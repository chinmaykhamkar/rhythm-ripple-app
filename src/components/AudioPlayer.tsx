
import React, { useRef, useState, useEffect } from 'react';
import { Playlist, Track } from '../data/musicData';
import TrackList from './TrackList';
import MusicVisualizer from './MusicVisualizer';
import { formatTime } from './formatTime';
import VinylRecord from './VinylRecord';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Repeat, Shuffle, Music
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

interface AudioPlayerProps {
  playlists: Playlist[];
  initialPlaylistIndex?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  playlists, 
  initialPlaylistIndex = 0 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(playlists[initialPlaylistIndex]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isPlaylistMenuOpen, setIsPlaylistMenuOpen] = useState(false);
  const [trackChangeAnimation, setTrackChangeAnimation] = useState(false);
  
  const currentTrack: Track = currentPlaylist.tracks[currentTrackIndex];

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleSkipForward();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Trigger record change animation
    setTrackChangeAnimation(true);
    setTimeout(() => setTrackChangeAnimation(false), 1000);
    
    audio.src = currentTrack.url;
    audio.load();
    
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }

    setDuration(currentTrack.duration);
    
  }, [currentTrack, currentPlaylist]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented, show a UI element to let the user manually start playback
          toast({
            title: "Playback blocked",
            description: "Please interact with the page to enable audio playback",
            variant: "destructive"
          });
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    let nextIndex;
    
    if (isShuffle) {
      // Get a random track that's not the current one
      const availableIndices = Array.from(
        { length: currentPlaylist.tracks.length }, 
        (_, i) => i
      ).filter(i => i !== currentTrackIndex);
      
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // If we're more than 3 seconds into the song, go back to the start
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    
    // Otherwise go to previous track
    const prevIndex = currentTrackIndex === 0 
      ? currentPlaylist.tracks.length - 1 
      : currentTrackIndex - 1;
    
    setCurrentTrackIndex(prevIndex);
  };

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setIsPlaylistMenuOpen(false);
  };

  const togglePlaylistMenu = () => {
    setIsPlaylistMenuOpen(!isPlaylistMenuOpen);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <audio ref={audioRef} />
      
      {/* Player Header with Cover Art & Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-6 animate-float-up">
        <VinylRecord 
          isPlaying={isPlaying}
          onTrackChange={trackChangeAnimation}
          title={currentTrack.name}
        />
        
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gradient">{currentPlaylist.name}</h2>
            <button 
              onClick={togglePlaylistMenu}
              className="p-2 rounded-lg hover:bg-secondary transition-colors relative"
            >
              <Music size={20} />
              {isPlaylistMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-panel z-10 p-2 rounded-lg animate-fade-in">
                  {playlists.map((playlist, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-secondary/80 rounded cursor-pointer transition-colors"
                      onClick={() => handlePlaylistSelect(playlist)}
                    >
                      {playlist.name}
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
          <p className="text-lg text-muted-foreground mt-1">by {currentPlaylist.artist}</p>
          <p className="text-sm text-muted-foreground">{currentPlaylist.year}</p>
          
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-2 animate-slide-in">
              {currentTrack.name}
            </h3>
            
            <MusicVisualizer isPlaying={isPlaying} />
            
            {/* Progress Bar */}
            <div className="my-4 animate-fade-in">
              <Slider 
                value={[currentTime]} 
                min={0}
                max={duration || 100}
                step={1}
                onValueChange={handleTimeChange}
                className="range-track my-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Player Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 animate-fade-in">
                <button 
                  onClick={toggleShuffle}
                  className={`hover:text-primary transition-colors ${isShuffle ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <Shuffle size={18} />
                </button>
                <button 
                  onClick={handleSkipBack} 
                  className="hover:text-primary transition-colors"
                >
                  <SkipBack size={24} />
                </button>
                <button 
                  onClick={handlePlayPause} 
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors animate-scale-in"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button 
                  onClick={handleSkipForward} 
                  className="hover:text-primary transition-colors"
                >
                  <SkipForward size={24} />
                </button>
                <button 
                  onClick={toggleRepeat}
                  className={`hover:text-primary transition-colors ${isRepeat ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <Repeat size={18} />
                </button>
              </div>
              
              {/* Volume Control */}
              <div className="hidden md:flex items-center space-x-3 animate-fade-in">
                <button onClick={toggleMute} className="text-muted-foreground hover:text-white transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24 range-track"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Track List */}
      <div className="glass-panel p-6 animate-float-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xl font-semibold mb-4">Tracks</h3>
        <TrackList 
          tracks={currentPlaylist.tracks}
          currentTrackIndex={currentTrackIndex}
          onTrackSelect={handleTrackSelect}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
