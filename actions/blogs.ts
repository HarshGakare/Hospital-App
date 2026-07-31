"use server";

import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { blogSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function createBlog(raw: unknown) {
  await requireAdmin();
  const data = blogSchema.parse(raw);
  await connectDB();
  await Blog.create({ ...data, slug: slugify(data.title) });
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}

export async function updateBlog(id: string, raw: unknown) {
  await requireAdmin();
  const data = blogSchema.parse(raw);
  await connectDB();
  await Blog.findByIdAndUpdate(id, { ...data, slug: slugify(data.title) });
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}

export async function deleteBlog(id: string) {
  await requireAdmin();
  await connectDB();
  await Blog.findByIdAndDelete(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
}
