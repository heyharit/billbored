import React from 'react';
import type { Listing } from '../types';
import { formatMoney, getFaviconUrl } from '../utils';
import { ExternalLink } from 'lucide-react';

interface PodiumProps {
  topListings: Listing[];
  onStealClick: (listing: Listing) => void;
}

export const BrutalistPodium: React.FC<PodiumProps> = ({ topListings, onStealClick }) => {
  const rank1 = topListings[0];
  const rank2 = topListings[1];
  const rank3 = topListings[2];

  return (
    <div className="w-full mb-16 relative">
      {/* Rank #1 Billboard */}
      {rank1 && (
        <div className="relative w-full border-4 border-white bg-black p-1 shadow-[16px_16px_0px_0px_rgba(220,38,38,1)] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] group mb-12">
          <div 
            className="relative border-2 border-[#333] bg-[#050505] overflow-hidden flex flex-col items-center text-center p-8 sm:p-16"
            style={rank1.bgImageUrl ? {
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${rank1.bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            <div className="scanlines"></div>
            
            <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-2 text-xs sm:text-sm tracking-widest uppercase border-r-2 border-b-2 border-[#333] z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              TOP BILLBORED
            </div>

            <div className="absolute top-0 right-0 bg-red-600 text-white font-black px-4 py-2 text-xs sm:text-sm tracking-widest uppercase border-l-2 border-b-2 border-[#333] z-10">
              {formatMoney(rank1.currentPrice)}
            </div>

            <a href={rank1.url} target="_blank" rel="noreferrer" className="relative z-10 mt-6 sm:mt-12 block group/link">
              <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
                <img 
                  src={getFaviconUrl(rank1.url)} 
                  alt="" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover/link:translate-x-1 group-hover/link:translate-y-1 group-hover/link:shadow-none transition-all flex-shrink-0"
                />
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-700 hover:from-white hover:to-white transition-all duration-300 leading-none break-all sm:break-normal px-4">
                  {rank1.displayName || rank1.title}
                </h1>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 group-hover/link:text-white transition-colors uppercase font-mono text-sm tracking-widest">
                <span>Visit Domain</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>

            <div className="relative z-10 w-[110%] -ml-[5%] border-y-2 border-[#333] bg-black/50 backdrop-blur-md mt-12 sm:mt-16 overflow-hidden flex items-center py-4">
              <div className="animate-marquee whitespace-nowrap text-xl sm:text-3xl font-mono font-bold text-red-500 tracking-widest">
                {Array(6).fill(rank1.description.toUpperCase() + " • ").join('')}
              </div>
            </div>

            <div className="relative z-10 w-full mt-12 flex flex-col sm:flex-row justify-between items-center font-mono gap-6">
              <div className="flex flex-col text-left w-full sm:w-auto">
                <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">Min Takeover Bid</span>
                <span className="text-2xl sm:text-3xl font-bold text-white">{formatMoney(rank1.currentPrice + 1)}+</span>
              </div>
              <button 
                onClick={() => onStealClick(rank1)}
                className="w-full sm:w-auto bg-white text-black hover:bg-red-600 hover:text-white font-black text-lg sm:text-xl uppercase px-8 py-4 transition-colors tracking-tighter"
              >
                Takeover Billboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ranks #2 and #3 Cascading Layout */}
      <div className="flex flex-col gap-6 w-full">
        {rank2 && (
          <div 
            className="relative w-[95%] md:w-[85%] self-end border-4 border-blue-500 bg-black p-1 transition-all duration-300 hover:translate-x-1 hover:translate-y-1 group"
            style={{ boxShadow: `8px 8px 0px 0px rgba(59,130,246,1)` }}
          >
            <div 
              className="relative border-2 border-[#333] bg-[#050505] overflow-hidden flex flex-col items-center text-center p-6 h-full min-h-[250px]"
              style={rank2.bgImageUrl ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${rank2.bgImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}
            >
              <div className="scanlines"></div>
              
              <div className="absolute top-0 left-0 bg-white text-black font-black px-3 py-1.5 text-xs tracking-widest uppercase border-r-2 border-b-2 border-[#333] z-10">
                2ND BILLBORED
              </div>
              <div className="absolute top-0 right-0 text-white font-black px-3 py-1.5 text-xs tracking-widest uppercase border-l-2 border-b-2 border-[#333] z-10 bg-blue-600">
                {formatMoney(rank2.currentPrice)}
              </div>

              <a href={rank2.url} target="_blank" rel="noreferrer" className="relative z-10 mt-10 block flex-1 flex flex-col justify-center w-full group/link">
                <div className="flex items-center justify-center gap-3">
                  <img src={getFaviconUrl(rank2.url)} alt="" className="w-10 h-10 rounded-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex-shrink-0" />
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white group-hover/link:text-blue-400 transition-colors leading-none truncate px-2 min-w-0">
                    {rank2.displayName || rank2.title}
                  </h2>
                </div>
                <p className="text-gray-400 font-mono text-sm mt-4 line-clamp-2 uppercase">
                  {rank2.description}
                </p>
              </a>

              <div className="relative z-10 w-full mt-6 border-t-2 border-[#333] pt-4 flex justify-between items-center font-mono">
                <div className="flex flex-col text-left">
                  <span className="text-gray-500 text-[10px] uppercase">Min Takeover</span>
                  <span className="text-lg font-bold text-white">{formatMoney(rank2.currentPrice + 1)}+</span>
                </div>
                <button 
                  onClick={() => onStealClick(rank2)}
                  className="bg-white text-black hover:bg-blue-600 hover:text-white font-black text-sm uppercase px-4 py-2 transition-colors brutalist-hover"
                >
                  Takeover
                </button>
              </div>
            </div>
          </div>
        )}

        {rank3 && (
          <div 
            className="relative w-[90%] md:w-[75%] self-start border-4 border-yellow-500 bg-black p-1 transition-all duration-300 hover:translate-x-1 hover:translate-y-1 group"
            style={{ boxShadow: `8px 8px 0px 0px rgba(234,179,8,1)` }}
          >
            <div 
              className="relative border-2 border-[#333] bg-[#050505] overflow-hidden flex flex-col items-center text-center p-6 h-full min-h-[200px]"
              style={rank3.bgImageUrl ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${rank3.bgImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {}}
            >
              <div className="scanlines"></div>
              
              <div className="absolute top-0 left-0 bg-white text-black font-black px-3 py-1.5 text-xs tracking-widest uppercase border-r-2 border-b-2 border-[#333] z-10">
                3RD BILLBORED
              </div>
              <div className="absolute top-0 right-0 text-white font-black px-3 py-1.5 text-xs tracking-widest uppercase border-l-2 border-b-2 border-[#333] z-10 bg-yellow-600">
                {formatMoney(rank3.currentPrice)}
              </div>

              <a href={rank3.url} target="_blank" rel="noreferrer" className="relative z-10 mt-8 block flex-1 flex flex-col justify-center w-full group/link">
                <div className="flex items-center justify-center gap-3">
                  <img src={getFaviconUrl(rank3.url)} alt="" className="w-8 h-8 rounded-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex-shrink-0" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white group-hover/link:text-yellow-400 transition-colors leading-none truncate px-2 min-w-0">
                    {rank3.displayName || rank3.title}
                  </h2>
                </div>
                <p className="text-gray-400 font-mono text-xs mt-3 line-clamp-2 uppercase">
                  {rank3.description}
                </p>
              </a>

              <div className="relative z-10 w-full mt-6 border-t-2 border-[#333] pt-4 flex justify-between items-center font-mono">
                <div className="flex flex-col text-left">
                  <span className="text-gray-500 text-[10px] uppercase">Min Takeover</span>
                  <span className="text-lg font-bold text-white">{formatMoney(rank3.currentPrice + 1)}+</span>
                </div>
                <button 
                  onClick={() => onStealClick(rank3)}
                  className="bg-white text-black hover:bg-yellow-600 hover:text-white font-black text-xs uppercase px-4 py-2 transition-colors brutalist-hover"
                >
                  Takeover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
