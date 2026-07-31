import { PhoneCall, Ambulance, Mail, Clock, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Emergency Contact" };

export default function EmergencyPage() {
  return (
    <main className="section">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Emergency Contact</h1>
        <p className="mt-2 text-slate-500">We&apos;re here around the clock when it matters most</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <a href="tel:+91 7499725914" className="card flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <PhoneCall className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-800">Hospital Emergency Line</h2>
          <p className="mt-1 text-lg font-bold text-red-600">+91 7499725914</p>
        </a>

        <a href="tel:102" className="card flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <Ambulance className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-800">Ambulance</h2>
          <p className="mt-1 text-lg font-bold text-red-600">102</p>
        </a>

        <a href="mailto:emergency@carewellhospital.example" className="card flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-800">Emergency Email</h2>
          <p className="mt-1 font-bold text-red-600">gakareharsh@gmail.com</p>
        </a>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Working Hours</h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex justify-between"><span>Emergency Department</span><span className="font-medium">24/7</span></li>
            <li className="flex justify-between"><span>Outpatient Consultations</span><span className="font-medium">8:00 AM – 8:00 PM</span></li>
            <li className="flex justify-between"><span>Pharmacy</span><span className="font-medium">24/7</span></li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 text-slate-800">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Location</h2>
          </div>
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              title="Hospital location map"
              className="h-full w-full border-0"
              loading="lazy"
              src="https://www.google.com/maps?q=Medical+Chowk+Nagpur&output=embed"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <a href="tel:+91 7499725914" className="btn-primary bg-red-600 hover:bg-red-700">
          <PhoneCall className="mr-2 h-4 w-4" /> Call Emergency Now
        </a>
      </div>
    </main>
  );
}
