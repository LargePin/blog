import Link from "next/link";
import { Rss, Globe, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const title = process.env.BLOG_TITLE || "My Blog";

  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">B</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{title}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              记录技术与生活的点滴，分享知识与思考。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">快速链接</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">首页</Link>
              <Link href="/categories" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">文章分类</Link>
              <Link href="/tags" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">标签云</Link>
              <Link href="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit">关于本站</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">联系方式</h3>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="GitHub">
                <Globe size={18} />
              </a>
              <a href="mailto:admin@blog.com" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Email">
                <Mail size={18} />
              </a>
              <a href="/api/rss" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950 hover:text-orange-600 dark:hover:text-orange-400 transition-colors" title="RSS">
                <Rss size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400">&copy; {year} {title}. All rights reserved.</p>
          <p className="text-xs text-slate-400">
            Powered by{" "}
            <a href="https://nextjs.org" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank">Next.js</a>
            {" "}&{" "}
            <a href="https://www.prisma.io" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" target="_blank">Prisma</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
