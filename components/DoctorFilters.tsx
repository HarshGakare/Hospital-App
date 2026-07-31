"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface DoctorFiltersProps {
  departments: { _id: string; name: string }[];
}

export default function DoctorFilters({ departments }: DoctorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        className="input-field w-auto"
        value={searchParams.get("department") ?? ""}
        onChange={(e) => updateParam("department", e.target.value)}
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d._id} value={d._id}>{d.name}</option>
        ))}
      </select>

      <select
        className="input-field w-auto"
        value={searchParams.get("experience") ?? ""}
        onChange={(e) => updateParam("experience", e.target.value)}
      >
        <option value="">Any Experience</option>
        <option value="5">5+ years</option>
        <option value="10">10+ years</option>
        <option value="15">15+ years</option>
      </select>

      <select
        className="input-field w-auto"
        value={searchParams.get("day") ?? ""}
        onChange={(e) => updateParam("day", e.target.value)}
      >
        <option value="">Any Availability</option>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}
