
import React, { useEffect, useState } from 'react';
import { SavedDrink } from '../types';
import { storageService } from '../services/storageService';
import { Trash2, X, Beaker, Clock, Star } from 'lucide-react';

interface RecipeGalleryProps {
    onClose: () => void;
    onSelectDrink?: (drink: SavedDrink) => void;
}

const RecipeGallery: React.FC<RecipeGalleryProps> = ({ onClose, onSelectDrink }) => {
    const [drinks, setDrinks] = useState<SavedDrink[]>([]);
    const [selectedDrink, setSelectedDrink] = useState<SavedDrink | null>(null);

    useEffect(() => {
        setDrinks(storageService.getSavedDrinks());
    }, []);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('确定要删除这个配方吗？')) {
            storageService.deleteDrink(id);
            setDrinks(storageService.getSavedDrinks());
            if (selectedDrink?.id === id) setSelectedDrink(null);
        }
    };

    const DecoCorners = () => (
        <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-brand-gold/30"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-brand-gold/30"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-brand-gold/30"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-brand-gold/30"></div>
        </>
    );

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 scanlines">
            <div className="w-full max-w-6xl h-full max-h-[90vh] bg-slate-900 border-4 border-black relative flex flex-col overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-4 border-b-4 border-black bg-black flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <Star className="text-brand-gold animate-pulse" size={20} />
                        <h2 className="text-xl font-pixel text-brand-gold uppercase tracking-widest">Masterpiece_Archives</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 transition-colors text-slate-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* List Section */}
                    <div className="w-full md:w-1/3 border-r-4 border-black flex flex-col h-full bg-slate-950/50">
                        <div className="p-3 bg-black/40 border-b border-white/5">
                            <span className="text-[10px] text-slate-500 font-pixel uppercase">Storage_Usage: {drinks.length}/100</span>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {drinks.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-700 font-pixel gap-2">
                                    <Beaker size={32} />
                                    <span className="text-[12px]">ARCHIVE_EMPTY</span>
                                </div>
                            ) : (
                                drinks.map(drink => (
                                    <button
                                        key={drink.id}
                                        onClick={() => setSelectedDrink(drink)}
                                        className={`w-full text-left p-3 border-2 transition-all relative group ${selectedDrink?.id === drink.id
                                                ? 'bg-slate-800 border-brand-gold/60'
                                                : 'bg-black/30 border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex gap-3 items-center">
                                            <div className="w-12 h-12 bg-black shrink-0 overflow-hidden border border-white/10">
                                                {drink.imageUrl ? (
                                                    <img src={drink.imageUrl} className="w-full h-full object-cover pixelated opacity-80" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: drink.color }}></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[12px] font-pixel text-brand-gold truncate uppercase">{drink.data.name}</div>
                                                <div className="text-[10px] text-slate-500 font-pixel flex items-center gap-1 mt-1">
                                                    <Clock size={10} />
                                                    {new Date(drink.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDelete(e, drink.id)}
                                                className="p-1 px-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detailed View */}
                    <div className="flex-1 overflow-y-auto bg-pixel-grid p-6 custom-scrollbar">
                        {selectedDrink ? (
                            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Image/Visuals */}
                                    <div className="space-y-4">
                                        <div className="relative aspect-square bg-black border-4 border-black overflow-hidden shadow-2xl">
                                            <DecoCorners />
                                            {selectedDrink.imageUrl ? (
                                                <img src={selectedDrink.imageUrl} className="w-full h-full object-cover pixelated" alt={selectedDrink.data.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-brand-gold font-pixel" style={{ backgroundColor: selectedDrink.color }}>
                                                    NO_VISUAL_DATA
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-pixel text-brand-gold mb-2 uppercase tracking-tighter">{selectedDrink.data.name}</h3>
                                            <p className="text-[14px] font-pixel text-slate-400 leading-relaxed bg-black/40 p-3 border-l-4 border-brand-gold/40">
                                                {selectedDrink.data.description}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[12px] font-pixel text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Ingredients</h4>
                                            <ul className="space-y-2">
                                                {selectedDrink.data.ingredients.map((ing, i) => (
                                                    <li key={i} className="flex justify-between text-[13px] font-pixel">
                                                        <span className="text-slate-300"># {ing.name}</span>
                                                        <span className="text-brand-gold/60">{ing.amount}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Methodology */}
                                <div className="p-4 bg-black/60 border-2 border-slate-800">
                                    <h4 className="text-[12px] font-pixel text-slate-500 uppercase mb-4 tracking-widest">Mixology_Protocol</h4>
                                    <div className="space-y-3">
                                        {selectedDrink.data.instructions.map((step, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <span className="text-[10px] font-pixel text-brand-gold/40 mt-1">{String(i + 1).padStart(2, '0')}</span>
                                                <span className="text-[13px] font-pixel text-slate-300 uppercase">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-700 font-pixel gap-4">
                                <Beaker size={48} className="opacity-20" />
                                <span className="text-[14px] tracking-widest">SELECT_AN_ARCHIVE_TO_VIEW_PROTOCOL</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeGallery;
