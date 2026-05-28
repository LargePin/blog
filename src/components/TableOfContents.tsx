"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // 从 markdown 提取标题
  useEffect(() => {
    const regex = /^(#{1,3})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const text = match[2].replace(/[*_`\[\]]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
        .replace(/^-+|-+$/g, "");
      items.push({ id, text, level: match[1].length });
    }
    setHeadings(items);
  }, [content]);

  // 监听滚动，高亮当前标题
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 w-full"
      >
        <List size={16} className="text-blue-500" />
        目录
        <span className="ml-auto text-xs text-slate-400">{headings.length}</span>
      </button>

      <nav className={`space-y-0.5 ${isOpen ? "block" : "hidden"} lg:block`}>
        {headings.map(({ id, text, level }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setIsOpen(false)}
            className={`block text-sm py-1 transition-colors truncate ${
              level === 2 ? "pl-3" : level === 3 ? "pl-6" : ""
            } ${
              activeId === id
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {text}
          </a>
        ))}
      </nav>
    </div>
  );
}
