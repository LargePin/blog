# 📝 My Blog — 部署文档

---

## 快速开始（Docker 一键部署）

### 前置要求
- 服务器：Linux（推荐 Debian/Ubuntu/CentOS）
- Docker 20.10+
- Docker Compose v2+
- 最低配置：1 核 CPU / 1GB 内存 / 10GB 磁盘

### 第一步：上传项目

```bash
# 方式一：压缩包传输（推荐）
# 在本地打包
cd ~/Desktop/hermes
tar czf blog.tar.gz --exclude='blog/node_modules' --exclude='blog/.next' --exclude='blog/logs' blog/

# 上传到服务器
scp blog.tar.gz user@服务器IP:~/

# 在服务器解压
ssh user@服务器IP "cd ~ && tar xzf blog.tar.gz"

# 方式二：Git 克隆
git clone <your-repo-url> blog
```

### 第二步：配置环境变量

```bash
cd ~/blog
cp .env.docker .env
vim .env
```

修改以下配置：

```bash
# 数据库密码（必须修改！）
DB_ROOT_PASSWORD=你的root密码
DB_PASSWORD=你的数据库密码

# 认证密钥（必须修改！用 openssl rand -hex 32 生成）
AUTH_SECRET=你的随机密钥

# 博客信息
BLOG_TITLE=你的博客名称
BLOG_DESCRIPTION=你的博客描述

# 端口（默认 80）
BLOG_PORT=80
```

### 第三步：启动

```bash
docker compose up -d --build
```

首次启动约 2-5 分钟（需下载镜像 + 构建）。完成后会自动：
- ✅ 启动 MariaDB 数据库
- ✅ 等待数据库就绪
- ✅ 同步表结构
- ✅ 创建管理员账号
- ✅ 启动 Next.js 应用

### 第四步：访问

```
http://服务器IP
```

### 第五步：登录后台

```
邮箱: admin@blog.com
密码: admin123
```

**⚠️ 登录后请立即修改默认密码！**

---

## 手动部署（PM2 + Nginx）

适合已有 Node.js 环境的服务器，或需要更精细控制的场景。

### 1. 安装环境

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# MariaDB
sudo apt install -y mariadb-server
sudo systemctl enable mariadb

# PM2
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx
```

### 2. 配置数据库

```bash
sudo mysql -e "
CREATE DATABASE blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON blog.* TO 'bloguser'@'localhost';
FLUSH PRIVILEGES;
"
```

### 3. 配置项目

```bash
cd ~/blog
npm install

# 创建 .env
cat > .env << 'EOF'
DATABASE_URL="mysql://bloguser:***@localhost:3306/blog"
AUTH_SECRET="your-random-secret"
BLOG_TITLE="My Blog"
BLOG_DESCRIPTION="A personal blog"
EOF
```

### 4. 初始化数据库

```bash
npx prisma db push
node prisma/seed.js
```

### 5. 构建

```bash
npm run build
```

### 6. 启动

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # 开机自启
```

### 7. 配置 Nginx

```bash
sudo cp nginx-blog.conf /etc/nginx/sites-available/blog
sudo ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

## 常用命令

### Docker 模式

```bash
cd ~/blog

# 基本操作
docker compose up -d --build   # 构建并启动（代码更新后执行）
docker compose down            # 停止并删除容器
docker compose restart blog    # 重启应用（不重新构建）
docker compose ps              # 查看容器状态

# 日志
docker compose logs blog             # 查看应用日志
docker compose logs blog --tail=50   # 查看最近 50 行
docker compose logs -f blog          # 实时跟踪日志

# 进入容器
docker compose exec blog sh          # 进入应用容器
docker compose exec db mysql -u bloguser -p blog  # 连接数据库

# 数据库备份
docker compose exec db mysqldump -u bloguser -p'password' blog > backup.sql

# 恢复备份
docker compose exec -T db mysql -u bloguser -p'password' blog < backup.sql
```

### PM2 模式

```bash
pm2 status              # 查看状态
pm2 logs blog           # 查看日志
pm2 restart blog        # 重启
pm2 stop blog           # 停止
./deploy.sh             # 重新构建部署
```

---

## 项目结构

```
blog/
├── Dockerfile               # Docker 多阶段构建
├── docker-compose.yml       # 容器编排（App + MariaDB）
├── docker-entrypoint.sh     # 容器启动脚本（DB 等待 + Schema 同步 + 种子数据）
├── .env.docker              # 环境变量模板（Docker 模式）
├── .dockerignore            # Docker 构建排除规则
├── DEPLOY.md                # 本文档
├── ecosystem.config.js      # PM2 配置
├── nginx-blog.conf          # Nginx 反向代理配置
├── deploy.sh                # PM2 一键部署脚本
├── prisma/
│   ├── schema.prisma        # 数据库模型定义
│   └── seed.js              # 种子数据（管理员 + 示例文章）
├── src/
│   ├── app/
│   │   ├── page.tsx         # 首页
│   │   ├── posts/           # 文章详情
│   │   ├── categories/      # 分类页
│   │   ├── tags/            # 标签页
│   │   ├── search/          # 搜索页
│   │   ├── about/           # 关于页
│   │   ├── write/           # 写文章页面
│   │   ├── trash/           # 前端回收站
│   │   ├── admin/           # 后台管理
│   │   └── api/             # API 接口
│   ├── components/          # React 组件
│   └── lib/                 # 工具函数（auth, prisma, utils）
└── public/
    └── uploads/             # 上传的图片
