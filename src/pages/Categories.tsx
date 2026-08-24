import { useState, useMemo } from 'react';
import { CATEGORIES } from '../types';
import type { Category } from '../types';
import { useListings } from '../hooks/useListings';
import { Layers, ArrowLeft, ArrowUpRight, Zap, Target } from 'lucide-react';
import { formatMoney } from '../utils';

export const Categories = () => {
  const { listings } = useListings();
  const [selectedSector, setSelectedSector] = useState<Category | null>(null);
  
  // Count how many brands are in each sector, and total value
  const sectorStats = useMemo(() => {
    return CATEGORIES.map(category => {
      const sectorListings = listings.filter(l => l.category === category);
      const totalValue = sectorListings.reduce((sum, l) => sum + l.currentPrice, 0);
      return { category, count: sectorListings.length, totalValue };
    });
  }, [listings]);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mb-16 border-b-4 border-red-600 pb-8 relative group">
          <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none hidden md:block">
            <Layers size={120} />
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter flex items-center gap-4">
            {selectedSector ? (
              <>
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="hover:text-red-500 transition-colors"
                >
                  <ArrowLeft size={48} className="md:w-[80px] md:h-[80px]" />
                </button>
                {selectedSector}
              </>
            ) : (
              'Global Categories'
            )}
          </h1>
          <p className="text-gray-400 font-mono text-sm md:text-base uppercase tracking-widest max-w-xl">
            {selectedSector 
              ? `Captivating campaigns currently running in the ${selectedSector} category.`
              : 'Browse active billboards by category. Prime visibility in the digital Times Square.'}
          </p>
        </div>

        {/* View Switcher */}
        {!selectedSector ? (
          /* ALL SECTORS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {sectorStats.map((stat, i) => (
              <div 
                key={stat.category}
                onClick={() => setSelectedSector(stat.category)}
                className="group relative bg-[#050505] border border-[#333] hover:border-red-500 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden rounded-3xl shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 group-hover:text-red-500 transition-all">
                  <ArrowUpRight size={32} />
                </div>
                <div className="absolute -bottom-12 -right-8 text-[150px] leading-none font-black text-white/5 pointer-events-none group-hover:text-red-500/10 transition-colors">
                  0{i + 1}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-12 relative z-10 group-hover:text-white transition-colors text-gray-300">
                  {stat.category}
                </h2>
                
                <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-widest relative z-10">
                  <div className="flex justify-between items-center border-b border-[#222] pb-3">
                    <span className="text-gray-500 flex items-center gap-2"><Target size={14} /> Live Billboards</span>
                    <span className="font-bold text-lg">{stat.count}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#222] pb-3">
                    <span className="text-gray-500 flex items-center gap-2"><Zap size={14} /> Total Category Value</span>
                    <span className="font-bold text-red-500 text-lg">{formatMoney(stat.totalValue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* SECTOR DETAIL GRID (BRANDS) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.filter(l => l.category === selectedSector).length > 0 ? (
              listings
                .filter(l => l.category === selectedSector)
                .sort((a, b) => b.currentPrice - a.currentPrice)
                .map((listing) => (
                  <div key={listing.id} className="group relative bg-[#111] border border-[#333] overflow-hidden rounded-2xl flex flex-col hover:border-red-500 transition-colors">
                    <div className="h-48 relative overflow-hidden bg-[#050505]">
                      {listing.bgImageUrl && (
                        <img 
                          src={listing.bgImageUrl} 
                          alt="" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[10px] uppercase px-3 py-1 font-bold flex items-center gap-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <Zap size={10} /> Rank #{listing.rank}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 truncate group-hover:text-red-500 transition-colors">
                        {listing.displayName}
                      </h3>
                      <p className="font-mono text-[10px] text-gray-500 uppercase line-clamp-3 mb-6">
                        {listing.description}
                      </p>
                      <div className="flex justify-between items-end border-t border-[#333] pt-4 mt-auto">
                        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Current Bid</span>
                        <span className="font-black text-xl text-white">{formatMoney(listing.currentPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full py-32 text-center flex flex-col items-center justify-center gap-6 text-gray-500 bg-[#050505] rounded-3xl border border-[#222]">
                <Layers size={80} className="opacity-20" />
                <p className="font-mono uppercase tracking-widest text-lg">No active billboards in this category.</p>
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="px-6 py-3 border border-gray-600 hover:border-white hover:text-white transition-colors font-mono text-xs uppercase tracking-widest"
                >
                  Return to Categories
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
