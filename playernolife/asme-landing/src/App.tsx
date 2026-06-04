import React from 'react';
import { VideoBackground } from './components/VideoBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Video */}
      <VideoBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Hero Content */}
      <Hero />

      {/* Social Footer */}
      <Footer />
    </div>
  );
}

export default App;
