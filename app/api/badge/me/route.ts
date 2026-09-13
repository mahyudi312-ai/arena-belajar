import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const allBadges = await prisma.badge.findMany({
      orderBy: { slug: "asc" },
    });

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    const ownedSlugs = new Set(userBadges.map((ub) => ub.badge.slug));

    const result = allBadges.map((b) => ({
      slug: b.slug,
      name: b.name,
      emoji: b.emoji,
      description: b.description,
      earned: ownedSlugs.has(b.slug),
      earnedAt: userBadges.find((ub) => ub.badge.slug === b.slug)?.earnedAt || null,
    }));

    return NextResponse.json({
      badges: result,
      total: allBadges.length,
      earned: userBadges.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}