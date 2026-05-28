import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, Eye, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    views: number;
    category: { name: string; slug: string } | null;
    tags: { name: string; slug: string }[];
  };
  featured?: boolean;
}

export default function PostCard({ post, featured }: PostCardProps) {
  return (
    <article className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5 ${
      featured ? "md:col-span-2" : ""
    }`}>
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="block overflow-hidden">
          <div className={`relative ${featured ? "h-56" : "h-44"} bg-slate-100 dark:bg-slate-700`}>
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </Link>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          {post.category && (
            <Link href={`/categories/${post.category.slug}`} className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
              {post.category.name}
            </Link>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={12} />{formatDate(post.publishedAt)}
            </span>
          )}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className={`font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2 ${featured ? "text-xl" : "text-base"}`}>
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag.slug} href={`/tags/${tag.slug}`} className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {tag.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Eye size={12} />{post.views}</span>
            <Link href={`/posts/${post.slug}`} className="flex items-center gap-0.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              阅读 <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
