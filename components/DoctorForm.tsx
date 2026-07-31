"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema } from "@/lib/validations";
import { z } from "zod";
import { createDoctor, updateDoctor } from "@/actions/doctors";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type DoctorInput = z.infer<typeof doctorSchema>;

interface DoctorFormProps {
  departments: { _id: string; name: string }[];
  defaultValues?: Partial<DoctorInput>;
  doctorId?: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DoctorForm({ departments, defaultValues, doctorId }: DoctorFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DoctorInput>({
    resolver: zodResolver(doctorSchema),
    defaultValues: { availability: [], ...defaultValues },
  });

  const availability = watch("availability") ?? [];

  function toggleDay(day: string) {
    if (availability.includes(day)) {
      setValue("availability", availability.filter((d) => d !== day));
    } else {
      setValue("availability", [...availability, day]);
    }
  }

  async function onSubmit(data: DoctorInput) {
    try {
      if (doctorId) {
        await updateDoctor(doctorId, data);
        toast.success("Doctor updated");
      } else {
        await createDoctor(data);
        toast.success("Doctor added");
      }
      router.push("/admin/doctors");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-5 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input {...register("name")} className="input-field" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Specialization</label>
        <input {...register("specialization")} className="input-field" />
        {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
        <select {...register("department")} className="input-field">
          <option value="">Select department</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Qualification</label>
        <input {...register("qualification")} className="input-field" />
        {errors.qualification && <p className="mt-1 text-xs text-red-500">{errors.qualification.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Experience (years)</label>
        <input {...register("experience")} type="number" className="input-field" />
        {errors.experience && <p className="mt-1 text-xs text-red-500">{errors.experience.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Profile Image URL</label>
        <input {...register("profileImage")} className="input-field" placeholder="/images/doctor-placeholder.jpg" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input {...register("email")} type="email" className="input-field" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
        <input {...register("phone")} className="input-field" />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Availability</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              type="button"
              key={day}
              onClick={() => toggleDay(day)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                availability.includes(day)
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-slate-300 text-slate-500"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
        <textarea {...register("bio")} rows={4} className="input-field" />
        {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {doctorId ? "Update Doctor" : "Add Doctor"}
        </button>
      </div>
    </form>
  );
}
