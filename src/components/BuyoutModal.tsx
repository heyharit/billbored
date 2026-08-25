import { useState, useEffect, useMemo } from 'react';
import { X, Image as ImageIcon, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Listing } from '../types';
import { CATEGORIES } from '../types';
import { formatMoney, getFaviconUrl } from '../utils';

interface Props {
  targetListing: Listing | null;
  isOpen: boolean;
  isNewPosition?: boolean;
  allListings: Listing[];
  onClose: () => void;
  onSubmit: (data: { url: string, displayName: string, description: string, category: string, bidAmount: number, bgImageUrl: string, editCode: string, editId: string, upgradeId?: string }) => void;
  isSubmitting: boolean;
}

// Normalize URL for comparison: lowercase, strip trailing slash, strip www
const normalizeUrl = (raw: string) => {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, '').toLowerCase();
  } catch {
    return raw.toLowerCase().replace(/\/$/, '');
  }
};

const getDomain = (raw: string) => {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return raw.split('/')[0].toLowerCase().replace(/^www\./, '');
  }
};

type Mode = 'new' | 'upgrade-pay' | 'upgrade-details';

export const BuyoutModal: React.FC<Props> = ({ targetListing, isOpen, isNewPosition, allListings, onClose, onSubmit, isSubmitting }) => {
  const [mode, setMode] = useState<Mode>('new');
  const [url, setUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editId, setEditId] = useState('');
  const [wantsEditCode, setWantsEditCode] = useState(false);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);

  // For upgrade-details mode: secret code lookup
  const [upgradeCode, setUpgradeCode] = useState('');
  const [upgradeIdentifier, setUpgradeIdentifier] = useState('');

  // For upgrade-pay mode: just use URL
  const [upgradeUrl, setUpgradeUrl] = useState('');

  // Extra amount to ADD to currentPrice when paying to move up
  const [extraAmount, setExtraAmount] = useState<string>('1');

  const minBid = isNewPosition ? 1 : (targetListing ? targetListing.currentPrice + 1 : 1);

  // Find listing by URL for "Pay to Move Up" — normalized comparison
  const listingByUrl = useMemo(() => {
    if (!upgradeUrl) return null;
    return allListings.find(l => normalizeUrl(l.url) === normalizeUrl(upgradeUrl)) || null;
  }, [upgradeUrl, allListings]);

  // Find listing by editId + editCode pair for "Edit Details"
  const foundListing = useMemo(() => {
    if (!upgradeIdentifier || !upgradeCode) return null;
    return allListings.find(l => l.editId === upgradeIdentifier && l.editCode === upgradeCode) || null;
  }, [upgradeIdentifier, upgradeCode, allListings]);

  // Detect if URL is already listed (for new placements) — normalized comparison
  const urlAlreadyListed = useMemo(() => {
    if (!url || mode !== 'new') return null;
    return allListings.find(l => normalizeUrl(l.url) === normalizeUrl(url)) || null;
  }, [url, mode, allListings]);

  // Detect if the root domain is already listed (if they are typing a subpath)
  const domainAlreadyListed = useMemo(() => {
    if (!url || mode !== 'new' || urlAlreadyListed) return null;
    const typedDomain = getDomain(url);
    if (!typedDomain) return null;
    return allListings.find(l => getDomain(l.url) === typedDomain) || null;
  }, [url, mode, allListings, urlAlreadyListed]);

  // Effective minimum bid when URL already on board: must beat that listing's currentPrice
  const effectiveMinBid = urlAlreadyListed
    ? urlAlreadyListed.currentPrice + 1
    : minBid;

  const [desiredValue, setDesiredValue] = useState<string>(minBid.toString());

  // editId uniqueness check
  const editIdTaken = useMemo(() => {
    if (!editId || !wantsEditCode) return false;
    return allListings.some(l => l.editId === editId);
  }, [editId, wantsEditCode, allListings]);

  useEffect(() => {
    if (isOpen) {
      setMode('new');
      setDesiredValue(minBid.toString());
      setUrl(''); setDisplayName(''); setDescription('');
      setBgImageUrl(''); setEditCode(''); setEditId('');
      setUpgradeCode(''); setUpgradeIdentifier(''); setUpgradeUrl('');
      setWantsEditCode(false); setExtraAmount('1');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, minBid]);

  if (!isOpen) return null;

  const parsedDesiredValue = parseFloat(desiredValue) || 0;
  const isValidNewBid = parsedDesiredValue >= effectiveMinBid;
  const parsedExtra = parseFloat(extraAmount) || 0;
  const isValidExtra = parsedExtra >= 1;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidNewBid || editIdTaken || urlAlreadyListed) return;
    onSubmit({
      url,
      displayName,
      description,
      category,
      bidAmount: parsedDesiredValue,
      bgImageUrl,
      editCode: wantsEditCode ? editCode : '',
      editId: wantsEditCode ? editId : '',
      upgradeId: undefined,
    });
  };

  const handleSubmitUpgradePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingByUrl || !isValidExtra) return;
    // bidAmount = the extra they're paying. Backend ADDS this to currentPrice.
    onSubmit({
      url: listingByUrl.url,
      displayName: listingByUrl.displayName || listingByUrl.title,
      description: listingByUrl.description,
      category: listingByUrl.category,
      bidAmount: parsedExtra,
      bgImageUrl: listingByUrl.bgImageUrl || '',
      editCode: '',
      editId: '',
      upgradeId: listingByUrl.id,
    });
  };

  const handleSubmitUpgradeDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundListing) return;
    // bidAmount = 0 means free details update
    onSubmit({
      url,
      displayName,
      description,
      category,
      bidAmount: 0,
      bgImageUrl,
      editCode: upgradeCode,
      editId: upgradeIdentifier,
      upgradeId: foundListing.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black border-2 border-white relative shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="border-b-2 border-white p-4 shrink-0 flex justify-between items-center bg-white text-black z-10">
          <h2 className="font-black text-lg sm:text-xl tracking-tighter uppercase truncate pr-4">
            {isNewPosition ? 'Claim Spot' : `Takeover Rank #${targetListing?.rank}`}
          </h2>
          <button onClick={onClose} className="hover:text-red-600 transition-colors shrink-0">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">

          {/* Mode Tabs */}
          <div className="flex border border-[#333] p-1 bg-[#050505] mb-6">
            <button type="button" onClick={() => setMode('new')}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${mode === 'new' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
              New Placement
            </button>
            <button type="button" onClick={() => setMode('upgrade-pay')}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${mode === 'upgrade-pay' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
              Pay To Move Up
            </button>
            <button type="button" onClick={() => setMode('upgrade-details')}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase transition-colors ${mode === 'upgrade-details' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
              Edit Details
            </button>
          </div>

          {/* ─── NEW PLACEMENT ─── */}
          {mode === 'new' && (
            <form onSubmit={handleSubmitNew} className="space-y-5">
              
              {/* Target URL is first so we can check if it exists immediately */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Target URL</label>
                <div className="relative">
                  <input type="url" required value={url} onChange={e => setUrl(e.target.value)}
                    placeholder="https://your-site.com"
                    className="w-full bg-transparent border border-[#333] p-3 pl-10 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                  {url && <img src={getFaviconUrl(url)} alt="" className="absolute left-3 top-3 w-4 h-4" />}
                </div>
              </div>

              {urlAlreadyListed ? (
                <div className="border border-yellow-500 bg-yellow-500/10 p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="text-yellow-400 font-mono text-sm uppercase">
                    ⚡ This exact URL is already on the board (Rank #{urlAlreadyListed.rank})
                  </div>
                  <div className="flex gap-4 w-full">
                    <button
                      type="button"
                      onClick={() => { setMode('upgrade-pay'); setUpgradeUrl(url); }}
                      className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-sm transition-colors"
                    >
                      Pay to Move Up
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('upgrade-details'); }}
                      className="flex-1 py-3 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 font-black uppercase text-sm transition-colors"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Domain Subpath Warning */}
                  {domainAlreadyListed && (
                    <div className="border border-blue-500 bg-blue-500/10 p-4 font-mono text-xs text-blue-400 uppercase mt-4 mb-2 animate-in fade-in duration-300">
                      ℹ️ A different page from this domain is already listed:<br/>
                      <span className="font-bold text-white mt-1 block">{domainAlreadyListed.url}</span>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button type="button" onClick={() => { setMode('upgrade-pay'); setUpgradeUrl(domainAlreadyListed.url); }} className="px-3 py-1.5 bg-blue-500 text-black font-bold hover:bg-blue-400 transition-colors">Boost Existing</button>
                        <button type="button" onClick={() => { setMode('upgrade-details'); }} className="px-3 py-1.5 border border-blue-500 text-blue-400 hover:bg-blue-500/20 transition-colors">Edit Existing</button>
                        <span className="text-gray-500 hidden sm:inline">OR CONTINUE BELOW ↓</span>
                      </div>
                    </div>
                  )}

                  {/* Bid Amount */}
                  <div className="border border-[#333] p-4 bg-[#0a0a0a]">
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2 font-mono">
                      Desired Power Level (Total Value ${effectiveMinBid}+ min)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-white font-bold">$</span>
                      <input type="number" min={effectiveMinBid} step="1" required
                        value={desiredValue} onChange={e => setDesiredValue(e.target.value)}
                        className="w-full bg-transparent text-3xl font-black text-white focus:outline-none placeholder-gray-700" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Display Name</label>
                    <input type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. NeuralFlow AI"
                      className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex justify-between">
                      <span>Elevator Pitch</span><span>{description.length}/140</span>
                    </label>
                    <textarea required maxLength={140} rows={2} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Why should people click? Make it punchy."
                      className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm resize-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full bg-black border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm uppercase cursor-pointer">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Background Image URL (Optional)
                      </label>
                      <input type="url" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                    </div>
                  </div>

                  {/* Optional Edit Code Section */}
                  <div className="border border-[#333] p-4 bg-[#050505]">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={wantsEditCode} onChange={e => setWantsEditCode(e.target.checked)}
                        className="w-4 h-4 accent-red-600" />
                      <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-1">
                        <Key className="w-3 h-3" /> Set a secret edit code (optional — required to edit later)
                      </span>
                    </label>

                    {wantsEditCode && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 font-mono">
                            Unique Identifier (hidden username)
                          </label>
                          <div className="relative">
                            <input type="text" required={wantsEditCode} value={editId} onChange={e => setEditId(e.target.value)}
                              placeholder="e.g. mycompany2024"
                              className={`w-full bg-transparent border p-3 pr-8 text-white focus:outline-none transition-colors font-mono text-sm ${editIdTaken ? 'border-red-500' : editId ? 'border-green-500' : 'border-[#333]'}`} />
                            {editId && (
                              <span className="absolute right-3 top-3">
                                {editIdTaken ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                              </span>
                            )}
                          </div>
                          {editIdTaken && <p className="text-[9px] text-red-400 mt-1 uppercase">This identifier is already taken.</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 font-mono">Secret Password</label>
                          <input type="password" required={wantsEditCode} value={editCode} onChange={e => setEditCode(e.target.value)}
                            placeholder="Enter a secret password"
                            className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                        </div>
                        <p className="col-span-full text-[9px] text-gray-600 uppercase">Save both. You need BOTH to edit your listing later. We don't store these in plain text.</p>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={isSubmitting || !isValidNewBid || editIdTaken || !!urlAlreadyListed || (wantsEditCode && (!editId || !editCode))}
                    className="w-full mt-2 py-4 brutalist-button text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'PROCESSING...' : `PAY ${formatMoney(parsedDesiredValue)} VIA RAZORPAY`}
                  </button>
                </>
              )}
            </form>
          )}

          {/* ─── UPGRADE: PAY TO MOVE UP ─── */}
          {mode === 'upgrade-pay' && (
            <form onSubmit={handleSubmitUpgradePay} className="space-y-5">
              <p className="text-gray-400 font-mono text-xs uppercase">Enter your website URL to find your listing, then pay any amount to boost your power level and move up the board.</p>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Your Website URL</label>
                <div className="relative">
                  <input type="url" value={upgradeUrl} onChange={e => setUpgradeUrl(e.target.value)}
                    placeholder="https://your-site.com"
                    className="w-full bg-transparent border border-[#333] p-3 pl-10 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                  {upgradeUrl && <img src={getFaviconUrl(upgradeUrl)} alt="" className="absolute left-3 top-3 w-4 h-4" />}
                </div>
              </div>

              {upgradeUrl && (
                <div className={`border p-3 font-mono text-xs uppercase ${listingByUrl ? 'border-green-500 bg-green-900/10 text-green-400' : 'border-red-500/30 bg-red-900/10 text-red-400'}`}>
                  {listingByUrl ? `✓ Found: ${listingByUrl.displayName || listingByUrl.title} — Rank #${listingByUrl.rank} — Current Power: ${formatMoney(listingByUrl.currentPrice)}` : '✗ No listing found for this URL.'}
                </div>
              )}

              {listingByUrl && (
                <div className="border border-[#333] p-4 bg-[#0a0a0a]">
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 font-mono">
                    Amount to Add to Power Level ($1 min)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-white font-bold">+$</span>
                    <input type="number" min={1} step="1" required
                      value={extraAmount} onChange={e => setExtraAmount(e.target.value)}
                      className="w-full bg-transparent text-3xl font-black text-white focus:outline-none" />
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-2 uppercase">
                    New power level will be: {formatMoney((listingByUrl.currentPrice || 0) + parsedExtra)}
                  </div>
                </div>
              )}

              <button type="submit" disabled={isSubmitting || !listingByUrl || !isValidExtra}
                className="w-full mt-2 py-4 brutalist-button text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'PROCESSING...' : `PAY +${formatMoney(parsedExtra)} VIA RAZORPAY`}
              </button>
            </form>
          )}

          {/* ─── UPGRADE: EDIT DETAILS (FREE) ─── */}
          {mode === 'upgrade-details' && (
            <form onSubmit={handleSubmitUpgradeDetails} className="space-y-5">
              <p className="text-gray-400 font-mono text-xs uppercase">Update your listing's details for free. No payment required. Requires your secret identifier + password.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Your Unique Identifier</label>
                  <input type="text" value={upgradeIdentifier} onChange={e => setUpgradeIdentifier(e.target.value)}
                    placeholder="e.g. mycompany2024"
                    className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Secret Password</label>
                  <input type="password" value={upgradeCode} onChange={e => setUpgradeCode(e.target.value)}
                    placeholder="Your secret password"
                    className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                </div>
              </div>

              {upgradeIdentifier && upgradeCode && (
                <div className={`border p-3 font-mono text-xs uppercase ${foundListing ? 'border-green-500 bg-green-900/10 text-green-400' : 'border-red-500/30 bg-red-900/10 text-red-400'}`}>
                  {foundListing ? `✓ Found: ${foundListing.displayName || foundListing.title}` : '✗ No listing found with these credentials.'}
                </div>
              )}

              {foundListing && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Target URL</label>
                      <div className="relative">
                        <input type="url" required value={url} onChange={e => setUrl(e.target.value)}
                          placeholder={foundListing.url}
                          className="w-full bg-transparent border border-[#333] p-3 pl-10 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                        {url && <img src={getFaviconUrl(url)} alt="" className="absolute left-3 top-3 w-4 h-4" />}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Display Name</label>
                      <input type="text" required value={displayName} onChange={e => setDisplayName(e.target.value)}
                        placeholder={foundListing.displayName}
                        className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex justify-between">
                      <span>Elevator Pitch</span><span>{description.length}/140</span>
                    </label>
                    <textarea required maxLength={140} rows={2} value={description} onChange={e => setDescription(e.target.value)}
                      placeholder={foundListing.description}
                      className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full bg-black border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm uppercase cursor-pointer">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 font-mono flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Background Image URL
                      </label>
                      <input type="url" value={bgImageUrl} onChange={e => setBgImageUrl(e.target.value)}
                        placeholder={foundListing.bgImageUrl || 'https://...'}
                        className="w-full bg-transparent border border-[#333] p-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm" />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" disabled={isSubmitting || !foundListing}
                className="w-full mt-2 py-4 brutalist-button text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'SAVING...' : 'UPDATE DETAILS (FREE)'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
