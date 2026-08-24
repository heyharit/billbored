import React from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';
import type { Listing } from '../types';
import { formatMoney, formatTimeAgo, getFaviconUrl } from '../utils';

interface Props {
  listing: Listing;
  onBuyout: (listing: Listing) => void;
}

export const LeaderboardEntry: React.FC<Props> = ({ listing, onBuyout }) => {
  const minBid = listing.currentPrice + 1;

  return (
    <div className="group relative bg-black border border-[#333] hover:border-white transition-colors duration-150 flex flex-col md:flex-row">
      
      {/* Rank Block (Left) */}
      <div className="md:w-20 shrink-0 border-b md:border-b-0 md:border-r border-[#333] flex items-center justify-center p-4 bg-[#0a0a0a] group-hover:bg-white group-hover:text-black transition-colors">
        <span className="font-mono text-3xl font-black">
          {listing.rank || '-'}
        </span>
      </div>

      {/* Main Content (Center) */}
      <div 
        className="flex-1 p-4 flex flex-col justify-between relative"
        style={listing.bgImageUrl ? {
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.7)), url(${listing.bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <img src={getFaviconUrl(listing.url)} alt="" className="w-5 h-5 rounded-none mr-1" />
            <a 
              href={listing.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-lg font-bold text-white hover:text-red-500 hover:underline inline-flex items-center gap-1 uppercase tracking-tight"
            >
              {listing.displayName || listing.title}
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="px-1.5 py-0.5 bg-[#1a1a1a] text-gray-400 text-[10px] font-mono border border-[#333]">
              {listing.category}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {listing.description}
          </p>
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            ACTIVE SINCE {formatTimeAgo(listing.purchasedAt)}
          </span>
          <span>{listing.clicks} CLICKS</span>
        </div>
      </div>

      {/* Financials & Action (Right) */}
      <div className="md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-[#333] flex flex-col">
        {/* Financial Data */}
        <div className="p-3 bg-[#0a0a0a] flex-1 flex flex-col justify-center gap-2 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">PAID</span>
            <span className="text-white font-bold">{formatMoney(listing.currentPrice)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">MIN TAKEOVER BID</span>
            <span className="text-red-500 font-bold">{formatMoney(minBid)}</span>
          </div>
          <div className="flex justify-between text-[10px] pt-2 border-t border-[#333]">
            <span className="text-gray-600">PROFIT SPLIT</span>
            <span className="text-green-500">50% OWNER / 50% PLATFORM</span>
          </div>
        </div>
        
        {/* Buyout Button */}
        <button
          onClick={() => onBuyout(listing)}
          className="w-full py-3 bg-black border-t border-[#333] text-white font-bold uppercase text-xs tracking-wider brutalist-hover group-hover:border-white flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Takeover For {formatMoney(minBid)}+
        </button>
      </div>
    </div>
  );
};
