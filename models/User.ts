import { Schema, models, model } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
