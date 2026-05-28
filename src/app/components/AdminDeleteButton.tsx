"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDeleteButton({ postId }: { postId: string }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("确定将这篇文章移入回收站？")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) { router.refresh(); } else { alert("删除失败"); }
  };
  return (
    <button onClick={handleDelete} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors">
      <Trash2 size={16} />
    </button>
  );
}
