import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Gakare Hospital | Book an Appointment Online",
    template: "%s | Gakare Hospital",
  },
  description:
    "Book appointments with expert doctors across Cardiology, Neurology, Orthopedics, Dentistry, Pediatrics and Emergency care.",
  openGraph: {
    title: "Gakare Hospital",
    description: "Book appointments with expert doctors online, in minutes.",
    siteName: "Gakare Hospital",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
      <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
