import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { deleteBlog } from "@/actions/blogs";
import DeleteButton from "@/components/DeleteButton";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Blog Posts" };

export default async function AdminBlogsPage() {
  await connectDB();
  const posts = await Blog.find().sort({ publishedDate: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Blog Posts</h1>
        <Link href="/admin/blogs/new" className="btn-primary">
          <Plus className="mr-1 h-4 w-4" /> New Post
        </Link>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={String(post._id)} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{post.title}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3">{formatDate(post.publishedDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/blogs/${String(post._id)}/edit`} className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-100">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <DeleteButton action={deleteBlog} id={String(post._id)} label="post" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-slate-400">No blog posts yet.</p>}
      </div>
    </div>
  );
}
