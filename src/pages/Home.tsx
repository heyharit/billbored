import { useState } from 'react';
import { BrutalistPodium } from '../components/BrutalistPodium';
import { LeaderboardEntry } from '../components/LeaderboardEntry';
import { LatestActivity } from '../components/LatestActivity';
import { BuyoutModal } from '../components/BuyoutModal';
import type { Listing, ActivityItem, SiteStats } from '../types';
import { formatMoney } from '../utils';
import { useListings } from '../hooks/useListings';

const INITIAL_ACTIVITIES: ActivityItem[] = [];

export const Home = () => {
  const { listings: sortedListings } = useListings();
  const [activities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isNewSpotModalOpen, setIsNewSpotModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only display the Top 99 Elite
  const top99Listings = sortedListings.slice(0, 99);

  const stats: SiteStats = {
    totalVolume: sortedListings.reduce((sum, l) => sum + l.currentPrice, 0),
    totalProfitGenerated: 0,
    activePositions: sortedListings.length,
    highestBuyout: sortedListings[0]?.currentPrice || 0,
    launchDate: 'OCTOBER 2024'
  };

  // Helper to load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyoutSubmit = async (data: { url: string, displayName: string, description: string, category: string, bidAmount: number, bgImageUrl: string, editCode: string, editId: string, upgradeId?: string }) => {
    setIsSubmitting(true);
    const API_URL = import.meta.env.VITE_API_URL || '';

    try {
      // ── FREE DETAILS UPDATE (no payment needed)
      if (data.bidAmount === 0 && data.upgradeId) {
        const response = await fetch(`${API_URL}/api/update-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            upgradeId: data.upgradeId,
            editId: data.editId,
            editCode: data.editCode,
            url: data.url,
            displayName: data.displayName,
            description: data.description,
            category: data.category,
            bgImageUrl: data.bgImageUrl,
          }),
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to update details');
        }
        alert('Details updated successfully!');
        setIsNewSpotModalOpen(false);
        setSelectedListing(null);
        return;
      }

      // ── PAID PLACEMENT or UPGRADE (Razorpay)
      const res = await loadRazorpayScript();
      if (!res) throw new Error('Razorpay SDK failed to load. Check your connection.');
      
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Razorpay order');
      }

      const { orderId, amount, currency } = await response.json();
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', 
        amount: amount.toString(),
        currency: currency,
        name: 'BillboredX',
        description: data.upgradeId ? `Power Upgrade: +$${data.bidAmount}` : `Takeover Billboard: ${data.displayName}`,
        order_id: orderId,
        handler: function () {
          alert('Payment Successful! Your billboard is updating...');
          setIsNewSpotModalOpen(false);
          setSelectedListing(null);
        },
        prefill: { name: 'Takeover Bidder' },
        theme: { color: '#DC2626' },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (e: any) {
      console.error('Checkout error:', e);
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-8">
      
      {/* Massive Brutalist Podium for Top 3 Spots */}
      {top99Listings.length > 0 && (
        <BrutalistPodium 
          topListings={top99Listings.slice(0, 3)} 
          onStealClick={setSelectedListing} 
        />
      )}

      {/* Top Header / Manifesto */}
      <div className="mb-12 border-l-4 border-white pl-6 py-2 mt-8">
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
          The Digital <br/><span className="text-red-600">Times Square</span>
        </h1>
        <p className="text-gray-400 max-w-2xl text-sm sm:text-base font-mono uppercase leading-relaxed mt-4">
          The first digital billboard functioning as a status credit system. 
          Buy a space. Get pushed down? Upgrade your spot later by paying only the difference.
          No sunk costs. Just pure financial competition. 
          <span className="block mt-2 font-bold text-white">Reserved strictly for the Top 99 brands globally.</span>
        </p>
      </div>

      {/* Global Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#333] border border-[#333] mb-12">
        <div className="bg-black p-4 md:p-6 flex flex-col gap-1">
          <span className="text-gray-500 font-mono text-[10px] uppercase">Total System Value</span>
          <span className="text-white font-black text-2xl md:text-3xl font-mono">{formatMoney(stats.totalVolume)}</span>
        </div>
        <div className="bg-black p-4 md:p-6 flex flex-col gap-1">
          <span className="text-gray-500 font-mono text-[10px] uppercase">Elite Spots Remaining</span>
          <span className="text-green-500 font-black text-2xl md:text-3xl font-mono">{Math.max(0, 99 - stats.activePositions)}</span>
        </div>
        <div className="bg-black p-4 md:p-6 flex flex-col gap-1">
          <span className="text-gray-500 font-mono text-[10px] uppercase">Highest Power Level</span>
          <span className="text-white font-black text-2xl md:text-3xl font-mono">{formatMoney(stats.highestBuyout)}</span>
        </div>
        <div className="bg-black p-4 md:p-6 flex flex-col gap-1">
          <span className="text-gray-500 font-mono text-[10px] uppercase">Total Listed Brands</span>
          <span className="text-white font-black text-2xl md:text-3xl font-mono">{stats.activePositions}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: The Board (Rank 4+) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="border-b border-[#333] pb-2 mb-2 flex justify-between items-end">
            <h2 className="text-2xl font-black uppercase tracking-tighter">The Board</h2>
            <span className="text-gray-500 font-mono text-xs uppercase">Ranks 4-{top99Listings.length}</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {top99Listings.slice(3).map(listing => (
              <LeaderboardEntry 
                key={listing.id} 
                listing={listing} 
                onBuyout={setSelectedListing} 
              />
            ))}
            
            {top99Listings.length <= 3 && (
              <div className="p-8 border border-[#333] text-center font-mono text-gray-500 text-sm uppercase">
                No lower ranks yet. Claim Rank #4 for $1.
              </div>
            )}
            
            {/* Buy New Spot Button */}
            <button
              onClick={() => setIsNewSpotModalOpen(true)}
              className="mt-4 p-6 border-2 border-dashed border-[#333] hover:border-white text-gray-500 hover:text-white font-black uppercase text-xl transition-colors brutalist-hover flex flex-col items-center justify-center gap-2"
            >
              <span>+ Claim New Position Rank #{top99Listings.length + 1}</span>
              <span className="text-sm font-mono text-green-500">Starting at $1</span>
            </button>
          </div>
        </div>

        {/* Right: Tape */}
        <div className="lg:col-span-1">
          <LatestActivity activities={activities} />
        </div>
      </div>

      <BuyoutModal 
        isOpen={!!selectedListing || isNewSpotModalOpen}
        isNewPosition={isNewSpotModalOpen}
        targetListing={selectedListing}
        allListings={sortedListings}
        onClose={() => {
          setSelectedListing(null);
          setIsNewSpotModalOpen(false);
        }}
        onSubmit={handleBuyoutSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Home;
