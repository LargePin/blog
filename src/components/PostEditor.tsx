"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    categoryId: string | null;
    tags: { id: string }[];
  };
  categories: Category[];
  tags: Tag[];
}

export default function PostEditor({ post, categories, tags }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    categoryId: post?.categoryId || "",
    tagIds: post?.tags?.map((t) => t.id) || [],
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!post) {
      let slug = form.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // 移除非ASCII字符（包括中文）
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
      // 如果标题全是中文，生成时间戳slug
      if (!slug) {
        slug = "post-" + Date.now().toString(36);
      }
      setForm((prev) => ({ ...prev, slug }));
    }
  }, [form.title, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "保存失败");
    }
    setLoading(false);
  };

  const handleTagToggle = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {post ? "编辑文章" : "新建文章"}
        </h1>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
              className="rounded"
            />
            发布
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文章标题"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL 别名</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="文章摘要（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容 (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              required
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="使用 Markdown 格式写作..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">封面图片 URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="https://..."
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">无分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                    form.tagIds.includes(tag.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
