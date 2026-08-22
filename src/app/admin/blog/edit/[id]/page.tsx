import BlogPostForm from "@/components/admin/BlogPostForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // @ts-ignore - Bypass IDE cache issue
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id }
  });

  if (!post) {
    notFound();
  }

  return <BlogPostForm initialData={post} />;
}
