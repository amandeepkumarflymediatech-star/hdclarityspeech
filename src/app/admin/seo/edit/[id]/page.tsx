import SeoMetadataForm from "@/components/admin/SeoMetadataForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function EditSeoPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // @ts-ignore - Bypass IDE cache issue
  const seo = await prisma.seoMetadata.findUnique({
    where: { id: params.id }
  });

  if (!seo) {
    notFound();
  }

  return <SeoMetadataForm initialData={seo} />;
}
