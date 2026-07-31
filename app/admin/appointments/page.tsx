import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { deleteAppointment } from "@/actions/appointments";
import DeleteButton from "@/components/DeleteButton";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Appointments" };

export default async function AdminAppointmentsPage() {
  await connectDB();
  const appointments = await Appointment.find()
    .populate("doctor", "name")
    .populate("department", "name")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Appointments</h1>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={String(appt._id)} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{appt.fullName}</p>
                  <p className="text-xs text-slate-400">{appt.age} yrs · {appt.gender}</p>
                </td>
                <td className="px-4 py-3">{(appt.doctor as unknown as { name?: string })?.name}</td>
                <td className="px-4 py-3">{(appt.department as unknown as { name?: string })?.name}</td>
                <td className="px-4 py-3">{formatDate(appt.date)} · {appt.time}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{appt.email}<br />{appt.phone}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deleteAppointment} id={String(appt._id)} label="appointment" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <p className="p-6 text-center text-slate-400">No appointments yet.</p>}
      </div>
    </div>
  );
}
