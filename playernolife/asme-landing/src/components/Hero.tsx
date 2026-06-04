import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
      {/* Heading */}
      <h1 
        className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Built for the curious
      </h1>

      <div className="max-w-xl w-full space-y-4">
        {/* Email Input Bar */}
        <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 text-base"
          />
          <button className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-all flex items-center justify-center shrink-0">
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-white text-sm leading-relaxed px-4 opacity-80">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </p>

        {/* Manifesto Button */}
        <div className="flex justify-center pt-4">
          <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Our Manifesto
          </button>
        </div>
      </div>
    </main>
  );
};
