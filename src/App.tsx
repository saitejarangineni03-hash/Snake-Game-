import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen bg-dark-void text-white font-sans overflow-hidden flex flex-col border-4 border-[#1a1a1f] relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-void-gradient opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="h-16 border-b border-neon-cyan/20 flex items-center justify-between px-8 bg-[#0a0a0f]/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neon-cyan rounded-sm flex items-center justify-center rotate-45 shadow-[0_0_15px_#00f3ff]">
            <div className="w-3 h-3 bg-dark-void rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-neon-cyan">SYNTH-SNAKE <span className="font-light opacity-50">OS</span></h1>
        </div>
        
        <div className="hidden md:flex items-center gap-12 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neon-magenta uppercase tracking-tighter">System Version</span>
            <span className="text-lg leading-tight">V1.0.4</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-right">
            <div className="text-[10px] opacity-40 uppercase">System Status</div>
            <div className="text-xs text-neon-lime">STABLE // 60 FPS</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-6 p-6 relative z-10 overflow-hidden">
        {/* Game Stage */}
        <section className="flex-1 bg-[#0a0a0f] border border-neon-cyan/30 rounded-lg flex items-center justify-center relative shadow-[inset_0_0_40px_rgba(0,243,255,0.05)] overflow-hidden">
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-magenta shadow-[0_0_8px_#ff00ff]"></div>
            <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <SnakeGame />
          </motion.div>

          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
            Geometric Layer // Alpha 08
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-80 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <MusicPlayer />
          </motion.div>
        </aside>
      </main>

      {/* Footer / Status Bar Area is handled by MusicPlayer internal UI for consistency with components but themed */}
    </div>
  );
}
