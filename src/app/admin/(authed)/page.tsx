import { prisma } from "@/lib/prisma";
import { FileText, Folder, Tag, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, draftPosts, totalCategories, totalTags, totalViews, trashedCount] = 
    await Promise.all([
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.post.count({ where: { published: true, deletedAt: null } }),
      prisma.post.count({ where: { published: false, deletedAt: null } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.aggregate({ _sum: { views: true }, where: { deletedAt: null } }),
      prisma.post.count({ where: { deletedAt: { not: null } } }),
    ]);

  const recentPosts = await prisma.post.findMany({
    where: { deletedAt: null },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, published: true, createdAt: true },
  });

  const stats = [
    { label: "总文章", value: totalPosts, icon: FileText, color: "blue" },
    { label: "已发布", value: publishedPosts, icon: FileText, color: "green" },
    { label: "草稿", value: draftPosts, icon: FileText, color: "yellow" },
    { label: "分类", value: totalCategories, icon: Folder, color: "purple" },
    { label: "标签", value: totalTags, icon: Tag, color: "pink" },
    { label: "总阅读", value: totalViews._sum.views || 0, icon: Eye, color: "indigo" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">仪表盘</h1>
        {trashedCount > 0 && (
          <Link href="/admin/trash" className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors">
            <Trash2 size={14} /> 回收站 ({trashedCount})
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                <Icon size={16} /><span className="text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">最近文章</h2>
          <Link href="/admin/posts/new" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm">+ 新建文章</Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recentPosts.map((post) => (
            <div key={post.id} className="py-3 flex items-center justify-between">
              <div>
                <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">{post.title}</Link>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(post.createdAt).toLocaleDateString("zh-CN")}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${post.published ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400" : "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"}`}>
                {post.published ? "已发布" : "草稿"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
