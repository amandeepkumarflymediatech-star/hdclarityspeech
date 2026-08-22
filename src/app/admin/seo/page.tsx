import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SeoManagementClient from "@/components/admin/SeoManagementClient";

export default async function AdminSeoPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // @ts-ignore - Bypass IDE cache issue
  const seoList = await prisma.seoMetadata.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <SeoManagementClient seoList={seoList} />
    </div>
  );
}
