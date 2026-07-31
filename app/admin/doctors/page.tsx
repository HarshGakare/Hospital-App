import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import { deleteDoctor } from "@/actions/doctors";
import DeleteButton from "@/components/DeleteButton";
import { Plus, Pencil } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Doctors" };

export default async function AdminDoctorsPage() {
  await connectDB();
  const doctors = await Doctor.find().populate("department", "name").sort({ createdAt: -1 }).lean();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage Doctors</h1>
        <Link href="/admin/doctors/new" className="btn-primary">
          <Plus className="mr-1 h-4 w-4" /> Add Doctor
        </Link>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={String(doc._id)} className="border-t border-slate-100">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-100">
                    <Image src={doc.profileImage} alt={doc.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.specialization}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{(doc.department as unknown as { name?: string })?.name}</td>
                <td className="px-4 py-3">{doc.experience}+ yrs</td>
                <td className="px-4 py-3 text-xs text-slate-500">{doc.email}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/doctors/${String(doc._id)}/edit`} className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-100">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <DeleteButton action={deleteDoctor} id={String(doc._id)} label="doctor" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {doctors.length === 0 && <p className="p-6 text-center text-slate-400">No doctors yet.</p>}
      </div>
    </div>
  );
}
