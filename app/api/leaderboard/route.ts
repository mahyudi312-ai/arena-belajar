import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kelas = searchParams.get("kelas");
    const limit = Number(searchParams.get("limit") || 50);

    const where: any = { role: "SISWA" };
    if (kelas) where.kelas = Number(kelas);

    const users = await prisma.user.findMany({
      where,
      orderBy: { exp: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        kelas: true,
        avatar: true,
        exp: true,
        level: true,
        kristal: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}