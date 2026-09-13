import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectSlug = searchParams.get("subject");
  const kelas = searchParams.get("kelas");

  if (!subjectSlug || !kelas) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });

  if (!subject) {
    return NextResponse.json({ lessons: [], subject: null });
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      subjectId: subject.id,
      kelas: Number(kelas),
    },
    orderBy: { urutan: "asc" },
    include: {
      _count: { select: { quizzes: true } },
    },
  });

  return NextResponse.json({ lessons, subject });
}