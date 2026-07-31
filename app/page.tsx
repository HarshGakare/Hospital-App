import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/Doctor";
import Department from "@/models/Department";
import DoctorCard from "@/components/DoctorCard";
import DepartmentCard from "@/components/DepartmentCard";
import TestimonialCard from "@/components/TestimonialCard";

async function getHomeData() {
  await connectDB();
  const [doctors, departments] = await Promise.all([
    Doctor.find().limit(4).lean(),
    Department.find().limit(6).lean(),
  ]);
  return { doctors, departments };
}

const SERVICES = [
  { icon: CalendarCheck, title: "Easy Online Booking", desc: "Book appointments in under 2 minutes, 24/7." },
  { icon: Stethoscope, title: "Expert Specialists", desc: "Board-certified doctors across every department." },
  { icon: ShieldCheck, title: "Trusted Care", desc: "Modern facilities backed by rigorous safety standards." },
  { icon: Clock, title: "24/7 Emergency", desc: "Round-the-clock emergency and trauma response." },
];

const TESTIMONIALS = [
  { name: "Priya Nair", role: "Cardiology Patient", quote: "The booking process was effortless and the doctor was incredibly attentive. Highly recommend CareWell." },
  { name: "Arjun Kapoor", role: "Orthopedics Patient", quote: "From consultation to recovery, the entire team made me feel genuinely cared for." },
  { name: "Meera Iyer", role: "Pediatrics Parent", quote: "Booking my daughter's appointment online saved me so much time. The staff were wonderful." },
];

export default async function HomePage() {
  const { doctors, departments } = await getHomeData();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-fadeUp">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
              Trusted by 50,000+ patients
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Your Health, <span className="text-primary">Our Priority</span>
            </h1>
            <p className="mt-4 max-w-lg text-slate-600">
              Book appointments with expert doctors in seconds. Quality
              healthcare across Cardiology, Neurology, Orthopedics, Dentistry,
              Pediatrics, and Emergency care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="btn-primary">
                Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/doctors" className="btn-outline">
                Meet Our Doctors
              </Link>
            </div>
          </div>
          <div className="relative h-72 overflow-hidden rounded-card shadow-card sm:h-96">
            <Image
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1200&auto=format&fit=crop"
              alt="Doctor consulting a patient"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose GakareHospital</h2>
          <p className="mt-2 text-slate-500">Comprehensive care built around you</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="card text-center">
              <div className="mx-auto w-fit rounded-lg bg-primary-50 p-3 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-white">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Our Departments</h2>
            <p className="mt-2 text-slate-500">Specialized care under one roof</p>
          </div>
          <Link href="/departments" className="hidden text-sm font-medium text-primary sm:flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <DepartmentCard
              key={String(d._id)}
              name={d.name}
              slug={d.slug}
              description={d.description}
              icon={d.icon}
            />
          ))}
        </div>
      </section>

      {/* Doctors preview */}
      <section className="section">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Meet Our Doctors</h2>
            <p className="mt-2 text-slate-500">Experienced specialists dedicated to your health</p>
          </div>
          <Link href="/doctors" className="hidden text-sm font-medium text-primary sm:flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <DoctorCard
              key={String(doc._id)}
              id={String(doc._id)}
              name={doc.name}
              specialization={doc.specialization}
              qualification={doc.qualification}
              experience={doc.experience}
              profileImage={doc.profileImage}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">What Our Patients Say</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-card bg-primary px-8 py-14 text-center text-white sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to book your appointment?</h2>
            <p className="mt-2 text-primary-100">Our team is ready to take care of you and your family.</p>
          </div>
          <Link href="/book" className="rounded-lg bg-white px-6 py-3 font-semibold text-primary transition hover:bg-primary-50">
            Book Now
          </Link>
        </div>
      </section>
    </main>
  );
}
