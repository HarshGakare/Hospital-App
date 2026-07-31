"use server";

import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import { departmentSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function createDepartment(raw: unknown) {
  await requireAdmin();
  const data = departmentSchema.parse(raw);
  await connectDB();
  await Department.create({ ...data, slug: slugify(data.name) });
  revalidatePath("/departments");
  revalidatePath("/admin/departments");
}

export async function updateDepartment(id: string, raw: unknown) {
  await requireAdmin();
  const data = departmentSchema.parse(raw);
  await connectDB();
  await Department.findByIdAndUpdate(id, { ...data, slug: slugify(data.name) });
  revalidatePath("/departments");
  revalidatePath("/admin/departments");
}

export async function deleteDepartment(id: string) {
  await requireAdmin();
  await connectDB();
  await Department.findByIdAndDelete(id);
  revalidatePath("/departments");
  revalidatePath("/admin/departments");
}
