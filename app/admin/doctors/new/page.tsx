import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import DoctorForm from "@/components/DoctorForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Doctor" };

export default async function NewDoctorPage() {
  await connectDB();
  const departments = await Department.find().select("name").lean();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Add Doctor</h1>
      <DoctorForm departments={departments.map((d) => ({ _id: String(d._id), name: d.name }))} />
    </div>
  );
}
