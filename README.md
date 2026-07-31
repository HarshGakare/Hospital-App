# CareWell — Hospital Appointment Booking App

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, MongoDB Atlas,
Mongoose, NextAuth, React Hook Form + Zod, Nodemailer, and the Google Sheets API.

This README is written as a running build log — it grows with each step.

---

## STEP 1 — Create the project & install packages

You don't need `create-next-app` here since the scaffold (config files,
`app/`, `lib/`, etc.) is already generated for you. Once you download this
project, from inside the `hospital-app` folder run:

```bash
npm install
```

This reads `package.json` and installs everything: Next.js 15, React 19,
TypeScript, Mongoose, NextAuth 5, React Hook Form, Zod, Nodemailer,
lucide-react, and dev tooling (Tailwind, ESLint, tsx).

If you *were* starting completely from scratch instead, the equivalent
command would be:

```bash
npx create-next-app@latest hospital-app --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd hospital-app
npm install mongoose next-auth@beta react-hook-form @hookform/resolvers zod nodemailer lucide-react clsx tailwind-merge date-fns react-hot-toast bcryptjs
npm install -D @types/nodemailer @types/bcryptjs tsx
```

**Run it:**

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see a placeholder page confirming
the scaffold works.

---

## STEP 2 — Tailwind CSS configuration

Tailwind is configured in three files:

