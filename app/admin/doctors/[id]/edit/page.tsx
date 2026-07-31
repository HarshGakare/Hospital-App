import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import Doctor from "@/models/Doctor";
import DoctorForm from "@/components/DoctorForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Doctor" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDoctorPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const [departments, doctor] = await Promise.all([
    Department.find().select("name").lean() as any,
    Doctor.findById(id).lean() as any,
  ]);

  if (!doctor) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Doctor</h1>
      <DoctorForm
        departments={departments.map((d: any) => ({ _id: String(d._id), name: d.name }))}
        doctorId={id}
        defaultValues={{
          name: doctor.name,
          specialization: doctor.specialization,
          department: String(doctor.department),
          qualification: doctor.qualification,
          experience: doctor.experience,
          profileImage: doctor.profileImage,
          email: doctor.email,
          phone: doctor.phone,
          availability: doctor.availability,
          bio: doctor.bio,
        }}
      />
    </div>
  );
}
