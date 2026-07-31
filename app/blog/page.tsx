import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import SearchBar from "@/components/SearchBar";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Health Blog" };

interface BlogPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function BlogList({ searchParams }: BlogPageProps) {
  const { q } = await searchParams;
  await connectDB();

  const filter = q ? { title: { $regex: q, $options: "i" } } : {};
  const posts = await Blog.find(filter).sort({ publishedDate: -1 }).lean();

  if (posts.length === 0) {
    return <div className="card py-16 text-center text-slate-500">No articles found.</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={String(post._id)} href={`/blog/${post.slug}`} className="card overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg">
          <div className="relative h-44 w-full">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
          <div className="p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-secondary-600">{post.category}</span>
            <h2 className="mt-2 font-semibold text-slate-800">{post.title}</h2>
            <p className="mt-2 text-xs text-slate-400">{post.author} · {formatDate(post.publishedDate)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage(props: BlogPageProps) {
  return (
    <main className="section">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Health Blog</h1>
        <p className="mt-2 text-slate-500">Tips and insights from our specialists</p>
      </div>
      <div className="mb-8 mx-auto max-w-sm">
         <Suspense fallback={<div>Loading search...</div>}>
        <SearchBar placeholder="Search articles..." />
        </Suspense>
      </div>
      <Suspense fallback={<div className="text-center text-slate-400">Loading articles...</div>}>
        <BlogList {...props} />
      </Suspense>
    </main>
  );
}
