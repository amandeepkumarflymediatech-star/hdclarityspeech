export default function Contact() {
  return (
    <main className="min-h-screen bg-white text-primary pt-32 px-6 flex flex-col items-center">
      <h1 className="text-5xl font-black font-playfair tracking-tight mb-8">Contact Us</h1>
      <p className="text-primary/70 text-lg font-sans max-w-md text-center">
        Our contact functionality is currently integrated on our home page. Please head there to get in touch.
      </p>
      <a href="/#contact" className="mt-8 px-8 py-4 bg-accent text-white font-bold uppercase tracking-wider text-sm hover:bg-primary transition-colors">
        Go to Home
      </a>
    </main>
  );
}