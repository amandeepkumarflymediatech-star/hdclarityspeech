// Force cache invalidate
import React from 'react';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: 'Not Found | HD Clarity Speech' };
  
  return {
    title: `${post.title} | HD Clarity Speech`,
    description: post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: { name: true, image: true, bio: true }
      }
    }
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 bg-slate-50 border-b border-slate-100 overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-10 group">
            <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </span>
            Back to Blog
          </Link>

          {post.tags && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {post.tags.split(',').map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-100/50 border border-blue-200/50 px-3 py-1.5 rounded-full shadow-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight font-playfair leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 bg-white/60 backdrop-blur-md w-fit px-6 py-4 rounded-2xl border border-slate-200/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                {post.author.image ? (
                  <Image src={post.author.image} alt={post.author.name || ''} width={40} height={40} className="object-cover" />
                ) : (
                  <User size={18} className="text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900">{post.author.name || 'Admin'}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Author</p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{format(new Date(post.createdAt), 'MMMM d, yyyy')}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Published</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <Image 
          src={post.coverImage} 
          alt={post.title}
          width={1200}
          height={600}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="w-full max-w-5xl mx-auto h-auto px-4 md:px-6 relative z-20  -mt-8 md:-mt-12 "
          priority
        />
      )}

      {/* Article Content */}
      <div className={`max-w-3xl mx-auto px-6 pb-24 ${post.coverImage ? 'pt-16' : 'pt-24'}`}>
        <article className="prose prose-lg prose-slate max-w-none prose-headings:font-playfair prose-headings:font-black prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-3xl prose-img:shadow-md">
          {/* We assume content is stored as rich HTML string from the admin editor */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Author Footer Bio */}
        <div className="mt-20 p-8 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {post.author.image ? (
              <Image src={post.author.image} alt={post.author.name || ''} width={96} height={96} className="object-cover" />
            ) : (
              <User size={40} className="text-slate-300" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">Written by</p>
            <h3 className="text-2xl font-black text-slate-900 font-playfair mb-3">{post.author.name || 'HD Clarity Admin'}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {post.author.bio || "Dedicated to helping individuals find their voice and speak with clarity. Part of the HD Clarity Speech team."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
