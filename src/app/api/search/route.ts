import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ posts: [] });

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      deletedAt: null,
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ],
    },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ posts });
}
