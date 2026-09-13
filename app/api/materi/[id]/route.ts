import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
    include: {
      subject: true,
      quizzes: { orderBy: { urutan: "asc" } },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}