import mongoose, { Schema, models, model } from "mongoose";

export interface IDoctor {
  _id?: string;
  name: string;
  specialization: string;
  department: mongoose.Types.ObjectId | string;
  qualification: string;
  experience: number;
  profileImage: string;
  email: string;
  phone: string;
  availability: string[]; // e.g. ["Mon", "Wed", "Fri"]
  bio: string;
  createdAt?: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    profileImage: { type: String, default: "/images/doctor-placeholder.svg" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    availability: { type: [String], default: [] },
    bio: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Doctor || model<IDoctor>("Doctor", DoctorSchema);