- **`tailwind.config.ts`** — defines the hospital's color theme as reusable
  tokens: `primary` (#2563EB), `secondary` (#10B981), and `background`
  (#F8FAFC), plus a `card` border radius and shadow, and a `fadeUp`
  animation for scroll-in effects.
- **`postcss.config.mjs`** — wires Tailwind + Autoprefixer into the build.
- **`app/globals.css`** — imports Tailwind's three layers and defines reusable
  component classes (`.btn-primary`, `.btn-secondary`, `.btn-outline`,
  `.card`, `.input-field`, `.section`) so every later step just does
  `className="btn-primary"` instead of repeating utility soup.

**Test it:** the placeholder home page's heading uses `text-primary` — if it
renders blue, Tailwind is wired correctly.

---

## STEP 3 — Connect MongoDB Atlas

### 3.1 Create the Atlas account & cluster
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free).
2. Click **Build a Database** → choose the **M0 Free** tier.
3. Pick a cloud provider/region close to you → **Create**.

### 3.2 Create a database user
1. In **Database Access** (left sidebar) → **Add New Database User**.
2. Choose **Password** auth, set a username/password (save these — you'll
   need them in the connection string). Give it **Read and write to any
   database**.

### 3.3 Whitelist your IP
1. In **Network Access** → **Add IP Address**.
2. For local development, **Add Current IP Address** is fine. For Vercel
   deployment (Step 20), add `0.0.0.0/0` (allow from anywhere) since
   Vercel's serverless functions don't have static IPs — Atlas's own
   database-user auth is what actually protects the data.

### 3.4 Create the database
You don't need to manually create it — Mongoose creates the database and
collections automatically the first time you write data, based on the
database name in your connection string.

### 3.5 Get the connection string
1. Go to **Database** → **Connect** → **Drivers**.
2. Copy the string, which looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
3. Replace `<username>` / `<password>` with your database user's
   credentials, and insert a database name before the `?`, e.g.
   `.../hospitalDB?retryWrites=true...`

### 3.6 Store it locally
Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Paste your real connection string into `MONGODB_URI`. **`.env.local` is
git-ignored** (see `.gitignore`) — never commit real credentials.

### 3.7 `lib/mongodb.ts` — and why connection pooling matters
See the file for the full implementation. The short version:

- Next.js dev mode hot-reloads your server code on every save. Without
  caching, `mongoose.connect()` would run again on every reload, and each
  call opens a new pool of TCP sockets to Atlas — you'd exhaust Atlas's
  connection limit within minutes of editing code.
- The fix: cache the connection (and the *in-flight promise*, not just the
  finished connection) on Node's `global` object, which survives module
  reloads in dev and warm serverless invocations in production. Every
  route/action calls `connectDB()`, but only the *first* call per process
  actually opens a connection — the rest reuse it.
- `maxPoolSize: 10` caps how many concurrent sockets *this one* Mongoose
  instance can open to Atlas, which matters a lot in serverless deployments
  where many function instances can be running simultaneously.

**Test it:** we'll wire up a real query in Step 7 (Doctors) — for now, the
file just needs to compile without errors (`npm run build` will catch typos).

---

## STEP 4 — Folder structure

```
hospital-app/
├── app/                    # Next.js App Router: pages, layouts, API routes
│   ├── (public routes: page.tsx, doctors/, departments/, book/, blog/, emergency/)
│   ├── admin/              # Admin dashboard route group (Step 14)
│   ├── api/                # Route handlers (webhooks, NextAuth, etc.)
│   ├── layout.tsx          # Root layout — fonts, metadata, <html>/<body>
│   └── globals.css         # Tailwind entrypoint + shared component classes
├── components/             # Reusable UI: Navbar, Footer, DoctorCard, forms...
├── lib/                    # Framework-agnostic helpers: mongodb.ts, auth.ts,
│                            # email.ts, googleSheets.ts, utils.ts
├── models/                 # Mongoose schemas: Doctor, Department, Appointment,
│                            # Blog, User
├── actions/                # Next.js Server Actions — the "write" layer that
│                            # calls into models/ and lib/ (e.g. bookAppointment)
├── public/                 # Static assets — images, favicon, robots.txt
├── styles/                 # Reserved for any non-Tailwind CSS (rarely needed)
├── .env.local              # Real secrets (git-ignored)
├── .env.local.example      # Template documenting required env vars
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

**Why Server Actions live in their own `actions/` folder instead of inside
`app/api/`:** this project uses Next.js Server Actions (functions marked
`"use server"`) for form submissions like booking an appointment, since they
let a form `<form action={bookAppointment}>` post data straight to the
server without you hand-writing a `fetch` + API route + client state for
every form. `app/api/` is reserved for things that genuinely need a URL —
NextAuth's handler (Step 15) and any external webhook.

---

## STEP 5 — Navbar

`components/Navbar.tsx` is a client component (`"use client"`) because it
tracks open/closed state for the mobile menu and highlights the active link
via `usePathname()`. Links: Home, Doctors, Departments, Book Appointment,
Blog, Emergency Contact, plus a standalone red "Emergency" quick-link.

**Test it:** resize your browser below `768px` — the desktop link row should
collapse into a hamburger menu that toggles a dropdown.

---

## STEP 6 — Home Page

`app/page.tsx` is a Server Component that queries MongoDB directly (via
`connectDB()` + `Doctor.find()` / `Department.find()`) — no API round trip
needed, since Server Components run on the server already. Sections: Hero,
Services (4 value props), Departments (live from DB), Doctors Preview (live
from DB), Testimonials (static — wire to a real collection later if needed),
and a CTA banner.

**Test it:** once you've run the seed script (Step 7), the Departments and
Doctors Preview sections should populate with real data instead of being
empty.

---

## STEP 7 — Doctor Profiles

- **`models/Doctor.ts`** — Mongoose schema with all requested fields, a
  `department` field that references the `Department` collection
  (`ref: "Department"`), and an `availability` array of weekday strings.
- **`scripts/seed.ts`** — admin seed data. Run with:

  ```bash
  npm run seed
  ```

  This inserts 6 departments, 4 doctors, and one admin user
  (`admin@carewell.example` / `Admin@12345` — **change this password before
  deploying**).
- **`components/DoctorCard.tsx`** — the card shown on the Home page and the
  Doctors listing.
- **`app/doctors/[id]/page.tsx`** — the doctor detail page, a dynamic route
  using Next.js 15's async `params` (`params: Promise<{ id: string }>`).

**Test it:** after seeding, visit `/doctors` — you should see 4 doctor
cards; clicking one opens `/doctors/<id>` with their full bio.

---

## STEP 8 — Departments

`models/Department.ts` stores `name`, a unique `slug` (auto-generated via
`lib/utils.ts`'s `slugify()`), `description`, and a `icon` string that maps
to a `lucide-react` icon component name (looked up dynamically in
`DepartmentCard.tsx` and the departments page via
`(Icons as Record<string, LucideIcon>)[iconName]`).

**Test it:** `/departments` should list all 6 seeded departments, each
linking to `/doctors?department=<id>` to pre-filter the doctors list.

---

## STEP 9 — Appointment Booking

- **`lib/validations.ts`** → `appointmentSchema` — Zod schema validating
  name, email, phone, age, gender, department, doctor, date, time, and an
  optional message.
- **`components/AppointmentForm.tsx`** — a client component using
  `react-hook-form` + `@hookform/resolvers/zod`. It reads `?doctor=` or
  `?department=` query params (set when you click "Book Appointment" from a
  doctor's profile) to pre-fill the form, and filters the doctor dropdown by
  the selected department.
- **`actions/appointments.ts`** → `bookAppointment()` — a Server Action
  (`"use server"`) that re-validates with the same Zod schema server-side
  (never trust client validation alone), looks up the doctor/department,
  writes the appointment, then fires off the admin email, patient email, and
  Google Sheets row **in parallel** with `Promise.allSettled` — so if email
  or Sheets fails, the booking itself still succeeds and the failure is just
  logged.
- **Duplicate prevention**: `models/Appointment.ts` has a compound unique
  index — `{ doctor: 1, date: 1, time: 1 }` — so MongoDB itself rejects a
  second booking for the same doctor/date/time slot at the database level
  (error code `11000`), which `bookAppointment()` catches and turns into a
  friendly "please choose another slot" message.

**Test it:** go to `/book`, fill the form, and submit. Try booking the exact
same doctor + date + time twice — the second attempt should be rejected with
the duplicate-slot message.

---

## STEP 10 — Google Sheets Integration (via Apps Script, no API key)

This project writes to Google Sheets through a small **Apps Script Web App**
bound to your Sheet, instead of the Google Sheets API + service account.
That means: no Google Cloud project, no enabling APIs, no service account
JSON key to protect — you paste one script into the Sheet you already have,
deploy it, and our server just POSTs to the URL it gives you.

### 10.1 Prepare your Sheet
Open the Google Sheet you're using for appointments and make sure row 1 has
these headers, in this order:
```
Name | Email | Phone | Department | Doctor | Appointment Date | Time | Message | Booking Time
```
Make sure the tab is named **Sheet1** (or update the name in `Code.gs` if
yours is different — see 10.2 below).

### 10.2 Add the Apps Script
1. In your Sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder `myFunction() {}` code.
3. Paste in the contents of `scripts/apps-script/Code.gs` from this project.
4. Click the save icon (or `Ctrl+S` / `Cmd+S`).

### 10.3 Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → **Web app**.
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone
     (This only exposes the `doPost` endpoint defined in the script — it
     does **not** make your Sheet itself public or expose your Google
     account. Anyone with the URL can add a row via POST; they still can't
     read, open, or edit the Sheet.)
4. Click **Deploy**, then **Authorize access** and approve the permissions
   (it's your own script acting on your own Sheet, so this is expected).
5. Copy the **Web app URL** it gives you — it looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.

### 10.4 Configure `.env.local`
```
GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
```

### 10.5 How it's wired
`lib/googleSheets.ts` does a plain `fetch(scriptUrl, { method: "POST", body: JSON.stringify(row) })`
for every booking. The Apps Script's `doPost()` parses that JSON and calls
`sheet.appendRow([...])` with the 9 columns in order, then returns
`{ status: "success" }`. If `GOOGLE_SCRIPT_URL` isn't set, the function logs
a warning and skips the write instead of throwing — so local development
still works even before you've deployed the script.

Because this call happens inside `Promise.allSettled()` alongside the two
emails (Step 9/11), a Sheets failure never blocks the booking or the emails
— it's just logged.

**Test it:**
1. Paste the Web App URL directly into your browser — you should see
   `{"status":"ok","message":"Appointment webhook is live."}` (that's the
   `doGet()` sanity check in `Code.gs`).
2. Book an appointment on `/book` — a new row should appear at the bottom
   of your Sheet within a few seconds.

**If a deploy update doesn't seem to take effect:** Apps Script Web App
URLs are versioned. After editing `Code.gs`, use **Deploy → Manage
deployments → edit (pencil icon) → New version** rather than creating an
entirely new deployment, so your existing `GOOGLE_SCRIPT_URL` keeps working.

---

## STEP 11 — Email Notifications

`lib/email.ts` creates one shared `nodemailer.createTransport()` instance
using SMTP credentials from `.env.local`. Two functions build styled HTML
emails from a shared `baseTemplate()` + `detailsTable()` helper (matching
the site's primary/secondary color theme):

- **`sendAdminNotification()`** → sent to `ADMIN_EMAIL`, includes patient
  name, phone, doctor, department, date, time.
- **`sendPatientConfirmation()`** → sent to the patient's own email, confirms
  their appointment details.

### Setting up Gmail SMTP (most common for local dev)
1. Enable 2-Step Verification on the Gmail account.
2. Go to https://myaccount.google.com/apppasswords → generate an **App
   Password** (16 characters, no spaces).
3. In `.env.local`:
   ```
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="465"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="the-16-char-app-password"
   ADMIN_EMAIL="admin@yourhospital.com"
   ```
For production, a transactional provider (Resend, SES, Postmark, SendGrid)
is more reliable than Gmail SMTP — swap the `transporter` config in
`lib/email.ts` if you switch providers; the rest of the code doesn't change.

**Test it:** book an appointment — you should receive two emails: one to
`ADMIN_EMAIL`, one to the email address you entered in the form.

---

## STEP 12 — Emergency Contact

`app/emergency/page.tsx` — static content page with tap-to-call links
(`tel:`), a mail link (`mailto:`), working hours, an embedded Google Maps
iframe (no API key needed for the basic embed), and a prominent red "Call
Emergency Now" button.

**Test it:** on mobile, tapping any phone number should open your dialer
pre-filled with that number.

---

## STEP 13 — Blog System

- **`models/Blog.ts`** — `title`, unique `slug`, `coverImage`, `category`,
  `author`, `content`, `publishedDate`.
- **`app/blog/page.tsx`** — lists all posts (newest first), with a search
  box (Step 16) filtering by title.
- **`app/blog/[slug]/page.tsx`** — single post view, looked up by slug (not
  Mongo `_id`) for clean, human-readable URLs.

**Test it:** add a post from `/admin/blogs/new` (Step 14), then confirm it
appears at `/blog` and its detail page renders at `/blog/<slug>`.

---

## STEP 14 — Admin Dashboard

Everything under `app/admin/` (protected by Step 15's auth):

- **`/admin/login`** — credentials sign-in form.
- **`/admin/dashboard`** — counts of doctors, departments, appointments, blog
  posts.
- **`/admin/doctors`**, **`/admin/departments`**, **`/admin/blogs`** — list
  views with **Add / Edit / Delete**, each backed by a shared form component
  (`DoctorForm.tsx`, `DepartmentForm.tsx`, `BlogForm.tsx`) and the Server
  Actions in `actions/`.
- **`/admin/appointments`** — read-only table of all bookings with a
  **Delete** action (no edit, since appointments are patient-submitted).
- **`components/DeleteButton.tsx`** — a reusable two-tap confirm-then-delete
  button (tap once to arm it, tap again within 3 seconds to confirm) used
  across all four admin list pages.

**Test it:** sign in at `/admin/login`, add a new department, then confirm
it immediately shows up in the department dropdown on `/book`.

---

## STEP 15 — Authentication

Uses **NextAuth v5** (`lib/auth.ts`) with the **Credentials** provider:

- `models/User.ts` stores `email`, a bcrypt `passwordHash`, and a `role`
  (`"admin" | "user"`).
- `authorize()` looks the user up, compares the password with
  `bcrypt.compare()`, and returns the user (including `role`) on success.
- A JWT session strategy carries `role` into the token (`jwt` callback) and
  back into the client session (`session` callback) — see
  `types/next-auth.d.ts` for the TypeScript module augmentation that adds
  `role` to the `Session` type.
- **`middleware.ts`** protects every `/admin/*` route except `/admin/login`
  itself, redirecting unauthenticated (or non-admin) visitors to the login
  page, and redirecting already-logged-in admins away from the login page.

**Test it:** try visiting `/admin/dashboard` in an incognito window — you
should be redirected to `/admin/login`. Sign in with the seeded admin
credentials and you should land on the dashboard.

---

## STEP 16 — Search

`components/SearchBar.tsx` is a client component that writes the query into
the URL's `?q=` param (via `useRouter().replace()`), so search state is
shareable/bookmarkable and works with the server-rendered list pages. Used
on:
- **Doctors** (`/doctors`) — searches by name.
- **Blog** (`/blog`) — searches by title.

Department search wasn't separately requested with its own field since the
Departments page is short and fully visible at once — search is applied
where it earns its place (long, filterable lists).

**Test it:** type a doctor's first name into the search box on `/doctors` —
the list should narrow as you type (state updates via `useTransition` to
keep typing responsive while the URL/route updates).

---

## STEP 17 — Filters

`components/DoctorFilters.tsx` adds three dropdowns to `/doctors`:
**Department**, **Experience** (5+/10+/15+ years), and **Availability**
(day of week) — all combined into the same MongoDB query alongside the
search term, e.g.:

```ts
const filter = {};
if (q) filter.name = { $regex: q, $options: "i" };
if (department) filter.department = department;
if (experience) filter.experience = { $gte: Number(experience) };
if (day) filter.availability = day;
```

**Test it:** select a department from the dropdown — the URL should update
to `/doctors?department=<id>` and only that department's doctors should
remain.

---

## STEP 18 — Responsive Design

Handled throughout with Tailwind's responsive prefixes rather than as a
separate pass — every component built in Steps 5–17 already uses
`sm:`/`lg:` breakpoints (Navbar's hamburger menu, card grids that go
1 → 2 → 4 columns, the admin sidebar that stacks on top on mobile instead of
sitting beside content, etc).

**Test it:** open Chrome DevTools' device toolbar and check `/`, `/doctors`,
`/book`, and `/admin/dashboard` at mobile (375px), tablet (768px), and
desktop (1280px) widths.

---

## STEP 19 — SEO

- **`app/layout.tsx`** — `metadataBase`, a title template
  (`"%s | CareWell Hospital"`), default description, and Open Graph tags.
- **Per-page metadata** — every route exports its own `metadata` (static
  pages) or `generateMetadata()` (dynamic doctor/blog pages), so each page
  gets a distinct `<title>`.
- **`app/robots.ts`** — allows all crawling except `/admin/` and `/api/`,
  and points to the sitemap.
- **`app/sitemap.ts`** — dynamically includes every doctor and blog post
  URL alongside the static routes, generated at request time from MongoDB.

**Test it:** run `npm run build && npm start`, then visit
`http://localhost:3000/robots.txt` and `http://localhost:3000/sitemap.xml` —
both should render correctly (Next.js auto-generates these from the `.ts`
files).

---

## STEP 20 — Deployment (Vercel)

### 20.1 Push to GitHub
```bash
cd hospital-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/hospital-app.git
git push -u origin main
```

### 20.2 Import into Vercel
1. Go to https://vercel.com/new and import the GitHub repo.
2. Framework preset should auto-detect **Next.js** — leave build settings
   default (`next build`).

### 20.3 Environment variables
In the Vercel project → **Settings → Environment Variables**, add every
variable from `.env.local.example` with your real values:

| Variable | Notes |
|---|---|
| `MONGODB_URI` | Same Atlas connection string as local |
| `NEXTAUTH_SECRET` | Generate a **new, different** secret for production: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://carewell.vercel.app` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Same as local, or swap to a transactional provider |
| `ADMIN_EMAIL` | Where booking notifications go |
| `GOOGLE_SCRIPT_URL` | Same Apps Script Web App deployment URL as local |
| `NEXT_PUBLIC_SITE_URL` | Your production URL — used by `sitemap.ts`/`robots.ts`/OG tags |

Add these for all three environments (Production, Preview, Development) or
just Production, depending on whether you want preview deployments to hit
the same database.

### 20.4 MongoDB Atlas network access for Vercel
Since Vercel serverless functions don't have static IPs, go back to Atlas →
**Network Access** → **Add IP Address → Allow Access From Anywhere**
(`0.0.0.0/0`). Security still comes from the database user's
password — this is standard practice for serverless deployments.

### 20.5 Seed production data
Run the seed script once locally, pointed at your **production** connection
string:
```bash
MONGODB_URI="<your-atlas-prod-uri>" npm run seed
```
(Or temporarily set `.env.local` to the prod URI, run `npm run seed`, then
switch it back to your dev URI.)

### 20.6 Deploy
Click **Deploy** in Vercel — subsequent pushes to `main` auto-deploy.

**Test it:** visit your live URL, book a test appointment, and confirm the
email + Google Sheets row + `/admin/appointments` entry all show up.

---

## Full Project Structure (final)

```
hospital-app/
├── app/
│   ├── admin/
│   │   ├── appointments/page.tsx
│   │   ├── blogs/(page.tsx, new/, [id]/edit/)
│   │   ├── dashboard/page.tsx
│   │   ├── departments/(page.tsx, new/, [id]/edit/)
│   │   ├── doctors/(page.tsx, new/, [id]/edit/)
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── blog/(page.tsx, [slug]/page.tsx)
│   ├── book/page.tsx
│   ├── departments/page.tsx
│   ├── doctors/(page.tsx, [id]/page.tsx)
│   ├── emergency/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── actions/
│   ├── appointments.ts
│   ├── blogs.ts
│   ├── departments.ts
│   └── doctors.ts
├── components/
│   ├── AdminProviders.tsx
│   ├── AdminSidebar.tsx
│   ├── AppointmentForm.tsx
│   ├── BlogForm.tsx
│   ├── DeleteButton.tsx
│   ├── DepartmentCard.tsx
│   ├── DepartmentForm.tsx
│   ├── DoctorCard.tsx
│   ├── DoctorFilters.tsx
│   ├── DoctorForm.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── TestimonialCard.tsx
├── lib/
│   ├── auth.ts
│   ├── email.ts
│   ├── googleSheets.ts
│   ├── mongodb.ts
│   ├── utils.ts
│   └── validations.ts
├── models/
│   ├── Appointment.ts
│   ├── Blog.ts
│   ├── Department.ts
│   ├── Doctor.ts
│   └── User.ts
├── scripts/seed.ts
├── types/next-auth.d.ts
├── public/images/(doctor-placeholder.svg, blog-placeholder.svg)
├── middleware.ts
├── .env.local.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Quick Start (all steps combined)

```bash
npm install
cp .env.local.example .env.local   # fill in real values
npm run seed                        # seeds departments, doctors, admin user
npm run dev                         # http://localhost:3000
```

Admin login: `admin@carewell.example` / `Admin@12345` (change immediately
in a real deployment — this is seed data, not a secret to keep).
#   H o s p i t a l - A p p  
 