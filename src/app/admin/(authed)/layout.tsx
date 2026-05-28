import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = { title: "管理后台" };

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-slate-50">
        {children}
      </div>
    </div>
  );
}
