'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCtaSection() {
  const container = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studyPreference: '1:1 Coaching',
    message: '',
  });

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.from('.cta-reveal', {
          y: 80,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 72%',
          },
        });

        gsap.from('.cta-side-line', {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container.current,
            start: 'top 72%',
          },
        });
      });

      return () => ctx.revert();
    },
    { scope: container }
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error || 'Something went wrong. Please try again.'
        );
      }

      setSubmitStatus('success');

      setFormData({
        name: '',
        email: '',
        studyPreference: '1:1 Coaching',
        message: '',
      });
    } catch (error: any) {
      setSubmitStatus('error');

      setErrorMessage(
        error?.message ||
          'Unable to send your inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ================= CTA SECTION ================= */}

      <section
        ref={container}
        className="relative overflow-hidden bg-primary"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(232,117,50,0.16),transparent_30%)]" />

          <div className="absolute -right-40 top-0 h-[700px] w-[700px] rounded-full border border-white/5" />
          <div className="absolute -right-20 top-20 h-[500px] w-[500px] rounded-full border border-white/5" />

          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-44">
          <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">

            {/* Left */}
            <div>
              <div className="mb-8 flex items-center gap-4 overflow-hidden">
                <span className="cta-reveal block h-px w-12 bg-accent" />

                <p className="cta-reveal text-xs font-bold uppercase tracking-[0.28em] text-accent">
                  Your next chapter starts here
                </p>
              </div>

              <div className="overflow-hidden">
                <h2 className="cta-reveal font-playfair text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  Your Voice
                </h2>
              </div>

              <div className="overflow-hidden">
                <h2 className="cta-reveal font-playfair text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  Deserves To
                </h2>
              </div>

              <div className="overflow-hidden">
                <h2 className="cta-reveal font-cormorant text-6xl font-semibold italic leading-[0.95] tracking-tight text-accent sm:text-7xl md:text-8xl lg:text-9xl">
                  Be Heard.
                </h2>
              </div>
            </div>

            {/* Right */}
            <div className="lg:pb-3">
              <div className="cta-side-line mb-8 h-20 w-px bg-accent/70" />

              <p className="cta-reveal mb-8 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                Stop holding back in conversations, meetings, interviews,
                and the moments that matter most.
              </p>

              <button
                onClick={() => {
                  setSubmitStatus('idle');
                  setIsModalOpen(true);
                }}
                className="cta-reveal group inline-flex items-center gap-5 border border-accent bg-accent px-7 py-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-white hover:text-primary sm:px-9"
              >
                Book Free Consultation

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-primary">
                  <ArrowUpRight size={17} />
                </span>
              </button>
            </div>
          </div>

          {/* Bottom line */}
          <div className="cta-reveal mt-20 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 sm:mt-28">
            <span>Speak with confidence</span>
            <span className="hidden h-1 w-1 rounded-full bg-accent sm:block" />
            <span>Communicate clearly</span>
            <span className="hidden h-1 w-1 rounded-full bg-accent sm:block" />
            <span>Command every room</span>
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/85 p-4 backdrop-blur-xl"
          onMouseDown={() => setIsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Book a free consultation"
            onMouseDown={(e) => e.stopPropagation()}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]"
          >
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-white/10 bg-primary text-white transition hover:bg-accent lg:right-6 lg:top-6"
            >
              <X size={18} />
            </button>

            {/* LEFT PANEL */}

            <div className="relative overflow-hidden bg-primary p-8 text-white sm:p-12">
              <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                  Free Consultation
                </p>

                <h3 className="mb-6 font-playfair text-4xl font-black leading-tight sm:text-5xl">
                  Let's find your
                  <span className="block font-cormorant text-5xl italic text-accent sm:text-6xl">
                    voice.
                  </span>
                </h3>

                <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/60">
                  Tell us a little about yourself and we'll help you find
                  the right path for your communication goals.
                </p>

                <div className="mt-auto space-y-5">
                  {[
                    'Understand your communication goals',
                    'Discover the right learning approach',
                    'Get a personalized recommendation',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm text-white/80"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
                        <Check size={12} />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}

            <div className="p-8 sm:p-12 lg:p-14">
              {submitStatus === 'success' ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle2 size={40} />
                  </div>

                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                    Inquiry Received
                  </p>

                  <h3 className="mb-5 font-playfair text-4xl font-black text-primary">
                    You're on your way.
                  </h3>

                  <p className="max-w-md text-sm leading-relaxed text-primary/60">
                    Thank you for reaching out. Our team will review your
                    details and get in touch with you shortly.
                  </p>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-10 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-accent"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                      Step 1 of 1
                    </p>

                    <h3 className="font-playfair text-3xl font-black text-primary sm:text-4xl">
                      Tell us about yourself.
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-primary/55">
                      Complete the form below and we'll take it from there.
                    </p>
                  </div>

                  {submitStatus === 'error' && (
                    <div className="mb-6 border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-600">
                      {errorMessage}
                    </div>
                  )}

                  <form
                    onSubmit={handleContactSubmit}
                    className="space-y-6"
                  >
                    {/* Name */}

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary/45"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full border-b border-primary/15 bg-transparent py-3 text-sm text-primary outline-none transition placeholder:text-primary/25 focus:border-accent"
                      />
                    </div>

                    {/* Email */}

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary/45"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full border-b border-primary/15 bg-transparent py-3 text-sm text-primary outline-none transition placeholder:text-primary/25 focus:border-accent"
                      />
                    </div>

                    {/* Preference */}

                    <div>
                      <label
                        htmlFor="studyPreference"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary/45"
                      >
                        Preferred Learning Style
                      </label>

                      <select
                        id="studyPreference"
                        name="studyPreference"
                        value={formData.studyPreference}
                        onChange={handleChange}
                        className="w-full border-b border-primary/15 bg-transparent py-3 text-sm text-primary outline-none transition focus:border-accent"
                      >
                        <option value="1:1 Coaching">
                          1:1 Coaching
                        </option>

                        <option value="Group Classes">
                          Group Classes
                        </option>

                        <option value="Self Paced">
                          Self-Paced Learning
                        </option>

                        <option value="Not Sure Yet">
                          I'm Not Sure Yet
                        </option>
                      </select>
                    </div>

                    {/* Goals */}

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary/45"
                      >
                        What would you like to improve?
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your goals, challenges, or what you'd like to achieve..."
                        className="w-full resize-none border-b border-primary/15 bg-transparent py-3 text-sm leading-relaxed text-primary outline-none transition placeholder:text-primary/25 focus:border-accent"
                      />
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="group mt-4 flex w-full items-center justify-center gap-4 bg-primary px-7 py-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          Sending
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        </>
                      ) : (
                        <>
                          Send My Inquiry
                          <ArrowUpRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <p className="pt-1 text-center text-[10px] leading-relaxed text-primary/35">
                      By submitting this form, you agree to be contacted
                      regarding your consultation.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}