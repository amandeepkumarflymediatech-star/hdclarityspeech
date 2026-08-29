'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogListClient({ initialPosts }: { initialPosts: any[] }) {
  const [visibleCount, setVisibleCount] = useState(6);

  const showMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialPosts.slice(0, visibleCount).map((post, i) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className={`group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 fill-mode-both`}
            style={{ animationDelay: `${(i % 6) * 100}ms` }}
          >
            {/* Image Container */}
            <div className="relative overflow-hidden flex-shrink-0">
              {post.coverImage ? (
                <Image 
                  src={post.coverImage} 
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center min-h-[250px]">
                  <span className="font-playfair text-4xl font-black text-blue-900/10 uppercase">{post.title.substring(0,2)}</span>
                </div>
              )}
              {/* Floating Date */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                <Calendar size={12} className="text-blue-600" />
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-1">
              {post.tags && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {post.tags.split(',').map((tag: string) => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-slate-900 font-playfair leading-tight mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                {post.title}
              </h2>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 flex-1">
                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {post.author.image ? (
                      <Image src={post.author.image} alt={post.author.name || ''} width={32} height={32} className="object-cover" />
                    ) : (
                      <User size={14} className="text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{post.author.name || 'Admin'}</span>
                </div>
                
                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < initialPosts.length && (
        <div className="mt-16 text-center">
          <button 
            onClick={showMore}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold uppercase tracking-widest text-sm rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors shadow-sm hover:shadow-md"
          >
            View More Blogs
          </button>
        </div>
      )}
    </>
  );
}
