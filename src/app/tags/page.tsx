import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Tag } from "lucide-react";

export const metadata = { title: "标签云" };

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  const maxCount = Math.max(...tags.map(t => t._count.posts), 1);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">标签云</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">通过标签发现感兴趣的内容</p>
      </div>
      {tags.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <Tag className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
          <p className="text-slate-400">暂无标签</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {tags.map((tag) => {
              const ratio = tag._count.posts / maxCount;
              const sizeClass = ratio > 0.7 ? "text-base px-4 py-2" : ratio > 0.4 ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";
              return (
                <Link key={tag.id} href={`/tags/${tag.slug}`} className={`inline-flex items-center gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition-all duration-200 border border-slate-100 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-800 ${sizeClass}`}>
                  <Tag size={12} className="text-slate-400 dark:text-slate-500" />
                  {tag.name}
                  <span className="text-xs text-slate-300 dark:text-slate-500 ml-0.5">{tag._count.posts}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
