import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogForm from "@/components/BlogForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Blog Post" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const post = await Blog.findById(id).lean();
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Blog Post</h1>
      <BlogForm
        blogId={id}
        defaultValues={{
          title: post.title,
          category: post.category,
          author: post.author,
          coverImage: post.coverImage,
          content: post.content,
        }}
      />
    </div>
  );
}
