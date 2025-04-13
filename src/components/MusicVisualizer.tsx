
import React, { useEffect, useRef } from 'react';

interface MusicVisualizerProps {
  isPlaying: boolean;
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying }) => {
  const barCount = 24;
  const minHeight = 5;
  const maxHeight = 50;
  
  // Create an array of bars with random heights that we'll animate
  const generateRandomHeights = () => {
    return Array.from({ length: barCount }, () => 
      Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight
    );
  };
  
  const [heights, setHeights] = React.useState(generateRandomHeights());
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isPlaying) {
      const updateBars = () => {
        setHeights(generateRandomHeights());
        animationRef.current = requestAnimationFrame(updateBars);
      };
      
      // Update less frequently for a smoother effect
      const interval = setInterval(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(updateBars);
      }, 200);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearInterval(interval);
      };
    }
  }, [isPlaying]);
  
  return (
    <div className={`flex items-end justify-center h-16 w-full transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}>
      {heights.map((height, index) => (
        <div 
          key={index}
          className="visualizer-bar"
          style={{ 
            height: `${height}px`, 
            animationDelay: `${index * 0.05}s`,
            animationPlayState: isPlaying ? 'running' : 'paused'
          }}
        />
      ))}
    </div>
  );
};

export default MusicVisualizer;
