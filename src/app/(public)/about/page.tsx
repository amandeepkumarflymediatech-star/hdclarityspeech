import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full font-sans text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 pt-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-6 py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6 transition-colors duration-300">Empowering Learners Everywhere</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
            At HD Clarity Speech, our mission is to break down the barriers to effective learning by connecting you with passionate, expert tutors in a flexible, 1-on-1 environment.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 w-full relative rounded-[2.5rem] aspect-square overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 z-10 mix-blend-overlay" />
            <Image src="/team-office.png" alt="HD Clarity Team" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Why We Started</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
              We recognized that traditional, one-size-fits-all education leaves many students behind. Whether it's pacing, scheduling conflicts, or a lack of personalized attention, the old model is broken.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
              That's why we built a platform focused entirely on the student. We carefully vet every tutor and provide them with the tools to deliver highly personalized sessions tailored strictly to your goals.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                'Vetted, Expert Tutors',
                'Curriculum Designed Around You',
                'Learn From Anywhere in the World',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">
                  <CheckCircle2 className="text-blue-600" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-slate-900/80 border dark:border-slate-800 p-12 rounded-[2rem] text-center text-white transition-colors duration-300">
          <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Ready to experience the difference that dedicated 1-on-1 support makes? Start your journey today.
          </p>
          <Link href="/live-class" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
            Book a Session
          </Link>
        </div>
      </section>
    </div>
  );
}