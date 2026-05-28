#!/bin/sh
set -e

echo "========================================="
echo "  🚀 Blog Starting..."
echo "========================================="

# ---------- 等待数据库就绪 ----------
if [ -n "$DATABASE_URL" ]; then
  echo "[1/3] ⏳ Waiting for database connection..."
  
  DB_READY=false
  for i in $(seq 1 30); do
    if node -e "
      const { PrismaClient } = require('@prisma/client');
      const p = new PrismaClient();
      p.\$connect()
        .then(() => { console.log('connected'); process.exit(0); })
        .catch(() => process.exit(1));
    " 2>/dev/null; then
      echo "  ✅ Database connected (attempt $i)"
      DB_READY=true
      break
    fi
    echo "  ⏳ Attempt $i/30..."
    sleep 2
  done

  if [ "$DB_READY" = "false" ]; then
    echo "  ❌ Database connection failed after 30 attempts"
    exit 1
  fi

  # ---------- 同步数据库 Schema ----------
  echo "[2/3] 🗄️ Syncing database schema..."
  if node node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate 2>&1; then
    echo "  ✅ Schema synced"
  else
    echo "  ⚠️ Schema sync failed (tables may already exist)"
  fi

  # ---------- 初始化种子数据 ----------
  if [ "$SEED_ON_START" = "true" ]; then
    echo "[3/3] 🌱 Seeding database..."
    if node prisma/seed.js 2>&1; then
      echo "  ✅ Seed completed"
    else
      echo "  ⚠️ Seed skipped (data may already exist)"
    fi
  fi
else
  echo "⚠️ DATABASE_URL not set, skipping database setup"
fi

echo "========================================="
echo "  ✅ Blog ready on port $PORT"
echo "========================================="

# 启动应用
exec "$@"
