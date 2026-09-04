"use client";

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Reset success state after a few seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-primary text-white pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">Get in Touch</h1>
          <p className="text-secondary/90 text-lg md:text-xl font-sans max-w-2xl mx-auto">
            Have questions about our speech therapy programs? We're here to help. Reach out to our team of experts today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-playfair font-bold text-primary mb-8">Contact Information</h2>
            <div className="space-y-8 mb-12">
              <div className="flex items-start group">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-primary mr-6 shrink-0 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30 group-hover:-translate-y-1">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Call Us</h3>
                  <p className="text-primary/70 mb-1 font-medium hover:text-accent cursor-pointer transition-colors">+91 83608-58527</p>
                  <p className="text-primary/60 text-sm">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-primary mr-6 shrink-0 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30 group-hover:-translate-y-1">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Email Us</h3>
                  <p className="text-primary/70 mb-1 font-medium hover:text-accent cursor-pointer transition-colors">hridey@hdclarityspeech.com</p>
                  <p className="text-primary/60 text-sm">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center text-primary mr-6 shrink-0 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-accent/30 group-hover:-translate-y-1">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">Visit Us</h3>
                  <p className="text-primary/70 mb-1 font-medium hover:text-accent cursor-pointer transition-colors">123 Therapy Lane, Suite 100</p>
                  <p className="text-primary/60 text-sm">New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Decorative block / Map Placeholder */}
            <div className="bg-secondary/10 w-full h-64 rounded-3xl border border-secondary/30 flex items-center justify-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              <div className="z-10 flex flex-col items-center mt-20">
                <div className="bg-white p-3 rounded-full mb-3 shadow-lg shadow-black/20 animate-bounce">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <p className="text-white font-bold text-lg tracking-wide">Our Location</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-primary/10 border border-secondary/20">
            <h2 className="text-3xl font-playfair font-bold text-primary mb-2">Send a Message</h2>
            <p className="text-primary/60 mb-8 font-sans">Fill out the form below and we'll get back to you as soon as possible.</p>

            {isSubmitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border-4 border-green-100">
                  <Send className="w-10 h-10 ml-2" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3 font-playfair">Message Sent!</h3>
                <p className="text-primary/70">
                  Thank you for reaching out. We've received your message and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-primary ml-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-2xl border border-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-gray-50/50 hover:bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-primary ml-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-2xl border border-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-gray-50/50 hover:bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-primary ml-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-2xl border border-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-gray-50/50 hover:bg-white"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-primary ml-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-5 py-3.5 rounded-2xl border border-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-gray-50/50 hover:bg-white resize-none"
                    placeholder="Tell us about your needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent text-white rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}