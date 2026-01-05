
import React, { useEffect, useState, useMemo } from 'react';
import { DrinkState, GlassType, ActionType, Ingredient } from '../types';
import { GLASS_VOLUMES } from '../constants';

interface GlassSimulatorProps {
  drinkState: DrinkState;
  currentAction: ActionType | null;
  currentIngredient?: Ingredient | null;
}

const GlassSimulator: React.FC<GlassSimulatorProps> = ({ drinkState, currentAction, currentIngredient }) => {
  const { glass, layers, isMixed, mixedColor, currentVolume, ice, garnish } = drinkState;
  const maxVol = GLASS_VOLUMES[glass];

  // Animation states
  const [isPouring, setIsPouring] = useState(false);
  const [pourColor, setPourColor] = useState('#ffffff');
  const [surfaceWobble, setSurfaceWobble] = useState(0);
  const [isIceDropping, setIsIceDropping] = useState(false);
  const [isSwirlActive, setIsSwirlActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [newGarnishId, setNewGarnishId] = useState<string | null>(null);
  const [shakeBubbles, setShakeBubbles] = useState<Array<{ id: number, x: number, y: number, size: number, delay: number }>>([]);

  // Trigger animations on action
  useEffect(() => {
    if (currentAction === ActionType.POUR) {
      const lastLayer = layers[layers.length - 1];
      if (lastLayer) setPourColor(lastLayer.color);
      setIsPouring(true);

      // Wobble effect
      setSurfaceWobble(1);
      const wobbleInterval = setInterval(() => {
        setSurfaceWobble(prev => prev * -0.8); // Decay wobble
      }, 100);

      const timer = setTimeout(() => {
        setIsPouring(false);
        clearInterval(wobbleInterval);
        setSurfaceWobble(0);
      }, 1000);

      return () => { clearTimeout(timer); clearInterval(wobbleInterval); };
    }

    if (currentAction === ActionType.ADD_ICE) {
      setIsIceDropping(true);
      setSurfaceWobble(3);
      const timer = setTimeout(() => {
        setIsIceDropping(false);
        setSurfaceWobble(0);
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (currentAction === ActionType.STIR) {
      setIsSwirlActive(true);
      setSurfaceWobble(2);
      const timer = setTimeout(() => {
        setIsSwirlActive(false);
        setSurfaceWobble(0);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (currentAction === ActionType.SHAKE) {
      setIsShaking(true);
      setSurfaceWobble(8);
      // Generate bubbles (use average bottom Y to avoid dependency)
      const avgBottomY = 200;
      const bubbles = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: 40 + Math.random() * 120,
        y: avgBottomY - Math.random() * 50,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 0.5
      }));
      setShakeBubbles(bubbles);

      const timer = setTimeout(() => {
        setIsShaking(false);
        setSurfaceWobble(0);
        setShakeBubbles([]);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (currentAction === ActionType.GARNISH) {
      const lastGarnish = garnish[garnish.length - 1];
      if (lastGarnish) {
        setNewGarnishId(lastGarnish);
        setTimeout(() => setNewGarnishId(null), 1500);
      }
    }
  }, [currentAction, layers.length, garnish.length]);

  // Glass Configuration
  const config = useMemo(() => {
    const commonWidth = 200;
    const commonHeight = 240;

    switch (glass) {
      case GlassType.MARTINI:
        return {
          path: "M 20 10 L 28 10 L 28 18 L 36 18 L 36 26 L 44 26 L 44 34 L 52 34 L 52 42 L 60 42 L 60 50 L 68 50 L 68 58 L 76 58 L 76 66 L 84 66 L 84 74 L 92 74 L 92 82 L 100 82 L 108 82 L 108 74 L 116 74 L 116 66 L 124 66 L 124 58 L 132 58 L 132 50 L 140 50 L 140 42 L 148 42 L 148 34 L 156 34 L 156 26 L 164 26 L 164 18 L 172 18 L 172 10 L 180 10 Z",
          width: commonWidth,
          height: commonHeight,
          maskId: "mask-martini",
          liquidBottomY: 82,
          liquidTopY: 10,
          rimY: 10,
          stem: true,
        };
      case GlassType.COUPE:
        return {
          path: "M 20 20 L 20 60 L 30 60 L 30 70 L 50 70 L 50 80 L 150 80 L 150 70 L 170 70 L 170 60 L 180 60 L 180 20 Z",
          width: commonWidth,
          height: commonHeight,
          maskId: "mask-coupe",
          liquidBottomY: 80,
          liquidTopY: 20,
          rimY: 20,
          stem: true,
        };
      case GlassType.HIGHBALL:
        return {
          path: "M 45 10 L 45 200 L 55 200 L 55 210 L 145 210 L 145 200 L 155 200 L 155 10 Z",
          width: commonWidth,
          height: commonHeight,
          maskId: "mask-highball",
          liquidBottomY: 210,
          liquidTopY: 10,
          rimY: 10,
          stem: false,
        };
      case GlassType.ROCKS:
      default:
        return {
          path: "M 40 10 L 40 190 L 50 190 L 50 200 L 150 200 L 150 190 L 160 190 L 160 10 Z",
          width: commonWidth,
          height: commonHeight,
          maskId: "mask-rocks",
          liquidBottomY: 200,
          liquidTopY: 20,
          rimY: 10,
          stem: false,
        };
    }
  }, [glass]);

  // --- Layer Rendering Logic ---
  const totalLiquidHeight = config.liquidBottomY - config.liquidTopY;

  const renderLayers = () => {
    if (layers.length === 0) return null;

    let accumulatedHeight = 0;

    const renderedRects = layers.map((layer, index) => {
      const layerRatio = (layer.amount / maxVol);
      const pxHeight = Math.max(layerRatio * totalLiquidHeight, 2);

      const yPos = config.liquidBottomY - accumulatedHeight - pxHeight;
      accumulatedHeight += pxHeight;

      return (
        <rect
          key={layer.id || index}
          x="0"
          y={yPos}
          width="200"
          height={pxHeight + 1}
          fill={isMixed ? mixedColor : layer.color}
          opacity={0.9}
          className="transition-all duration-700 ease-out"
        />
      );
    });

    if (isMixed) {
      const totalRatio = Math.min(currentVolume / maxVol, 0.95);
      const totalHeight = totalRatio * totalLiquidHeight;
      return (
        <rect
          x="0"
          y={config.liquidBottomY - totalHeight}
          width="200"
          height={totalHeight}
          fill={mixedColor}
          opacity="0.92"
          className="transition-all duration-500"
        />
      );
    }

    return renderedRects;
  };

  // Surface Y Position
  const currentFillRatio = Math.min(currentVolume / maxVol, 0.95);
  // If volume is 0, surface is at bottom.
  const surfaceY = currentVolume > 0 ? (config.liquidBottomY - (currentFillRatio * totalLiquidHeight)) : config.liquidBottomY;

  // Garnish Logic
  const isRimGarnish = (id: string) => ['lemon', 'lime', 'orange', 'salt', 'sugar', 'pineapple'].some(k => id.includes(k));
  const rimGarnishes = garnish.filter(g => isRimGarnish(g));
  const floatGarnishes = garnish.filter(g => !isRimGarnish(g));

  const shakeClass = currentAction === ActionType.SHAKE ? 'animate-shake' : '';

  const renderGarnishSVG = (g: string, index: number, type: 'rim' | 'float') => {
    // Position
    // If Rim: use config.rimY
    // If Float: use surfaceY (but clamp to not go below rim visually if empty? No, float on bottom if empty)
    const yPos = type === 'rim' ? config.rimY : surfaceY;

    // X offset for variety
    const xOffset = type === 'rim' ? (glass === GlassType.MARTINI ? 80 : 60) : ((index % 2 === 0 ? 10 : -10) + index * 5);

    const animationClass = type === 'float' ? "animate-bob" : "";

    let content = <circle r="5" fill="red" />;

    if (g.includes('lemon') || g.includes('lime') || g.includes('orange')) {
      const color = g.includes('lime') ? '#32CD32' : (g.includes('orange') ? 'orange' : '#FFD700');
      // Pixel-perfect Citrus Wheel (blocky)
      content = (
        <g transform="rotate(15)">
          <rect x="-16" y="-16" width="32" height="32" fill={color} />
          <rect x="-18" y="-18" width="36" height="36" fill="none" stroke="white" strokeWidth="4" />
          <rect x="-8" y="-8" width="8" height="8" fill="white" opacity="0.4" />
          <rect x="0" y="0" width="8" height="8" fill="white" opacity="0.4" />
        </g>
      );
      if (g.includes('Twist')) {
        content = (
          <g>
            <rect x="0" y="0" width="12" height="4" fill={color} />
            <rect x="8" y="4" width="12" height="4" fill={color} />
            <rect x="16" y="8" width="12" height="4" fill={color} />
          </g>
        );
      }
    } else if (g.includes('pineapple')) {
      content = (
        <g>
          <rect x="0" y="0" width="20" height="20" fill="#FFD700" />
          <rect x="5" y="-10" width="10" height="10" fill="#228B22" />
        </g>
      );
    } else if (g.includes('cherry')) {
      content = (
        <g>
          <rect x="-8" y="-8" width="16" height="16" fill="#8B0000" />
          <rect x="0" y="-16" width="4" height="12" fill="#3e2723" />
          <rect x="0" y="-20" width="10" height="4" fill="#3e2723" />
          <rect x="-4" y="-4" width="4" height="4" fill="white" opacity="0.3" />
        </g>
      );
    } else if (g.includes('olive')) {
      content = (
        <g>
          <rect x="-10" y="-8" width="20" height="16" fill="#556B2F" />
          <rect x="-2" y="-2" width="4" height="4" fill="red" />
          {glass === GlassType.MARTINI && <rect x="-2" y="-40" width="4" height="60" fill="#A9A9A9" />}
        </g>
      );
    } else if (g.includes('mint') || g.includes('rosemary') || g.includes('celery')) {
      const color = g.includes('mint') ? '#228B22' : (g.includes('celery') ? '#90EE90' : '#556B2F');
      content = (
        <g>
          <rect x="-4" y="-24" width="8" height="32" fill={color} />
          <rect x="-8" y="-16" width="16" height="4" fill={color} />
          <rect x="-8" y="-8" width="16" height="4" fill={color} />
        </g>
      );
    } else if (g.includes('cucumber')) {
      content = (
        <g>
          <rect x="-12" y="-6" width="24" height="12" fill="#90EE90" stroke="#228B22" strokeWidth="3" />
          <rect x="-4" y="-2" width="8" height="4" fill="white" opacity="0.2" />
        </g>
      );
    } else if (g.includes('raspberry')) {
      content = <rect x="-8" y="-8" width="16" height="16" fill="#DC143C" stroke="#8B0000" strokeWidth="4" />;
    } else if (g.includes('cinnamon')) {
      content = <rect x="-3" y="-24" width="6" height="48" fill="#8B4513" transform="rotate(30)" />;
    }

    // Calculation for stacking
    // We count how many garnishes of the SAME type (rim or float) appeared BEFORE this one
    // to determine its offset.
    const prevCount = garnish.slice(0, index).filter(prevG =>
      type === 'rim' ? isRimGarnish(prevG) : !isRimGarnish(prevG)
    ).length;

    // Offsetting
    const stackOffsetX = type === 'rim' ? prevCount * 12 : prevCount * 10;
    const stackOffsetY = type === 'rim' ? prevCount * -5 : prevCount * -8;

    // Base Position
    const baseX = type === 'rim'
      ? (config.width / 2 + (glass === GlassType.MARTINI ? 70 : 60))
      : (config.width / 2 - 10 + (index % 2 === 0 ? 5 : -5)); // Centerish float

    const finalX = baseX + stackOffsetX;
    const finalY = yPos + stackOffsetY;

    // Z-Index Hack: Later garnishes are rendered last (on top), which is correct for SVG.

    return (
      <g key={`${g}-${index}`} transform={`translate(${finalX}, ${finalY})`} className={animationClass} style={{ animationDelay: `${index * 0.1}s` }}>
        {content}
      </g>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center h-full w-full select-none ${shakeClass}`}>
      <div className="relative pixelated pt-16" style={{ width: config.width, height: config.height + 100 }}>
        <svg
          viewBox={`0 -100 ${config.width} ${config.height + 100}`}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges', overflow: 'visible' }}
        >
          <defs>
            <clipPath id={config.maskId}>
              <path d={config.path} />
            </clipPath>

            <pattern id="dither-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="white" fillOpacity="0.1" />
              <rect x="4" y="4" width="4" height="4" fill="white" fillOpacity="0.1" />
            </pattern>

            <pattern id="bubble-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="4" height="4" fill="white" opacity="0.4" />
              <rect x="12" y="10" width="2" height="2" fill="white" opacity="0.2" />
            </pattern>
          </defs>

          {/* --- STEM & BASE --- */}
          {config.stem && (
            <g>
              <line x1="100" y1={config.liquidBottomY} x2="100" y2="210" stroke="rgba(255,255,255,0.8)" strokeWidth="6" />
              <line x1="60" y1="210" x2="140" y2="210" stroke="rgba(255,255,255,0.8)" strokeWidth="6" />
            </g>
          )}

          {/* --- LIQUID CONTENT (Inside Glass Mask) --- */}
          <g clipPath={`url(#${config.maskId})`}>
            {/* 1. The Liquid Stack */}
            <g>{renderLayers()}</g>

            {/* 2. Dither Overlay for depth */}
            <rect x="0" y="0" width="200" height="240" fill="url(#dither-pattern)" pointerEvents="none" />

            {/* 3. Surface Steps */}
            {currentVolume > 0 && (
              <rect x="0" y={surfaceY} width="200" height="4" fill="white" opacity="0.3" />
            )}

            {/* 4. Bubbles (Pixelated) */}
            {layers.some(l => ['tonic', 'soda', 'champagne', 'ginger_beer', 'cola'].includes(l.ingredientId)) && (
              <rect x="0" y="0" width="200" height="240" fill="url(#bubble-pattern)" className="animate-pulse" />
            )}

            {/* 5. Ice Cubes (Pixelated) */}
            {ice && (
              <g transform={`translate(0, ${Math.min(surfaceY + 10, config.liquidBottomY - 20) - config.liquidBottomY + 40})`} className="transition-transform duration-700">
                <rect x="80" y={config.liquidBottomY - 50} width="32" height="32" fill="white" opacity="0.1" stroke="white" strokeWidth="4" strokeOpacity="0.3" />
                <rect x="112" y={config.liquidBottomY - 72} width="24" height="24" fill="white" opacity="0.1" stroke="white" strokeWidth="4" strokeOpacity="0.3" transform="rotate(22 124 140)" />
              </g>
            )}

            {/* 6. Floating Garnishes */}
            {floatGarnishes.map((g, i) => renderGarnishSVG(g, i, 'float'))}

            {/* 7. Splash removed per user request */}
          </g>

          {/* --- GLASS SHELL --- */}
          <path d={config.path} fill="rgba(255,255,255,0.02)" stroke="none" />
          <path d={config.path} stroke="white" strokeOpacity="0.8" strokeWidth="6" fill="none" strokeLinejoin="round" />

          {/* Rim Salt/Sugar */}
          {garnish.includes('garnish_salt') && (
            <line x1="20" y1={config.rimY} x2="180" y2={config.rimY} stroke="white" strokeWidth="3" strokeDasharray="2 4" />
          )}

          {/* --- OBJECTS ON TOP OF GLASS --- */}
          {rimGarnishes.map((g, i) => renderGarnishSVG(g, i, 'rim'))}

          {/* --- ACTION OVERLAYS --- */}
          {isPouring && currentIngredient?.icon && (
            <g className="animate-pour-bottle">
              <foreignObject x="60" y="-80" width="80" height="80">
                <img
                  src={currentIngredient.icon}
                  alt={currentIngredient.name}
                  className="pixelated"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                />
              </foreignObject>
              {/* Stream removed per user request */}
            </g>
          )}

          {isSwirlActive && (
            <g clipPath={`url(#${config.maskId})`}>
              <rect x="80" y={surfaceY + 20} width="40" height="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" className="animate-swirl" />
            </g>
          )}

          {isShaking && shakeBubbles.length > 0 && (
            <g clipPath={`url(#${config.maskId})`} className="mix-blend-overlay">
              {shakeBubbles.map(bubble => (
                <rect
                  key={bubble.id}
                  x={bubble.x}
                  y={bubble.y}
                  width={bubble.size}
                  height={bubble.size}
                  fill="white"
                  opacity="0.7"
                  className="animate-shake-bubble"
                  style={{ animationDelay: `${bubble.delay}s` }}
                />
              ))}
            </g>
          )}

          {/* Ice Dropping */}
          {isIceDropping && (
            <g className="animate-ice-drop">
              <rect x="85" y="-30" width="30" height="30" fill="url(#glassShine)" stroke="white" strokeWidth="2" strokeOpacity="0.8" />
            </g>
          )}

          {/* Garnish Drop Animation */}
          {newGarnishId && (
            <g className="animate-garnish-drop">
              {renderGarnishSVG(newGarnishId, 0, isRimGarnish(newGarnishId) ? 'rim' : 'float')}
            </g>
          )}

          {/* Stir Spoon */}
          {currentAction === ActionType.STIR && (
            <rect x="98" y="-80" width="4" height={config.liquidBottomY - 20} fill="#ccc" className="animate-spin-spoon origin-[100px_0px]" />
          )}
        </svg>
      </div>

      <style>{`
        .pixelated { image-rendering: pixelated; }

        @keyframes rise {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        .animate-rise { animation: rise 2s linear infinite; }

        @keyframes pourStream {
          0% { opacity: 0.8; stroke-width: 12px; }
          50% { opacity: 1; stroke-width: 14px; }
          100% { opacity: 0.8; stroke-width: 12px; }
        }
        .animate-pour-stream { animation: pourStream 0.2s steps(2, jump-none) infinite; }

        @keyframes splashUp {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(calc(var(--rand-x, 1) * 20px), -25px); opacity: 0; }
        }
        .animate-splash-up { animation: splashUp 0.6s ease-out infinite; }

        @keyframes swirl {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-swirl { transform-origin: center; animation: swirl 1s linear infinite; }

        @keyframes spin-spoon {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
        .animate-spin-spoon { animation: spin-spoon 0.8s ease-in-out infinite; }

        @keyframes pourBottle {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          30% { transform: translateY(0) rotate(0deg); opacity: 1; }
          70% { transform: translateY(0) rotate(15deg); opacity: 1; }
          100% { transform: translateY(0) rotate(15deg); opacity: 0; }
        }
        .animate-pour-bottle { animation: pourBottle 1s ease-out forwards; }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0) rotate(25deg); }
          50% { transform: translateY(-6px) rotate(20deg); }
        }
        .animate-float-slower { animation: float-slower 4s ease-in-out infinite; }

        @keyframes iceDrop {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); }
        }
        .animate-ice-drop { animation: iceDrop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes garnishDrop {
          0% { transform: translateY(-150px) scale(0.5); opacity: 0; }
          100% { transform: translateY(0) scale(1.1); opacity: 1; }
        }
        .animate-garnish-drop { animation: garnishDrop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        .animate-shake-bubble { animation: rise 1s ease-out forwards; }
      `}</style>
    </div >
  );
};

export default GlassSimulator;
