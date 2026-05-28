import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { tags: { select: { id: true } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();
  return <PostEditor post={post} categories={categories} tags={tags} />;
}
