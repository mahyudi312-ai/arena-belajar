import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndAwardBadges } from "@/lib/badge-checker";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { lessonId, quizId, userAnswer, isCorrect } = body;

    if (!lessonId || !quizId || !userAnswer) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz tidak ditemukan" }, { status: 404 });
    }

    const expGained = isCorrect ? quiz.exp : 0;

    await prisma.quizAttempt.create({
      data: {
        userId,
        lessonId,
        quizId,
        userAnswer,
        isCorrect: !!isCorrect,
        expGained,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const newExp = user.exp + expGained;
    const newLevel = Math.floor(newExp / 500) + 1;
    const leveledUp = newLevel > user.level;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        exp: newExp,
        level: newLevel,
        kristal: user.kristal + (isCorrect ? 5 : 0),
      },
    });

    const totalQuizzes = await prisma.quiz.count({ where: { lessonId } });
    const correctAttempts = await prisma.quizAttempt.groupBy({
      by: ["quizId"],
      where: { userId, lessonId, isCorrect: true },
    });

    let lessonCompleted = false;
    if (correctAttempts.length >= totalQuizzes && totalQuizzes > 0) {
      const existing = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });

      if (!existing || !existing.completed) {
        await prisma.progress.upsert({
          where: { userId_lessonId: { userId, lessonId } },
          update: { completed: true, skor: correctAttempts.length },
          create: {
            userId,
            lessonId,
            completed: true,
            skor: correctAttempts.length,
          },
        });
        lessonCompleted = true;

        const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
        if (lesson) {
          await prisma.user.update({
            where: { id: userId },
            data: { exp: updatedUser.exp + lesson.expReward },
          });
        }
      }
    }

    // Cek & beri badge baru
    const newBadges = await checkAndAwardBadges(userId);

    return NextResponse.json({
      success: true,
      expGained,
      newExp: updatedUser.exp,
      newLevel: updatedUser.level,
      kristal: updatedUser.kristal,
      leveledUp,
      lessonCompleted,
      newBadges,
    });
  } catch (err: any) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}