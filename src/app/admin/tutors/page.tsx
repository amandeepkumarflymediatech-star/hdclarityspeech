import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TutorManagementClient from "@/components/admin/TutorManagementClient";

export default async function AdminTutorsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const tutors = await prisma.user.findMany({
    where: { role: 'TUTOR' },
    select: { id: true, name: true, email: true, createdAt: true, isApproved: true, experience: true, bio: true, qualifications: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <TutorManagementClient tutors={tutors} />
    </div>
  );
}
