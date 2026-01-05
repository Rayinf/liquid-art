
import React from 'react';
import { DailyMission, MissionRequirement } from '../types';
import { X, Target, Award, User, Quote } from 'lucide-react';

interface DailyMissionModalProps {
    mission: DailyMission;
    onClose: () => void;
    onStart: () => void;
}

const DailyMissionModal: React.FC<DailyMissionModalProps> = ({ mission, onClose, onStart }) => {
    const renderRequirement = (req: MissionRequirement, index: number) => {
        let text = '';
        switch (req.type) {
            case 'ingredient': text = `使用 ${req.value}ml ${req.target}`; break;
            case 'flavor': text = `风味要求: ${req.target} 强度 >= ${req.value}`; break;
            case 'glass': text = `必须使用: ${req.target}`; break;
            case 'alcohol_level': text = req.value === 0 ? '调配无酒精饮品' : `酒精强度达到 ${req.value}%`; break;
        }

        return (
            <div key={index} className="flex items-center gap-3 p-3 bg-black/40 border-l-4 border-brand-gold/60 group hover:bg-black/60 transition-colors">
                <Target size={14} className="text-brand-gold/40 group-hover:text-brand-gold" />
                <span className="text-[13px] font-pixel text-slate-300 uppercase">{text}</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 scanlines">
            <div className="max-w-2xl w-full bg-slate-900 border-4 border-black relative overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[400px]">

                {/* Left: NPC Visual */}
                <div className="w-full md:w-2/5 bg-black flex flex-col items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-black relative">
                    <div className="absolute top-4 left-4 text-[10px] font-pixel text-brand-gold/20">NPC_IDENT: {mission.npcName.toUpperCase()}</div>
                    <div className="text-8xl mb-6 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-bounce">{mission.npcAvatar}</div>
                    <div className="text-center">
                        <h3 className="text-xl font-pixel text-brand-gold uppercase tracking-tighter mb-1">{mission.npcName}</h3>
                        <div className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-pixel text-brand-gold">REQUESTER</div>
                    </div>
                </div>

                {/* Right: Mission Details */}
                <div className="flex-1 p-6 md:p-8 flex flex-col bg-pixel-grid relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h4 className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest flex items-center gap-2 mb-3">
                                <Quote size={10} /> THE_REQUEST
                            </h4>
                            <div className="bg-slate-800/80 p-4 border-l-4 border-brand-gold relative shadow-xl">
                                <p className="text-[14px] font-pixel text-white leading-relaxed italic">
                                    {mission.requestDescription}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Target size={10} /> CHALLENGE_CONSTRAINTS
                            </h4>
                            <div className="space-y-2">
                                {mission.requirements.map((req, i) => renderRequirement(req, i))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between text-[12px] font-pixel">
                                <span className="text-slate-500 uppercase">Mission_Reward:</span>
                                <div className="flex items-center gap-2 text-brand-gold">
                                    <Award size={16} />
                                    <span>{mission.reward}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onStart}
                        className="mt-8 w-full pixel-button bg-brand-gold text-brand-900 py-4 font-pixel text-sm hover:brightness-110 active:translate-y-1 transition-all shadow-[0_4px_0_0_#92400e]"
                    >
                        ACCEPT_CHALLENGE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailyMissionModal;
