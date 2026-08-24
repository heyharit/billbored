export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTimeAgo(timestamp: number): string {
  const diffInSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  
  if (diffInSeconds < 60) return 'JUST NOW';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}M AGO`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}H AGO`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}D AGO`;
}

// Calculate payouts based on arbitrary new bid
export function calculatePayouts(oldPrice: number, newBid: number) {
  const markup = newBid - oldPrice;
  const ownerPayout = oldPrice + (markup * 0.5); // Owner gets original back + 50% of markup
  const platformFee = markup * 0.5;              // Platform takes 50% of markup
  const profit = markup * 0.5;                   // The profit the owner made
  return { ownerPayout, platformFee, profit };
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (e) {
    return '';
  }
}
