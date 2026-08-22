import BlogPostForm from "@/components/admin/BlogPostForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewBlogPostPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <BlogPostForm />;
}
