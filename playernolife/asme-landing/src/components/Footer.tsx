import React from 'react';
import { Instagram, Twitter, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 flex justify-center gap-4 pb-12">
      <button 
        aria-label="Instagram"
        className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
      >
        <Instagram size={20} />
      </button>
      
      <button 
        aria-label="Twitter"
        className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
      >
        <Twitter size={20} />
      </button>
      
      <button 
        aria-label="Website"
        className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
      >
        <Globe size={20} />
      </button>
    </footer>
  );
};
