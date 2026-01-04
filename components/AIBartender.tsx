import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateDrinkRecipe, generateDrinkImage } from '../services/geminiService';
import { AIDrinkResult } from '../types';

interface AIBartenderProps {
  onResult: (result: AIDrinkResult, imageUrl: string) => void;
}

const AIBartender: React.FC<AIBartenderProps> = ({ onResult }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(''); 
  const [preferences, setPreferences] = useState({
    boozy: 'medium', // low, medium, high
    taste: 'balanced', // sweet, sour, bitter
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setLoadingState("正在连接灵感网络...");

    try {
      // 1. Generate Recipe
      setTimeout(() => setLoadingState("AI 正在构思配方..."), 1000);
      const recipe = await generateDrinkRecipe(prompt, JSON.stringify(preferences));
      
      // 2. Generate Visual
      setLoadingState("正在调制视觉影像...");
      const imageUrl = await generateDrinkImage(recipe.visualPrompt);

      onResult(recipe, imageUrl);

    } catch (error) {
      console.error(error);
      alert("灵感连接中断 (API Error). 请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <Sparkles className="w-12 h-12 text-brand-gold mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl font-serif text-white mb-2 tracking-wider">AI 灵感特调</h2>
        <p className="text-slate-400">描述一种心情、一个地点或一段回忆。<br/>我们将它蒸馏成液体的诗篇。</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-accent rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：“东京雨夜，霓虹灯倒映在湿漉漉的路面。带点忧郁但清爽的感觉。”"
            className="relative w-full h-32 bg-brand-900 border border-white/10 rounded-xl p-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold/50 resize-none transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-4 justify-center">
            <select 
                className="bg-brand-800 border border-white/10 rounded px-4 py-2 text-sm text-slate-300 focus:border-brand-gold outline-none"
                value={preferences.boozy}
                onChange={(e) => setPreferences({...preferences, boozy: e.target.value})}
            >
                <option value="low">低酒精 (Low ABV)</option>
                <option value="medium">标准浓度 (Standard)</option>
                <option value="high">烈酒 (Strong)</option>
            </select>
             <select 
                className="bg-brand-800 border border-white/10 rounded px-4 py-2 text-sm text-slate-300 focus:border-brand-gold outline-none"
                value={preferences.taste}
                onChange={(e) => setPreferences({...preferences, taste: e.target.value})}
            >
                <option value="sweet">偏甜 (Sweet)</option>
                <option value="sour">偏酸/柑橘 (Sour)</option>
                <option value="bitter">苦味/复杂 (Bitter)</option>
                <option value="balanced">均衡 (Balanced)</option>
            </select>
        </div>

        <button
          type="button" 
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full py-4 bg-brand-gold text-brand-900 font-serif font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> {loadingState}
            </>
          ) : (
            '生成特调 (Generate)'
          )}
        </button>
      </form>

      <div className="mt-12 grid grid-cols-2 gap-4 opacity-50 text-sm">
         <div className="bg-white/5 p-3 rounded text-center cursor-pointer hover:bg-white/10 border border-white/5 hover:border-brand-gold/30 transition-all" onClick={() => setPrompt("踩在秋天落叶上的清脆感觉，带点烟熏味。")}>
            "秋日落叶"
         </div>
         <div className="bg-white/5 p-3 rounded text-center cursor-pointer hover:bg-white/10 border border-white/5 hover:border-brand-gold/30 transition-all" onClick={() => setPrompt("赛博朋克2077的上流酒会，金属与迷幻。")}>
            "赛博朋克派对"
         </div>
      </div>
    </div>
  );
};

export default AIBartender;