
import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';

interface VinylRecordProps {
  isPlaying: boolean;
  onTrackChange: boolean;
  title: string;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ isPlaying, onTrackChange, title }) => {
  const [animateChange, setAnimateChange] = useState(false);
  
  // Handle track change animation
  useEffect(() => {
    if (onTrackChange) {
      setAnimateChange(true);
      const timer = setTimeout(() => {
        setAnimateChange(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [onTrackChange]);

  return (
    <div className="relative w-64 h-64 flex-shrink-0">
      {/* Vinyl record animation container */}
      <div 
        className={`record-container absolute inset-0 ${animateChange ? 'animate-record-change' : ''}`}
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Record disk */}
        <div 
          className={`absolute inset-0 rounded-full bg-black shadow-lg ${isPlaying ? 'animate-spin-slow' : ''}`}
          style={{ 
            animation: isPlaying ? 'spin-slow 12s linear infinite' : 'none',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Inner vinyl grooves */}
          <div className="absolute inset-4 rounded-full border-4 border-gray-800"></div>
          <div className="absolute inset-8 rounded-full border-2 border-gray-800"></div>
          <div className="absolute inset-12 rounded-full border border-gray-800"></div>
          <div className="absolute inset-16 rounded-full border border-gray-800"></div>
          
          {/* Center label */}
          <div className="absolute rounded-full bg-primary/80 w-16 h-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-inner">
            <p className="text-xs text-center font-bold text-white break-words w-full px-1 overflow-hidden">
              {title.length > 25 ? `${title.slice(0, 25)}...` : title}
            </p>
          </div>
          
          {/* Center hole */}
          <div className="absolute rounded-full bg-black w-2 h-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Record shine overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300/10 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Tonearm */}
      <div 
        className={`absolute top-0 right-0 origin-top-right transition-transform duration-700 ${isPlaying ? 'rotate-25' : 'rotate-0'}`} 
        style={{ width: '120px', height: '20px', transformOrigin: 'right top' }}
      >
        {/* Tonearm base */}
        <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gray-700 shadow-lg"></div>
        
        {/* Tonearm */}
        <div className="absolute top-4 right-4 w-[100px] h-2 bg-gray-600 rounded-full origin-right transform -rotate-12"></div>
        
        {/* Cartridge */}
        <div className="absolute top-1 left-0 w-4 h-6 bg-gray-600 rounded-sm"></div>
        
        {/* Needle */}
        <div className="absolute top-6 left-1 w-0.5 h-3 bg-gray-400"></div>
      </div>
      
      {/* Fallback icon, shown before record is loaded */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0">
        <Music size={84} className="text-primary animate-pulse-glow" />
      </div>
    </div>
  );
};

export default VinylRecord;
