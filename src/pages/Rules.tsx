export const Rules = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">System Rules</h1>
        <p className="text-xl text-red-600 font-mono uppercase">Read carefully before deploying capital.</p>
      </div>

      <div className="space-y-8 font-mono text-sm leading-relaxed text-gray-300">
        
        <div className="border border-[#333] p-6 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase">1. Minimum Takeover Requirement</h2>
          <p>
            You can claim any NEW position at the bottom of the board for exactly $1. 
            To takeover an existing position, you must bid <span className="text-white font-bold bg-[#333] px-1">at least $1 more</span> than the current price. 
            You can bid as high as you want to defend your billboard from future takeovers.
          </p>
        </div>

        <div className="border border-[#333] p-6 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase">2. Automated Payouts & Profit Split</h2>
          <p>
            When your spot is stolen, payouts are processed automatically via Stripe Connect. 
            You receive <span className="text-white font-bold bg-[#333] px-1">100% of your principal</span> back, PLUS <span className="text-green-500 font-bold bg-green-500/10 px-1">50% of the markup profit</span> (the difference between your price and the new bid). 
            The platform retains the remaining 50% as a fee.
          </p>
        </div>

        <div className="border border-[#333] p-6 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase">3. Content Moderation</h2>
          <p>
            We enforce a strict zero-tolerance policy for:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>NSFW / Adult content</li>
            <li>Illegal services or products</li>
            <li>Malicious links or phishing</li>
          </ul>
          <p className="text-red-500 mt-4">
            If your link violates these terms, it will be removed without a refund, and your position will be burned.
          </p>
        </div>

        <div className="border border-[#333] p-6 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase">4. No Sunk Cost Guarantee</h2>
          <p>
            As long as your link does not violate moderation policies, you will retain your rank until someone buys you out. 
            Once bought out, your payout is mathematically guaranteed by the system logic.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Rules;
