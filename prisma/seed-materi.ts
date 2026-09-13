import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const KELAS_LIST = [1, 2, 3, 4, 5, 6];

async function importFile(filePath: string) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(`\nImport: ${data.subject.name} Kelas ${data.subject.kelas}`);

  const subject = await prisma.subject.upsert({
    where: { slug: data.subject.slug },
    update: {
      name: data.subject.name,
      emoji: data.subject.emoji,
      color: data.subject.color,
    },
    create: {
      slug: data.subject.slug,
      name: data.subject.name,
      emoji: data.subject.emoji,
      color: data.subject.color,
      urutan: 2,
    },
  });

  for (const lesson of data.lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        title: lesson.title,
        content: lesson.content,
        urutan: lesson.order,
        expReward: lesson.expReward,
      },
      create: {
        id: lesson.id,
        subjectId: subject.id,
        kelas: data.subject.kelas,
        title: lesson.title,
        content: lesson.content,
        urutan: lesson.order,
        expReward: lesson.expReward,
      },
    });
  }

  const lessonIds = data.lessons.map((l: any) => l.id);
  await prisma.quiz.deleteMany({
    where: { lessonId: { in: lessonIds } },
  });

  for (const quiz of data.quizzes) {
    await prisma.quiz.create({
      data: {
        lessonId: quiz.lessonId,
        type: quiz.type,
        question: quiz.question,
        options: JSON.stringify(quiz.options),
        answer: quiz.answer,
        exp: quiz.exp,
      },
    });
  }

  console.log(`  ${data.lessons.length} materi`);
  console.log(`  ${data.quizzes.length} soal`);
}

async function main() {
  console.log("Mulai import semua kelas...");
  console.log("");

  for (const kelas of KELAS_LIST) {
    const folder = path.join(process.cwd(), "data", `kelas-${kelas}`);
    if (!fs.existsSync(folder)) {
      console.log(`Folder kelas-${kelas} belum ada, skip.`);
      continue;
    }
    const files = fs.readdirSync(folder).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      await importFile(path.join(folder, file));
    }
  }

  console.log("");
  console.log("SELESAI! Semua materi diimport.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());