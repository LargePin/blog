"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {currentPage > 1 && (
        <Link href={`${basePath}?page=${currentPage - 1}`} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <ChevronLeft size={16} />
        </Link>
      )}
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className="px-2 text-slate-300 dark:text-slate-600 text-sm">···</span>
        ) : (
          <Link key={page} href={`${basePath}?page=${page}`} className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
          }`}>
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={`${basePath}?page=${currentPage + 1}`} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
