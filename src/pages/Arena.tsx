import { useState, useRef, useEffect, useMemo } from 'react';
import type { Listing } from '../types';
import { formatMoney } from '../utils';
import { X, ExternalLink, Zap, Eye, Clock } from 'lucide-react';
import { useListings } from '../hooks/useListings';

interface HologramProps {
  listing: Listing | null;
  onClose: () => void;
  onOvertake: (listing: Listing) => void;
}

const HologramModal: React.FC<HologramProps> = ({ listing, onClose, onOvertake }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (listing) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      document.body.style.overflow = '';
      setVisible(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [listing]);

  if (!listing) return null;

  const timeHeld = Date.now() - listing.purchasedAt;
  const hoursHeld = Math.floor(timeHeld / 3600000);
  const daysHeld = Math.floor(hoursHeld / 24);
  const holdStr = daysHeld > 0 ? `${daysHeld}d ${hoursHeld % 24}h` : `${hoursHeld}h`;

  return (
    <div className={`fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col lg:flex-row transition-all duration-500 ease-out ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Close Button overlay */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 lg:top-8 lg:right-8 z-50 p-3 lg:p-4 bg-white/10 hover:bg-red-600 text-white backdrop-blur-md transition-colors border border-white/20 group"
      >
        <X className="w-6 h-6 lg:w-8 lg:h-8 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Left Column: Media & Title (60%) */}
      <div className="hologram-left relative w-full lg:w-[60%] h-[40vh] lg:h-screen bg-[#050505] border-b lg:border-b-0 lg:border-r border-[#333] flex flex-col justify-end p-6 lg:p-16 overflow-hidden">
        {listing.bgImageUrl && (
          <img 
            src={listing.bgImageUrl} 
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover brightness-50 transition-all duration-1000 ${visible ? 'scale-100 opacity-60' : 'scale-110 opacity-0'}`} 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className={`relative z-10 transition-all duration-700 delay-100 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <img 
            src={`https://picsum.photos/seed/fav${listing.id}/128/128`} 
            alt="" 
            className="w-16 h-16 lg:w-24 lg:h-24 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 lg:mb-6 border-2 border-white/20 bg-black object-cover" 
          />
          <h1 className="text-4xl sm:text-6xl lg:text-[100px] xl:text-[130px] font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl max-w-full break-words">
            {listing.displayName || listing.title}
          </h1>
          <a 
            href={listing.url} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-white/10 hover:bg-white hover:text-black border border-white/20 transition-colors text-xs lg:text-sm font-mono tracking-widest uppercase text-white"
          >
            <ExternalLink size={16} /> Access Domain
          </a>
        </div>
      </div>

      {/* Right Column: Data & Action (40%) */}
      <div className="relative w-full lg:w-[40%] h-[60vh] lg:h-screen bg-black overflow-y-auto flex flex-col">
        <div className="flex-1 p-6 lg:p-12 flex flex-col gap-6 lg:gap-10">
          
          <div className={`transition-all duration-700 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-red-500 font-mono text-[10px] lg:text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
              Threat Level
            </div>
            <div className="text-3xl lg:text-6xl font-black uppercase tracking-tighter">Rank #{listing.rank}</div>
          </div>

          <div className="h-px w-full bg-[#222]"></div>

          <div className={`transition-all duration-700 delay-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-gray-500 font-mono text-[10px] lg:text-xs uppercase tracking-widest mb-3">Directive</div>
            <p className="text-base lg:text-xl text-gray-300 font-mono leading-relaxed border-l-2 border-red-500 pl-4 bg-[#0a0a0a] p-4">
              "{listing.description}"
            </p>
          </div>

          <div className="h-px w-full bg-[#222]"></div>

          <div className={`grid grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-[#050505] p-4 border border-[#222]">
               <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap size={12} className="text-red-500"/> Power</div>
               <div className="text-2xl lg:text-3xl font-black">{formatMoney(listing.currentPrice)}</div>
            </div>
            <div className="bg-[#050505] p-4 border border-[#222]">
               <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Eye size={12} className="text-red-500"/> Eyes</div>
               <div className="text-2xl lg:text-3xl font-black">{listing.clicks.toLocaleString()}</div>
            </div>
            <div className="bg-[#050505] p-4 border border-[#222]">
               <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={12} className="text-red-500"/> Hold</div>
               <div className="text-2xl lg:text-3xl font-black">{holdStr}</div>
            </div>
            <div className="bg-[#050505] p-4 border border-[#222]">
               <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2">Category</div>
               <div className="text-lg lg:text-xl font-black uppercase truncate">{listing.category}</div>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action */}
        <div className={`sticky bottom-0 w-full p-4 lg:p-8 footer-glass backdrop-blur-md border-t border-[#333] transition-all duration-700 delay-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <button 
            onClick={() => { setVisible(false); setTimeout(() => onOvertake(listing), 500); }}
            className="w-full py-5 lg:py-8 bg-red-600 hover:bg-white text-white hover:text-black transition-all flex flex-col items-center justify-center gap-2 border border-red-500 hover:border-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] brutalist-hover group"
          >
            <span className="font-black text-xl lg:text-3xl uppercase tracking-tighter">Takeover Billboard</span>
            <span className="font-mono text-[10px] lg:text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:font-bold">{formatMoney(listing.currentPrice + 1)}+ Required</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// ─── Highly Visual Treemap Cell ───────────────────────────────────────────────

interface CellProps {
  listing: Listing;
  style: React.CSSProperties;
  onClick: () => void;
}

const TreemapCell: React.FC<CellProps> = ({ listing, style, onClick }) => {
  const rank = listing.rank || 99;
  
  // Decide visual prominence based on size/rank
  const isGiant = rank <= 3;
  const isLarge = rank > 3 && rank <= 12;

  // We assign a random neon accent border/shadow color based on ID so it's consistent
  const colors = [
    'rgba(239, 68, 68, 1)',   // Red
    'rgba(59, 130, 246, 1)',  // Blue
    'rgba(234, 179, 8, 1)',   // Yellow
    'rgba(34, 197, 94, 1)',   // Green
    'rgba(168, 85, 247, 1)',  // Purple
    'rgba(6, 182, 212, 1)',   // Cyan
  ];
  const accentColor = colors[parseInt(listing.id.split('-')[1] || '0') % colors.length];

  return (
    <div
      className="absolute overflow-hidden cursor-pointer group mosaic-cell rounded-2xl md:rounded-3xl isolate"
      style={{ ...style }}
      onClick={onClick}
    >
      <div className="relative w-full h-full bg-black overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:z-50 rounded-2xl md:rounded-3xl"
           style={{
             boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1)`,
           }}>
        
        {/* The actual image - desaturated by default, pops to full color on hover */}
        {listing.bgImageUrl && (
          <img 
            src={listing.bgImageUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[80%] brightness-50 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-500"
          />
        )}
        
        {/* Glow overlay on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
          style={{ background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)` }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 text-center">
          {isGiant ? (
            <>
              <h2 className="text-white font-black text-3xl sm:text-5xl uppercase tracking-tighter leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {listing.displayName}
              </h2>
              <span className="text-white/50 font-mono text-xs mt-2 uppercase tracking-widest font-bold">#{rank}</span>
            </>
          ) : isLarge ? (
            <>
              <h2 className="text-white font-black text-xl sm:text-2xl uppercase tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {listing.displayName}
              </h2>
              <span className="text-white/50 font-mono text-[10px] mt-1 uppercase tracking-widest font-bold">#{rank}</span>
            </>
          ) : (
            // For small cells, just show the favicon or a very truncated name
            <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-[8px] uppercase tracking-tighter leading-none drop-shadow-md truncate w-full px-1">
                {listing.displayName}
              </span>
            </div>
          )}
        </div>
        
        {/* Aggressive Hover Border */}
        <div 
          className="absolute inset-0 border-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl md:rounded-3xl"
          style={{ borderColor: accentColor, boxShadow: `inset 0 0 20px ${accentColor}` }}
        ></div>
      </div>
    </div>
  );
};


// ─── Treemap Layout Algorithm ─────────────────────────────────────────────────

interface Rect { x: number; y: number; w: number; h: number; }

function layoutTreemap(items: { weight: number }[], container: Rect): Rect[] {
  if (items.length === 0) return [];
  if (items.length === 1) return [{ ...container }];

  const totalWeight = items.reduce((s, i) => s + i.weight, 0);
  if (totalWeight === 0) return items.map(() => ({ ...container }));

  let bestSplit = 1;
  let bestDiff = Infinity;
  let runningWeight = 0;
  for (let i = 0; i < items.length - 1; i++) {
    runningWeight += items[i].weight;
    const diff = Math.abs(runningWeight / totalWeight - 0.5);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = i + 1;
    }
  }

  const leftItems = items.slice(0, bestSplit);
  const rightItems = items.slice(bestSplit);
  const leftWeight = leftItems.reduce((s, i) => s + i.weight, 0);
  const ratio = leftWeight / totalWeight;

  let leftRect: Rect, rightRect: Rect;

  if (container.w >= container.h) {
    const splitX = container.x + container.w * ratio;
    leftRect = { x: container.x, y: container.y, w: container.w * ratio, h: container.h };
    rightRect = { x: splitX, y: container.y, w: container.w * (1 - ratio), h: container.h };
  } else {
    const splitY = container.y + container.h * ratio;
    leftRect = { x: container.x, y: container.y, w: container.w, h: container.h * ratio };
    rightRect = { x: container.x, y: splitY, w: container.w, h: container.h * (1 - ratio) };
  }

  return [
    ...layoutTreemap(leftItems, leftRect),
    ...layoutTreemap(rightItems, rightRect),
  ];
}


// ─── Main Page ────────────────────────────────────────────────────────────────

export const Arena = () => {
  const { listings } = useListings();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // BillboredXXI displays exactly the top 21 listings
  const top21Listings = useMemo(() => listings.slice(0, 21), [listings]);

  // Measure container for the treemap algorithm
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    // Give it a tiny delay on mount to ensure CSS has applied
    setTimeout(updateSize, 50);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Ensure weights are strictly positive and descending properly
  const weights = top21Listings.map(l => ({ weight: Math.max(l.currentPrice, 10) }));
  
  const rects = containerSize.w > 0
    ? layoutTreemap(weights, { x: 0, y: 0, w: containerSize.w, h: containerSize.h })
    : [];

  const handleOvertake = (listing: Listing) => {
    setSelectedListing(null);
    alert(`Initiate Takeover for ${listing.displayName} (Backend Pending)`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <div className="w-full mx-auto px-4 sm:px-8 pt-8 pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              BILLBORED<span className="text-red-600">XXI</span>
            </h1>
            <p className="text-gray-400 font-mono text-xs sm:text-sm uppercase mt-2 tracking-widest max-w-2xl">
              The absolute top 21 of the globally elite 99 brands. Space is strictly dictated by financial power. Hover to awaken. Click to engage.
            </p>
          </div>
        </div>
      </div>

      {/* The Mosaic Container */}
      <div className="flex-1 w-full relative px-2 pb-2">
        <div 
          ref={containerRef}
          className="relative w-full h-full bg-[#050505]"
          style={{ height: 'calc(100vh - 160px)', minHeight: '600px' }}
        >
          {rects.map((rect, i) => {
            const listing = top21Listings[i];
            if (!listing) return null;
            return (
              <TreemapCell
                key={listing.id}
                listing={listing}
                style={{
                  left: rect.x + 2,
                  top: rect.y + 2,
                  width: rect.w - 4,
                  height: rect.h - 4,
                }}
                onClick={() => setSelectedListing(listing)}
              />
            );
          })}
        </div>
      </div>

      <HologramModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onOvertake={handleOvertake}
      />
    </div>
  );
};
