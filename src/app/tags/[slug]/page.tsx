import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

const POSTS_PER_PAGE = 6;

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, tags: { some: { id: tag.id } } },
      include: {
        category: { select: { name: true, slug: true } },
        tags: { select: { name: true, slug: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { published: true, tags: { some: { id: tag.id } } } }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="animate-fade-in">
      <Link href="/tags" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> 所有标签
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Tag size={20} className="text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{tag.name}</h1>
          <p className="text-sm text-slate-500">共 {total} 篇文章</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <p className="text-slate-400">该标签下暂无文章</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/tags/${slug}`} />
    </div>
  );
}
