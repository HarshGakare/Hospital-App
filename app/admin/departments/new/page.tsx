import DepartmentForm from "@/components/DepartmentForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Department" };

export default function NewDepartmentPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Add Department</h1>
      <DepartmentForm />
    </div>
  );
}
