import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="w-full font-sans text-primary bg-white pt-24 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-primary/70 hover:text-accent transition-colors mb-8 font-medium">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-8 font-playfair">Terms of Service</h1>
        <div className="prose prose-lg text-primary/80 space-y-6">
          <p>
            Welcome to HD Clarity Speech. These Terms of Service outline the rules and regulations for the use of our website and services.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">Acceptance of Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use HD Clarity Speech if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">License</h2>
          <p>
            Unless otherwise stated, HD Clarity Speech and/or its licensors own the intellectual property rights for all material on HD Clarity Speech. All intellectual property rights are reserved. You may access this from HD Clarity Speech for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">User Responsibilities</h2>
          <p>
            You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.
          </p>
          
          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at hridey@hdclarityspeech.com.
          </p>
        </div>
      </div>
    </div>
  );
}
