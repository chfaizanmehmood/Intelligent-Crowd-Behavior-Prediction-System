import React, { useRef, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'pedestrian' | 'staff' | 'alert_source';
  history: { x: number; y: number }[];
  groupId: number;
  label: string;
}

interface CrowdCanvasProps {
  state: 'NORMAL' | 'MODERATE' | 'WARNING' | 'DANGEROUS';
  showBoundingBoxes?: boolean;
  showHeatmap?: boolean;
  showPaths?: boolean;
  showGrid?: boolean;
}

export const CrowdCanvas: React.FC<CrowdCanvasProps> = ({
  state,
  showBoundingBoxes = true,
  showHeatmap = true,
  showPaths = true,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize and adjust particles depending on state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    let particleCount = 28;
    let baseSpeed = 1.0;

    if (state === 'MODERATE') {
      particleCount = 55;
      baseSpeed = 1.5;
    } else if (state === 'WARNING') {
      particleCount = 95;
      baseSpeed = 2.4;
    } else if (state === 'DANGEROUS') {
      particleCount = 150;
      baseSpeed = 3.5;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isDangerous = state === 'DANGEROUS';
      const isWarning = state === 'WARNING';
      
      // Determine flow pathways depending on state
      let vx = (Math.random() - 0.5) * baseSpeed;
      let vy = (Math.random() - 0.5) * baseSpeed;

      // Group vectors to simulate unified group motion
      const groupId = Math.floor(i / 10);
      if (isDangerous) {
        // Chaotic flow - converging on exits or circular vortices
        const angle = Math.random() * Math.PI * 2;
        vx = Math.sin(angle) * baseSpeed * 1.5;
        vy = Math.cos(angle) * baseSpeed * 1.5;
      } else if (isWarning) {
        // Linear rushing toward bottom right/northwest
        vx = (Math.random() * 0.5 - 0.1) * baseSpeed;
        vy = (Math.random() * 0.5 - 0.45) * baseSpeed;
      } else {
        // Gentle walking
        vx = (Math.random() - 0.5) * baseSpeed;
        vy = (Math.random() - 0.5) * baseSpeed;
      }

      particles.push({
        id: i,
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx,
        vy,
        radius: 4,
        type: i % 15 === 0 ? 'staff' : 'pedestrian',
        history: [],
        groupId,
        label: `ID_${String(1000 + i).slice(1)}`
      });
    }

    particlesRef.current = particles;
  }, [state]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas with subtle blueprint gradient
      ctx.fillStyle = '#0b0f1a'; // dark navy background
      ctx.fillRect(0, 0, width, height);

      // 1. Grid lines for a technological overview HUD style
      if (showGrid) {
        ctx.strokeStyle = '#1e293b'; // slate 800
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Draw safe zone / warning zone anchors
      ctx.strokeStyle = state === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.2)' : state === 'WARNING' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(34, 197, 94, 0.1)';
      ctx.fillStyle = state === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(50, 55, width - 100, height - 110);
      ctx.stroke();
      ctx.fill();

      // Label visual boundaries
      ctx.fillStyle = '#64748b'; // slate 500
      ctx.font = '9px monospace';
      ctx.fillText('CAM_01_FEED (LIVE_ANALYTICS)', 15, 20);
      ctx.fillText('DETECT_ZONE_ALPHA', 60, 75);

      // Draw hazard areas / congestion heatmaps
      if (showHeatmap) {
        if (state === 'DANGEROUS') {
          // Heatmap critical zones (Red overlays)
          const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, 120);
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
          grad.addColorStop(0.6, 'rgba(239, 68, 68, 0.15)');
          grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width/2, height/2, 120, 0, Math.PI*2);
          ctx.fill();

          // Highlight text warning
          ctx.strokeStyle = '#ef4444';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(width/2 - 80, 25, 160, 24);
          ctx.stroke();
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.font = '10px "JetBrains Mono"';
          ctx.fillText('⚠️ CRITICAL CRUSH DETECTED', width/2 - 70, 40);
        } else if (state === 'WARNING') {
          // Yellow orange warning zone on left
          const grad = ctx.createRadialGradient(150, 150, 5, 150, 150, 90);
          grad.addColorStop(0, 'rgba(249, 115, 22, 0.35)');
          grad.addColorStop(0.7, 'rgba(249, 115, 22, 0.1)');
          grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(150, 150, 90, 0, Math.PI*2);
          ctx.fill();
        } else if (state === 'MODERATE') {
          // Soft blue purple gathering heatmap
          const grad = ctx.createRadialGradient(width - 150, height - 120, 5, width - 150, height - 120, 70);
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
          grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(width - 150, height - 120, 70, 0, Math.PI*2);
          ctx.fill();
        }
      }

      // Update and Draw particles
      const particles = particlesRef.current;
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 30 || p.x > width - 30) {
          p.vx = -p.vx;
          p.x = p.x < 30 ? 30 : width - 30;
        }
        if (p.y < 35 || p.y > height - 35) {
          p.vy = -p.vy;
          p.y = p.y < 35 ? 35 : height - 35;
        }

        // Add history for movement paths
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 8) {
          p.history.shift();
        }

        // Draw path tail
        if (showPaths && p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let k = 1; k < p.history.length; k++) {
            ctx.lineTo(p.history[k].x, p.history[k].y);
          }
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = state === 'DANGEROUS' 
            ? 'rgba(239, 68, 68, 0.3)' 
            : state === 'WARNING' 
            ? 'rgba(249, 115, 22, 0.25)' 
            : 'rgba(59, 130, 246, 0.2)';
          ctx.stroke();
        }

        // Draw bounding box matching wireframe descriptions
        if (showBoundingBoxes) {
          const size = 18;
          ctx.lineWidth = 1;
          
          if (state === 'DANGEROUS') {
            ctx.strokeStyle = '#ef4444'; // red
            ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
          } else if (state === 'WARNING') {
            ctx.strokeStyle = '#f97316'; // orange
            ctx.fillStyle = 'rgba(249, 115, 22, 0.08)';
          } else if (state === 'MODERATE') {
            ctx.strokeStyle = '#eab308'; // yellow
            ctx.fillStyle = 'rgba(234, 179, 8, 0.05)';
          } else {
            ctx.strokeStyle = '#22c55e'; // green
            ctx.fillStyle = 'rgba(34, 197, 94, 0.05)';
          }

          // Render small bounding box around dot
          ctx.beginPath();
          ctx.rect(p.x - size / 2, p.y - size / 2, size, size);
          ctx.stroke();
          ctx.fill();

          // Tiny corner crosshairs on boxes for high-tech look
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // Top-left
          ctx.moveTo(p.x - size/2, p.y - size/2 + 4);
          ctx.lineTo(p.x - size/2, p.y - size/2);
          ctx.lineTo(p.x - size/2 + 4, p.y - size/2);
          // Bottom-right
          ctx.moveTo(p.x + size/2 - 4, p.y + size/2);
          ctx.lineTo(p.x + size/2, p.y + size/2);
          ctx.lineTo(p.x + size/2, p.y + size/2 - 4);
          ctx.stroke();

          // Render label text ID above bounding box
          ctx.fillStyle = '#94a3b8'; // slate 400
          ctx.font = '7px monospace';
          ctx.fillText(p.label, p.x - size / 2, p.y - size / 2 - 3);
        }

        // Draw Core Node marker (Center Core)
        ctx.fillStyle = state === 'DANGEROUS' 
          ? '#ef4444' 
          : state === 'WARNING' 
          ? '#f97316' 
          : state === 'MODERATE' 
          ? '#3b82f6' 
          : '#22c55e';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type === 'staff' ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add double rings for staff elements
        if (p.type === 'staff') {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Flow direction vector compass helper
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width - 55, 55, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw compass text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px monospace';
      ctx.fillText('N', width - 58, 41);
      ctx.fillText('S', width - 58, 75);
      ctx.fillText('W', width - 75, 58);
      ctx.fillText('E', width - 41, 58);

      // Draw flow vector arrow based on active flow state
      ctx.strokeStyle = state === 'DANGEROUS' ? '#f87171' : state === 'WARNING' ? '#fb923c' : '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width - 55, 55);
      
      let vectorX = -12;
      let vectorY = -12; // NorthWest typically (45 deg pointing top left)
      if (state === 'DANGEROUS') {
        vectorX = (Math.sin(Date.now() / 200) * 12);
        vectorY = (Math.cos(Date.now() / 200) * 12); // Chaotic vector vortex
      } else if (state === 'WARNING') {
        vectorX = 0;
        vectorY = -16; // Strong Northern flow
      } else if (state === 'MODERATE') {
        vectorX = -10;
        vectorY = -10; // NorthWestern flow
      } else {
        vectorX = 8;
        vectorY = -8; // NorthEast slow flow
      }

      ctx.lineTo(width - 55 + vectorX, 55 + vectorY);
      ctx.stroke();

      // Draw arrowhead
      ctx.fillStyle = state === 'DANGEROUS' ? '#f87171' : state === 'WARNING' ? '#fb923c' : '#4ade80';
      ctx.beginPath();
      ctx.arc(width - 55 + vectorX, 55 + vectorY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Overlay status boxes at the baseline
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(15, height - 32, 220, 18);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9.5px monospace';
      const detailInfo = state === 'DANGEROUS'
        ? `FPS: 30 | CROWD: HIGH CONFIDENCE (CRUSH)`
        : state === 'WARNING'
        ? `FPS: 30 | WARNING: ELEVATED THRESHOLD`
        : `FPS: 30 | STATUS: RUNNING (SAFE)`;
      ctx.fillText(detailInfo, 22, height - 19);

      // Recursive loop
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, showBoundingBoxes, showHeatmap, showPaths, showGrid]);

  return (
    <div className="relative border border-navy-800 bg-navy-950 rounded-2xl overflow-hidden shadow-lg">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-navy-950/90 px-2.5 py-1.5 rounded-lg border border-navy-800 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${state === 'DANGEROUS' ? 'bg-red-500' : state === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${state === 'DANGEROUS' ? 'bg-red-500' : state === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
        </span>
        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-300">
          {state} Classification HUD Matrix
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={720}
        height={340}
        className="w-full max-h-[350px] object-cover cursor-crosshair display-block"
      />
    </div>
  );
};
