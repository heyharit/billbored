import React from 'react';
import type { Listing } from '../types';
import { formatMoney } from '../utils';
import { ExternalLink } from 'lucide-react';

interface Props {
  listing: Listing;
  onStealClick: (listing: Listing) => void;
}

export const BrutalistBillboard: React.FC<Props> = ({ listing, onStealClick }) => {
  if (!listing) return null;

  return (
    <div className="w-full mb-16 relative">
      {/* Decorative Billboard "Poles" */}
      <div className="absolute -bottom-8 left-12 w-4 h-8 bg-white border-x-4 border-black z-[-1]"></div>
      <div className="absolute -bottom-8 right-12 w-4 h-8 bg-white border-x-4 border-black z-[-1]"></div>

      {/* The Main Board */}
      <div className="relative w-full border-4 border-white bg-black p-1 shadow-[16px_16px_0px_0px_rgba(220,38,38,1)] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] group">
        
        {/* LED Screen Area */}
        <div className="relative border-2 border-[#333] bg-[#050505] overflow-hidden flex flex-col items-center text-center p-8 sm:p-16">
          
          {/* Scanlines Effect */}
          <div className="scanlines"></div>
          
          {/* Top Badge */}
          <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-2 text-xs sm:text-sm tracking-widest uppercase border-r-2 border-b-2 border-[#333] z-10 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            PRIME BILLBOARD / RANK #1
          </div>

          <div className="absolute top-0 right-0 bg-red-600 text-white font-black px-4 py-2 text-xs sm:text-sm tracking-widest uppercase border-l-2 border-b-2 border-[#333] z-10">
            {formatMoney(listing.currentPrice)}
          </div>

          {/* Main Title */}
          <a 
            href={listing.url}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 mt-6 sm:mt-12 block"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-700 hover:from-white hover:to-white transition-all duration-300 leading-none break-all sm:break-normal px-4">
              {listing.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 group-hover:text-white transition-colors uppercase font-mono text-sm tracking-widest">
              <span>Visit Domain</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          {/* Scrolling Marquee Description */}
          <div className="relative z-10 w-[110%] -ml-[5%] border-y-2 border-[#333] bg-[#111] mt-12 sm:mt-16 overflow-hidden flex items-center py-4">
            <div className="animate-marquee whitespace-nowrap text-xl sm:text-3xl font-mono font-bold text-red-500 tracking-widest">
              {/* Duplicate text for seamless loop */}
              {Array(6).fill(listing.description.toUpperCase() + " • ").join('')}
            </div>
          </div>

          {/* Action Footer inside Billboard */}
          <div className="relative z-10 w-full mt-12 flex flex-col sm:flex-row justify-between items-center font-mono gap-6">
            <div className="flex flex-col text-left w-full sm:w-auto">
                <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest">Takeover Price</span>
                <span className="text-2xl sm:text-3xl font-bold text-white">{formatMoney(listing.currentPrice + 1)}</span>
              </div>
            
            <button 
              onClick={() => onStealClick(listing)}
              className="w-full sm:w-auto bg-white text-black hover:bg-red-600 hover:text-white font-black text-lg sm:text-xl uppercase px-8 py-4 transition-colors tracking-tighter"
            >
              Takeover Billboard
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};
