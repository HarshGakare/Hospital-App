import { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";
import Department from "@/models/Department";
import Doctor from "@/models/Doctor";
import AppointmentForm from "@/components/AppointmentForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Book an Appointment" };

async function BookingFormLoader() {
  await connectDB();
  const [departments, doctors] = await Promise.all([
    Department.find().select("name").lean(),
    Doctor.find().select("name department").lean(),
  ]);

  return (
    
    <AppointmentForm
      departments={departments.map((d) => ({ _id: String(d._id), name: d.name }))}
      doctors={doctors.map((d) => ({
        _id: String(d._id),
        name: d.name,
        department: String(d.department),
      }))}
    />
    
  );
}

export default function BookPage() {
  return (
    <main className="section max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Book an Appointment</h1>
        <p className="mt-2 text-slate-500">Fill in your details and we&apos;ll confirm shortly</p>
      </div>
      <Suspense fallback={<div className="text-center text-slate-400">Loading form...</div>}>
        <BookingFormLoader />
      </Suspense>
    </main>
  );
}
