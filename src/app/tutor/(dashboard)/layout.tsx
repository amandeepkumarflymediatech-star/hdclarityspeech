import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import DashboardLayout from './_components/DashboardLayout';

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'TUTOR') {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  // Block access to the dashboard if the tutor is not approved
  if (!dbUser || (!dbUser.isApproved && dbUser.onboardingStatus !== 'APPROVED')) {
    redirect('/tutor/onboarding');
  }

  return (
    <DashboardLayout user={dbUser}>
      {children}
    </DashboardLayout>
  );
}