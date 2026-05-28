import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";

export const metadata = { title: "文章分类" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
      posts: { where: { published: true }, select: { title: true, slug: true }, take: 3, orderBy: { publishedAt: "desc" } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">文章分类</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">按主题浏览所有文章</p>
      </div>
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <Folder className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
          <p className="text-slate-400">暂无分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <Folder size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h2>
                    <p className="text-xs text-slate-400">{cat._count.posts} 篇文章</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              {cat.posts.length > 0 && (
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                  {cat.posts.map((post) => (
                    <p key={post.slug} className="text-xs text-slate-500 dark:text-slate-400 truncate">• {post.title}</p>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
