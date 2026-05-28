#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /home/oesp/Desktop/hermes/blog

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the project
echo "🔨 Building project..."
npm run build

# Copy static files and uploads
echo "📁 Copying static files..."
mkdir -p .next/standalone/.next/static .next/standalone/public
cp -r .next/static/* .next/standalone/.next/static/
cp -r public/* .next/standalone/public/ 2>/dev/null || true
# 保留 uploads 目录
if [ -d "public/uploads" ]; then
  mkdir -p .next/standalone/public/uploads
  cp -r public/uploads/* .next/standalone/public/uploads/ 2>/dev/null || true
fi

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart blog || pm2 start ecosystem.config.js

echo "✅ Deployment complete!"
pm2 status
