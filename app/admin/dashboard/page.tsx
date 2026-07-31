import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Department from "@/models/Department";
import Appointment from "@/models/Appointment";
import Blog from "@/models/Blog";
import { Stethoscope, Building2, CalendarCheck, Newspaper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  await connectDB();
  const [doctorCount, departmentCount, appointmentCount, blogCount] = await Promise.all([
    Doctor.countDocuments(),
    Department.countDocuments(),
    Appointment.countDocuments(),
    Blog.countDocuments(),
  ]);

  const stats = [
    { label: "Doctors", value: doctorCount, icon: Stethoscope },
    { label: "Departments", value: departmentCount, icon: Building2 },
    { label: "Appointments", value: appointmentCount, icon: CalendarCheck },
    { label: "Blog Posts", value: blogCount, icon: Newspaper },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">Overview of your hospital&apos;s data</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="rounded-lg bg-primary-50 p-3 text-primary">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
