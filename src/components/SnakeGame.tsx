import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          setIsPaused(false);
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          setIsPaused(false);
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          setIsPaused(false);
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          setIsPaused(false);
          break;
        case ' ': // Space to pause/resume
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* HUD - Integrated into the design flow */}
      <div className="w-full max-w-[480px] flex justify-between items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-tighter text-neon-magenta font-mono font-bold">Score</span>
          <span className="text-2xl font-mono font-bold text-white leading-tight">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-tighter text-neon-cyan font-mono font-bold">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-neon-lime" />
            <span className="text-2xl font-mono font-bold text-white leading-tight">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-[1px] bg-white/5 border border-white/10 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div 
          className="grid bg-[#0a0a0f] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 24px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 24px)`,
            width: '480px',
            height: '480px'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            if (isSnake) {
              return (
                <div 
                  key={i} 
                  className={`w-[22px] h-[22px] m-[1px] rounded-sm transition-all duration-200 ${
                    isHead ? 'bg-neon-lime border-2 border-white/40 shadow-[0_0_20px_#39ff14] z-20' : 
                    'bg-neon-lime shadow-[0_0_10px_#39ff14] z-10'
                  }`}
                />
              );
            }

            if (isFood) {
              return (
                <div 
                  key={i} 
                  className="w-[20px] h-[20px] m-[2px] bg-neon-red rounded-full shadow-[0_0_20px_#ff003c] z-10 animate-pulse" 
                />
              );
            }

            return <div key={i} className="w-[24px] h-[24px]" />;
          })}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]"
            >
              {isGameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-5xl font-black text-neon-red text-glow-red uppercase tracking-tighter">TERMINATED</h2>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 mx-auto px-8 py-3 bg-neon-cyan text-dark-void font-bold rounded-sm hover:scale-105 transition-transform shadow-[0_0_20px_#00f3ff]"
                  >
                    <RefreshCw size={20} />
                    INITIALIZE
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2 border-y border-white/10 py-8 w-full bg-black/40">
                  <h2 className="text-2xl font-bold text-white/80 uppercase tracking-[0.4em] italic">SUSPENDED</h2>
                  <p className="text-[10px] text-neon-cyan uppercase tracking-[0.2em] font-mono">Input Required to Resume</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
        <span>Grid: 20x20</span>
        <div className="w-1 h-1 rounded-full bg-white/20"></div>
        <span>Refresh: 6.6Hz</span>
      </div>
    </div>
  );
}
