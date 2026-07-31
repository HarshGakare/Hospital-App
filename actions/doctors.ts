"use server";

import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { doctorSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function createDoctor(raw: unknown) {
  await requireAdmin();
  const data = doctorSchema.parse(raw);
  await connectDB();
  await Doctor.create(data);
  revalidatePath("/doctors");
  revalidatePath("/admin/doctors");
}

export async function updateDoctor(id: string, raw: unknown) {
  await requireAdmin();
  const data = doctorSchema.parse(raw);
  await connectDB();
  await Doctor.findByIdAndUpdate(id, data);
  revalidatePath("/doctors");
  revalidatePath("/admin/doctors");
}

export async function deleteDoctor(id: string) {
  await requireAdmin();
  await connectDB();
  await Doctor.findByIdAndDelete(id);
  revalidatePath("/doctors");
  revalidatePath("/admin/doctors");
}
