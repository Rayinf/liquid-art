
import React, { useState } from 'react';
import { GlassType, ActionType, DrinkState, Step, AIDrinkResult, Ingredient, IngredientCategory } from './types';
import { INVENTORY, GLASS_VOLUMES } from './constants';
import GlassSimulator from './components/GlassSimulator';
import Workbench from './components/Workbench';
import Timeline from './components/Timeline';
import DrinkResult from './components/DrinkResult';
import GlassSimOverlay from './components/GlassSimOverlay';
import RecipeGallery from './components/RecipeGallery';
import DailyMissionModal from './components/DailyMissionModal';
import { storageService } from './services/storageService';
import { missionService } from './services/missionService';
import { analyzeCustomDrink, generateDrinkImage, evaluateMissionSuccess, generateDrinkRecipe, setApiKey } from './services/geminiService';
import { audioService } from './services/audioService';
import { ChevronLeft, Key, Settings, X, Beaker, Package, Library, Target } from 'lucide-react';
import { DailyMission } from './types';

type MobileTab = 'simulator' | 'workbench';

enum AppMode {
  DIY = 'diy',
  RESULT = 'result'
}

// Utility to blend hex colors
const blendColors = (colorA: string, weightA: number, colorB: string, weightB: number) => {
  const h2d = (h: string) => parseInt(h.replace('#', ''), 16);
  const getRgb = (c: string) => {
    if (c.startsWith('#')) return [h2d(c.slice(1, 3)), h2d(c.slice(3, 5)), h2d(c.slice(5, 7))];
    return [200, 200, 200]; // Fallback
  }
  const [r1, g1, b1] = getRgb(colorA);
  const [r2, g2, b2] = getRgb(colorB);
  const total = weightA + weightB;
  if (total === 0) return colorA;
  const r = Math.round((r1 * weightA + r2 * weightB) / total);
  const g = Math.round((g1 * weightA + g2 * weightB) / total);
  const b = Math.round((b1 * weightA + b2 * weightB) / total);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.DIY);

  // API Key State
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [isKeySaved, setIsKeySaved] = useState(!!localStorage.getItem('GEMINI_API_KEY'));
  const [showSettings, setShowSettings] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [currentMission, setCurrentMission] = useState<DailyMission | null>(null);
  const [missionResult, setMissionResult] = useState<{ success: boolean, reason: string } | null>(null);

  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<MobileTab>('workbench');

  // Loading States
  const [analyzing, setAnalyzing] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false); // Controls playback mode
  const [isAIGenerated, setIsAIGenerated] = useState(false); // Tracks if current drink was AI-generated

  // Action State for Simulator Animation
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(null);

  // Drink State
  const [drinkState, setDrinkState] = useState<DrinkState>({
    glass: GlassType.ROCKS,
    steps: [],
    currentVolume: 0,
    maxVolume: GLASS_VOLUMES[GlassType.ROCKS],
    layers: [],
    isMixed: false,
    mixedColor: '#FFFFFF',
    ice: false,
    garnish: []
  });

  const [resultData, setResultData] = useState<{ data: AIDrinkResult, img: string } | null>(null);

  // Initialize API Key
  React.useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Initialize Daily Mission
  React.useEffect(() => {
    if (isKeySaved) {
      setCurrentMission(missionService.getDailyMission());
    }
  }, [isKeySaved]);

  const saveApiKey = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
    setIsKeySaved(true);
    setShowSettings(false);
  };

  const resetDrink = () => {
    setDrinkState({
      glass: GlassType.ROCKS,
      steps: [],
      currentVolume: 0,
      maxVolume: GLASS_VOLUMES[GlassType.ROCKS],
      layers: [],
      isMixed: false,
      mixedColor: '#FFFFFF',
      ice: false,
      garnish: []
    });
    setResultData(null);
    setMissionResult(null);
    setCurrentAction(null);
    setIsAIPlaying(false);
    setIsAIGenerated(false);
  };

  // Central Action Handler
  const handleAction = (action: ActionType, payload: any, customDescription?: string) => {
    // 1. Trigger Animation State
    setCurrentAction(action);
    if (action === ActionType.POUR && payload.ingredient) {
      setCurrentIngredient(payload.ingredient);
      setTimeout(() => setCurrentIngredient(null), 1000);
    }
    // Clear animation state after duration
    setTimeout(() => setCurrentAction(null), action === ActionType.POUR ? 1000 : 2000);

    // 2. Update Drink Logic
    setDrinkState(prev => {
      let desc = '';
      if (action === ActionType.POUR && payload.ingredient) desc = `注入 ${payload.amount}ml ${payload.ingredient.name.split('(')[0]}`;
      if (action === ActionType.ADD_ICE) desc = "加入冰块";
      if (action === ActionType.STIR) desc = "轻柔搅拌";
      if (action === ActionType.SHAKE) desc = "大力摇晃";
      if (action === ActionType.GARNISH) desc = `装饰 ${payload.ingredient.name.split('(')[0]}`;

      const newStep: Step = {
        id: Math.random().toString(36).substr(2, 9),
        action,
        ingredientId: payload.ingredient?.id,
        amount: payload.amount,
        description: customDescription || desc
      }; let newLayers = [...prev.layers];
      let newVolume = prev.currentVolume;
      let newIsMixed = prev.isMixed;
      let newMixedColor = prev.mixedColor;
      let newIce = prev.ice;
      let newGarnish = [...prev.garnish];

      switch (action) {
        case ActionType.POUR:
          audioService.playPour();
          if (payload.ingredient) {
            newStep.ingredientId = payload.ingredient.id;
            newVolume += payload.amount;
            newLayers.push({
              id: newStep.id,
              ingredientId: payload.ingredient.id,
              name: payload.ingredient.name,
              color: payload.ingredient.color,
              density: payload.ingredient.density,
              amount: payload.amount
            });
            // Update mixed color
            if (newVolume > 0) {
              if (newVolume === payload.amount) {
                newMixedColor = payload.ingredient.color;
              } else {
                newMixedColor = blendColors(newMixedColor, newVolume - payload.amount, payload.ingredient.color, payload.amount);
              }
            }
          }
          break;
        case ActionType.ADD_ICE:
          audioService.playIce();
          newIce = true;
          break;
        case ActionType.STIR:
          audioService.playStir();
          newIsMixed = true;
          break;
        case ActionType.SHAKE:
          audioService.playShake();
          newIsMixed = true;
          break;
        case ActionType.GARNISH:
          audioService.playIce(); // Re-use clink for garnish
          if (payload.ingredient) newGarnish.push(payload.ingredient.id);
          break;
      }

      return {
        ...prev,
        steps: [...prev.steps, newStep],
        currentVolume: newVolume,
        layers: newLayers,
        isMixed: newIsMixed,
        mixedColor: newMixedColor,
        ice: newIce,
        garnish: newGarnish
      };
    });
  };
  const undoStep = () => {
    setDrinkState(prev => {
      if (prev.steps.length === 0) return prev;
      const newSteps = prev.steps.slice(0, -1);

      let newVolume = 0;
      let newLayers: any[] = [];
      let newIsMixed = false;
      let newMixedColor = '#FFFFFF';
      let newIce = false;
      let newGarnish: string[] = [];

      newSteps.forEach(step => {
        switch (step.action) {
          case ActionType.POUR:
            const ingredient = INVENTORY.find(i => i.id === step.ingredientId);
            if (ingredient) {
              const prevVol = newVolume;
              newVolume += step.amount;
              newLayers.push({
                id: step.id,
                ingredientId: ingredient.id,
                name: ingredient.name,
                color: ingredient.color,
                density: ingredient.density,
                amount: step.amount
              });
              if (newVolume > 0) {
                if (prevVol === 0) newMixedColor = ingredient.color;
                else newMixedColor = blendColors(newMixedColor, prevVol, ingredient.color, step.amount);
              }
            }
            break;
          case ActionType.ADD_ICE: newIce = true; break;
          case ActionType.STIR:
          case ActionType.SHAKE: newIsMixed = true; break;
          case ActionType.GARNISH:
            if (step.ingredientId) newGarnish.push(step.ingredientId);
            break;
        }
      });

      return {
        ...prev,
        steps: newSteps,
        currentVolume: newVolume,
        layers: newLayers,
        isMixed: newIsMixed,
        mixedColor: newMixedColor,
        ice: newIce,
        garnish: newGarnish
      };
    });
  };

  // --- AI Workflow ---

  const handleAIRequest = async (prompt: string, preferences: any) => {
    setAnalyzing(true);
    try {
      // 1. Get Recipe
      const recipe = await generateDrinkRecipe(prompt, JSON.stringify(preferences));

      // 2. Start Playback
      setAnalyzing(false);
      setIsAIPlaying(true);
      resetDrink(); // Clear previous

      await playRecipe(recipe);

      // 3. Show Result immediately (image will load in background)
      setMode(AppMode.RESULT);
      setIsAIPlaying(false);
      setIsAIGenerated(true);

      const stats = calculateStats();
      const enrichedRecipe = { ...recipe, ...stats, userPrompt: prompt };

      // Set initial result without image
      setResultData({ data: enrichedRecipe, img: '' });

      // 4. Generate Final Image in background
      const imgUrl = await generateDrinkImage(recipe.visualPrompt);
      setResultData({ data: enrichedRecipe, img: imgUrl });

    } catch (e) {
      console.error(e);
      setAnalyzing(false);
      setIsAIPlaying(false);
      alert("AI 暂时繁忙，请稍后再试");
    }
  };

  const playRecipe = async (recipe: AIDrinkResult) => {
    const stepDelay = 1500;

    // Helper to generate a color from ingredient name
    const generateColorFromName = (name: string): string => {
      // Simple hash function to generate a number from string
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Generate vibrant colors by using HSL
      const hue = Math.abs(hash) % 360;
      const saturation = 60 + (Math.abs(hash >> 8) % 20); // 60-80%
      const lightness = 45 + (Math.abs(hash >> 16) % 15); // 45-60%

      // Convert HSL to hex
      const hslToHex = (h: number, s: number, l: number) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      };

      return hslToHex(hue, saturation, lightness);
    };

    // Helper to find local ingredient match or mock one
    const findIngredient = (name: string): Ingredient => {
      const match = INVENTORY.find(i => i.name.includes(name) || name.includes(i.name.split('(')[0]));
      if (match) return match;
      // Mock generic with dynamic color
      return {
        id: 'ai_' + name,
        name: name,
        category: IngredientCategory.SYRUP_MIXER,
        abv: 0,
        color: generateColorFromName(name),
        density: 1.0,
        flavor: { sweet: 5, sour: 5, bitter: 0, spicy: 0, boozy: 0 }
      };
    };

    // Play Ingredients
    // --- Atomic Playback Sequence ---
    for (const instruction of recipe.instructions) {
      const instructionLower = instruction.toLowerCase();
      let hasExecuted = false;

      // 1. Multiple Ingredient Pouring Detection
      // We look for ALL ingredients from the list that might be mentioned in this sentence
      for (const ingMatch of recipe.ingredients) {
        const baseName = ingMatch.name.split('(')[0].split('（')[0];

        // Advanced fuzzy check:
        // 1. Exact match (rare with AI variations)
        // 2. Instruction contains base name (e.g., "倒入茉莉花浸泡二锅头")
        // 3. Base name contains significant words from instruction (e.g., "山楂糖浆" matches "自制山楂糖浆")
        // 4. Overlap of significant characters
        const isMatch = instruction.includes(baseName) ||
          baseName.includes(instruction.replace(/加入|倒入|在.*中|、|和|。/g, '').trim()) ||
          (baseName.length > 2 && instruction.includes(baseName.replace(/自制|新鲜|手工/g, '').trim())) ||
          // Final fallback for partial naming like "山楂糖浆" vs "自制山楂糖浆"
          (baseName.length > 2 && baseName.split('').some((_, i) => i < baseName.length - 2 && instruction.includes(baseName.substring(i, i + 3))));

        if (isMatch) {
          const localIng = findIngredient(ingMatch.name);
          let amount = parseInt(ingMatch.amount) || (parseInt(instruction.match(/\d+/)?.[0] || '30'));
          // Use undefined for customDescription here so handleAction generates a specific one
          handleAction(ActionType.POUR, { ingredient: localIng, amount });
          hasExecuted = true;
          await new Promise(r => setTimeout(r, 600)); // Short gap between multiple pours
        }
      }

      // 2. Techniques Detection (Keywords based)
      let techAction: ActionType | null = null;
      let techPayload: any = {};

      // Refined Shake detection: must contain shake keywords BUT not just "shaker" (摇酒壶)
      const isShakeAction = instructionLower.includes('shake') || instructionLower.includes('震') ||
        (instructionLower.includes('摇') && !instructionLower.includes('摇酒壶'));

      if (isShakeAction) {
        techAction = ActionType.SHAKE;
      } else if (instructionLower.includes('stir') || instructionLower.includes('搅')) {
        techAction = ActionType.STIR;
      } else if (instructionLower.includes('ice') || instructionLower.includes('冰')) {
        techAction = ActionType.ADD_ICE;
      } else if (instructionLower.includes('garnish') || instructionLower.includes('装饰') || instructionLower.includes('点缀') || instructionLower.includes('放入')) {
        // Only trigger garnish if it's not already handled by a POUR matching above
        if (instructionLower.includes('点缀') || instructionLower.includes('装饰') || instructionLower.includes('garnish')) {
          techAction = ActionType.GARNISH;
          const garnishIng = recipe.ingredients.find(ing => instruction.includes(ing.name.split('(')[0]));
          techPayload.ingredient = garnishIng ? findIngredient(garnishIng.name) : { name: instruction, id: 'garnish' };
        }
      }

      if (techAction) {
        // Only pass customDescription if it's NOT a complex sentence, otherwise let it use the default tech name
        const isComplex = instruction.length > 15;
        handleAction(techAction, techPayload, isComplex ? undefined : instruction);
        hasExecuted = true;
      }

      // 3. Fallback: if nothing matched but sentence has "加入" or "倒入", try to find any volume-like nouns
      if (!hasExecuted && (instruction.includes('加') || instruction.includes('倒'))) {
        // If we missed ingredients because of name mismatch but volume is there
        const volMatch = instruction.match(/(\d+)\s*(ml|毫升|克)/i);
        if (volMatch) {
          handleAction(ActionType.POUR, {
            ingredient: findIngredient(instruction.substring(0, 10)),
            amount: parseInt(volMatch[1])
          }, instruction);
          hasExecuted = true;
        }
      }

      if (hasExecuted) {
        await new Promise(r => setTimeout(r, stepDelay));
      }
    }

    await new Promise(r => setTimeout(r, 1000));
  };

  const calculateStats = () => {
    let totalVol = 0;
    let totalAbv = 0;
    let totalDensity = 0;

    drinkState.layers.forEach(layer => {
      const ing = INVENTORY.find(i => i.id === layer.ingredientId);
      if (ing) {
        totalVol += layer.amount;
        totalAbv += (ing.abv * layer.amount);
        totalDensity += (ing.density * layer.amount);
      }
    });

    return {
      abv: totalVol > 0 ? Number((totalAbv / totalVol).toFixed(1)) : 0,
      density: totalVol > 0 ? Number((totalDensity / totalVol).toFixed(3)) : 1.000,
      temp: drinkState.ice ? '4.2°C' : (drinkState.steps.some(s => s.type === ActionType.SHAKE) ? '6.5°C' : '18.2°C')
    };
  };

  // --- Manual Finish Workflow ---
  const handleManualFinish = async () => {
    setAnalyzing(true);
    try {
      const ingredientsList = drinkState.layers.map(l => ({ name: l.name, amount: `${l.amount} ml` }));
      const stepsList = drinkState.steps.map(s => s.description);
      const glassType = drinkState.glass;

      const analysis = await analyzeCustomDrink(ingredientsList, stepsList, glassType);
      const imageUrl = await generateDrinkImage(analysis.visualPrompt);

      // 3. Mission Evaluation
      if (currentMission && !currentMission.isCompleted) {
        const evaluation = await evaluateMissionSuccess(analysis, currentMission.requirements);
        setMissionResult(evaluation);
        if (evaluation.success) {
          missionService.completeMission();
          setCurrentMission(missionService.getDailyMission()); // Refresh state
        }
      }

      const stats = calculateStats();
      const enrichedAnalysis = { ...analysis, ...stats };

      setResultData({ data: enrichedAnalysis, img: imageUrl });
      setMode(AppMode.RESULT);
    } catch (e) {
      console.error(e);
      alert("生成失败");
    } finally {
      setAnalyzing(false);
    }
  };


  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden font-pixel flex flex-col relative bg-pixel-grid selection:bg-brand-gold selection:text-black">
      <div className="absolute inset-0 pointer-events-none z-[60] border-[16px] border-black opacity-20"></div>

      {!isKeySaved && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6 bg-pixel-grid">
          <div className="max-w-md w-full pixel-border bg-slate-800 p-8 space-y-6 shadow-2xl animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center space-y-2">
              <h2 className="text-2xl text-brand-gold uppercase tracking-widest">System Setup</h2>
              <p className="text-[12px] text-slate-400">INPUT GEMINI_API_KEY TO PROCEED</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="ENTER_API_KEY_HERE"
                  className="w-full bg-black/60 border-2 border-slate-700 p-4 pl-12 text-[14px] font-pixel text-brand-gold focus:border-brand-gold outline-none transition-colors"
                />
              </div>

              <button
                onClick={() => saveApiKey(apiKeyInput)}
                disabled={!apiKeyInput.trim()}
                className="w-full pixel-button bg-brand-gold text-brand-900 py-4 text-sm font-pixel flex items-center justify-center gap-2 hover:brightness-110 active:translate-y-1 transition-all disabled:opacity-50"
              >
                INITIALIZE_SYSTEM
              </button>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed italic opacity-60">
                * YOUR KEY IS STORED LOCALLY IN BROWSER STORAGE. <br />
                IT IS NEVER SENT TO ANY SERVER EXCEPT DIRECTLY TO GOOGLE AI API.
              </p>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-md w-full pixel-border bg-slate-800 p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl text-brand-gold font-pixel uppercase tracking-tight">System Configuration</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Update API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full bg-black/60 border-2 border-slate-700 p-3 text-[14px] font-pixel text-brand-gold focus:border-brand-gold outline-none transition-all"
                  />
                </div>
              </div>
              <button
                onClick={() => saveApiKey(apiKeyInput)}
                className="w-full pixel-button bg-brand-gold text-brand-900 py-3 text-sm font-pixel hover:brightness-110"
              >
                APPLY_CHANGES
              </button>
              <button
                onClick={() => {
                  if (confirm("THIS WILL ERASE ALL LOCAL STORAGE. PROCEED?")) {
                    localStorage.removeItem('GEMINI_API_KEY');
                    setIsKeySaved(false);
                    setShowSettings(false);
                    setApiKeyInput('');
                  }
                }}
                className="w-full text-[10px] text-red-500 font-pixel hover:underline pt-2 uppercase opacity-50 hover:opacity-100"
              >
                ERASE_LOCAL_CONFIG
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === AppMode.DIY && (
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          {/* Retro Header - Optimized for mobile */}
          <header className="px-3 md:px-6 py-3 md:py-4 bg-black border-b-4 border-black flex justify-between items-center z-30 shadow-[0_4px_0_0_#1a1a1a]">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="px-2 py-1 bg-brand-gold text-brand-900 text-[10px] md:text-[12px] animate-pulse">LIVE</div>
              <h1 className="text-base md:text-xl tracking-tighter text-white">
                LIQUID_ART <span className="hidden sm:inline text-brand-gold opacity-50 font-pixel">V1.1</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[12px] text-slate-500 uppercase">System Status</span>
                <span className="text-[14px] text-green-500">READY_TO_MIX</span>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 border-2 border-slate-800 hover:border-brand-gold transition-colors text-slate-500 hover:text-brand-gold"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => setShowGallery(true)}
                className="p-2 border-2 border-slate-800 hover:border-brand-gold transition-colors text-slate-500 hover:text-brand-gold flex items-center gap-2"
              >
                <Library size={18} />
                <span className="hidden lg:inline text-[10px] font-pixel">ARCHIVE</span>
              </button>
              <button
                onClick={() => setShowMission(true)}
                className={`p-2 border-2 transition-colors flex items-center gap-2 ${currentMission?.isCompleted
                  ? 'border-green-800 text-green-600 hover:border-green-500 hover:text-green-500'
                  : 'border-slate-800 text-slate-500 hover:border-brand-gold hover:text-brand-gold'
                  }`}
              >
                <Target size={18} />
                <span className="hidden lg:inline text-[10px] font-pixel">DAILY_MISSION</span>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

            {/* === MOBILE LAYOUT === */}
            <div className="flex-1 flex flex-col md:hidden overflow-hidden">
              {/* Mobile: Simulator View */}
              {mobileTab === 'simulator' && (
                <div className="flex-1 flex flex-col relative bg-slate-900 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
                  <GlassSimOverlay />
                  <div className="flex-1 flex items-center justify-center overflow-hidden z-10 relative">
                    <GlassSimulator drinkState={drinkState} currentAction={currentAction} currentIngredient={currentIngredient} />
                  </div>
                  <div className="shrink-0 z-20 mb-[60px]">
                    <Timeline steps={drinkState.steps} />
                  </div>
                </div>
              )}

              {/* Mobile: Workbench View */}
              {mobileTab === 'workbench' && (
                <div className="flex-1 overflow-hidden">
                  <Workbench
                    drinkState={drinkState}
                    onAction={handleAction}
                    onSelectGlass={(g) => setDrinkState(prev => ({ ...prev, glass: g, maxVolume: GLASS_VOLUMES[g] }))}
                    onFinish={handleManualFinish}
                    onAIRequest={handleAIRequest}
                    onUndo={undoStep}
                    onReset={resetDrink}
                    loading={analyzing}
                    aiMode={isAIPlaying}
                    isAIGenerated={isAIGenerated}
                  />
                </div>
              )}
            </div>

            {/* === DESKTOP LAYOUT (unchanged) === */}
            <div className="hidden md:flex flex-1 flex-row overflow-hidden h-full">
              {/* Simulator Area */}
              <div className="flex-1 flex flex-col relative h-full bg-slate-900 border-r-4 border-black overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
                <GlassSimOverlay />
                <div className="flex-1 flex items-center justify-center overflow-hidden z-10 relative">
                  <GlassSimulator drinkState={drinkState} currentAction={currentAction} currentIngredient={currentIngredient} />
                </div>
                <div className="shrink-0 z-20">
                  <Timeline steps={drinkState.steps} />
                </div>
              </div>

              {/* Controls Area */}
              <div className="flex-1 h-full z-20 shadow-2xl overflow-y-auto custom-scrollbar">
                <Workbench
                  drinkState={drinkState}
                  onAction={handleAction}
                  onSelectGlass={(g) => setDrinkState(prev => ({ ...prev, glass: g, maxVolume: GLASS_VOLUMES[g] }))}
                  onFinish={handleManualFinish}
                  onAIRequest={handleAIRequest}
                  onUndo={undoStep}
                  onReset={resetDrink}
                  loading={analyzing}
                  aiMode={isAIPlaying}
                  isAIGenerated={isAIGenerated}
                />
              </div>
            </div>

            {/* === MOBILE BOTTOM TAB NAVIGATION === */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t-4 border-slate-800 safe-area-bottom">
              <div className="flex">
                <button
                  onClick={() => setMobileTab('simulator')}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all ${mobileTab === 'simulator'
                    ? 'text-brand-gold bg-slate-900'
                    : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  <Beaker size={22} />
                  <span className="text-[10px] font-pixel uppercase">调酒台</span>
                </button>
                <button
                  onClick={() => setMobileTab('workbench')}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all ${mobileTab === 'workbench'
                    ? 'text-brand-gold bg-slate-900'
                    : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  <Package size={22} />
                  <span className="text-[10px] font-pixel uppercase">材料库</span>
                </button>
                <button
                  onClick={() => setShowGallery(true)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all text-slate-500 hover:text-slate-300"
                >
                  <Library size={22} />
                  <span className="text-[10px] font-pixel uppercase">存档</span>
                </button>
              </div>
            </nav>
          </main>
        </div>
      )}

      {mode === AppMode.RESULT && resultData && (
        <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 flex items-center justify-center bg-pixel-grid bg-black/40">
            <DrinkResult
              result={resultData.data}
              imageUrl={resultData.img}
              glass={drinkState.glass}
              color={drinkState.mixedColor}
              missionResult={missionResult}
              onReset={() => { setMode(AppMode.DIY); resetDrink(); }}
            />
          </div>
        </div>
      )}

      {showGallery && <RecipeGallery onClose={() => setShowGallery(false)} />}
      {showMission && currentMission && (
        <DailyMissionModal
          mission={currentMission}
          onClose={() => setShowMission(false)}
          onStart={() => setShowMission(false)}
        />
      )}
    </div>
  );
}

export default App;
