"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Eye, ArrowLeft, Bold, Italic, Code, List, Link as LinkIcon, Image, Heading1, Heading2, Quote, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const DRAFT_KEY = "blog-draft";

function WriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", published: false, categoryId: "", tagIds: [] as string[] });

  // 加载分类和标签
  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
    fetch("/api/tags").then(r => r.json()).then(d => setTags(d.tags || []));
  }, []);

  // 编辑模式：加载已有文章
  useEffect(() => {
    if (editSlug && session) {
      fetch(`/api/posts/slug/${editSlug}`)
        .then(r => r.json())
        .then(post => {
          if (post && post.id) {
            setEditId(post.id);
            setForm({
              title: post.title || "",
              slug: post.slug || "",
              excerpt: post.excerpt || "",
              content: post.content || "",
              published: post.published || false,
              categoryId: post.categoryId || "",
              tagIds: post.tags?.map((t: any) => t.id) || [],
            });
          }
        });
    }
  }, [editSlug, session]);

  // 新建模式：恢复草稿
  useEffect(() => {
    if (!editSlug) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          const data = JSON.parse(draft);
          if (data.title || data.content) {
            if (confirm("检测到未保存的草稿，是否恢复？")) {
              setForm(data.form);
              setSavedAt(data.savedAt);
            } else {
              localStorage.removeItem(DRAFT_KEY);
            }
          }
        } catch {}
      }
    }
  }, [editSlug]);

  // 自动保存草稿（每 10 秒）
  useEffect(() => {
    if (editId) return; // 编辑模式不自动保存草稿
    if (!form.title && !form.content) return;

    const timer = setInterval(() => {
      const now = new Date().toLocaleTimeString("zh-CN");
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, savedAt: now }));
      setSavedAt(now);
    }, 10000);

    return () => clearInterval(timer);
  }, [form, editId]);

  // 自动 slug
  useEffect(() => {
    if (editId) return;
    let slug = form.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug) slug = "post-" + Date.now().toString(36);
    setForm(prev => ({ ...prev, slug }));
  }, [form.title, editId]);

  // 图片上传
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        insertText(`![${file.name}](${data.url})`);
      } else {
        alert(data.error || "上传失败");
      }
    } catch { alert("上传失败"); }
    setUploading(false);
  };

  // 拖拽上传
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  }, []);

  // 粘贴上传
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleUpload(file);
        break;
      }
    }
  }, []);

  // 插入文本到光标位置
  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart, end = textarea.selectionEnd;
    const newContent = form.content.substring(0, start) + text + form.content.substring(end);
    setForm(prev => ({ ...prev, content: newContent }));
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + text.length, start + text.length); }, 0);
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart, end = textarea.selectionEnd;
    const selected = form.content.substring(start, end);
    const text = before + selected + after;
    insertText(text);
    setTimeout(() => textarea.setSelectionRange(start + before.length, start + before.length + selected.length), 0);
  };

  // 清除草稿
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setSavedAt(null);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim() || !form.content.trim()) { alert("标题和内容不能为空"); return; }
    setLoading(true);
    const url = editId ? `/api/posts/${editId}` : "/api/posts";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, published: publish }) });
    if (res.ok) {
      clearDraft();
      const post = await res.json();
      router.push(`/posts/${post.slug}`);
    } else {
      alert((await res.json()).error || "保存失败");
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="text-center py-20 text-slate-400">加载中...</div>;
  if (!session) return (
    <div className="max-w-md mx-auto text-center py-20 animate-fade-in">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">需要登录</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">请先登录后再写文章</p>
      <Link href="/admin/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">去登录</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft size={14} /> 返回首页
        </Link>
        <div className="flex items-center gap-3">
          {savedAt && !editId && (
            <span className="text-xs text-slate-400">草稿已保存 {savedAt}</span>
          )}
          {form.title && !editId && (
            <button onClick={clearDraft} className="text-xs text-slate-400 hover:text-red-500 transition-colors" title="清除草稿">清除草稿</button>
          )}
          <button onClick={() => handleSubmit(false)} disabled={loading} className="px-4 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">存草稿</button>
          <button onClick={() => handleSubmit(true)} disabled={loading} className="px-4 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            <Save size={14} /> {loading ? "保存中..." : editId ? "更新" : "发布"}
          </button>
        </div>
      </div>

      {editId && (
        <div className="mb-4 px-4 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">✏️ 编辑模式</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="文章标题..." className="w-full text-2xl sm:text-3xl font-bold bg-transparent text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none border-none" />
          <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} rows={2}
            placeholder="文章摘要（可选）..." className="w-full text-sm bg-transparent text-slate-500 dark:text-slate-400 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none border-none resize-none" />

          {/* Toolbar */}
          <div className="flex items-center gap-0.5 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex-wrap">
            <button onClick={() => insertMarkdown("## ")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="标题"><Heading1 size={16} /></button>
            <button onClick={() => insertMarkdown("### ")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="小标题"><Heading2 size={16} /></button>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button onClick={() => insertMarkdown("**", "**")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="粗体"><Bold size={16} /></button>
            <button onClick={() => insertMarkdown("*", "*")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="斜体"><Italic size={16} /></button>
            <button onClick={() => insertMarkdown("\`", "\`")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="代码"><Code size={16} /></button>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button onClick={() => insertMarkdown("- ")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="列表"><List size={16} /></button>
            <button onClick={() => insertMarkdown("> ")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="引用"><Quote size={16} /></button>
            <button onClick={() => insertMarkdown("[链接](", ")")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="链接"><LinkIcon size={16} /></button>
            <button onClick={() => insertMarkdown("![图片](", ")")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="图片链接"><Image size={16} /></button>
            <button onClick={() => insertMarkdown("\n\`\`\`javascript\n", "\n\`\`\`\n")} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-colors" title="代码块"><Code size={16} /></button>
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 transition-colors disabled:opacity-50" title="上传图片">
              <Upload size={16} />
            </button>
            {uploading && <span className="text-xs text-blue-500 ml-1">上传中...</span>}
          </div>

          {/* Content */}
          <textarea
            ref={textareaRef}
            id="content-editor"
            value={form.content}
            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onPaste={handlePaste}
            rows={20}
            placeholder="使用 Markdown 格式写作...（支持拖拽/粘贴图片上传）"
            className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-sm text-slate-900 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 resize-y leading-relaxed"
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">URL 别名</label>
            <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white" />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">分类</label>
            <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
              className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white">
              <option value="">无分类</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">标签</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t: any) => (
                <button key={t.id} onClick={() => setForm(p => ({ ...p, tagIds: p.tagIds.includes(t.id) ? p.tagIds.filter(id => id !== t.id) : [...p.tagIds, t.id] }))}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${form.tagIds.includes(t.id) ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function WritePage() {
  return <Suspense fallback={<div className="text-center py-20 text-slate-400">加载中...</div>}><WriteContent /></Suspense>;
}
