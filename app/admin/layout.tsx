import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  return <div className="min-h-dvh lg:flex"><AdminNav username={session.sub} /><div className="min-w-0 flex-1">{children}</div></div>;
}
