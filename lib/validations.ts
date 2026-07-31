import { z } from "zod";

export const appointmentSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(15),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.enum(["male", "female", "other"], { message: "Select a gender" }),
  department: z.string().min(1, "Select a department"),
  doctor: z.string().min(1, "Select a doctor"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  message: z.string().max(500).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

export const doctorSchema = z.object({
  name: z.string().min(2),
  specialization: z.string().min(2),
  department: z.string().min(1),
  qualification: z.string().min(2),
  experience: z.coerce.number().int().min(0),
  profileImage: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  availability: z.array(z.string()).default([]),
  bio: z.string().min(10),
});

export const departmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().min(1),
});

export const blogSchema = z.object({
  title: z.string().min(3),
  coverImage: z.string().optional(),
  category: z.string().min(2),
  author: z.string().min(2),
  content: z.string().min(20),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;
