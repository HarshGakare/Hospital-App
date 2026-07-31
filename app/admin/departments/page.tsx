import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import { deleteDepartment } from "@/actions/departments";
import DeleteButton from "@/components/DeleteButton";
import { Plus, Pencil } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Departments" };

export default async function AdminDepartmentsPage() {
  await connectDB();
  const departments = await Department.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Departments</h1>
        <Link href="/admin/departments/new" className="btn-primary">
          <Plus className="mr-1 h-4 w-4" /> Add Department
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <div key={String(dept._id)} className="card">
            <h2 className="font-semibold text-slate-800">{dept.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{dept.description}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Link href={`/admin/departments/${String(dept._id)}/edit`} className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-100">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <DeleteButton action={deleteDepartment} id={String(dept._id)} label="department" />
            </div>
          </div>
        ))}
      </div>
      {departments.length === 0 && <p className="mt-6 text-center text-slate-400">No departments yet.</p>}
    </div>
  );
}
