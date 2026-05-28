# ============ Stage 1: Build ============
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖（利用 Docker 缓存层）
COPY package.json package-lock.json ./
RUN npm ci

# 复制源码
COPY . .

# 构建时需要 DATABASE_URL（静态页面查询需要）
# 传入占位符即可，实际值在运行时由 docker-compose 注入
ARG DATABASE_URL=mysql://placeholder:placeholder@localhost:3306/placeholder
ENV DATABASE_URL=$DATABASE_URL

# 生成 Prisma Client
RUN npx prisma generate

# 构建 Next.js（含静态文件复制）
RUN npm run build

# ============ Stage 2: Production ============
FROM node:20-alpine AS runner

WORKDIR /app

# 安装运行时必要工具
RUN apk add --no-cache openssl curl

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 创建非 root 用户
RUN addgroup --system --gid 1001 blog && adduser --system --uid 1001 blog

# 从 builder 复制构建产物
COPY --from=builder --chown=blog:blog /app/.next/standalone ./
COPY --from=builder --chown=blog:blog /app/.next/static ./.next/static
COPY --from=builder --chown=blog:blog /app/public ./public

# 复制完整 node_modules（Prisma 需要完整的依赖链，选择性复制会导致 WASM 文件缺失）
COPY --from=builder --chown=blog:blog /app/node_modules ./node_modules

# 复制 Prisma schema 和种子数据
COPY --from=builder --chown=blog:blog /app/prisma ./prisma

# 创建上传目录
RUN mkdir -p public/uploads && chown -R blog:blog public/uploads

# 复制启动脚本
COPY --chown=blog:blog docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER blog

EXPOSE 3000

# 健康检查（启动等待 30 秒后再检测）
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
