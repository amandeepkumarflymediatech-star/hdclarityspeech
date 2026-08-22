import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogManagementClient from "@/components/admin/BlogManagementClient";

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // @ts-ignore - Bypass IDE cache issue
  const posts = await prisma.blogPost.findMany({
    include: {
      author: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <BlogManagementClient posts={posts} />
    </div>
  );
}
