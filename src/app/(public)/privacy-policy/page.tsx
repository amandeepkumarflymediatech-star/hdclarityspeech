import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full font-sans text-primary bg-white pt-24 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-primary/70 hover:text-accent transition-colors mb-8 font-medium">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-8 font-playfair">Privacy Policy</h1>
        <div className="prose prose-lg text-primary/80 space-y-6">
          <p>
            At HD Clarity Speech, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the website.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at hridey@hdclarityspeech.com.
          </p>
        </div>
      </div>
    </div>
  );
}
