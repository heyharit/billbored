export const About = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">Manifesto</h1>
        <p className="text-xl text-gray-400 font-mono">Traditional advertising is a sunk cost. We fixed it.</p>
      </div>

      <div className="space-y-8 font-mono text-sm sm:text-base leading-relaxed text-gray-300">
        <p>
          Every social network, billboard, and ad network operates on a simple principle: you give them money, they give you attention, and you never see your money again. It's a pure expense.
        </p>
        <p>
          <strong className="text-white">BillboredX turns attention into a tradable asset.</strong>
        </p>
        <p>
          When you buy a rank on our board, you aren't just paying for clicks. You are acquiring prime space in the digital Times Square. And like all premier billboard space, someone else can buy it from you.
        </p>

        <div className="border border-[#333] p-6 bg-[#0a0a0a] space-y-6 my-12">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">The Math is Simple</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-red-500 font-bold">1.</span>
              <span>You buy Rank #1 for $100. Your campaign is now live.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-red-500 font-bold">2.</span>
              <span>Someone really wants Rank #1. They steal it from you by bidding $150 (a $50 markup).</span>
            </div>
            <div className="flex gap-4">
              <span className="text-red-500 font-bold">3.</span>
              <span>The protocol routes $125 back to you (your $100 principal + 50% of the $50 markup). The platform takes the other $25.</span>
            </div>
          </div>
        </div>

        <p>
          You got massive exposure for as long as you held the spot, and you walked away with a profit. 
        </p>
        
        <p className="text-white font-bold uppercase pt-8">
          This is not a static ad network. This is the ultimate digital Times Square. Captivate the world, extract capital, and own the spotlight.
        </p>
      </div>
    </div>
  );
};

export default About;
