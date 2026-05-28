"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trash2, RotateCcw, Clock, ArrowLeft } from "lucide-react";
import DeletePostButton from "@/components/DeletePostButton";

export default function TrashPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    const res = await fetch("/api/posts/trash");
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
    setLoading(false);
  };

  useEffect(() => { if (session) fetchTrash(); }, [session]);

  if (status === "loading" || loading) return <div className="text-center py-20 text-slate-400">加载中...</div>;
  if (!session) return (
    <div className="max-w-md mx-auto text-center py-20">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">需要登录</h1>
      <Link href="/admin/login" className="text-blue-600 dark:text-blue-400 underline text-sm">去登录</Link>
    </div>
  );

  const getDaysLeft = (deletedAt: string) => {
    const diff = 30 - Math.floor((Date.now() - new Date(deletedAt).getTime()) / 86400000);
    return Math.max(0, diff);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
        <ArrowLeft size={14} /> 返回首页
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">回收站</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">已删除的文章会在 30 天后自动清除</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <Trash2 className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={40} />
          <p className="text-slate-400">回收站为空</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const daysLeft = getDaysLeft(post.deletedAt);
            return (
              <div key={post.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {daysLeft > 0 ? `${daysLeft} 天后自动清除` : "即将清除"}
                    </span>
                    {post.published && <span className="text-xs text-green-600 dark:text-green-400">已发布</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DeletePostButton postId={post.id} showRestore />
                  <DeletePostButton postId={post.id} showPermanent />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
