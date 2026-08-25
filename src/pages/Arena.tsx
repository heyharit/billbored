import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Listing } from '../types';
import { useListings } from '../hooks/useListings';
import { getListingSlug } from '../utils';


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
  const navigate = useNavigate();
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
    setTimeout(updateSize, 50);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const weights = top21Listings.map(l => ({ weight: Math.max(l.currentPrice, 10) }));
  
  const rects = containerSize.w > 0
    ? layoutTreemap(weights, { x: 0, y: 0, w: containerSize.w, h: containerSize.h })
    : [];

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
                onClick={() => navigate(`/brand/${getListingSlug(listing)}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
