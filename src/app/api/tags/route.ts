import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug } = await request.json();

  try {
    const tag = await prisma.tag.create({ data: { name, slug } });
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "标签名或别名已存在" }, { status: 400 });
    }
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ tags });
}
