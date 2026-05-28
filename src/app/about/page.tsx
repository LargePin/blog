export const metadata = { title: "关于" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">B</span>
            </div>
          </div>
        </div>
        <div className="px-8 pt-14 pb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">关于本站</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">一个热爱技术的开发者的个人博客</p>
          <div className="prose">
            <h2>👋 你好</h2>
            <p>欢迎来到我的个人博客！这里是我记录技术学习、项目实践和日常思考的地方。</p>
            <h2>🛠️ 技术栈</h2>
            <ul>
              <li><strong>前端框架</strong>: Next.js 15 (App Router)</li>
              <li><strong>编程语言</strong>: TypeScript</li>
              <li><strong>样式方案</strong>: Tailwind CSS</li>
              <li><strong>数据库</strong>: MySQL / MariaDB</li>
              <li><strong>ORM</strong>: Prisma</li>
              <li><strong>部署方案</strong>: PM2 + Nginx</li>
            </ul>
            <h2>✨ 功能特性</h2>
            <ul>
              <li>响应式设计 + 暗色模式</li>
              <li>Markdown 文章编辑与渲染</li>
              <li>代码语法高亮</li>
              <li>文章目录导航</li>
              <li>分类和标签系统</li>
              <li>全文搜索</li>
            </ul>
            <h2>📬 联系我</h2>
            <ul>
              <li>邮箱: admin@blog.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
