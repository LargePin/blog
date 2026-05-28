"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, PenSquare, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/categories", label: "分类" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {process.env.BLOG_TITLE || "My Blog"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <Link
              href="/search"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="搜索"
            >
              <Search size={18} />
            </Link>
            <Link
              href="/write"
              className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              title="写文章"
            >
              <PenSquare size={18} />
            </Link>
            <Link
              href="/trash"
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              title="回收站"
            >
              <Trash2 size={18} />
            </Link>
            <ThemeToggle />
            <Link
              href="/admin"
              className="ml-1 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
            >
              管理
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/search"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              搜索
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
