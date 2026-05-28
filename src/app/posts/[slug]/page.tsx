import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Calendar, Eye, Clock, ArrowLeft, Tag, Folder, PenSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import DeletePostButton from "@/components/DeletePostButton";
import RelatedPosts from "@/components/RelatedPosts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, select: { title: true, excerpt: true } });
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function estimateReadTime(content: string): number { return Math.max(1, Math.ceil(content.length / 500)); }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const post = await prisma.post.findUnique({
    where: { slug, deletedAt: null },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });

  if (!post) notFound();

  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  const isOwner = userId === post.authorId;
  const readTime = estimateReadTime(post.content);

  return (
    <div className="animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
        <ArrowLeft size={14} /> 返回首页
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8">
        <article className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden">
          {post.coverImage && (
            <div className="relative h-64 sm:h-80 bg-slate-100 dark:bg-slate-700">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {post.category && (
                  <Link href={`/categories/${post.category.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                    <Folder size={11} />{post.category.name}
                  </Link>
                )}
                {post.publishedAt && <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={12} />{formatDate(post.publishedAt)}</span>}
                <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={12} />约 {readTime} 分钟</span>
                <span className="flex items-center gap-1 text-xs text-slate-400"><Eye size={12} />{post.views} 阅读</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">{post.title}</h1>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  {post.tags.map((tag) => (
                    <Link key={tag.slug} href={`/tags/${tag.slug}`} className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Tag size={10} />{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <MarkdownRenderer content={post.content} />

            {/* Owner actions */}
            {isOwner && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <Link href={`/write?edit=${post.slug}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
                  <PenSquare size={14} /> 编辑文章
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            )}

            {/* Related Posts */}
            <RelatedPosts currentPostId={post.id} categoryId={post.categoryId} tagIds={post.tags.map(t => t.slug)} />
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <TableOfContents content={post.content} />
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{(post.author.name || "A")[0]}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.author.name || "Admin"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
