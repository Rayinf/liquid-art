import React from 'react';
import { Step, ActionType } from '../types';
import { Droplets, RotateCw, Snowflake, ChefHat } from 'lucide-react';

interface TimelineProps {
  steps: Step[];
}

const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <div className="w-full bg-black/80 backdrop-blur-sm border-t-4 border-black p-3 relative scanlines overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 mb-3 p-1 bg-slate-900 border-b-2 border-slate-800 sticky top-0 z-20">
        <div className="w-2 h-2 bg-red-600 animate-pulse"></div>
        <span className="text-[12px] font-pixel text-slate-500 uppercase tracking-widest">LOG_CONSOLE_V1.12</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-start">
        {steps.length === 0 && (
          <span className="col-span-full text-slate-700 text-[14px] font-pixel p-2 uppercase animate-pulse">_WAITING_FOR_INPUT...</span>
        )}
        {steps.map((step, index) => (
          <div key={step.id} className="p-2 bg-slate-900/80 border-l-2 border-brand-gold animate-[fadeIn_0.3s_ease-out] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-pixel text-brand-gold uppercase mb-1 opacity-70 truncate">{`#${index + 1} >> ${step.action}`}</div>
              <div className="text-[12px] font-pixel text-white leading-tight mb-1 line-clamp-2">{step.description}</div>
            </div>
            {step.amount && <div className="text-[10px] font-pixel text-slate-500 mt-1">VAL: {step.amount}ML</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;