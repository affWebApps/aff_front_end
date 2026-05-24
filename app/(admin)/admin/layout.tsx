import AdminGuard from "../component/AdminGuard";
import AdminHeader from "../component/AdminHeader";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </AdminGuard>
  );
}

