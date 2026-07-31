"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations";
import { bookAppointment } from "@/actions/appointments";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface DepartmentOption {
  _id: string;
  name: string;
}

interface DoctorOption {
  _id: string;
  name: string;
  department: string;
}

interface AppointmentFormProps {
  departments: DepartmentOption[];
  doctors: DoctorOption[];
}

const TIME_SLOTS = [
   "09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35", "09:40", "09:45", "09:50", "09:55",
  "10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55",
  "11:00", "11:05", "11:10", "11:15", "11:20", "11:25", "11:30", "11:35", "11:40", "11:45", "11:50", "11:55",
  "12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30", "12:35", "12:40", "12:45", "12:50", "12:55",
  "13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55",
  "14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30", "14:35", "14:40", "14:45", "14:50", "14:55",
  "15:00", "15:05", "15:10", "15:15", "15:20", "15:25", "15:30", "15:35", "15:40", "15:45", "15:50", "15:55",
  "16:00", "16:05", "16:10", "16:15", "16:20", "16:25", "16:30", "16:35", "16:40", "16:45", "16:50", "16:55",
  "17:00", "17:05", "17:10", "17:15", "17:20", "17:25", "17:30", "17:35", "17:40", "17:45", "17:50", "17:55",
  "18:00"
];

export default function AppointmentForm({ departments, doctors }: AppointmentFormProps) {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      department: searchParams.get("department") ?? "",
      doctor: searchParams.get("doctor") ?? "",
    },
  });

  const selectedDepartment = watch("department");

  const filteredDoctors = useMemo(
    () => doctors.filter((d) => !selectedDepartment || d.department === selectedDepartment),
    [doctors, selectedDepartment]
  );

  // If the pre-selected doctor (from a "Book" link on a doctor's profile)
  // belongs to a different department than currently selected, sync it.
  useEffect(() => {
    const doctorParam = searchParams.get("doctor");
    if (doctorParam) {
      const doc = doctors.find((d) => d._id === doctorParam);
      if (doc) setValue("department", doc.department);
    }
  }, [searchParams, doctors, setValue]);

  const today = new Date().toISOString().split("T")[0];

  async function onSubmit(data: AppointmentInput) {
    const result = await bookAppointment(data);
    if (result.success) {
      toast.success(result.message);
      setSubmitted(true);
      reset();
    } else {
      toast.error(result.message);
    }
  }

  if (submitted) {
    return (
      <div className="card text-center">
        <h3 className="text-xl font-semibold text-secondary-700">Appointment Requested!</h3>
        <p className="mt-2 text-slate-500">
          We&apos;ve emailed you a confirmation. Our team will reach out if anything needs
          adjusting.
        </p>
        <button className="btn-outline mt-6" onClick={() => setSubmitted(false)}>
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
        <input {...register("fullName")} className="input-field" placeholder="Jane Doe" />
        {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input {...register("email")} type="email" className="input-field" placeholder="jane@example.com" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
        <input {...register("phone")} className="input-field" placeholder="+91 98765 43210" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
        <input {...register("age")} type="number" className="input-field" placeholder="32" />
        {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
        <select {...register("gender")} className="input-field">
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
        <select {...register("department")} className="input-field">
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Doctor</label>
        <select {...register("doctor")} className="input-field">
          <option value="">Select doctor</option>
          {filteredDoctors.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        {errors.doctor && <p className="mt-1 text-xs text-red-500">{errors.doctor.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
        <input {...register("date")} type="date" min={today} className="input-field" />
        {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Time</label>
        <select {...register("time")} className="input-field">
          <option value="">Select time</option>
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Message (optional)</label>
        <textarea {...register("message")} rows={3} className="input-field" placeholder="Briefly describe your symptoms or reason for visit" />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Booking..." : "Confirm Appointment"}
        </button>
      </div>
    </form>
  );
}
