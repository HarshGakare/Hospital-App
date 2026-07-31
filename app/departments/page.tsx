import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Departments" };

export default async function DepartmentsPage() {
  await connectDB();
  const departments = await Department.find().lean();

  return (
    <main className="section">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Our Departments</h1>
        <p className="mt-2 text-slate-500">Specialized, coordinated care across every stage of life</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[dept.icon] || Icons.Stethoscope;
          return (
            <div key={String(dept._id)} id={dept.slug} className="card scroll-mt-24">
              <div className="w-fit rounded-lg bg-secondary-50 p-3 text-secondary-600">
                <IconComponent className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-800">{dept.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{dept.description}</p>
              <Link
                href={`/doctors?department=${String(dept._id)}`}
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                View {dept.name} doctors →
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
