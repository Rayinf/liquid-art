
import React from 'react';
import { AIDrinkResult, GlassType } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RefreshCw, Bookmark, Check } from 'lucide-react';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import Typewriter from './Typewriter';
import { BookOpen, Zap, Target, Thermometer, Droplets, Activity } from 'lucide-react';

const HUDTelemetry = ({ label, value, icon: Icon }: any) => (
  <div className="flex flex-col border-l-2 border-brand-gold/30 pl-2 py-1">
    <div className="flex items-center gap-1.5 text-[8px] text-brand-gold/50 uppercase tracking-tighter mb-0.5">
      <Icon size={8} /> {label}
    </div>
    <div className="text-[12px] font-pixel text-white/90 leading-none">{value}</div>
  </div>
);

const SegmentedBar = ({ value }: { value: number }) => (
  <div className="flex gap-1 h-3 w-32">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
      <div
        key={i}
        className={`flex-1 ${i <= value ? 'bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-slate-800'}`}
      />
    ))}
  </div>
);

interface DrinkResultProps {
  result: AIDrinkResult;
  imageUrl?: string;
  onReset: () => void;
  glass: GlassType;
  color: string;
  missionResult?: { success: boolean; reason: string } | null;
}

const DrinkResult: React.FC<DrinkResultProps> = ({ result, imageUrl, onReset, glass, color, missionResult }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  const radarData = [
    { subject: '甜度 (Sweet)', A: result.flavorProfile.sweet * 10, fullMark: 10 },
    { subject: '酸度 (Sour)', A: result.flavorProfile.sour * 10, fullMark: 10 },
    { subject: '苦度 (Bitter)', A: result.flavorProfile.bitter * 10, fullMark: 10 },
    { subject: '辛辣 (Spicy)', A: result.flavorProfile.spicy * 10, fullMark: 10 },
    { subject: '烈度 (Boozy)', A: result.flavorProfile.boozy * 10, fullMark: 10 },
    { subject: '咸鲜 (Salty)', A: result.flavorProfile.salty || 0, fullMark: 10 },
  ];

  const handleSave = () => {
    if (isSaved) return;
    storageService.saveDrink({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      data: result,
      imageUrl: imageUrl || '',
      glass,
      color
    });
    setIsSaved(true);
    audioService.playSuccess();
  };

  // Scoring metrics
  const scores = {
    visual: 9,
    flavor: 8,
    creative: 7,
    story: 9
  };

  const DecoCorners = () => (
    <>
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-gold/40 z-50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-gold/40 z-50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-gold/40 z-50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-gold/40 z-50"></div>
    </>
  );

  return (
    <div className="w-full max-w-6xl h-auto md:h-full lg:h-[85vh] flex flex-col animate-[fadeIn_0.5s_ease-out] relative shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-slate-900 self-center overflow-hidden border-4 border-black">
      <DecoCorners />

      {/* Mission Status Overlay */}
      {missionResult && (
        <div className={`absolute top-0 inset-x-0 z-[60] py-2 px-6 flex items-center justify-between border-b-2 border-black animate-slideDown ${missionResult.success ? 'bg-green-600 text-white' : 'bg-red-900 text-red-200'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`p-1 border border-current font-pixel text-[10px]`}>
              {missionResult.success ? 'MISSION_PASSED' : 'MISSION_FAILED'}
            </div>
            <span className="font-pixel text-[12px] uppercase">{missionResult.reason}</span>
          </div>
          {missionResult.success && <div className="font-pixel text-[10px] animate-pulse">REWARD_UNLOCKED!</div>}
        </div>
      )}

      {/* Retro Header Overlay */}
      <div className={`absolute top-3 right-3 z-40 bg-brand-gold text-brand-900 font-pixel text-[12px] px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0_0_#000] ${missionResult ? 'mt-10' : ''}`}>
        <div className="w-2 h-2 bg-brand-900 animate-ping"></div>
        NEW_ITEM_FOUND!
      </div>

      <div className="absolute top-4 left-4 z-40 text-[10px] text-brand-gold/40 font-pixel space-y-1 hidden md:block">
        <div>SYS_READ: 200_OK</div>
      </div>

      {/* GLOBAL HEADER */}
      <div className="w-full bg-black/95 border-b-4 border-black p-5 relative z-30 shrink-0">
        {result.userPrompt && (
          <div className="mb-4 p-3 bg-brand-gold/10 border-l-4 border-brand-gold flex items-center gap-4 animate-fadeIn">
            <div className="px-2 py-0.5 bg-brand-gold text-brand-900 text-[9px] font-pixel uppercase shrink-0">
              User Input
            </div>
            <div className="text-[13px] font-pixel text-brand-gold/90 italic truncate">
              "{result.userPrompt}"
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-1 bg-brand-gold/60"></div>
          <div className="w-2 h-1 bg-brand-gold animate-pulse"></div>
        </div>
        <h2 className="text-xl md:text-3xl font-pixel text-brand-gold tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase">{result.name}</h2>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

        {/* COL 1: VISUALS & LORE (Moved to Left) */}
        <div className="lg:col-span-6 border-r-4 border-black bg-black flex flex-col min-h-0">
          <div className="flex-1 relative overflow-hidden group p-2">
            {/* Large Image Container */}
            <div className="w-full h-full relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border-2 border-brand-gold/10 bg-slate-900 flex flex-col">
              {/* Dynamic Backdrop Glow */}
              <div
                className="absolute inset-0 opacity-20 blur-[80px] pointer-events-none transition-colors duration-1000"
                style={{ backgroundColor: color }}
              ></div>

              <div className="flex-1 relative overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={result.name} className="w-full h-full object-cover pixelated opacity-90 transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-gold font-pixel text-[14px] animate-pulse">
                    ANALYZING...
                  </div>
                )}

                {/* HUD Overlays (Moved to be more compact) */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                  <HUDTelemetry label="SG" value={result.density || '1.000'} icon={Droplets} />
                  <HUDTelemetry label="ABV" value={`${result.abv || '0.0'}%`} icon={Zap} />
                </div>

                {/* Description Overlay - MOVED HERE */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 z-30 pt-10">
                  <div className="max-h-[140px] overflow-y-auto no-scrollbar">
                    <p className="text-[13px] font-pixel text-slate-100 leading-relaxed italic border-l-2 border-brand-gold pl-2">
                      "{result.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* The Bartender's Tale */}
              <div className="p-4 bg-black/80 border-t-2 border-brand-gold/20 relative shrink-0">
                <h3 className="font-pixel text-[10px] text-brand-gold mb-2 uppercase flex items-center gap-2">
                  <BookOpen size={12} /> THE_BARTENDER_S_TALE
                </h3>
                <div className="max-h-[80px] overflow-y-auto no-scrollbar">
                  <p className="text-[12px] font-pixel text-slate-300 leading-relaxed">
                    <Typewriter text={result.lore} speed={20} delay={500} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COL 2: RECIPE DATA (Moved to Center) */}
        <div className="lg:col-span-3 border-r-4 border-black bg-slate-800/50 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            <div className="p-3 bg-black/40 border-2 border-slate-700 relative">
              <h3 className="font-pixel text-[10px] text-brand-gold mb-2 uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-gold animate-pulse"></div> INGREDIENTS
              </h3>
              <ul className="space-y-1.5">
                {result.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between text-[12px] font-pixel items-center border-b border-white/5 pb-1">
                    <span className="text-white/80 truncate pr-2"># {ing.name}</span>
                    <span className="text-brand-gold/70 bg-black/20 px-1 shrink-0">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-black/20 border border-white/5">
              <h3 className="font-pixel text-[10px] text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-slate-600"></span> METHODOLOGY
              </h3>
              <div className="space-y-2">
                {result.instructions.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start group">
                    <span className="text-brand-gold font-pixel text-[8px] mt-1 p-0.5 border border-brand-gold/20 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-pixel text-[11px] text-white/60 leading-tight uppercase group-hover:text-white transition-colors">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COL 3: ANALYTICS & ACTIONS */}
        <div className="lg:col-span-3 bg-slate-900 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto no-scrollbar">

            {/* Scoring Section */}
            <div className="p-3 bg-black/60 border-2 border-slate-800 relative overflow-hidden">
              <h3 className="text-[9px] text-slate-500 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                <Target size={12} className="text-brand-gold" /> QUANTUM_EVALUATION
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'VISUAL', val: scores.visual },
                  { label: 'FLAVOR', val: scores.flavor },
                  { label: 'CREATIVE', val: scores.creative }
                ].map(s => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[8px] text-brand-gold/60">
                      <span>{s.label}</span>
                      <span>{s.val * 10}%</span>
                    </div>
                    <SegmentedBar value={s.val} />
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart Section */}
            <div className="flex-1 min-h-[180px] bg-black/40 border border-white/5 relative flex flex-col p-2">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 8, fontFamily: '"CustomPixel"' }} />
                    <Radar
                      name="Flavor"
                      dataKey="A"
                      stroke="#d4af37"
                      strokeWidth={1}
                      fill="#d4af37"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 shrink-0">
              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`pixel-button text-[11px] font-pixel py-3 flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-green-600 text-white shadow-[0_4px_0_0_#166534]' : 'bg-brand-gold text-brand-900 shadow-[0_4px_0_0_#92400e]'
                  }`}
              >
                {isSaved ? <><Check size={12} /> STORED</> : <><Bookmark size={12} /> ARCHIVE_RECIPE</>}
              </button>
              <button
                onClick={onReset}
                className="pixel-button bg-slate-700 text-[11px] font-pixel py-3 flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-all shadow-[0_4px_0_0_#1e293b]"
              >
                <RefreshCw size={12} /> NEW_EXPERIMENT
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes scanner {
           0% { top: 0; opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { top: 100%; opacity: 0; }
        }
        .animate-scanner {
           animation: scanner 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DrinkResult;