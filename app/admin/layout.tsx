import AdminProviders from "@/components/AdminProviders";
import AdminSidebar from "@/components/AdminSidebar";
import { auth } from "@/lib/auth";
import { Toaster } from "react-hot-toast";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isLoginRoute = !session; // middleware already redirects unauthenticated users to /admin/login

  return (
    <AdminProviders>
      {isLoginRoute ? (
        <>{children}</>
      ) : (
        <div className="flex min-h-screen flex-col sm:flex-row">
          <AdminSidebar />
          <div className="flex-1 bg-background p-6 sm:p-10">{children}</div>
        </div>
      )}
      <Toaster position="top-center" />
    </AdminProviders>
  );
}
