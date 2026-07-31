import { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Department from "@/models/Department";
import DoctorCard from "@/components/DoctorCard";
import SearchBar from "@/components/SearchBar";
import DoctorFilters from "@/components/DoctorFilters";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Doctors" };

interface DoctorsPageProps {
  searchParams: Promise<{ q?: string; department?: string; experience?: string; day?: string }>;
}

async function DoctorsList({ searchParams }: DoctorsPageProps) {
  const { q, department, experience, day } = await searchParams;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (department) filter.department = department;
  if (experience) filter.experience = { $gte: Number(experience) };
  if (day) filter.availability = day;

  const [doctors, departments] = await Promise.all([
    Doctor.find(filter).populate("department", "name").lean(),
    Department.find().select("name").lean(),
  ]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchBar placeholder="Search doctors by name..." />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
        <DoctorFilters departments={departments.map((d) => ({ _id: String(d._id), name: d.name }))} />
          </Suspense>
      </div>

      {doctors.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">
          No doctors match your search. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <DoctorCard
              key={String(doc._id)}
              id={String(doc._id)}
              name={doc.name}
              specialization={doc.specialization}
              departmentName={(doc.department as unknown as { name?: string })?.name}
              qualification={doc.qualification}
              experience={doc.experience}
              profileImage={doc.profileImage}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function DoctorsPage(props: DoctorsPageProps) {
  return (
    <main className="section">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Our Doctors</h1>
        <p className="mt-2 text-slate-500">Find and book the right specialist for you</p>
      </div>
      <Suspense fallback={<div className="text-center text-slate-400">Loading doctors...</div>}>
        <DoctorsList {...props} />
      </Suspense>
    </main>
  );
}
