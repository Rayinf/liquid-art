import React from 'react';
import { AIDrinkResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Share2, RefreshCw } from 'lucide-react';

interface DrinkResultProps {
  result: AIDrinkResult;
  imageUrl?: string;
  onReset: () => void;
}

const DrinkResult: React.FC<DrinkResultProps> = ({ result, imageUrl, onReset }) => {
  const radarData = [
    { subject: '甜度 (Sweet)', A: result.flavorProfile.sweet * 10, fullMark: 10 },
    { subject: '酸度 (Sour)', A: result.flavorProfile.sour * 10, fullMark: 10 },
    { subject: '苦度 (Bitter)', A: result.flavorProfile.bitter * 10, fullMark: 10 },
    { subject: '辛辣 (Spicy)', A: result.flavorProfile.spicy * 10, fullMark: 10 },
    { subject: '烈度 (Boozy)', A: result.flavorProfile.boozy * 10, fullMark: 10 },
    { subject: '咸鲜 (Salty)', A: result.flavorProfile.salty || 0, fullMark: 10 },
  ];

  // Scoring metrics
  const scores = {
    visual: 9,
    flavor: 8,
    creative: 7,
    story: 9
  };

  const renderStars = (val: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-3 h-3 ${i <= Math.ceil(val / 2) ? 'bg-brand-gold shadow-[1px_1px_0_0_#000]' : 'bg-slate-700/30'}`}></div>
      ))}
    </div>
  );

  const DecoCorners = () => (
    <>
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-gold/40 z-50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-gold/40 z-50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-gold/40 z-50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-gold/40 z-50"></div>
    </>
  );

  return (
    <div className="w-full max-w-6xl h-auto md:h-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-12 animate-[fadeIn_0.5s_ease-out] relative shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-slate-900 self-center overflow-hidden border-4 border-black">
      <DecoCorners />

      {/* Retro Header Overlay */}
      <div className="absolute top-3 right-3 z-40 bg-brand-gold text-brand-900 font-pixel text-[12px] px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
        <div className="w-2 h-2 bg-brand-900 animate-ping"></div>
        NEW_ITEM_FOUND!
      </div>

      <div className="absolute top-4 left-4 z-40 text-[10px] text-brand-gold/40 font-pixel space-y-1 hidden md:block">
        <div>SYS_READ: 200_OK</div>
        <div>DATA_HASH: {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
      </div>

      {/* Left Column: Image & Evaluation */}
      <div className="lg:col-span-5 relative bg-black flex flex-col border-b-4 lg:border-b-0 lg:border-r-4 border-black overflow-hidden">
        <div className="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/pinstriped-dark.png')]">
          {imageUrl ? (
            <img src={imageUrl} alt={result.name} className="w-full h-full object-cover pixelated opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-gold font-pixel text-[14px] animate-pulse">
              GENERATING_IMAGE...
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-1 bg-brand-gold/60"></div>
              <div className="w-2 h-1 bg-brand-gold animate-pulse"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-pixel text-brand-gold mb-3 tracking-tighter shadow-black drop-shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase">{result.name}</h2>
            <div className="bg-black/90 p-4 border-l-4 border-brand-gold shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
              <p className="text-[14px] font-pixel text-slate-300 leading-relaxed line-clamp-3 md:line-clamp-none">
                {result.description}
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Grid */}
        <div className="p-4 md:p-5 bg-slate-950/80 font-pixel h-auto md:h-48 lg:h-auto shrink-0 border-t-4 border-black">
          <h3 className="text-[10px] text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
            <div className="p-0.5 border border-slate-700"><div className="w-1 h-1 bg-brand-gold"></div></div>
            DRINK_EVALUATION
          </h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="space-y-1">
              <div className="text-[10px] text-brand-gold uppercase opacity-60">Visuals</div>
              {renderStars(scores.visual)}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-brand-gold uppercase opacity-60">Flavor</div>
              {renderStars(scores.flavor)}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-brand-gold uppercase opacity-60">Creativity</div>
              {renderStars(scores.creative)}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-brand-gold uppercase opacity-60">Story</div>
              {renderStars(scores.story)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Data & Analysis */}
      <div className="lg:col-span-7 p-6 flex flex-col bg-slate-800 relative overflow-hidden bg-pixel-grid h-full">
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
          <div className="p-4 bg-black/40 border-2 border-slate-700 relative">
            <h3 className="font-pixel text-[12px] text-brand-gold mb-3 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-brand-gold animate-pulse"></div> INGREDIENTS_LIST
            </h3>
            <ul className="space-y-3">
              {result.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between text-[14px] font-pixel items-center border-b border-white/5 pb-2">
                  <span className="text-white/90"># {ing.name}</span>
                  <span className="text-brand-gold/80 bg-black/40 px-2">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2">
            <h3 className="font-pixel text-[12px] text-slate-500 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1 h-3 bg-slate-600"></span> METHODOLOGY
            </h3>
            <div className="space-y-3 pl-2">
              {result.instructions.map((step, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <span className="text-brand-gold font-pixel text-[8px] mt-1.5 p-0.5 border border-brand-gold/20 group-hover:bg-brand-gold/20 transition-colors">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-pixel text-[13px] text-white/70 leading-relaxed uppercase group-hover:text-white transition-colors">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flavor Profile Chart */}
          <div className="min-h-[200px] md:min-h-[260px] w-full relative bg-black/40 p-4 border-2 border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
            <h3 className="font-pixel text-[12px] text-slate-500 text-center mb-6 uppercase tracking-widest flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 bg-slate-700 rotate-45"></div>
              TARGET_ANALYSIS
              <div className="w-1.5 h-1.5 bg-slate-700 rotate-45"></div>
            </h3>
            <div className="w-full h-[160px] md:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 400, fontFamily: '"CustomPixel"' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name="Flavor"
                    dataKey="A"
                    stroke="#d4af37"
                    strokeWidth={2}
                    fill="#d4af37"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-4 shrink-0 grid grid-cols-2 gap-4">
          <button onClick={onReset} className="pixel-button bg-slate-700 text-[12px] font-pixel py-4 flex items-center justify-center gap-2 active:translate-y-1 transition-all">
            TRY_AGAIN
          </button>
          <button className="pixel-button bg-brand-gold text-brand-900 text-[12px] font-pixel py-4 flex items-center justify-center gap-2 active:translate-y-1 transition-all shadow-[0_4px_0_0_#92400e]">
            SAVE_DRINK
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default DrinkResult;