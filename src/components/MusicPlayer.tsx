import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "Synthwave AI",
    duration: "03:45",
    color: "magenta"
  },
  {
    id: 2,
    title: "Midnight Pulse",
    artist: "Cybernetic Echoes",
    duration: "02:12",
    color: "magenta"
  },
  {
    id: 3,
    title: "Digital Sunset",
    artist: "Lo-Fi Neural",
    duration: "04:20",
    color: "magenta"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p + 0.5) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex(i => (i + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(i => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="flex-1 bg-[#0a0a0f] border border-neon-magenta/30 rounded-lg p-5 flex flex-col shadow-[0_0_20px_rgba(255,0,255,0.05)]">
      <h3 className="text-[10px] font-mono text-neon-magenta uppercase tracking-[0.3em] mb-4">Media Library</h3>
      
      <div className="space-y-3 flex-grow">
        {TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setProgress(0);
            }}
            className={`p-3 rounded border transition-all cursor-pointer ${
              currentTrackIndex === idx 
                ? 'bg-white/5 border-white/5 border-l-2 border-l-neon-magenta' 
                : 'bg-transparent border-white/5 hover:bg-white/5'
            }`}
          >
            <div className={`text-xs font-semibold ${currentTrackIndex === idx ? 'text-white' : 'text-white/60'}`}>
              {track.title}
            </div>
            <div className="text-[10px] opacity-40 uppercase font-mono">
              {track.artist} • {track.duration}
            </div>
          </div>
        ))}
      </div>

      {/* Visualizer Section */}
      <div className="mt-8 border-t border-white/5 pt-6 space-y-6">
        <div className="h-24 bg-gradient-to-t from-neon-magenta/10 to-transparent rounded-lg border border-white/5 flex items-end p-3 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center gap-[4px] px-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [10, Math.random() * 40 + 20, 10] } : { height: 10 }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                className="w-1.5 bg-neon-magenta opacity-60 shadow-[0_0_10px_#ff00ff]"
              />
            ))}
          </div>
          <span className="text-[9px] font-mono opacity-30 relative z-10 w-full text-center uppercase tracking-widest">Frequency Analysis active</span>
        </div>

        {/* Controls Inline */}
        <div className="space-y-4">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]" 
              animate={{ width: `${progress}%` }}
              transition={{ type: "tween" }}
            />
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <button onClick={handlePrev} className="opacity-50 hover:opacity-100 hover:text-neon-cyan transition-all">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 bg-neon-cyan text-dark-void rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={handleNext} className="opacity-50 hover:opacity-100 hover:text-neon-cyan transition-all">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
