"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Category { id: string; name: string; slug: string; _count: { posts: number }; }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  const fetchCategories = async () => { const res = await fetch("/api/categories"); const data = await res.json(); setCategories(data.categories); setLoading(false); };
  useEffect(() => { fetchCategories(); }, []);

  const slugify = (text: string) => text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "");

  const handleCreate = async () => {
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", slug: "" }); setShowNew(false); fetchCategories(); } else { alert((await res.json()).error); }
  };
  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setEditing(null); fetchCategories(); } else { alert((await res.json()).error); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("确定删除？")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchCategories();
  };
  const startEdit = (cat: Category) => { setEditing(cat.id); setForm({ name: cat.name, slug: cat.slug }); };

  if (loading) return <div>加载中...</div>;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <button onClick={() => { setShowNew(true); setForm({ name: "", slug: "" }); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Plus size={16} /> 新建分类</button>
      </div>
      {showNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })} placeholder="分类名称" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="url-slug" className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleCreate} className="p-2 text-green-600 hover:bg-green-50 rounded"><Save size={18} /></button>
            <button onClick={() => setShowNew(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded"><X size={18} /></button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
        {categories.map((cat) => (
          <div key={cat.id} className="px-6 py-4 flex items-center justify-between">
            {editing === cat.id ? (
              <div className="flex items-center gap-3 flex-1">
                <input type="text" value={form.name} onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value) })} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-600 hover:bg-green-50 rounded"><Save size={18} /></button>
                <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded"><X size={18} /></button>
              </div>
            ) : (
              <>
                <div><span className="font-medium text-gray-900">{cat.name}</span><span className="text-sm text-gray-500 ml-2">/{cat.slug}</span><span className="text-xs text-gray-400 ml-2">({cat._count.posts} 篇)</span></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && <div className="text-center py-12 text-gray-500">暂无分类</div>}
      </div>
    </div>
  );
}
