"use client";

import { useEffect, useRef } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // 对已渲染的代码块应用高亮
    ref.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  // 配置 marked
  const renderer = new marked.Renderer();

  // 给标题添加 id（用于 TOC 定位）
  renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
    const cleanText = text.replace(/<[^>]*>/g, "").replace(/[*_`\[\]]/g, "").trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  // 代码块渲染（带语言标签）
  renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    const language = lang && hljs.getLanguage(lang) ? lang : "";
    return `<pre><code class="hljs language-${language}">${text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`;
  };

  marked.setOptions({ gfm: true, breaks: true });
  const html = marked.parse(content, { renderer }) as string;

  return (
    <div
      ref={ref}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
