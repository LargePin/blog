"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Tag { id: string; name: string; slug: string; _count: { posts: number }; }

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  const fetchTags = async () => { const res = await fetch("/api/tags"); const data = await res.json(); setTags(data.tags); setLoading(false); };
  useEffect(() => { fetchTags(); }, []);

  const slugify = (text: string) => text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "");

  const handleCreate = async () => {
    const res = await fetch("/api/tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", slug: "" }); setShowNew(false); fetchTags(); } else { alert((await res.json()).error); }
  };
  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/tags/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setEditing(null); fetchTags(); } else { alert((await res.json()).error); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
    if (res.ok) fetchTags();
  };
  const startEdit = (tag: Tag) => { setEditing(tag.id); setForm({ name: tag.name, slug: tag.slug }); };

  if (loading) return <div>加载中...</div>;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <button onClick={() => { setShowNew(true); setForm({ name: "", slug: "" }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Plus size={16} /> 新建标签</button>
      </div>
      {showNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })} placeholder="标签名称" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="url-slug" className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleCreate} className="p-2 text-green-600 hover:bg-green-50 rounded"><Save size={18} /></button>
            <button onClick={() => setShowNew(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded"><X size={18} /></button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="relative group">
              {editing === tag.id ? (
                <div className="flex items-center gap-2 bg-white border border-blue-300 rounded-full px-3 py-1.5">
                  <input type="text" value={form.name} onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })} className="w-20 text-sm border-none focus:outline-none" />
                  <button onClick={() => handleUpdate(tag.id)} className="text-green-600"><Save size={14} /></button>
                  <button onClick={() => setEditing(null)} className="text-gray-400"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
                  <span className="text-sm text-gray-700">{tag.name}</span>
                  <span className="text-xs text-gray-400">({tag._count.posts})</span>
                  <button onClick={() => startEdit(tag)} className="text-gray-400 hover:text-blue-600 ml-1"><Edit size={12} /></button>
                  <button onClick={() => handleDelete(tag.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
        {tags.length === 0 && <div className="text-center py-8 text-gray-500">暂无标签</div>}
      </div>
    </div>
  );
}
