import React, { useState, useEffect } from 'react';

const GlassSimOverlay: React.FC = () => {
    const [randomVal, setRandomVal] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRandomVal(Math.floor(Math.random() * 100));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const CornerBracket = ({ className }: { className?: string }) => (
        <div className={`absolute w-12 h-12 pointer-events-none ${className}`}>
            <div className="absolute top-0 left-0 w-full h-1 border-t-2 border-brand-gold/20"></div>
            <div className="absolute top-0 left-0 w-1 h-full border-l-2 border-brand-gold/20"></div>
            <div className="absolute top-0 left-0 w-2 h-2 bg-brand-gold/30"></div>
        </div>
    );

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Background Dot Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

            {/* Central Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-12 bg-white/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[2px] bg-white/10"></div>

            {/* Decorative Corners */}
            <CornerBracket className="top-8 left-8" />
            <CornerBracket className="top-8 right-8 rotate-90" />
            <CornerBracket className="bottom-8 left-8 -rotate-90" />
            <CornerBracket className="bottom-8 right-8 rotate-180" />

            {/* Technical Metadata Labels */}
            <div className="absolute top-10 left-24 font-pixel text-[10px] text-brand-gold/30 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brand-gold/20"></span>
                    REF_PT: 44.02 // AXIS_Z
                </div>
                <div>SIM_ENVIRONMENT: ACTIVE</div>
            </div>

            <div className="absolute top-10 right-24 font-pixel text-[10px] text-brand-gold/30 text-right space-y-1">
                <div>FLOW_RATE: 2.4 ML/S</div>
                <div className="flex items-center justify-end gap-2">
                    TEMP_CORE: 3.{randomVal}°C
                    <span className="w-1.5 h-1.5 bg-green-500/20 rounded-full animate-pulse"></span>
                </div>
            </div>

            <div className="absolute bottom-24 left-12 font-pixel text-[8px] text-brand-gold/20 vertical-rl opacity-40">
                SYSTEM_DIAGNOSTIC_RUNNING_V2.0.4.BLOCK_A
            </div>

            <div className="absolute top-1/2 right-12 -translate-y-1/2 flex flex-col gap-4 opacity-20">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-6 h-1 bg-brand-gold/40"></div>
                ))}
                <div className="w-6 h-1 bg-brand-gold animate-pulse"></div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-1 bg-brand-gold/40"></div>
                ))}
            </div>

            {/* Subtle Scanline Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 opacity-20 animate-[scan_8s_linear_infinite]"></div>

            <style>{`
        .vertical-rl {
          writing-mode: vertical-rl;
        }
        @keyframes scan {
          from { top: -5%; }
          to { top: 105%; }
        }
      `}</style>
        </div>
    );
};

export default GlassSimOverlay;
