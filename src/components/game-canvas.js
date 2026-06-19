import React, { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const { gamePhase, currentMultiplier, countdown, crashPoint } = useGameStore();
  const animationRef = useRef(null);
  const flightTimeRef = useRef(0);

  // Animate the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    let angle = 0;
    const dots = [];

    const drawGrid = (offset) => {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 40;

      // Draw vertical grid lines scrolling left
      for (let x = offset % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal grid lines scrolling down
      for (let y = (offset * 0.5) % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawPlane = (x, y) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.2 + Math.sin(angle * 5) * 0.05); // Subtle vibration

      // Draw red plane body
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      // Fuselage
      ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing (Main)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(2, -15);
      ctx.lineTo(8, -15);
      ctx.lineTo(2, 0);
      ctx.fill();

      // Wing (Under)
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-10, 12);
      ctx.lineTo(-4, 12);
      ctx.lineTo(2, 0);
      ctx.fill();

      // Tail fin
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-18, -10);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-8, 0);
      ctx.fill();

      // Propeller / Nose cone
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(17, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawSmokeTrail = () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.setLineDash([5, 5]);

      if (dots.length > 1) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        for (let i = 1; i < dots.length; i++) {
          ctx.lineTo(dots[i].x, dots[i].y);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const renderLoop = () => {
      ctx.fillStyle = '#0f172a'; // Deep slate background
      ctx.fillRect(0, 0, width, height);

      angle += 0.02;

      if (gamePhase === 'flying') {
        flightTimeRef.current += 1.5;
        const speed = flightTimeRef.current;

        // Draw grid scrolling to simulate movement
        drawGrid(-speed * 1.5);

        // Calculate parabolic coordinates for the plane
        // Plane starts at bottom-left and flies towards top-right
        const startX = width * 0.1;
        const startY = height * 0.85;
        const endX = width * 0.85;
        const endY = height * 0.2;

        // Progress goes from 0 to 1 based on multiplier
        // Max progress reaches 0.95 to keep the plane visible on screen
        const multiplierProgress = Math.min(0.95, (currentMultiplier - 1) / 10);
        
        // Easing curve for the path
        const currentX = startX + (endX - startX) * multiplierProgress;
        // Parabolic rise
        const currentY = startY - (startY - endY) * Math.sin(multiplierProgress * Math.PI / 2);

        // Add smoke dot
        if (dots.length === 0 || Math.hypot(dots[dots.length - 1].x - currentX, dots[dots.length - 1].y - currentY) > 8) {
          dots.push({ x: currentX, y: currentY });
        }

        // Draw trail and plane
        drawSmokeTrail();
        drawPlane(currentX, currentY);

      } else if (gamePhase === 'crashed') {
        // Plane has flown away / crashed
        drawGrid(0);
        // Show crashed/flew away state
      } else {
        // Countdown / waiting phase
        drawGrid(0);
        flightTimeRef.current = 0;
        dots.length = 0; // Reset dots

        // Draw stationary plane at starting point
        const startX = width * 0.1;
        const startY = height * 0.85;
        drawPlane(startX, startY);
      }

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [gamePhase, currentMultiplier]);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-center items-center">
      {/* Canvas for the game animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating game status overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <AnimatePresence mode="wait">
          {gamePhase === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-700 shadow-xl"
            >
              <div className="flex justify-center items-center gap-3 mb-2">
                {/* Simulated spinning loader */}
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-300 font-medium text-sm">WAITING FOR NEXT ROUND</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">
                START IN <span className="text-red-500 font-mono">{countdown.toFixed(1)}s</span>
              </h3>
              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: countdown, ease: "linear" }}
                  className="h-full bg-red-500"
                />
              </div>
            </motion.div>
          )}

          {gamePhase === 'flying' && (
            <motion.div
              key="flying"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Dynamic rising multiplier display */}
              <h2 className="text-6xl sm:text-7xl font-extrabold font-mono text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {currentMultiplier.toFixed(2)}x
              </h2>
            </motion.div>
          )}

          {gamePhase === 'crashed' && (
            <motion.div
              key="crashed"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center bg-red-950/90 border border-red-800 backdrop-blur px-8 py-5 rounded-2xl shadow-2xl"
            >
              <h3 className="text-red-400 font-bold text-lg tracking-wider mb-1">FLEW AWAY</h3>
              <h2 className="text-5xl font-black font-mono text-red-500">
                {crashPoint.toFixed(2)}x
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Watermark Logo */}
      <div className="absolute top-4 left-4 text-xs font-bold text-slate-700 uppercase tracking-widest select-none pointer-events-none">
        CashJet Aviator Engine
      </div>
    </div>
  );
}
