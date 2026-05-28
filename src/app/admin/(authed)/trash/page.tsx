"use client";

import { useState, useEffect } from "react";
import { Trash2, RotateCcw, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminTrashPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    const res = await fetch("/api/posts/trash");
    if (res.ok) { const data = await res.json(); setPosts(data.posts || []); }
    setLoading(false);
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (id: string) => {
    if (!confirm("确定恢复这篇文章？")) return;
    const res = await fetch(`/api/posts/${id}?action=restore`, { method: "DELETE" });
    if (res.ok) { fetchTrash(); } else { alert("恢复失败"); }
  };

  const handlePermanent = async (id: string) => {
    if (!confirm("⚠️ 彻底删除后无法恢复！确定？")) return;
    const res = await fetch(`/api/posts/${id}?action=permanent`, { method: "DELETE" });
    if (res.ok) { fetchTrash(); } else { alert("删除失败"); }
  };

  const handleEmpty = async () => {
    if (!confirm("⚠️ 确定清空回收站？所有文章将被彻底删除！")) return;
    for (const post of posts) {
      await fetch(`/api/posts/${post.id}?action=permanent`, { method: "DELETE" });
    }
    fetchTrash();
  };

  const getDaysLeft = (deletedAt: string) => {
    return Math.max(0, 30 - Math.floor((Date.now() - new Date(deletedAt).getTime()) / 86400000));
  };

  if (loading) return <div className="text-slate-400">加载中...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">回收站</h1>
        {posts.length > 0 && (
          <button onClick={handleEmpty} className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1">
            <AlertTriangle size={14} /> 清空回收站
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">已删除的文章会在 30 天后自动清除</p>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Trash2 className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
          <p className="text-slate-400">回收站为空</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">标题</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">状态</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">剩余时间</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {posts.map((post) => {
                const daysLeft = getDaysLeft(post.deletedAt);
                return (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 dark:text-white">{post.title}</span>
                      <p className="text-xs text-slate-400 mt-0.5">/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded ${post.published ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400" : "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400"}`}>
                        {post.published ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Clock size={14} />
                        {daysLeft > 0 ? `${daysLeft} 天` : "即将清除"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleRestore(post.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
                          <RotateCcw size={14} /> 恢复
                        </button>
                        <button onClick={() => handlePermanent(post.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                          <Trash2 size={14} /> 彻底删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
