export enum IngredientCategory {
  BASE_SPIRIT = '基酒',
  LIQUEUR = '利口酒',
  SYRUP_MIXER = '糖浆/辅料',
  GARNISH = '装饰',
  ICE = '冰块'
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  abv: number; // Alcohol by volume %
  color: string; // Hex code
  density: number; // For physics layering (Water = 1.0, Syrup > 1.0, Alcohol < 1.0)
  flavor: {
    sweet: number;
    sour: number;
    bitter: number;
    spicy: number;
    boozy: number; // intensity
  };
  description?: string;
  suggestedPairings?: string[]; // IDs of suggested ingredients
  icon?: string; // Pixel art icon emoji or path
}

export enum GlassType {
  ROCKS = '古典杯',
  HIGHBALL = '海波杯',
  MARTINI = '马提尼杯',
  COUPE = '浅碟香槟杯'
}

export enum ActionType {
  ADD_ICE = '加冰',
  POUR = '倒入',
  STIR = '搅拌',
  SHAKE = '摇晃',
  STRAIN = '过滤',
  GARNISH = '装饰'
}

export interface Step {
  id: string;
  action: ActionType;
  ingredientId?: string; // If pouring/garnishing
  amount?: number; // ml
  description: string;
}

export interface DrinkState {
  glass: GlassType;
  steps: Step[];
  currentVolume: number;
  maxVolume: number;
  layers: LiquidLayer[]; // Current visual state of liquid
  isMixed: boolean; // If stirred/shaken, layers merge
  mixedColor: string; // The resulting color if mixed
  ice: boolean;
  garnish: string[];
}

export interface LiquidLayer {
  id: string;
  ingredientId: string;
  amount: number;
  color: string;
  density: number;
  name: string;
}

export interface AIDrinkResult {
  name: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  visualPrompt: string; // Used to generate image
  flavorProfile: {
    sweet: number;
    sour: number;
    bitter: number;
    spicy: number;
    boozy: number;
    salty: number;
  };
}