import { Schema, models, model } from "mongoose";

export interface IBlog {
  _id?: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  author: string;
  content: string;
  publishedDate: Date;
  createdAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    coverImage: { type: String, default: "/images/blog-placeholder.svg" },
    category: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Blog || model<IBlog>("Blog", BlogSchema);
