# 📝 My Blog - Next.js 个人博客系统

基于 Next.js 15 + MySQL + Prisma 的全栈个人博客系统。

## ✨ 功能特性

### 前台
- 📱 响应式设计，完美适配移动端
- 📝 Markdown 文章编辑与渲染
- 🏷️ 分类和标签系统
- 🔍 全文搜索
- 📊 文章阅读统计
- 📄 分页功能

### 后台管理
- 🔐 管理员登录认证
- ✏️ 文章 CRUD（创建/编辑/删除）
- 📁 分类管理
- 🏷️ 标签管理
- 📊 数据统计仪表盘

## 🛠️ 技术栈

- **前端**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS 4
- **数据库**: MySQL / MariaDB
- **ORM**: Prisma 6
- **认证**: NextAuth.js 5
- **部署**: PM2 + Nginx

## 📦 安装部署

### 前置要求
- Node.js 20+
- MySQL 8+ 或 MariaDB 10.11+
- Nginx

### 1. 克隆项目
```bash
cd ~/Desktop/hermes
git clone <your-repo-url> blog
cd blog
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等
```

### 4. 初始化数据库
```bash
npx prisma db push
node prisma/seed.js
```

### 5. 构建项目
```bash
npm run build
cp -r public/* .next/standalone/public/
cp -r .next/static/* .next/standalone/.next/static/
```

### 6. 启动服务
```bash
pm2 start ecosystem.config.js
```

### 7. 配置 Nginx
```bash
sudo cp nginx-blog.conf /etc/nginx/sites-available/blog
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 或者使用一键部署脚本
```bash
chmod +x setup.sh
./setup.sh
```

## 🔑 默认管理员

- **邮箱**: admin@blog.com
- **密码**: admin123

> ⚠️ 首次登录后请立即修改密码！

## 📁 项目结构

```
blog/
├── prisma/
│   ├── schema.prisma    # 数据库模型
│   └── seed.js          # 种子数据
├── src/
│   ├── app/
│   │   ├── (site)/      # 前台页面
│   │   ├── admin/       # 后台管理
│   │   └── api/         # API 接口
│   ├── components/      # React 组件
│   └── lib/             # 工具函数
├── public/              # 静态资源
├── ecosystem.config.js  # PM2 配置
├── nginx-blog.conf      # Nginx 配置
└── setup.sh             # 部署脚本
```

## 🚀 常用命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# PM2 管理
pm2 status          # 查看状态
pm2 logs blog       # 查看日志
pm2 restart blog    # 重启服务
pm2 stop blog       # 停止服务

# 数据库管理
npx prisma studio   # 打开数据库管理界面
npx prisma db push  # 同步数据库结构
```

## 📝 写作指南

1. 登录后台: http://your-domain/admin
2. 点击"新建文章"
3. 使用 Markdown 格式写作
4. 选择分类和标签
5. 点击发布

## 🔧 自定义配置

### 修改博客信息
编辑 `.env` 文件:
```env
BLOG_TITLE="你的博客名称"
BLOG_DESCRIPTION="博客描述"
```

### 修改主题颜色
编辑 `src/app/globals.css` 中的 CSS 变量。

## 📄 License

MIT

---

Built with ❤️ using Next.js & Prisma
