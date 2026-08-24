import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Activate when at least 40% of the footer is visible on screen
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-black text-white border-t-2 border-[#222] mt-32 relative group flex flex-col">
      
      {/* Container that sizes itself to the glass panel */}
      <div className="w-full relative flex justify-center items-center py-16 md:py-24 lg:py-32 overflow-hidden min-h-[600px] md:min-h-[400px]">
        
        {/* Massive Typography Background - Desktop (Horizontal) */}
        <div className="hidden md:flex absolute inset-0 justify-center items-center z-0 opacity-10 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
          <h1 className="text-[250px] lg:text-[400px] font-black uppercase tracking-tighter leading-none whitespace-nowrap select-none group-hover:text-red-600 transition-colors duration-700">
            BILLBORED<span className="text-transparent" style={{ WebkitTextStroke: '4px currentColor' }}>X</span>
          </h1>
        </div>

        {/* Massive Typography Background - Mobile (Vertical) */}
        <div className={`flex md:hidden absolute inset-0 justify-center items-center z-0 transition-all duration-1000 pointer-events-none ${isInView ? 'opacity-100' : 'opacity-10'}`}>
          <h1 className={`text-[100px] sm:text-[140px] font-black uppercase tracking-tighter leading-[0.8] select-none transition-colors duration-1000 flex flex-col items-center ${isInView ? 'text-red-600' : ''}`}>
            <span>B</span>
            <span>I</span>
            <span>L</span>
            <span>L</span>
            <span>B</span>
            <span>O</span>
            <span>R</span>
            <span>E</span>
            <span>D</span>
            <span className="text-transparent" style={{ WebkitTextStroke: '3px currentColor' }}>X</span>
          </h1>
        </div>

        {/* Floating Glassmorphism Data Panel - Relative so it dictates the container height */}
        <div className="relative w-[95%] sm:w-[90%] max-w-5xl footer-glass backdrop-blur-md border border-white/10 p-8 md:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 z-10 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col gap-4 sm:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="BX Logo" className="w-8 h-8 no-invert" />
              <span className="font-black text-2xl tracking-tighter uppercase leading-none">BillboredX</span>
            </div>
            <p className="text-gray-400 font-mono text-[10px] sm:text-xs uppercase max-w-sm leading-relaxed border-l-2 border-red-600 pl-3">
              The ultimate digital Times Square. Claim your billboard. Captivate the world. Own the spotlight.
            </p>
            <div className="mt-2 text-[10px] font-mono text-gray-600">
              © {new Date().getFullYear()} BILLBOREDX INC.
            </div>
          </div>
          
          <div className="flex flex-col gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <span className="text-gray-500 font-bold mb-2">SYSTEM</span>
            <Link to="/" className="hover:text-white text-gray-400 transition-colors">Terminal</Link>
            <Link to="/xxi" className="hover:text-white text-gray-400 transition-colors">BillboredXXI</Link>
            <Link to="/categories" className="hover:text-white text-gray-400 transition-colors">Categories</Link>
            <Link to="/about" className="hover:text-white text-gray-400 transition-colors">Manifesto</Link>
          </div>
          
          <div className="flex flex-col gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <span className="text-gray-500 font-bold mb-2">LEGAL</span>
            <Link to="/terms" className="hover:text-white text-gray-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white text-gray-400 transition-colors">Privacy Policy</Link>
            <a href="#" className="hover:text-white text-gray-400 transition-colors">X (Twitter)</a>
          </div>
        </div>
      </div>

      {/* Infinite scrolling warning tape */}
      <div className="w-full bg-red-600 overflow-hidden relative z-20 shadow-[0_-10px_30px_rgba(220,38,38,0.2)]">
        <div className="whitespace-nowrap font-mono text-black font-black text-[10px] sm:text-xs tracking-widest py-3 flex gap-8 animate-marquee no-invert">
          <span>// THE DIGITAL TIMES SQUARE // CAPTIVATE THE GLOBE // OWN THE SPOTLIGHT // PRIME BILLBOARD SPACE EXTREMELY VOLATILE //</span>
          <span>// THE DIGITAL TIMES SQUARE // CAPTIVATE THE GLOBE // OWN THE SPOTLIGHT // PRIME BILLBOARD SPACE EXTREMELY VOLATILE //</span>
          <span>// THE DIGITAL TIMES SQUARE // CAPTIVATE THE GLOBE // OWN THE SPOTLIGHT // PRIME BILLBOARD SPACE EXTREMELY VOLATILE //</span>
          <span>// THE DIGITAL TIMES SQUARE // CAPTIVATE THE GLOBE // OWN THE SPOTLIGHT // PRIME BILLBOARD SPACE EXTREMELY VOLATILE //</span>
        </div>
      </div>
    </footer>
  );
};
