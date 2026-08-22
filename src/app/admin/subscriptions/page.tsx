import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SubscriptionManagementClient from "@/components/admin/SubscriptionManagementClient";

export default async function AdminSubscriptionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const packages = await prisma.studentPackage.findMany({
    include: { student: { select: { id: true, name: true, email: true } }, package: true },
    orderBy: { createdAt: 'desc' }
  });

  const subscriptions = packages.map(pkg => ({
    id: pkg.id,
    userId: pkg.studentId,
    planType: pkg.package?.name || 'BASIC',
    status: pkg.status,
    createdAt: pkg.createdAt,
    user: pkg.student
  }));

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <SubscriptionManagementClient subscriptions={subscriptions as any} users={users} />
    </div>
  );
}
