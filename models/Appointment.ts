import mongoose, { Schema, models, model } from "mongoose";

export interface IAppointment {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other";
  department: mongoose.Types.ObjectId | string;
  doctor: mongoose.Types.ObjectId | string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    // time: { type: String, required: true },
    message: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

// Prevent double-booking the same doctor at the same date + time.
AppointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

export default models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);
