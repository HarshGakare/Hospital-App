import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DepartmentCardProps {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function DepartmentCard({ name, slug, description, icon }: DepartmentCardProps) {
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[icon] || Icons.Stethoscope;

  return (
    <Link
      href={`/departments#${slug}`}
      className="card flex flex-col items-start gap-3 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="rounded-lg bg-secondary-50 p-3 text-secondary-600">
        <IconComponent className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{name}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </Link>
  );
}
