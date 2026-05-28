"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId, showRestore, showPermanent }: { postId: string; showRestore?: boolean; showPermanent?: boolean }) {
  const router = useRouter();

  const handleAction = async (action?: string) => {
    if (action === "restore") {
      if (!confirm("确定恢复这篇文章？")) return;
    } else if (action === "permanent") {
      if (!confirm("⚠️ 彻底删除后无法恢复！确定？")) return;
    } else {
      if (!confirm("确定将这篇文章移入回收站？")) return;
    }

    const url = action ? `/api/posts/${postId}?action=${action}` : `/api/posts/${postId}`;
    const method = action === "permanent" ? "DELETE" : action === "restore" ? "DELETE" : "DELETE";
    const res = await fetch(url, { method });
    if (res.ok) {
      if (action === "restore") {
        router.push("/trash");
      } else if (!action) {
        router.push("/");
      } else {
        router.refresh();
      }
    } else {
      alert("操作失败");
    }
  };

  if (showRestore) {
    return (
      <button onClick={() => handleAction("restore")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
        恢复
      </button>
    );
  }

  if (showPermanent) {
    return (
      <button onClick={() => handleAction("permanent")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
        彻底删除
      </button>
    );
  }

  return (
    <button onClick={() => handleAction()} className="inline-flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-sm font-medium">
      <Trash2 size={14} /> 删除
    </button>
  );
}
