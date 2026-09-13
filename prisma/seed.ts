import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SUBJECTS = [
  { slug: "bahasa-indonesia", name: "Bahasa Indonesia", emoji: "📖", color: "from-pink-400 to-pink-600", urutan: 1 },
  { slug: "matematika", name: "Matematika", emoji: "🔢", color: "from-blue-400 to-blue-600", urutan: 2 },
  { slug: "ppkn", name: "PPKn", emoji: "🇮🇩", color: "from-red-400 to-red-600", urutan: 3 },
  { slug: "ipas", name: "IPAS", emoji: "🔬", color: "from-green-400 to-green-600", urutan: 4 },
  { slug: "seni", name: "Seni Budaya", emoji: "🎨", color: "from-purple-400 to-purple-600", urutan: 5 },
  { slug: "pai", name: "Pendidikan Agama Islam", emoji: "🕌", color: "from-emerald-400 to-emerald-600", urutan: 6 },
  { slug: "bahasa-inggris", name: "Bahasa Inggris", emoji: "🌍", color: "from-orange-400 to-orange-600", urutan: 7 },
  { slug: "koding", name: "Koding", emoji: "💻", color: "from-indigo-400 to-indigo-600", urutan: 8 },
];

const BADGES = [
  { slug: "first-step", name: "Langkah Pertama", emoji: "🐣", description: "Selesaikan 1 misi pertama", requirement: JSON.stringify({ type: "lessons", value: 1 }) },
  { slug: "rajin-5", name: "Rajin Belajar", emoji: "📚", description: "Selesaikan 5 misi", requirement: JSON.stringify({ type: "lessons", value: 5 }) },
  { slug: "rajin-10", name: "Murid Teladan", emoji: "🌟", description: "Selesaikan 10 misi", requirement: JSON.stringify({ type: "lessons", value: 10 }) },
  { slug: "streak-3", name: "Semangat 3 Hari", emoji: "🔥", description: "Login 3 hari berturut-turut", requirement: JSON.stringify({ type: "streak", value: 3 }) },
  { slug: "streak-7", name: "Api Semangat", emoji: "🔥", description: "Login 7 hari berturut-turut", requirement: JSON.stringify({ type: "streak", value: 7 }) },
  { slug: "perfect-1", name: "Perfect Victory", emoji: "💯", description: "Dapat nilai 100 di quiz", requirement: JSON.stringify({ type: "perfect", value: 1 }) },
  { slug: "perfect-5", name: "Sultan Perfect", emoji: "👑", description: "Dapat nilai 100 di 5 quiz", requirement: JSON.stringify({ type: "perfect", value: 5 }) },
  { slug: "correct-50", name: "Jawaban Tepat", emoji: "🎯", description: "Jawab benar 50 soal", requirement: JSON.stringify({ type: "correct", value: 50 }) },
  { slug: "correct-100", name: "Penembak Jitu", emoji: "🎯", description: "Jawab benar 100 soal", requirement: JSON.stringify({ type: "correct", value: 100 }) },
  { slug: "exp-500", name: "Kolektor EXP", emoji: "⭐", description: "Kumpulkan 500 EXP", requirement: JSON.stringify({ type: "exp", value: 500 }) },
  { slug: "exp-1000", name: "Master EXP", emoji: "🌟", description: "Kumpulkan 1.000 EXP", requirement: JSON.stringify({ type: "exp", value: 1000 }) },
  { slug: "kristal-500", name: "Kolektor Kristal", emoji: "💎", description: "Kumpulkan 500 kristal", requirement: JSON.stringify({ type: "kristal", value: 500 }) },
  { slug: "level-5", name: "Naik Level 5", emoji: "⚔️", description: "Capai Level 5", requirement: JSON.stringify({ type: "level", value: 5 }) },
  { slug: "level-10", name: "Ksatria Muda", emoji: "🛡️", description: "Capai Level 10", requirement: JSON.stringify({ type: "level", value: 10 }) },
  { slug: "level-20", name: "Pahlawan Ilmu", emoji: "🏆", description: "Capai Level 20", requirement: JSON.stringify({ type: "level", value: 20 }) },
];

async function main() {
  console.log("Seeding...");

  for (const s of SUBJECTS) {
    await prisma.subject.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`${SUBJECTS.length} mapel`);

  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }
  console.log(`${BADGES.length} badge`);

  const hashedDemo = await bcrypt.hash("demo123", 10);

  await prisma.user.upsert({
    where: { email: "siswa1@demo.com" },
    update: {},
    create: {
      email: "siswa1@demo.com",
      password: hashedDemo,
      name: "Adik Hebat",
      role: "SISWA",
      kelas: 1,
      avatar: "ara",
      exp: 250,
      level: 3,
      kristal: 150,
      streak: 3,
    },
  });

  await prisma.user.upsert({
    where: { email: "guru@demo.com" },
    update: {},
    create: {
      email: "guru@demo.com",
      password: hashedDemo,
      name: "Bu Guru",
      role: "GURU",
      avatar: "kiki",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      password: hashedDemo,
      name: "Admin Arena",
      role: "ADMIN",
      avatar: "bubu",
    },
  });

  console.log("3 akun demo");
  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());