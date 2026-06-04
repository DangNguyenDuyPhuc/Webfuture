import React from 'react';
import { Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="relative z-20 pl-6 pr-6 py-6">
      <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto backdrop-blur-sm bg-black/10">
        {/* Left Side: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Globe className="text-white" size={24} />
            <span className="text-white font-semibold text-lg">Asme</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</a>
          </div>
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="flex items-center gap-4">
          <button className="text-white text-sm font-medium hover:text-white/80 transition-colors">
            Sign Up
          </button>
          <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};
