import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
}

export default function TestimonialCard({ name, role, quote }: TestimonialCardProps) {
  return (
    <div className="card">
      <Quote className="h-6 w-6 text-primary-100" />
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{quote}</p>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
        <div className="flex gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
