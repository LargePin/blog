import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

interface RelatedPostsProps {
  currentPostId: string;
  categoryId: string | null;
  tagIds: string[];
}

export default async function RelatedPosts({ currentPostId, categoryId, tagIds }: RelatedPostsProps) {
  // 优先找同分类+同标签的文章，其次同分类，最后同标签
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      deletedAt: null,
      id: { not: currentPostId },
      OR: [
        ...(categoryId ? [{ categoryId }] : []),
        ...(tagIds.length > 0 ? [{ tags: { some: { id: { in: tagIds } } } }] : []),
      ],
    },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  if (posts.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">相关文章</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                  {post.category.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="text-xs text-slate-400">{formatDate(post.publishedAt)}</span>
              )}
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
              {post.title}
            </h4>
            {post.excerpt && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              阅读 <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
