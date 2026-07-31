import nodemailer from "nodemailer";

// A single reusable SMTP transporter. Nodemailer pools connections
// internally, so we don't need our own caching logic here the way we do
// for Mongoose.
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: Number(process.env.SMTP_PORT ?? 465) === 465, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface AppointmentEmailData {
  fullName: string;
  email: string;
  phone: string;
  doctorName: string;
  departmentName: string;
  date: string;
  time: string;
  message?: string;
}

function baseTemplate(title: string, bodyHtml: string) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background:#F8FAFC; padding: 24px;">
    <div style="background:#2563EB; padding: 20px 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color:#ffffff; margin:0; font-size: 20px;">Gakare Hospital</h1>
    </div>
    <div style="background:#ffffff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0; border-top: none;">
      <h2 style="color:#0F172A; font-size: 18px; margin-top:0;">${title}</h2>
      ${bodyHtml}
    </div>
    <p style="color:#94A3B8; font-size: 12px; text-align:center; margin-top:16px;">
      This is an automated message from Gakare Hospital's appointment system.
    </p>
  </div>`;
}

function detailsTable(rows: [string, string][]) {
  return `<table style="width:100%; border-collapse: collapse; margin-top: 12px;">
    ${rows
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding:8px 0; color:#64748B; font-size:14px; width:40%;">${label}</td>
        <td style="padding:8px 0; color:#0F172A; font-size:14px; font-weight:600;">${value}</td>
      </tr>`
      )
      .join("")}
  </table>`;
}

export async function sendAdminNotification(data: AppointmentEmailData) {
  const html = baseTemplate(
    "New Appointment Booked",
    `<p style="color:#475569;">A new appointment has just been booked on the website.</p>
     ${detailsTable([
       ["Patient Name", data.fullName],
       ["Phone", data.phone],
       ["Email", data.email],
       ["Doctor", data.doctorName],
       ["Department", data.departmentName],
       ["Date", data.date],
       ["Time", data.time],
       ["Message", data.message || "—"],
     ])}`
  );

  return transporter.sendMail({
    from: `"Gakare Hospital" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Appointment — ${data.fullName} with ${data.doctorName}`,
    html,
  });
}

export async function sendPatientConfirmation(data: AppointmentEmailData) {
  const html = baseTemplate(
    "Your Appointment is Confirmed",
    `<p style="color:#475569;">Hi ${data.fullName}, thank you for booking with Gakare Hospital. Here are your appointment details:</p>
     ${detailsTable([
       ["Doctor", data.doctorName],
       ["Department", data.departmentName],
       ["Date", data.date],
       ["Time", data.time],
     ])}
     <p style="color:#475569; margin-top:16px;">Please arrive 15 minutes early with any relevant medical records. If you need to reschedule, contact us at the number on our Emergency page.</p>`
  );

  return transporter.sendMail({
    from: `"Gakare Hospital" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "Your Gakare Hospital appointment is confirmed",
    html,
  });
}
