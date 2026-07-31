import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import DepartmentForm from "@/components/DepartmentForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Department" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDepartmentPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const department = await Department.findById(id).lean() as any;
  if (!department) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Department</h1>
      <DepartmentForm
        departmentId={id}
        defaultValues={{
          name: department.name,
          description: department.description,
          icon: department.icon,
        }}
      />
    </div>
  );
}
