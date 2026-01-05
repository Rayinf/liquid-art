
import { SavedDrink } from '../types';

const STORAGE_KEY = 'liquid_art_saved_drinks';

export const storageService = {
    getSavedDrinks: (): SavedDrink[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse saved drinks', e);
            return [];
        }
    },

    saveDrink: (drink: SavedDrink): void => {
        let drinks = storageService.getSavedDrinks();
        // Pre-emptively limit to 50 recent drinks to avoid hitting limits too often? 
        // Or just let the error handler handle it. Let's do robust error handling.

        const trySave = (items: SavedDrink[]) => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                return true;
            } catch (e: any) {
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                    return false;
                }
                throw e;
            }
        };

        let updatedDrinks = [drink, ...drinks];

        // Loop until saved or empty
        while (!trySave(updatedDrinks)) {
            if (updatedDrinks.length <= 1) {
                // Warning: item itself is too big (unlikely) or something else is wrong
                console.error("Storage full, cannot save even single item.");
                alert("存储空间已满，无法保存更多配方。请尝试清除部分旧存档。");
                return;
            }
            // Remove the oldest (last item)
            updatedDrinks.pop();
            // Also update the source `drinks` state logic essentially if we were maintaining it, 
            // but here we just need to save the new state which includes the new drink and n-1 old ones.
        }
    },

    deleteDrink: (id: string): void => {
        const drinks = storageService.getSavedDrinks();
        const updatedDrinks = drinks.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrinks));
    },

    clearAll: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
