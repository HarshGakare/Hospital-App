
interface AppointmentRow {
  fullName: string;
  email: string;
  phone: string;
  departmentName: string;
  doctorName: string;
  date: string;
  time: string;
  message?: string;
}

export async function appendAppointmentToSheet(row: AppointmentRow) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    console.warn("GOOGLE_SCRIPT_URL is not set — skipping Google Sheets write.");
    return;
  }

  const res = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      departmentName: row.departmentName,
      doctorName: row.doctorName,
      date: row.date,
      time: row.time,
      message: row.message || "",
      bookingTime: new Date().toLocaleString("en-IN"),
    }),
  
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Google Sheets write failed with status ${res.status}`);
  }

  const data = await res.json().catch(() => null);
  if (data && data.status === "error") {
    throw new Error(`Google Sheets script returned an error: ${data.message}`);
  }
}
