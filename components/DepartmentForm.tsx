"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departmentSchema } from "@/lib/validations";
import { z } from "zod";
import { createDepartment, updateDepartment } from "@/actions/departments";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type DepartmentInput = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  defaultValues?: Partial<DepartmentInput>;
  departmentId?: string;
}

const ICON_OPTIONS = [
  "HeartPulse", "Brain", "Bone", "Smile", "Baby", "Siren",
  "Stethoscope", "Pill", "Syringe", "Activity", "Eye", "Ear",
];

export default function DepartmentForm({ defaultValues, departmentId }: DepartmentFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentInput>({
    resolver: zodResolver(departmentSchema),
    defaultValues,
  });

  async function onSubmit(data: DepartmentInput) {
    try {
      if (departmentId) {
        await updateDepartment(departmentId, data);
        toast.success("Department updated");
      } else {
        await createDepartment(data);
        toast.success("Department added");
      }
      router.push("/admin/departments");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <input {...register("name")} className="input-field" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Icon</label>
        <select {...register("icon")} className="input-field">
          {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
        </select>
        {errors.icon && <p className="mt-1 text-xs text-red-500">{errors.icon.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea {...register("description")} rows={3} className="input-field" />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {departmentId ? "Update Department" : "Add Department"}
      </button>
    </form>
  );
}
