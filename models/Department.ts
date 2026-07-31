import { Schema, models, model } from "mongoose";

export interface IDepartment {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // lucide-react icon name, e.g. "HeartPulse"
  createdAt?: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Stethoscope" },
  },
  { timestamps: true }
);

export default models.Department || model<IDepartment>("Department", DepartmentSchema);
