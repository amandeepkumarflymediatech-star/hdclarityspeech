import React from 'react';
import { prisma } from '@/lib/db';
import { Calendar } from 'lucide-react';
import BlogListClient from './BlogListClient';

export const metadata = {
  title: 'Blog | HD Clarity Speech',
  description: 'Insights, tips, and stories about stuttering and speech therapy.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true, image: true }
      }
    }
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 animate-in slide-in-from-bottom-4 duration-700 fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Our Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-playfair mb-6">
            Insights & Stories
          </h1>
          <p className="text-lg text-slate-600 font-sans leading-relaxed">
            Discover expert tips on speech therapy, inspiring stories from our community, and the latest updates on managing stuttering.
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 font-playfair mb-2">Check back soon!</h3>
            <p className="text-slate-500">We are currently preparing some amazing content for you.</p>
          </div>
        ) : (
          <BlogListClient initialPosts={posts} />
        )}
      </div>
    </main>
  );
}
