import BlogForm from "@/components/BlogForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Blog Post" };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
