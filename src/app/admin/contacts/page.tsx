import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContactManagementClient from "@/components/admin/ContactManagementClient";

export default async function AdminContactsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const contacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <ContactManagementClient contacts={contacts} />
    </div>
  );
}
