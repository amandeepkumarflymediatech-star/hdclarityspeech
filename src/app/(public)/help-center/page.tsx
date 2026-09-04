import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="w-full font-sans text-primary bg-white pt-24 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-primary/70 hover:text-accent transition-colors mb-8 font-medium">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-8 font-playfair">Help Center</h1>
        <div className="prose prose-lg text-primary/80">
          <p>
            Welcome to the HD Clarity Speech Help Center. If you have any questions or need assistance, please feel free to reach out to us using the contact information below.
          </p>
          
          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">How do I book a session?</h3>
              <p>You can book a session by navigating to the "1:1 Session" page, selecting a package that suits your needs, and following the checkout process.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">What if I need to cancel or reschedule?</h3>
              <p>Please contact us at least 24 hours in advance if you need to cancel or reschedule your session to avoid any cancellation fees.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">How are the sessions conducted?</h3>
              <p>All sessions are conducted online via video conferencing platforms. You will receive a link to join the session after booking.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4 font-playfair">Contact Support</h2>
          <p>
            If you need further assistance, please reach out to our support team:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Email: hridey@hdclarityspeech.com</li>
            <li>Phone: +91 83608-58527</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
