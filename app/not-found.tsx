import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <HeartPulse className="h-10 w-10 text-primary" />
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary mt-6">Back to Home</Link>
    </main>
  );
}
