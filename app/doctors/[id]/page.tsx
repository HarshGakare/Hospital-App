import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, GraduationCap, Briefcase, CalendarDays } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import mongoose from "mongoose";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getDoctor(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doctor = await Doctor.findById(id).populate("department", "name").lean();
  return doctor;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctor(id);
  return { title: doctor ? doctor.name : "Doctor Not Found" };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { id } = await params;
  const doctor = await getDoctor(id);
  if (!doctor) notFound();

  const department = doctor.department as unknown as { _id: string; name: string } | null;

  return (
    <main className="section">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="card items-center text-center lg:col-span-1">
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full bg-slate-100">
            <Image src={doctor.profileImage} alt={doctor.name} fill className="object-cover" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">{doctor.name}</h1>
          <p className="text-primary font-medium">{doctor.specialization}</p>
          {department && (
            <span className="mt-2 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              {department.name}
            </span>
          )}

          <div className="mt-6 space-y-3 text-left text-sm text-slate-600">
            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {doctor.qualification}</div>
            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> {doctor.experience}+ years experience</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {doctor.email}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {doctor.phone}</div>
            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {doctor.availability.join(", ")}</div>
          </div>

          <Link href={`/book?doctor=${String(doctor._id)}`} className="btn-primary mt-6 w-full">
            Book Appointment
          </Link>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-800">About {doctor.name}</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{doctor.bio}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
