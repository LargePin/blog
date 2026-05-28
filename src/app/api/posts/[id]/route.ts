import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, published, categoryId, tagIds } = body;

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return NextResponse.json({ error: "文章不存在" }, { status: 404 });

    const post = await prisma.post.update({
      where: { id },
      data: {
        title, slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        published,
        publishedAt: published && !existingPost.published ? new Date() : existingPost.publishedAt,
        categoryId: categoryId || null,
        tags: { set: tagIds?.map((id: string) => ({ id })) || [] },
      },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "URL别名已存在" }, { status: 400 });
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

// 软删除
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  try {
    if (action === "restore") {
      // 恢复
      await prisma.post.update({ where: { id }, data: { deletedAt: null } });
      return NextResponse.json({ success: true, action: "restored" });
    } else if (action === "permanent") {
      // 彻底删除
      await prisma.post.delete({ where: { id } });
      return NextResponse.json({ success: true, action: "deleted" });
    } else {
      // 软删除
      await prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
      return NextResponse.json({ success: true, action: "trashed" });
    }
  } catch {
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