```

---

## 自定义配置

### 修改博客信息

Docker 模式：编辑 `.env` 文件后重启
```bash
docker compose restart blog
```

PM2 模式：编辑 `.env` 文件后重启
```bash
pm2 restart blog
```

### 配置域名 + HTTPS

**方式一：Caddy（最简单，自动 HTTPS）**

```bash
# 安装 Caddy
sudo apt install -y caddy

# 编辑 /etc/caddy/Caddyfile
your-domain.com {
    reverse_proxy localhost:80
}

# 重启
sudo systemctl restart caddy
```

**方式二：Nginx + Certbot**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 修改端口

编辑 `.env`：
```bash
BLOG_PORT=8080
```

然后重启：
```bash
docker compose up -d
```

---

## 更新升级

### Docker 模式

```bash
cd ~/blog

# 拉取最新代码
git pull

# 重新构建并启动（数据不会丢失）
docker compose up -d --build
```

### PM2 模式

```bash
cd ~/blog
git pull
./deploy.sh
```

---

## 数据备份与恢复

### Docker 模式

```bash
# 备份数据库
docker compose exec db mysqldump -u bloguser -p'BlogUser2026!' blog > blog-$(date +%Y%m%d).sql

# 备份上传的图片
docker cp blog-app:/app/public/uploads ./uploads-backup

# 恢复数据库
docker compose exec -T db mysql -u bloguser -p'BlogUser2026!' blog < blog-20260528.sql

# 恢复图片
docker cp ./uploads-backup/. blog-app:/app/public/uploads/
```

### 自动备份（Cron）

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 3 点备份数据库
0 3 * * * cd /root/blog && docker compose exec -T db mysqldump -u bloguser -p'BlogUser2026!' blog | gzip > /root/backups/blog-$(date +\\%Y\\%m\\%d).sql.gz
```

---

## 故障排查

| 问题 | 排查命令 | 解决方案 |
|------|----------|----------|
| 无法访问 | `docker compose ps` | 检查容器是否运行 |
| 500 错误 | `docker compose logs blog --tail=20` | 查看应用日志 |
| 数据库连接失败 | `docker compose logs db` | 检查数据库是否就绪 |
| 构建失败 | `docker compose up --build` | 查看构建错误输出 |
| 图片上传 404 | 检查 uploads 目录权限 | `docker exec blog-app ls -la public/uploads/` |
| 端口被占用 | `sudo ss -tlnp \| grep :80` | 修改 BLOG_PORT 或停止占用进程 |
| 内存不足 | `free -h` | 增加 swap 或升级配置 |
| 退出登录异常 | 清除浏览器 Cookie | 客户端缓存问题 |

### 查看容器资源使用

```bash
docker stats blog-app blog-db
```

### 重置数据库（危险！会丢失所有数据）

```bash
docker compose down -v    # 删除容器和数据卷
docker compose up -d --build  # 重新创建
```

---

## 架构说明

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│  Nginx:80    │────▶│  Blog:3000  │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                          ┌──────▼──────┐
                                          │  MariaDB    │
                                          │  (Docker)   │
                                          └─────────────┘
```

- **blog-app**: Next.js standalone 模式，端口 3000
- **blog-db**: MariaDB 10.11，数据持久化到 Docker volume
- **uploads**: 图片存储，持久化到 Docker volume
- **健康检查**: 每 30 秒检测一次，失败自动重启

---

## 安全建议

1. **修改默认密码** — 首次登录后立即修改管理员密码
2. **修改数据库密码** — 使用强密码
3. **配置 AUTH_SECRET** — 使用 `openssl rand -hex 32` 生成
4. **启用 HTTPS** — 生产环境必须使用
5. **限制 SSH** — 禁用密码登录，使用密钥认证
6. **配置防火墙** — 只开放 80/443 端口
7. **定期备份** — 配置自动备份任务

---

## 许可证

MIT
