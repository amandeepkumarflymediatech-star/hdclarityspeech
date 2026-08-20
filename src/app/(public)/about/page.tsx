import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full font-sans text-primary bg-white pt-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-6 py-24 bg-secondary border-b border-secondary text-center relative overflow-hidden transition-colors duration-300">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold text-primary mb-6 font-playfair transition-colors duration-300">Empowering Learners Everywhere</h1>
          <p className="text-lg text-primary/80 leading-relaxed font-sans transition-colors duration-300">
            At HD Clarity Speech, our mission is to break down the barriers to effective learning by connecting you with passionate, expert tutors in a flexible, 1-on-1 environment.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 w-full relative rounded-none aspect-square overflow-hidden border border-secondary bg-secondary">
            <Image src="/team-office.png" alt="HD Clarity Team" fill className="object-cover hover:scale-105 transition-transform duration-700 mix-blend-multiply opacity-80 grayscale" />
          </div>

          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-bold text-primary font-playfair transition-colors duration-300">Why We Started</h2>
            <p className="text-lg text-primary/80 font-sans transition-colors duration-300">
              We recognized that traditional, one-size-fits-all education leaves many students behind. Whether it's pacing, scheduling conflicts, or a lack of personalized attention, the old model is broken.
            </p>
            <p className="text-lg text-primary/80 font-sans transition-colors duration-300">
              That's why we built a platform focused entirely on the student. We carefully vet every tutor and provide them with the tools to deliver highly personalized sessions tailored strictly to your goals.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                'Vetted, Expert Tutors',
                'Curriculum Designed Around You',
                'Learn From Anywhere in the World',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-primary font-medium font-sans transition-colors duration-300">
                  <CheckCircle2 className="text-accent" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24 bg-white">
        <div className="max-w-4xl mx-auto bg-primary border border-secondary p-12 rounded-none text-center text-white transition-colors duration-300">
          <h2 className="text-3xl font-bold mb-6 font-playfair">Join Our Growing Community</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto font-sans">
            Ready to experience the difference that dedicated 1-on-1 support makes? Start your journey today.
          </p>
          <Link href="/live-class" className="inline-block px-10 py-5 bg-accent hover:bg-white hover:text-primary text-white font-bold uppercase tracking-wider text-sm rounded-none shadow-sm transition-all">
            Book a Session
          </Link>
        </div>
      </section>
    </div>
  );
}