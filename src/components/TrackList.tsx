
import React from 'react';
import { Track } from '../data/musicData';
import { formatTime } from './formatTime';
import { Play } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, currentTrackIndex, onTrackSelect }) => {
  return (
    <div className="mt-6 space-y-1 max-h-[400px] overflow-y-auto scrollbar-hidden pr-2">
      {tracks.map((track, index) => (
        <div
          key={index}
          className={`playlist-item ${index === currentTrackIndex ? 'active' : ''} animate-fade-in`}
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => onTrackSelect(index)}
        >
          <div className="w-6 mr-3 text-center">
            {index === currentTrackIndex ? (
              <Play size={16} className="mx-auto" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <div className="flex-grow truncate">{track.name}</div>
          <div className="ml-3 opacity-70">{formatTime(track.duration)}</div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
