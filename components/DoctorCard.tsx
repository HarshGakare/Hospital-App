import Image from "next/image";
import Link from "next/link";
import { Star, Briefcase } from "lucide-react";

interface DoctorCardProps {
  id: string;
  name: string;
  specialization: string;
  departmentName?: string;
  qualification: string;
  experience: number;
  profileImage: string;
}

export default function DoctorCard({
  id,
  name,
  specialization,
  departmentName,
  qualification,
  experience,
  profileImage,
}: DoctorCardProps) {
  return (
    <Link href={`/doctors/${id}`} className="card group flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-slate-100">
        <Image src={profileImage} alt={name} fill sizes="112px" className="object-cover" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-800 group-hover:text-primary">{name}</h3>
      <p className="text-sm font-medium text-primary">{specialization}</p>
      {departmentName && (
        <span className="mt-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
          {departmentName}
        </span>
      )}
      <p className="mt-2 text-xs text-slate-500">{qualification}</p>
      <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
        <Briefcase className="h-3.5 w-3.5" />
        {experience}+ years experience
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        4.9 rating
      </div>
    </Link>
  );
}
