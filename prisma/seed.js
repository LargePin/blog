const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create categories
  const categories = [
    { name: "技术", slug: "tech" },
    { name: "生活", slug: "life" },
    { name: "随笔", slug: "essay" },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories created");

  // Create tags
  const tags = [
    { name: "Next.js", slug: "nextjs" },
    { name: "React", slug: "react" },
    { name: "TypeScript", slug: "typescript" },
    { name: "MySQL", slug: "mysql" },
    { name: "Tailwind", slug: "tailwind" },
  ];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log("Tags created");

  // Create sample posts
  const techCategory = await prisma.category.findUnique({ where: { slug: "tech" } });
  const nextjsTag = await prisma.tag.findUnique({ where: { slug: "nextjs" } });
  const reactTag = await prisma.tag.findUnique({ where: { slug: "react" } });

  const posts = [
    {
      title: "Hello World - 博客上线",
      slug: "hello-world",
      excerpt: "这是我的第一篇博客文章，记录博客搭建的过程。",
      content: `# Hello World

欢迎来到我的博客！这是使用 **Next.js 15** + **MySQL** + **Prisma** 搭建的个人博客系统。

## 技术栈

- **前端**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS
- **数据库**: MySQL (MariaDB)
- **ORM**: Prisma
- **部署**: PM2 + Nginx

## 功能特性

1. 响应式设计，支持移动端
2. Markdown 文章编辑
3. 分类和标签系统
4. 全文搜索
5. 管理后台

接下来我会持续更新技术文章，敬请期待！`,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: techCategory?.id,
    },
    {
      title: "Next.js 15 新特性介绍",
      slug: "nextjs-15-features",
      excerpt: "深入了解 Next.js 15 带来的新功能和改进。",
      content: `# Next.js 15 新特性介绍

Next.js 15 带来了许多令人兴奋的新特性。

## React 19 支持

Next.js 15 完全支持 React 19，包括：
- Server Components
- Server Actions
- 新的 use() hook

## Turbopack (稳定版)

Turbopack 现在已经稳定，开发服务器启动速度提升了 **10 倍**。

## 部分预渲染 (PPR)

部分预渲染允许你将静态和动态内容结合在同一个页面中。

## 总结

Next.js 15 是一个重要的版本更新，值得升级。`,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: techCategory?.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // Connect tags to posts
  const helloPost = await prisma.post.findUnique({ where: { slug: "hello-world" } });
  if (helloPost && nextjsTag && reactTag) {
    await prisma.post.update({
      where: { id: helloPost.id },
      data: { tags: { connect: [{ id: nextjsTag.id }, { id: reactTag.id }] } },
    });
  }

  console.log("Sample posts created");
  console.log("\n✅ Seed completed!");
  console.log("Admin login: admin@blog.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
