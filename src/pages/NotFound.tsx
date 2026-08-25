import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="text-red-600 mb-6 animate-pulse">
        <AlertTriangle size={80} />
      </div>
      <h1 className="text-7xl sm:text-9xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-4">
        404
      </h1>
      <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-widest text-gray-400 mb-10 text-center">
        Sector Not Found
      </h2>
      <div className="text-gray-500 font-mono text-xs sm:text-sm max-w-md text-center mb-12 uppercase leading-relaxed border border-[#333] p-6 bg-[#050505]">
        The digital real estate you are looking for does not exist or has been wiped from the grid. Verify your coordinates and try again.
      </div>
      
      <Link 
        to="/"
        className="py-4 px-8 bg-white text-black font-black uppercase text-xl hover:bg-red-600 hover:text-white transition-all border border-white hover:border-red-600 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] brutalist-hover"
      >
        Return to the Board
      </Link>
    </div>
  );
};
