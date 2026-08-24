import { useState, useEffect, useMemo } from 'react';
import { X, Image as ImageIcon, Key } from 'lucide-react';
import type { Listing } from '../types';
import { CATEGORIES } from '../types';
import { formatMoney, getFaviconUrl } from '../utils';

interface Props {
  targetListing: Listing | null;
  isOpen: boolean;
  isNewPosition?: boolean;
  allListings: Listing[];
  onClose: () => void;
  onSubmit: (data: { url: string, displayName: string, description: string, category: string, bidAmount: number, bgImageUrl: string, editCode: string, upgradeId?: string }) => void;
  isSubmitting: boolean;
}

export const BuyoutModal: React.FC<Props> = ({ targetListing, isOpen, isNewPosition, allListings, onClose, onSubmit, isSubmitting }) => {
  const [url, setUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [editCode, setEditCode] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  // The minimum price they want their spot to be worth.
  // If they target rank #3 which is $500, they want their spot to be worth $501.
  const targetValue = isNewPosition ? 1 : (targetListing ? targetListing.currentPrice + 1 : 1);
  const [desiredValue, setDesiredValue] = useState<string>(targetValue.toString());

  // Find their existing listing if they entered a correct code
  const existingListing = useMemo(() => {
    if (!isUpgrading || !editCode) return null;
    return allListings.find(l => l.editCode === editCode);
  }, [isUpgrading, editCode, allListings]);

  const credit = existingListing ? existingListing.currentPrice : 0;
  const parsedDesiredValue = parseFloat(desiredValue) || 0;
  const isValidValue = parsedDesiredValue >= targetValue;
  
  // The actual new money they have to pay today
  const amountDue = Math.max(1, parsedDesiredValue - credit);

  useEffect(() => {
    if (isOpen) {
      setDesiredValue(targetValue.toString());
      setUrl('');
      setDisplayName('');
      setDescription('');
      setBgImageUrl('');
      setEditCode('');
      setIsUpgrading(false);
      
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, targetValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidValue) {
      onSubmit({ 
        url, 
        displayName, 
        description, 
        category, 
        bidAmount: amountDue, 
        bgImageUrl, 
        editCode: isUpgrading ? editCode : (editCode || `CODE-${Math.random().toString(36).substring(2)}`), 
        upgradeId: existingListing?.id 
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black border-2 border-white relative shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="border-b-2 border-white p-4 shrink-0 flex justify-between items-center bg-white text-black z-10">
          <h2 className="font-black text-lg sm:text-xl tracking-tighter uppercase truncate pr-4">
            {isNewPosition ? 'Claim Spot (Bottom of Board)' : `Overtake Rank #${targetListing?.rank}`}
          </h2>
          <button onClick={onClose} className="hover:text-red-600 transition-colors shrink-0">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Upgrade Toggle */}
            <div className="flex border border-[#333] p-1 bg-[#050505]">
              <button
                type="button"
                onClick={() => setIsUpgrading(false)}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${!isUpgrading ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                New Placement
              </button>
              <button
                type="button"
                onClick={() => setIsUpgrading(true)}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${isUpgrading ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                Upgrade Existing Credit
              </button>
            </div>

            {/* Target Value Input */}
            <div className="border border-[#333] p-4 bg-[#0a0a0a]">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 font-mono">
                Desired Power Level (Total Value)
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl text-white font-bold">$</span>
                <input
                  type="number"
                  min={targetValue}
                  step="1"
                  required
                  value={desiredValue}
                  onChange={e => setDesiredValue(e.target.value)}
                  className="w-full bg-transparent text-3xl font-black text-white focus:outline-none placeholder-gray-700"
                />
              </div>
              
              <div className="text-[10px] text-gray-500 font-mono mt-2 uppercase">
                Minimum value needed for this rank: {formatMoney(targetValue)}
              </div>
            </div>

            {/* Upgrade Secret Code (If Upgrading) */}
            {isUpgrading && (
              <div className="border border-blue-500 p-4 bg-blue-900/10">
                <label className="block text-xs font-bold uppercase text-blue-400 mb-1.5 font-mono flex justify-between">
                  <span>Enter Your Existing Secret Code</span>
                  {existingListing && <span className="text-green-500">Found: {existingListing.displayName || existingListing.title}</span>}
                </label>
                <input
                  type="password"
                  value={editCode}
                  onChange={e => setEditCode(e.target.value)}
                  placeholder="e.g. MY-SECRET-CODE"
                  className="w-full bg-transparent border border-blue-500/30 p-3 text-white focus:border-blue-400 focus:outline-none transition-colors font-mono text-sm"
                />
              </div>
            )}

            {/* Financial Breakdown */}
            <div className="border border-[#333] p-3 font-mono text-sm space-y-2 bg-[#050505]">
              <div className="text-[10px] text-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span>Target Value</span>
                  <span className="text-white">{formatMoney(parsedDesiredValue)}</span>
                </div>
                {isUpgrading && (
                  <div className="flex justify-between text-blue-400">
                    <span>Applied Credit (From Existing Rank)</span>
                    <span>-{formatMoney(credit)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#333] pt-2 font-bold text-xs">
                  <span>NEW CASH DUE TODAY</span>
                  <span className="text-green-500">{formatMoney(amountDue)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Target URL</label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://your-site.com"
                    className="w-full bg-transparent border border-[#333] p-3 pl-10 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm"
                  />
                  {url && (
                    <img src={getFaviconUrl(url)} alt="" className="absolute left-3 top-3 w-4 h-4" />
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="e.g. NeuralFlow AI"
                  className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex justify-between">
                <span>Elevator Pitch</span>
                <span>{description.length}/140</span>
              </label>
              <textarea
                required
                maxLength={140}
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Why should people click? Make it punchy."
                className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-black border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm uppercase cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {!isUpgrading && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex items-center gap-1">
                    <Key className="w-3 h-3" /> Set Secret Edit Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editCode}
                    onChange={e => setEditCode(e.target.value)}
                    placeholder="Enter a secret code"
                    className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm"
                  />
                  <p className="text-[9px] text-gray-600 mt-1 uppercase">Save this code to top-up/edit your spot later.</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Background Image URL (Optional)
              </label>
              <input
                type="url"
                value={bgImageUrl}
                onChange={e => setBgImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm mb-2"
              />
              
              {bgImageUrl && (
                <div 
                  className="w-full h-24 border border-[#333] relative bg-cover bg-center rounded-sm" 
                  style={{ backgroundImage: `url(${bgImageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-white font-mono text-[10px] uppercase font-bold tracking-widest drop-shadow-md border border-white/20 px-2 py-1 bg-black/50">
                      Live Preview (Darkened for text readability)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValidValue || (isUpgrading && !existingListing)}
              className="w-full mt-2 py-4 brutalist-button text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'PROCESSING...' : `PAY ${formatMoney(amountDue)} VIA STRIPE`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
