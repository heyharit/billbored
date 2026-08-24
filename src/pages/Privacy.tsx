export const Privacy = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 space-y-12 mb-20">
      <div className="space-y-4 border-b-4 border-white pb-8">
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white">Privacy Policy</h1>
        <p className="text-xl text-gray-400 font-mono">Last Updated: October 2024</p>
      </div>

      <div className="space-y-8 font-mono text-sm sm:text-base leading-relaxed text-gray-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">1. Data Collection</h2>
          <p>
            BillboredX collects minimal personal information. We store the URLs, names, descriptions, and images you explicitly submit to the board. We also process payments via our payment providers (e.g., Stripe), who handle your financial data securely. We do not store your credit card numbers on our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">2. Usage Data</h2>
          <p>
            We collect basic analytics and click data (such as impressions and clicks on your billboard link) to display on the board and improve our service. This data is public by the nature of the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">3. Cookies</h2>
          <p>
            We use essential cookies to maintain your session state and save your theme preferences (Light/Dark mode). We do not use intrusive third-party tracking cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-white tracking-widest">4. Third Parties</h2>
          <p>
            We do not sell your personal data to third parties. Information explicitly published to the leaderboard is, by definition, public and may be scraped or viewed by anyone on the internet.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
