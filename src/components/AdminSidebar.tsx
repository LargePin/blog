"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Folder, Tag, LayoutDashboard, LogOut, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/posts", label: "文章管理", icon: FileText },
  { href: "/admin/categories", label: "分类管理", icon: Folder },
  { href: "/admin/tags", label: "标签管理", icon: Tag },
  { href: "/admin/trash", label: "回收站", icon: Trash2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">管理后台</h2>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}>
              <Icon size={18} />{item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => { signOut({ redirect: false }).then(() => { window.location.href = "/"; }); }}
          className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors w-full">
          <LogOut size={18} />退出登录
        </button>
      </div>
    </aside>
  );
}
