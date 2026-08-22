import SeoMetadataForm from "@/components/admin/SeoMetadataForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewSeoPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <SeoMetadataForm />;
}
