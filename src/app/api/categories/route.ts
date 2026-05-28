import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug } = await request.json();

  try {
    const category = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "分类名或别名已存在" }, { status: 400 });
    }
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}
