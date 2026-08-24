export const Terms = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 space-y-12 mb-20">
      <div className="space-y-4 border-b-4 border-white pb-8">
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">Terms of Service</h1>
        <p className="text-xl text-gray-400 font-mono">Last Updated: October 2024</p>
      </div>

      <div className="space-y-8 font-mono text-sm sm:text-base leading-relaxed text-gray-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">1. The Game</h2>
          <p>
            BillboredX is a digital real estate market. By purchasing a spot on the leaderboard, you are engaging in a competitive marketplace. Your spot is not guaranteed in perpetuity and can be overtaken by another user at any time if they pay a higher price.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">2. Payments & Credits</h2>
          <p>
            All purchases are final. We do not issue refunds. When you purchase a rank, your payment is converted into "Power" which secures your position. If you are outbid, you retain your Power as a credit, which can be applied to future upgrades. You do not get your cash back.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">3. Content Guidelines</h2>
          <p>
            You are entirely responsible for the URL, Display Name, Image, and Description you post. We reserve the absolute right to terminate, delete, or censor any listing that contains illegal content, extreme obscenity, or violates standard web hosting policies, without refund.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">4. Liability</h2>
          <p>
            BillboredX is provided "as is". We are not responsible for any direct or indirect financial loss you incur by participating in this market, nor are we responsible for the uptime of the websites linked on our board.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
