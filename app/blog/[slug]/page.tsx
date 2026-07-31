import Image from "next/image";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  await connectDB();
  return Blog.findOne({ slug }).lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post && post !== null ? (post as any).title : "Article Not Found" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="section max-w-3xl">
      <span className="text-xs font-semibold uppercase tracking-wide text-secondary-600">{(post as any).category}</span>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{(post as any).title}</h1>
      <p className="mt-2 text-sm text-slate-400">{(post as any).author} · {formatDate((post as any).publishedDate)}</p>

      <div className="relative mt-6 h-72 w-full overflow-hidden rounded-card sm:h-96">
        <Image src={(post as any).coverImage} alt={(post as any).title} fill className="object-cover" />
      </div>

      <article className="prose prose-slate mt-8 max-w-none whitespace-pre-line leading-relaxed text-slate-700">
        {(post as any).content}
      </article>
    </main>
  );
}
