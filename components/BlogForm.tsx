"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "@/lib/validations";
import { z } from "zod";
import { createBlog, updateBlog } from "@/actions/blogs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type BlogInput = z.infer<typeof blogSchema>;

interface BlogFormProps {
  defaultValues?: Partial<BlogInput>;
  blogId?: string;
}

export default function BlogForm({ defaultValues, blogId }: BlogFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  async function onSubmit(data: BlogInput) {
    try {
      if (blogId) {
        await updateBlog(blogId, data);
        toast.success("Post updated");
      } else {
        await createBlog(data);
        toast.success("Post published");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input {...register("title")} className="input-field" />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <input {...register("category")} className="input-field" placeholder="Wellness" />
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Author</label>
          <input {...register("author")} className="input-field" />
          {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Cover Image URL</label>
        <input {...register("coverImage")} className="input-field" placeholder="/images/blog-placeholder.jpg" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
        <textarea {...register("content")} rows={10} className="input-field" />
        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {blogId ? "Update Post" : "Publish Post"}
      </button>
    </form>
  );
}
