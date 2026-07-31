import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Blog from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  await connectDB();
  const [doctors, posts] = await Promise.all([
    Doctor.find().select("_id").lean(),
    Blog.find().select("slug").lean(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/doctors`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/departments`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/book`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/emergency`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${siteUrl}/doctors/${String(d._id)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...doctorRoutes, ...blogRoutes];
}
