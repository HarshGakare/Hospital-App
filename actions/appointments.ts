"use server";

import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Doctor from "@/models/Doctor";
import Department from "@/models/Department";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations";
import { sendAdminNotification, sendPatientConfirmation } from "@/lib/email";
import { appendAppointmentToSheet } from "@/lib/googleSheets";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof AppointmentInput, string>>;
}

export async function bookAppointment(raw: AppointmentInput): Promise<ActionResult> {
  const parsed = appointmentSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof AppointmentInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof AppointmentInput;
      fieldErrors[key] = issue.message;
    }
    return { success: false, message: "Please fix the highlighted fields.", fieldErrors };
  }

  const data = parsed.data;

  await connectDB();

  // Look up doctor + department so we have their names for the email/sheet,
  // and so we can confirm they actually exist before writing anything.
  const [doctor, department] = await Promise.all([
    Doctor.findById(data.doctor),
    Department.findById(data.department),
  ]);

  if (!doctor || !department) {
    return { success: false, message: "Selected doctor or department was not found." };
  }

  try {
    await Appointment.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      gender: data.gender,
      department: data.department,
      doctor: data.doctor,
      date: data.date,
      time: data.time,
      message: data.message,
    });
  } catch (err: unknown) {
    // Mongo duplicate key error from the unique (doctor, date, time) index.
    if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
      return {
        success: false,
        message: "That doctor is already booked at the selected date and time. Please choose another slot.",
      };
    }
    console.error("Appointment creation failed:", err);
    return { success: false, message: "Something went wrong while booking. Please try again." };
  }

  const emailData = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    doctorName: doctor.name,
    departmentName: department.name,
    date: data.date,
    time: data.time,
    message: data.message,
  };

  // Email + Sheets are "nice to have" side effects — if either fails, the
  // booking itself has already succeeded, so we log instead of failing the
  // whole request.
  const results = await Promise.allSettled([
    sendAdminNotification(emailData),
    sendPatientConfirmation(emailData),
    appendAppointmentToSheet(emailData),
  ]);

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const labels = ["admin email", "patient email", "Google Sheets append"];
      console.error(`${labels[i]} failed:`, r.reason);
    }
  });

  revalidatePath("/admin/appointments");

  return { success: true, message: "Your appointment has been booked! Check your email for confirmation." };
}

export async function deleteAppointment(id: string) {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized");
  }
  await connectDB();
  await Appointment.findByIdAndDelete(id);
  revalidatePath("/admin/appointments");
}

