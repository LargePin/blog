import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import AdminDeleteButton from "@/components/AdminDeleteButton";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } }, tags: { select: { name: true } } },
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">文章管理</h1>
        <Link href="/admin/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
          <Plus size={16} /> 新建文章
        </Link>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">标题</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">分类</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">状态</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">阅读</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">日期</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4"><Link href={`/posts/${post.slug}`} className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400" target="_blank">{post.title}</Link></td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{post.category?.name || "-"}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded ${post.published ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400" : "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"}`}>{post.published ? "已发布" : "草稿"}</span></td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><Eye size={14} /> {post.views}</td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(post.createdAt).toLocaleDateString("zh-CN")}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"><Edit size={16} /></Link>
                    <AdminDeleteButton postId={post.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <div className="text-center py-12 text-slate-400">暂无文章</div>}
      </div>
    </div>
  );
}
