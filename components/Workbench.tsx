import React, { useState } from 'react';
import { INVENTORY } from '../constants';
import { IngredientCategory, Ingredient, ActionType, DrinkState, GlassType } from '../types';
import { Plus, Droplets, RotateCw, Check, Sparkles, X, RotateCcw, Trash2 } from 'lucide-react';

interface WorkbenchProps {
  drinkState: DrinkState;
  onAction: (action: ActionType, payload: any) => void;
  onSelectGlass: (glass: GlassType) => void;
  onFinish: () => void;
  onAIRequest: (prompt: string, preferences: any) => void;
  onUndo: () => void;
  onReset: () => void;
  loading: boolean;
  aiMode?: boolean;
  isAIGenerated?: boolean;
}

const Workbench: React.FC<WorkbenchProps> = ({ drinkState, onAction, onSelectGlass, onFinish, onAIRequest, onUndo, onReset, loading, aiMode, isAIGenerated }) => {
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory>(IngredientCategory.BASE_SPIRIT);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [pourAmount, setPourAmount] = useState<number>(30);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const DecoCorners = () => (
    <>
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-brand-gold/30 z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-brand-gold/30 z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-brand-gold/30 z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-brand-gold/30 z-10 pointer-events-none"></div>
    </>
  );

  const TechReadout = ({ label, value }: { label: string, value: string }) => (
    <div className="flex gap-2 text-[10px] items-center opacity-40 font-pixel">
      <span className="text-brand-gold">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );

  const categories = Object.values(IngredientCategory);
  const filteredInventory = INVENTORY.filter(i => i.category === selectedCategory);

  const handleAISubmit = () => {
    if (!aiPrompt.trim()) return;
    onAIRequest(aiPrompt, { boozy: 'medium' });
    setShowAIModal(false);
    setAiPrompt('');
  };

  return (
    <div className="bg-brand-800/80 border-l border-white/5 backdrop-blur-md flex flex-col h-full w-full shadow-2xl relative z-20">

      {/* Header / AI Button */}
      <div className="p-3 border-b-4 border-black flex justify-between items-center bg-black/60 relative">
        <DecoCorners />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-brand-gold font-pixel text-[14px] tracking-tight uppercase">Dashboard_B</span>
        </div>
        <div className="hidden xl:flex gap-4 px-4 overflow-hidden">
          <TechReadout label="MEM" value="128kb" />
          <TechReadout label="SAT" value="98%" />
        </div>
        <button
          onClick={() => setShowAIModal(true)}
          disabled={loading || aiMode}
          className="pixel-button bg-brand-gold text-brand-900 text-[12px] font-pixel flex items-center gap-1 hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
        >
          <Sparkles size={12} /> SYSTEM_REQ
        </button>
      </div>

      {/* AI Modal Overlay */}
      {showAIModal && (
        <div className="absolute inset-0 z-50 bg-black/95 p-6 flex flex-col items-center justify-center animate-[fadeIn_0.2s_ease-out] scanlines">
          <button onClick={() => setShowAIModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white font-pixel text-lg">X</button>
          <Sparkles className="text-brand-gold w-10 h-10 mb-4 animate-pulse" />
          <h3 className="text-base font-pixel text-white mb-2 text-center uppercase leading-relaxed">System Request:<br />Desired Flavor?</h3>
          <p className="text-[14px] font-pixel text-slate-500 mb-6 text-center">"Input mood, place, or vibe..."</p>
          <textarea
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Type here..."
            className="w-full h-24 bg-black border-4 border-slate-800 p-3 text-sm text-brand-gold font-pixel focus:border-brand-gold outline-none resize-none mb-6 placeholder:opacity-30"
          />
          <button
            onClick={handleAISubmit}
            className="w-full pixel-button bg-brand-gold text-brand-900 font-pixel text-sm py-4"
          >
            GENERATE_DRINK
          </button>
        </div>
      )}

      {/* Glass Selection */}
      {drinkState.steps.length === 0 && !selectedIngredient && (
        <div className="p-3 border-b-4 border-black bg-black/20">
          <h3 className="text-slate-500 text-[12px] font-pixel mb-2 uppercase tracking-tighter">Select Glass</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(GlassType).map(g => (
              <button
                key={g}
                onClick={() => onSelectGlass(g)}
                disabled={aiMode}
                className={`pixel-button text-[12px] py-2 font-pixel transition-all ${drinkState.glass === g ? 'bg-brand-gold text-brand-900' : 'bg-slate-800 text-slate-400'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b-4 border-black bg-black/40">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setSelectedIngredient(null); }}
            disabled={aiMode}
            className={`px-3 py-2 whitespace-nowrap text-[12px] font-pixel transition-all ${selectedCategory === cat ? 'text-brand-gold bg-black/60 shadow-[inset_0_-4px_0_0_#d4af37]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {cat.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar bg-pixel-grid">
        <div className="grid grid-cols-3 gap-2">
          {filteredInventory.map(ing => (
            <button
              key={ing.id}
              onClick={() => !aiMode && setSelectedIngredient(ing)}
              disabled={aiMode}
              className={`relative p-2 pixel-border transition-all group ${selectedIngredient?.id === ing.id ? 'bg-slate-700/80 ring-2 ring-brand-gold/40' : 'bg-slate-800/40 hover:bg-slate-700/60'} disabled:opacity-50 overflow-hidden`}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-pixel.png')] opacity-10 pointer-events-none"></div>
              <div className="flex flex-col items-center gap-2 relative z-10">
                {ing.icon ? (
                  <img src={ing.icon} alt={ing.name} className="w-14 h-14 object-contain pixelated group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center">
                    <div className="w-3 h-10" style={{ backgroundColor: ing.color }}></div>
                  </div>
                )}
                <div className="w-full text-center">
                  <div className="text-[12px] font-pixel text-slate-300 leading-tight group-hover:text-brand-gold mb-1 truncate">{ing.name.split('(')[0]}</div>
                  <div className="text-[10px] font-pixel text-slate-500 flex justify-center items-center gap-1">
                    <div className="w-1 h-3 bg-slate-700">
                      <div className="w-full bg-brand-gold" style={{ height: `${(ing.abv / 40) * 100}%` }}></div>
                    </div>
                    {ing.abv}%
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Panel */}
      <div className="p-3 bg-black/80 border-t-4 border-black relative min-h-[140px]">
        {loading || aiMode ? (
          <div className="absolute inset-0 bg-black/90 z-40 flex items-center justify-center flex-col gap-4 scanlines">
            <RotateCw className="animate-spin text-brand-gold" size={32} />
            <span className="text-brand-gold text-[14px] font-pixel tracking-widest text-center px-4">
              {loading ? "ANALYZING_PROMPT..." : "AI_EXECUTING_MIX..."}
            </span>
          </div>
        ) : selectedIngredient ? (
          <div className="space-y-4 animate-[slideUp_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <span className="text-brand-gold font-pixel text-sm">{selectedIngredient.name.split('(')[0]}</span>
              <button onClick={() => setSelectedIngredient(null)} className="text-[12px] font-pixel text-slate-500 hover:text-white uppercase">[Cancel]</button>
            </div>

            {selectedIngredient.category === IngredientCategory.ICE ? (
              <button
                onClick={() => { onAction(ActionType.ADD_ICE, { ingredient: selectedIngredient }); setSelectedIngredient(null); }}
                className="w-full pixel-button bg-slate-700 text-xs font-pixel py-4 flex items-center justify-center gap-2"
              >
                ADD_ICE_CUBES
              </button>
            ) : selectedIngredient.category === IngredientCategory.GARNISH ? (
              <button
                onClick={() => { onAction(ActionType.GARNISH, { ingredient: selectedIngredient }); setSelectedIngredient(null); }}
                className="w-full pixel-button bg-brand-accent text-sm font-pixel py-4 flex items-center justify-center gap-2"
              >
                ADD_GARNISH
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-[14px] text-brand-gold font-pixel">
                  <span>ML:</span>
                  <span>{pourAmount}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={pourAmount}
                  onChange={(e) => setPourAmount(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-800 appearance-none cursor-pointer accent-brand-gold pixel-border"
                  style={{ padding: '0 4px' }}
                />
                <button
                  onClick={() => { onAction(ActionType.POUR, { ingredient: selectedIngredient, amount: pourAmount }); setSelectedIngredient(null); }}
                  className="w-full pixel-button bg-brand-gold text-brand-900 font-pixel text-sm py-4 flex items-center justify-center gap-2"
                >
                  POUR_IN
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 relative">
            <button
              onClick={() => onAction(ActionType.STIR, {})}
              disabled={drinkState.steps.length === 0}
              className="pixel-button text-[14px] font-pixel py-3 disabled:opacity-30 bg-slate-800 hover:brightness-110 active:translate-y-1 transition-all shadow-[0_4px_0_0_#1a1a1a]"
            >
              STIR
            </button>
            <button
              onClick={() => onAction(ActionType.SHAKE, {})}
              disabled={drinkState.steps.length === 0}
              className="pixel-button text-[14px] font-pixel py-3 disabled:opacity-30 bg-slate-800 hover:brightness-110 active:translate-y-1 transition-all shadow-[0_4px_0_0_#1a1a1a]"
            >
              SHAKE
            </button>
            <button
              onClick={onUndo}
              disabled={drinkState.steps.length === 0 || aiMode}
              className="pixel-button bg-slate-900/50 text-[12px] font-pixel py-2 disabled:opacity-30 hover:text-white transition-colors"
            >
              UNDO
            </button>
            <button
              onClick={onReset}
              disabled={drinkState.steps.length === 0 || aiMode}
              className="pixel-button bg-slate-900/50 text-[12px] font-pixel py-2 disabled:opacity-30 hover:text-white transition-colors"
            >
              CLEAR
            </button>
            <button
              onClick={onFinish}
              disabled={drinkState.steps.length === 0 || isAIGenerated || aiMode}
              className="col-span-2 pixel-button bg-brand-accent text-sm font-pixel py-4 mt-1 shadow-[0_4px_0_0_#4a0000] hover:brightness-110 active:translate-y-1 transition-all relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center gap-2 relative z-10">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></div>
                SERVE_COCKTAIL
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workbench;
