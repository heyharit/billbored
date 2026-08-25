import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { formatMoney, getListingSlug, getFaviconUrl } from '../utils';
import { ExternalLink, Zap, Eye, Clock, ArrowLeft } from 'lucide-react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const BrandPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { listings, loading } = useListings();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const listing = listings.find(l => getListingSlug(l) === slug);

  // Click tracking — one click per browser device (localStorage)
  useEffect(() => {
    if (!listing || !slug) return;
    const key = `clicked_${listing.id}`;
    if (!localStorage.getItem(key)) {
      // Set localStorage IMMEDIATELY (synchronously) before the async call
      // so even if the component re-renders, we never double-count
      localStorage.setItem(key, '1');
      updateDoc(doc(db, 'listings', listing.id), { clicks: increment(1) })
        .catch((err) => {
          // If Firestore fails, remove the localStorage flag so it can retry next visit
          localStorage.removeItem(key);
          console.error(err);
        });
    }
  }, [slug, listing?.id]); // Safely track when listing.id becomes available

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-gray-500 uppercase tracking-widest animate-pulse">Loading Billboard...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 text-white">
        <div className="font-black text-6xl">404</div>
        <div className="font-mono text-gray-400 uppercase tracking-widest">Billboard Not Found</div>
        <Link to="/" className="font-mono text-xs uppercase tracking-widest border border-[#333] px-6 py-3 hover:border-white transition-colors">
          ← Back to Board
        </Link>
      </div>
    );
  }

  const timeHeld = Date.now() - listing.purchasedAt;
  const hoursHeld = Math.floor(timeHeld / 3600000);
  const daysHeld = Math.floor(hoursHeld / 24);
  const holdStr = daysHeld > 0 ? `${daysHeld}d ${hoursHeld % 24}h` : `${hoursHeld}h`;

  return (
    <div className={`w-full bg-black text-white flex flex-col lg:flex-row transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 lg:fixed lg:top-24 lg:left-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/20 flex items-center gap-2 font-mono text-xs uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Left Column: Media & Title (Sticky on Desktop) */}
      <div className="hologram-left relative w-full lg:w-[60%] h-[45vh] lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] bg-[#050505] border-b lg:border-b-0 lg:border-r border-[#333] flex flex-col justify-end p-6 lg:p-16 overflow-hidden">
        {listing.bgImageUrl && (
          <img
            src={listing.bgImageUrl}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover brightness-50 transition-all duration-1000 ${visible ? 'scale-100 opacity-60' : 'scale-110 opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className={`relative z-10 transition-all duration-700 delay-100 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <img
            src={getFaviconUrl(listing.url)}
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

      {/* Right Column: Data & Action (Normal flow) */}
      <div className="relative w-full lg:w-[40%] bg-black flex flex-col">
        <div className="flex-1 p-6 lg:p-12 flex flex-col gap-6 lg:gap-10 pt-16 lg:pt-12">

          <div className={`transition-all duration-700 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-red-500 font-mono text-[10px] lg:text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
              Threat Level
            </div>
            <div className="text-3xl lg:text-6xl font-black uppercase tracking-tighter">Rank #{listing.rank}</div>
          </div>

          <div className="h-px w-full bg-[#222]" />

          <div className={`transition-all duration-700 delay-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="text-gray-500 font-mono text-[10px] lg:text-xs uppercase tracking-widest mb-3">Directive</div>
            <p className="text-base lg:text-xl text-gray-300 font-mono leading-relaxed border-l-2 border-red-500 pl-4 bg-[#0a0a0a] p-4">
              "{listing.description}"
            </p>
          </div>

          <div className="h-px w-full bg-[#222]" />

          <div className={`grid grid-cols-2 gap-4 lg:gap-6 transition-all duration-700 delay-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-[#050505] p-4 border border-[#222]">
              <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap size={12} className="text-red-500" /> Power</div>
              <div className="text-2xl lg:text-3xl font-black">{formatMoney(listing.currentPrice)}</div>
            </div>
            <div className="bg-[#050505] p-4 border border-[#222]">
              <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Eye size={12} className="text-red-500" /> Eyes</div>
              <div className="text-2xl lg:text-3xl font-black">{(listing.clicks || 0).toLocaleString()}</div>
            </div>
            <div className="bg-[#050505] p-4 border border-[#222]">
              <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={12} className="text-red-500" /> Hold</div>
              <div className="text-2xl lg:text-3xl font-black">{holdStr}</div>
            </div>
            <div className="bg-[#050505] p-4 border border-[#222]">
              <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2">Category</div>
              <div className="text-lg lg:text-xl font-black uppercase truncate">{listing.category}</div>
            </div>
          </div>
        </div>

        {/* Sticky Takeover CTA */}
        <div className={`sticky bottom-0 w-full p-4 lg:p-8 footer-glass backdrop-blur-md border-t border-[#333] transition-all duration-700 delay-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <Link
            to="/"
            state={{ takeoverListing: listing }}
            className="w-full py-5 lg:py-8 bg-red-600 hover:bg-white text-white hover:text-black transition-all flex flex-col items-center justify-center gap-2 border border-red-500 hover:border-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] brutalist-hover group block text-center"
          >
            <span className="font-black text-xl lg:text-3xl uppercase tracking-tighter">Takeover Billboard</span>
            <span className="font-mono text-[10px] lg:text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100">{formatMoney(listing.currentPrice + 1)}+ Required</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
