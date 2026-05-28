import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, published, categoryId, tagIds } = body;

  try {
    const post = await prisma.post.create({
      data: {
        title, slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: (session.user as any).id,
        categoryId: categoryId || null,
        tags: tagIds?.length ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "URL别名已存在" }, { status: 400 });
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } }, tags: { select: { name: true } } },
  });
  return NextResponse.json({ posts });
}
