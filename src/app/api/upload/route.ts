import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // 验证类型
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 });
    }

    // 限制大小 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过 5MB" }, { status: 400 });
    }

    // 生成文件名
    const ext = file.name.split(".").pop() || "png";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = Math.random().toString(36).substring(2, 8);
    const filename = `${date}-${rand}.${ext}`;

    // 按月分目录
    const month = new Date().toISOString().slice(0, 7);
    const uploadDir = join(process.cwd(), "public", "uploads", month);
    await mkdir(uploadDir, { recursive: true });

    // 写入文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(uploadDir, filename), buffer);

    // 同时写入 standalone 目录（如果存在）
    const standaloneDir = join(process.cwd(), ".next", "standalone", "public", "uploads", month);
    try {
      await mkdir(standaloneDir, { recursive: true });
      await writeFile(join(standaloneDir, filename), buffer);
    } catch {}

    const url = `/api/uploads/${month}/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (error) {
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
