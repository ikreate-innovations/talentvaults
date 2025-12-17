'use client';

export default function NewsletterForm() {
  const handleSubscribe = () => {
    alert('Newsletter subscription coming soon!');
  };

  return (
    <div className="mt-4 flex w-full max-w-md flex-col items-center gap-4 sm:flex-row">
      <input 
        className="h-12 w-full flex-grow rounded-lg border-white/40 bg-white/10 px-4 text-white placeholder-slate-300 focus:border-white focus:ring-white" 
        placeholder="your.email@example.com" 
        type="email" 
      />
      <button 
        onClick={handleSubscribe}
        className="flex w-full min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 transition-colors sm:w-auto whitespace-nowrap"
      >
        <span>Subscribe Now</span>
      </button>
    </div>
  );
}