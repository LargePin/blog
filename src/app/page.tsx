import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { ArrowRight, BookOpen, Tag, Folder } from "lucide-react";

const POSTS_PER_PAGE = 6;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const [posts, total, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, deletedAt: null },
      include: { category: { select: { name: true, slug: true } }, tags: { select: { name: true, slug: true } } },
      orderBy: { publishedAt: "desc" },
      skip, take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { published: true, deletedAt: null } }),
    prisma.category.findMany({ include: { _count: { select: { posts: true } } }, take: 8 }),
    prisma.tag.findMany({ include: { _count: { select: { posts: true } } }, take: 12 }),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="animate-fade-in">
      {page === 1 && (
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-800 dark:via-blue-900 dark:to-indigo-900 p-8 sm:p-10 text-white">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-blue-200 tracking-wide uppercase">欢迎来到我的博客</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">记录技术与生活的点滴</h1>
              <p className="text-blue-200/80 text-sm sm:text-base max-w-xl leading-relaxed mb-6">分享编程经验、技术探索和日常思考。</p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/about" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors border border-white/10">了解更多 <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">最新文章</h2>
            <span className="text-xs text-slate-400">共 {total} 篇</span>
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <BookOpen className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
              <p className="text-slate-400">暂无文章</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {posts.map((post, i) => <PostCard key={post.id} post={post} featured={i === 0 && page === 1} />)}
            </div>
          )}
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>

        <aside className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4"><Folder size={16} className="text-blue-500" /><h3 className="text-sm font-bold text-slate-900 dark:text-white">文章分类</h3></div>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span>{cat.name}</span><span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{cat._count.posts}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4"><Tag size={16} className="text-indigo-500" /><h3 className="text-sm font-bold text-slate-900 dark:text-white">热门标签</h3></div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`} className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-slate-100 dark:border-slate-600">
                  {tag.name}<span className="ml-1 text-slate-300 dark:text-slate-500">{tag._count.posts}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
