"use client";

import { useState } from "react";
import { Search as SearchIcon, BookOpen } from "lucide-react";
import PostCard from "@/components/PostCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.posts || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">搜索文章</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">输入关键词搜索博客内容</p>
      </div>
      <div className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="搜索文章标题、内容..."
          className="w-full pl-11 pr-24 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400" />
        <button onClick={handleSearch} disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium">
          {loading ? "搜索中..." : "搜索"}
        </button>
      </div>
      {searched && (
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{loading ? "搜索中..." : `找到 ${results.length} 篇相关文章`}</p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{results.map((post: any) => <PostCard key={post.id} post={post} />)}</div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <BookOpen className="mx-auto mb-3 text-slate-300 dark:text-slate-600" size={36} />
              <p className="text-slate-400 text-sm">未找到相关文章，换个关键词试试</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
