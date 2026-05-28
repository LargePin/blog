import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-4 select-none">404</div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">页面未找到</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">你访问的页面不存在或已被移除</p>
      <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-500/20">
        <Home size={16} /> 返回首页
      </Link>
    </div>
  );
}
