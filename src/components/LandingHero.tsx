
import React, { useEffect, useRef } from 'react';
import { ChevronDown, Music } from 'lucide-react';

const LandingHero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollPosition = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the section we've scrolled (0 to 1)
      const scrollProgress = Math.min(
        Math.max((scrollPosition - sectionTop + windowHeight) / (sectionHeight + windowHeight), 0),
        1
      );
      
      // Apply parallax effect to background elements
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1);
        if (element instanceof HTMLElement) {
          element.style.transform = `translateY(${scrollProgress * speed * -100}px)`;
          element.style.opacity = `${Math.min(1, 1.5 - scrollProgress)}`;
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToPlayer = () => {
    const playerSection = document.getElementById('player-section');
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div 
      ref={sectionRef}
      className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Background elements */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl parallax"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-primary/20 blur-3xl parallax"></div>
      <div className="absolute top-40 right-1/3 w-20 h-20 rounded-full bg-primary/15 blur-2xl parallax"></div>
      
      {/* Music icon with animation */}
      <div className="mb-10 relative">
        <div className="absolute -inset-10 bg-gradient-radial from-primary/20 to-transparent blur-xl"></div>
        <div className="relative animate-pulse-glow">
          <Music size={80} className="text-primary" />
        </div>
      </div>
      
      {/* Main text */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 animate-float-up">
        <span className="text-gradient">Rhythm Ripple</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-center max-w-2xl text-muted-foreground mb-10 animate-float-up" style={{ animationDelay: '0.2s' }}>
        Immerse yourself in seamless audio experiences with our elegant music player
      </p>
      
      {/* Scroll indicator */}
      <button 
        onClick={scrollToPlayer}
        className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors animate-float-up"
        style={{ animationDelay: '0.4s' }}
      >
        <span className="mb-2">Explore</span>
        <ChevronDown size={24} className="animate-bounce" />
      </button>
    </div>
  );
};

export default LandingHero;
