
import React from 'react';
import AudioPlayer from '../components/AudioPlayer';
import LandingHero from '../components/LandingHero';
import { playlists } from '../data/musicData';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section with parallax */}
      <LandingHero />
      
      {/* Player section */}
      <div id="player-section" className="py-20 px-4 md:px-8">
        <AudioPlayer playlists={playlists} />
      </div>
      
      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Rhythm Ripple &copy; 2025. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
