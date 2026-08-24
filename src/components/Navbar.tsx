import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Terminal, Grid, Layers, BookOpen, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const isLightMode = localStorage.getItem('theme') === 'light';
    if (isLightMode) {
      setIsLight(true);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLight(false);
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLight(true);
    }
  };

  const NAV_LINKS = [
    { path: '/', label: 'TERMINAL', icon: Terminal },
    { path: '/xxi', label: 'BILLBOREDXXI', icon: Grid },
    { path: '/categories', label: 'CATEGORIES', icon: Layers },
    { path: '/about', label: 'MANIFESTO', icon: BookOpen },
    { path: '/rules', label: 'RULES', icon: ShieldAlert },
  ];

  return (
    <nav className="w-full border-b brutalist-border bg-black text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
        {/* Brand */}
        <Link to="/" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter transition-colors flex items-center gap-2 group">
          <img src="/favicon.svg" alt="BX Logo" className="w-8 h-8 no-invert" />
          <span className="group-hover:text-red-600 transition-colors">Billbored<span className="text-red-600 logo-x transition-colors">X</span></span>
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold font-mono">
          {NAV_LINKS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link 
                key={path} 
                to={path} 
                className={`nav-link transition-colors flex items-center gap-1.5 ${isActive ? 'active font-bold' : 'text-gray-500'}`}
              >
                <Icon size={14} className={isActive ? 'text-red-500' : ''} />
                {label}
              </Link>
            );
          })}
          
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center p-1.5 text-gray-400 hover:text-white hover:bg-[#111] transition-colors ml-2 border border-[#333] no-invert"
            title="Toggle Theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Ticker / Marquee line */}
      <div className="w-full bg-[#111] border-t border-[#333] py-1.5 px-4 overflow-hidden flex items-center text-[10px] font-mono text-gray-500 uppercase whitespace-nowrap">
        <span className="animate-pulse text-red-500 mr-2">● LIVE</span>
        <span>THE BUYOUT BOARD. EVERY SPOT CAN BE STOLEN. NEXT BUYER PAYS 1.5X. YOU GET 1.25X. PLATFORM GETS 0.25X. NO SUNK COSTS. PURE CAPITALISM.</span>
      </div>
    </nav>
  );
};
