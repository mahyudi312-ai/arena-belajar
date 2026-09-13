import { prisma } from "./prisma";

interface BadgeResult {
  slug: string;
  name: string;
  emoji: string;
  description: string;
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeResult[]> {
  const newBadges: BadgeResult[] = [];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: { include: { badge: true } },
    },
  });

  if (!user) return [];

  const ownedSlugs = user.badges.map((ub) => ub.badge.slug);

  // Hitung statistik user
  const totalCorrectAttempts = await prisma.quizAttempt.count({
    where: { userId, isCorrect: true },
  });

  const completedLessons = await prisma.progress.count({
    where: { userId, completed: true },
  });

  const perfectLessons = await prisma.progress.count({
    where: { userId, completed: true, skor: { gte: 5 } },
  });

  // Ambil semua badge yang tersedia
  const allBadges = await prisma.badge.findMany();

  for (const badge of allBadges) {
    if (ownedSlugs.includes(badge.slug)) continue;

    let earned = false;
    let req: any = {};
    try {
      req = JSON.parse(badge.requirement);
    } catch {
      continue;
    }

    switch (req.type) {
      case "exp":
        earned = user.exp >= req.value;
        break;
      case "level":
        earned = user.level >= req.value;
        break;
      case "kristal":
        earned = user.kristal >= req.value;
        break;
      case "streak":
        earned = user.streak >= req.value;
        break;
      case "lessons":
        earned = completedLessons >= req.value;
        break;
      case "correct":
        earned = totalCorrectAttempts >= req.value;
        break;
      case "perfect":
        earned = perfectLessons >= req.value;
        break;
    }

    if (earned) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
      newBadges.push({
        slug: badge.slug,
        name: badge.name,
        emoji: badge.emoji,
        description: badge.description,
      });
    }
  }

  return newBadges;
}