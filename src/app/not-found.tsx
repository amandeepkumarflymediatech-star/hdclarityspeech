import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-xl mx-auto">
        <div className="relative w-full mb-8 flex justify-center">
          {/* Large background text for visual interest */}
          <div className="text-[150px] md:text-[200px] leading-none font-bold text-secondary/40 select-none pointer-events-none">
            404
          </div>
          
          {/* Foreground text aligned center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-primary text-3xl md:text-5xl font-playfair font-bold">
              Page Not Found
            </h1>
          </div>
        </div>
        
        <p className="text-primary/70 text-lg md:text-xl mb-10 leading-relaxed font-sans">
          Oops! It seems you've wandered into uncharted territory. The page you are looking for might have been removed or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="px-8 py-3.5 bg-accent text-white rounded-full font-medium transition-all duration-300 hover:bg-accent/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent w-full sm:w-auto"
          >
            Return to Homepage
          </Link>
          <Link 
            href="/contact"
            className="px-8 py-3.5 bg-white text-primary border-2 border-secondary/50 rounded-full font-medium transition-all duration-300 hover:border-primary hover:bg-secondary/10 hover:-translate-y-1 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
