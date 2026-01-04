
import { Ingredient, IngredientCategory, GlassType } from './types';

export const GLASS_VOLUMES: Record<GlassType, number> = {
  [GlassType.ROCKS]: 250,
  [GlassType.HIGHBALL]: 350,
  [GlassType.MARTINI]: 200,
  [GlassType.COUPE]: 180,
};

export const INVENTORY: Ingredient[] = [
  // --- 基酒 (Base Spirits) ---
  {
    id: 'vodka',
    name: '伏特加 (Vodka)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#F0F8FF',
    density: 0.94,
    flavor: { sweet: 0, sour: 0, bitter: 1, spicy: 2, boozy: 8 },
    suggestedPairings: ['vermouth_dry', 'oj', 'cranberry', 'kahlua', 'lime'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'gin',
    name: '伦敦干金酒 (Gin)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#F5F5F5',
    density: 0.94,
    flavor: { sweet: 0, sour: 1, bitter: 3, spicy: 3, boozy: 8 },
    suggestedPairings: ['tonic', 'vermouth_dry', 'lemon', 'campari'],
    icon: '/icons/gin.png'
  },
  {
    id: 'gin_hendricks',
    name: '亨利爵士金酒 (Hendrick\'s)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 41,
    color: '#F0FFF0',
    density: 0.94,
    flavor: { sweet: 1, sour: 1, bitter: 2, spicy: 2, boozy: 8 },
    suggestedPairings: ['tonic', 'cucumber', 'rose'],
    icon: '/icons/gin.png'
  },
  {
    id: 'whiskey_bourbon',
    name: '波本威士忌 (Bourbon)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 45,
    color: '#CD853F', // Amber
    density: 0.94,
    flavor: { sweet: 3, sour: 0, bitter: 2, spicy: 4, boozy: 9 },
    suggestedPairings: ['bitters', 'vermouth_sweet', 'syrup_sugar'],
    icon: '/icons/whiskey.png'
  },
  {
    id: 'whiskey_rye',
    name: '黑麦威士忌 (Rye)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 45,
    color: '#B8860B',
    density: 0.94,
    flavor: { sweet: 2, sour: 0, bitter: 2, spicy: 6, boozy: 9 },
    suggestedPairings: ['vermouth_sweet', 'bitters'],
    icon: '/icons/whiskey.png'
  },
  {
    id: 'whiskey_scotch',
    name: '苏格兰威士忌 (Scotch)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#DAA520',
    density: 0.94,
    flavor: { sweet: 1, sour: 0, bitter: 4, spicy: 5, boozy: 8 },
    suggestedPairings: ['amaretto', 'drambuie', 'soda'],
    icon: '/icons/whiskey.png'
  },
  {
    id: 'whiskey_irish',
    name: '爱尔兰威士忌 (Irish Whiskey)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#DAA520',
    density: 0.94,
    flavor: { sweet: 2, sour: 0, bitter: 1, spicy: 3, boozy: 8 },
    suggestedPairings: ['coffee', 'cream', 'ginger_ale'],
    icon: '/icons/whiskey.png'
  },
  {
    id: 'rum_white',
    name: '白朗姆酒 (White Rum)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#FAFAFA',
    density: 0.94,
    flavor: { sweet: 4, sour: 0, bitter: 0, spicy: 1, boozy: 8 },
    suggestedPairings: ['lime', 'syrup_simple', 'mint', 'cola', 'pineapple'],
    icon: '/icons/rum.png'
  },
  {
    id: 'rum_dark',
    name: '深色朗姆酒 (Dark Rum)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#8B4513',
    density: 0.95,
    flavor: { sweet: 6, sour: 0, bitter: 2, spicy: 3, boozy: 8 },
    suggestedPairings: ['ginger_beer', 'lime', 'pineapple', 'oj'],
    icon: '/icons/rum.png'
  },
  {
    id: 'rum_spiced',
    name: '香料朗姆酒 (Spiced Rum)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 35,
    color: '#A0522D',
    density: 0.96,
    flavor: { sweet: 7, sour: 0, bitter: 1, spicy: 6, boozy: 7 },
    suggestedPairings: ['cola', 'ginger_beer'],
    icon: '/icons/rum.png'
  },
  {
    id: 'tequila_blanco',
    name: '银龙舌兰 (Tequila Blanco)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#F0FFFF',
    density: 0.94,
    flavor: { sweet: 1, sour: 1, bitter: 2, spicy: 5, boozy: 8 },
    suggestedPairings: ['lime', 'cointreau', 'syrup_agave', 'grapefruit'],
    icon: '/icons/tequila.png'
  },
  {
    id: 'tequila_reposado',
    name: '金龙舌兰 (Reposado)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#F4A460',
    density: 0.94,
    flavor: { sweet: 2, sour: 0, bitter: 2, spicy: 4, boozy: 8 },
    suggestedPairings: ['lime', 'agave'],
    icon: '/icons/tequila.png'
  },
  {
    id: 'brandy',
    name: '白兰地 (Brandy)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#8B4513',
    density: 0.95,
    flavor: { sweet: 5, sour: 1, bitter: 1, spicy: 2, boozy: 8 },
    suggestedPairings: ['cointreau', 'lemon'],
    icon: '/icons/whiskey.png'
  },
  {
    id: 'cognac',
    name: '干邑 (Cognac)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#800000',
    density: 0.95,
    flavor: { sweet: 4, sour: 1, bitter: 2, spicy: 2, boozy: 8 },
    suggestedPairings: ['cointreau', 'lemon'],
    icon: '/icons/whiskey.png'
  },
  {
    id: 'mezcal',
    name: '梅斯卡尔 (Mezcal)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 42,
    color: '#FFFFF0',
    density: 0.94,
    flavor: { sweet: 1, sour: 1, bitter: 3, spicy: 8, boozy: 8 },
    suggestedPairings: ['lime', 'agave', 'grapefruit'],
    icon: '/icons/tequila.png'
  },
  {
    id: 'pisco',
    name: '皮斯科 (Pisco)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#FFFFF0',
    density: 0.94,
    flavor: { sweet: 3, sour: 2, bitter: 1, spicy: 1, boozy: 8 },
    suggestedPairings: ['lime', 'egg_white', 'bitters'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'cachaca',
    name: '卡查萨 (Cachaça)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 40,
    color: '#F0FFF0',
    density: 0.94,
    flavor: { sweet: 5, sour: 1, bitter: 0, spicy: 3, boozy: 8 },
    suggestedPairings: ['lime', 'sugar'],
    icon: '/icons/rum.png'
  },
  {
    id: 'absinthe',
    name: '苦艾酒 (Absinthe)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 60,
    color: '#7FFF00', // Chartreuse green
    density: 0.90,
    flavor: { sweet: 2, sour: 0, bitter: 8, spicy: 9, boozy: 10 },
    suggestedPairings: ['sugar', 'water'],
    icon: '/icons/liqueur_green.png'
  },
  {
    id: 'sake',
    name: '清酒 (Sake)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 15,
    color: '#F5F5DC',
    density: 0.99,
    flavor: { sweet: 3, sour: 1, bitter: 0, spicy: 0, boozy: 3 },
    suggestedPairings: ['lime', 'cucumber', 'lychee'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'sambuca',
    name: '萨姆布卡 (Sambuca)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 42,
    color: '#FFFFFF',
    density: 0.94,
    flavor: { sweet: 6, sour: 0, bitter: 1, spicy: 7, boozy: 8 },
    suggestedPairings: ['coffee', 'cream'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'jagermeister',
    name: '野格 (Jägermeister)',
    category: IngredientCategory.BASE_SPIRIT,
    abv: 35,
    color: '#2F1B0C',
    density: 0.96,
    flavor: { sweet: 4, sour: 0, bitter: 6, spicy: 7, boozy: 7 },
    suggestedPairings: ['ginger_beer', 'energy_drink'],
    icon: '/icons/liqueur_red.png'
  },

  // --- 利口酒 (Liqueurs) ---
  {
    id: 'blue_curacao',
    name: '蓝库拉索 (Blue Curacao)',
    category: IngredientCategory.LIQUEUR,
    abv: 20,
    color: '#0000FF', // Vivid Blue
    density: 1.08,
    flavor: { sweet: 8, sour: 1, bitter: 2, spicy: 0, boozy: 4 },
    suggestedPairings: ['vodka', 'rum_white', 'lemon', 'pineapple'],
    icon: '/icons/liqueur_blue.png'
  },
  {
    id: 'vermouth_sweet',
    name: '甜味美思 (Sweet Vermouth)',
    category: IngredientCategory.LIQUEUR,
    abv: 16,
    color: '#8B0000', // Dark Red/Brown
    density: 1.02,
    flavor: { sweet: 6, sour: 2, bitter: 4, spicy: 2, boozy: 3 },
    suggestedPairings: ['whiskey', 'campari', 'gin'],
    icon: '/icons/liqueur_red.png'
  },
  {
    id: 'vermouth_dry',
    name: '干味美思 (Dry Vermouth)',
    category: IngredientCategory.LIQUEUR,
    abv: 16,
    color: '#FFFFF0', // Pale
    density: 1.01,
    flavor: { sweet: 1, sour: 3, bitter: 3, spicy: 1, boozy: 3 },
    suggestedPairings: ['gin', 'vodka'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'campari',
    name: '金巴利 (Campari)',
    category: IngredientCategory.LIQUEUR,
    abv: 25,
    color: '#DC143C', // Bright Red
    density: 1.05,
    flavor: { sweet: 5, sour: 1, bitter: 9, spicy: 1, boozy: 5 },
    suggestedPairings: ['gin', 'vermouth_sweet', 'soda'],
    icon: '/icons/liqueur_red.png'
  },
  {
    id: 'aperol',
    name: '阿佩罗 (Aperol)',
    category: IngredientCategory.LIQUEUR,
    abv: 11,
    color: '#FF4500', // Orange Red
    density: 1.06,
    flavor: { sweet: 7, sour: 1, bitter: 5, spicy: 0, boozy: 2 },
    suggestedPairings: ['prosecco', 'soda', 'orange'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'cointreau',
    name: '君度 (Cointreau)',
    category: IngredientCategory.LIQUEUR,
    abv: 40,
    color: '#FFFAF0', // Clear
    density: 1.04,
    flavor: { sweet: 6, sour: 1, bitter: 2, spicy: 1, boozy: 7 },
    suggestedPairings: ['tequila', 'brandy', 'lime', 'lemon'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'triple_sec',
    name: '三秒酒 (Triple Sec)',
    category: IngredientCategory.LIQUEUR,
    abv: 20,
    color: '#FFFFFF',
    density: 1.09,
    flavor: { sweet: 8, sour: 1, bitter: 1, spicy: 0, boozy: 4 },
    suggestedPairings: ['tequila', 'lime'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'kahlua',
    name: '咖啡利口酒 (Kahlua)',
    category: IngredientCategory.LIQUEUR,
    abv: 20,
    color: '#2F1B0C', // Dark Coffee
    density: 1.10,
    flavor: { sweet: 8, sour: 0, bitter: 4, spicy: 0, boozy: 4 },
    suggestedPairings: ['vodka', 'cream'],
    icon: '/icons/liqueur_red.png'
  },
  {
    id: 'baileys',
    name: '百利甜 (Baileys)',
    category: IngredientCategory.LIQUEUR,
    abv: 17,
    color: '#D2B48C', // Tan
    density: 1.08,
    flavor: { sweet: 9, sour: 0, bitter: 1, spicy: 0, boozy: 3 },
    suggestedPairings: ['kahlua', 'vodka'],
    icon: '/icons/cream.png'
  },
  {
    id: 'amaretto',
    name: '杏仁利口酒 (Amaretto)',
    category: IngredientCategory.LIQUEUR,
    abv: 28,
    color: '#CD853F',
    density: 1.07,
    flavor: { sweet: 9, sour: 0, bitter: 2, spicy: 1, boozy: 5 },
    suggestedPairings: ['whiskey', 'lemon'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'elderflower',
    name: '接骨木花 (St. Germain)',
    category: IngredientCategory.LIQUEUR,
    abv: 20,
    color: '#FFFACD', // Pale Yellow
    density: 1.06,
    flavor: { sweet: 7, sour: 1, bitter: 0, spicy: 0, boozy: 4 },
    suggestedPairings: ['gin', 'soda', 'champagne'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'malibu',
    name: '马利宝椰子酒 (Malibu)',
    category: IngredientCategory.LIQUEUR,
    abv: 21,
    color: '#FFFFFF',
    density: 1.02,
    flavor: { sweet: 9, sour: 0, bitter: 0, spicy: 0, boozy: 3 },
    suggestedPairings: ['pineapple', 'rum_white'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'midori',
    name: '蜜瓜利口酒 (Midori)',
    category: IngredientCategory.LIQUEUR,
    abv: 20,
    color: '#32CD32', // Lime Green
    density: 1.09,
    flavor: { sweet: 9, sour: 1, bitter: 0, spicy: 0, boozy: 4 },
    suggestedPairings: ['vodka', 'lemon', 'soda'],
    icon: '/icons/liqueur_green.png'
  },
  {
    id: 'chambord',
    name: '黑树莓利口酒 (Chambord)',
    category: IngredientCategory.LIQUEUR,
    abv: 16,
    color: '#800080', // Purple
    density: 1.12,
    flavor: { sweet: 9, sour: 1, bitter: 0, spicy: 0, boozy: 3 },
    suggestedPairings: ['champagne', 'vodka'],
    icon: '/icons/liqueur_red.png'
  },
  {
    id: 'creme_de_cassis',
    name: '黑加仑利口酒 (Crème de Cassis)',
    category: IngredientCategory.LIQUEUR,
    abv: 15,
    color: '#4B0082', // Indigo
    density: 1.15,
    flavor: { sweet: 9, sour: 2, bitter: 0, spicy: 0, boozy: 3 },
    suggestedPairings: ['champagne', 'wine_white'],
    icon: '/icons/liqueur_red.png'
  },
  {
    id: 'creme_de_menthe',
    name: '薄荷利口酒 (Crème de Menthe)',
    category: IngredientCategory.LIQUEUR,
    abv: 24,
    color: '#00FF7F', // Spring Green
    density: 1.10,
    flavor: { sweet: 8, sour: 0, bitter: 0, spicy: 5, boozy: 4 },
    suggestedPairings: ['brandy', 'cream'],
    icon: '/icons/liqueur_green.png'
  },
  {
    id: 'maraschino',
    name: '黑樱桃利口酒 (Maraschino)',
    category: IngredientCategory.LIQUEUR,
    abv: 32,
    color: '#F0FFFF',
    density: 1.03,
    flavor: { sweet: 5, sour: 1, bitter: 2, spicy: 2, boozy: 6 },
    suggestedPairings: ['gin', 'lemon', 'creme_de_violette'],
    icon: '/icons/vodka.png'
  },
  {
    id: 'creme_de_violette',
    name: '紫罗兰利口酒 (Crème de Violette)',
    category: IngredientCategory.LIQUEUR,
    abv: 22,
    color: '#EE82EE', // Violet
    density: 1.08,
    flavor: { sweet: 8, sour: 0, bitter: 1, spicy: 0, boozy: 4 },
    suggestedPairings: ['gin', 'lemon', 'maraschino'],
    icon: '/icons/liqueur_blue.png'
  },
  {
    id: 'galliano',
    name: '加利亚诺 (Galliano)',
    category: IngredientCategory.LIQUEUR,
    abv: 42,
    color: '#FFFF00', // Yellow
    density: 1.05,
    flavor: { sweet: 7, sour: 0, bitter: 1, spicy: 4, boozy: 8 },
    suggestedPairings: ['vodka', 'oj'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'chartreuse_green',
    name: '绿查特酒 (Green Chartreuse)',
    category: IngredientCategory.LIQUEUR,
    abv: 55,
    color: '#7FFF00',
    density: 1.01,
    flavor: { sweet: 4, sour: 0, bitter: 6, spicy: 8, boozy: 9 },
    suggestedPairings: ['gin', 'lime'],
    icon: '/icons/liqueur_green.png'
  },
  {
    id: 'frangelico',
    name: '榛子利口酒 (Frangelico)',
    category: IngredientCategory.LIQUEUR,
    abv: 20,
    color: '#8B4513',
    density: 1.06,
    flavor: { sweet: 8, sour: 0, bitter: 1, spicy: 2, boozy: 4 },
    suggestedPairings: ['kahlua', 'cream', 'chocolate'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'limoncello',
    name: '柠檬酒 (Limoncello)',
    category: IngredientCategory.LIQUEUR,
    abv: 28,
    color: '#FFF700',
    density: 1.08,
    flavor: { sweet: 8, sour: 4, bitter: 0, spicy: 0, boozy: 5 },
    suggestedPairings: ['prosecco', 'vodka', 'soda'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'disaronno',
    name: '迪萨罗诺 (Disaronno)',
    category: IngredientCategory.LIQUEUR,
    abv: 28,
    color: '#B87333',
    density: 1.07,
    flavor: { sweet: 9, sour: 0, bitter: 1, spicy: 2, boozy: 5 },
    suggestedPairings: ['amaretto', 'cream', 'cola'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'drambuie',
    name: '蜂蜜威士忌 (Drambuie)',
    category: IngredientCategory.LIQUEUR,
    abv: 40,
    color: '#DAA520',
    density: 1.04,
    flavor: { sweet: 7, sour: 0, bitter: 2, spicy: 4, boozy: 7 },
    suggestedPairings: ['whiskey_scotch', 'lemon'],
    icon: '/icons/liqueur_orange.png'
  },
  {
    id: 'grand_marnier',
    name: '君度橙酒 (Grand Marnier)',
    category: IngredientCategory.LIQUEUR,
    abv: 40,
    color: '#FF8C00',
    density: 1.05,
    flavor: { sweet: 6, sour: 1, bitter: 2, spicy: 1, boozy: 7 },
    suggestedPairings: ['cognac', 'lemon', 'champagne'],
    icon: '/icons/liqueur_orange.png'
  },

  // --- 糖浆/辅料 (Syrups & Mixers) ---
  {
    id: 'syrup_simple',
    name: '简单糖浆 (Simple Syrup)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFFFF0',
    density: 1.33,
    flavor: { sweet: 10, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['lemon', 'lime'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'syrup_honey',
    name: '蜂蜜糖浆 (Honey Syrup)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFD700',
    density: 1.35,
    flavor: { sweet: 9, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['lemon', 'whiskey', 'gin'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'syrup_agave',
    name: '龙舌兰糖浆 (Agave Nectar)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFA07A',
    density: 1.35,
    flavor: { sweet: 9, sour: 0, bitter: 1, spicy: 0, boozy: 0 },
    suggestedPairings: ['tequila', 'lime'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'syrup_grenadine',
    name: '红石榴糖浆 (Grenadine)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#8B0000',
    density: 1.35,
    flavor: { sweet: 9, sour: 1, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['tequila', 'oj'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'syrup_orgeat',
    name: '杏仁糖浆 (Orgeat)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFEFD5', // Papaya Whip
    density: 1.25,
    flavor: { sweet: 9, sour: 0, bitter: 1, spicy: 1, boozy: 0 },
    suggestedPairings: ['rum_white', 'lime'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'lemon',
    name: '柠檬汁 (Lemon Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFFACD',
    density: 1.04,
    flavor: { sweet: 1, sour: 9, bitter: 1, spicy: 0, boozy: 0 },
    suggestedPairings: ['syrup_simple', 'gin', 'whiskey'],
    icon: '/icons/citrus.png'
  },
  {
    id: 'lime',
    name: '青柠汁 (Lime Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#F0FFF0',
    density: 1.04,
    flavor: { sweet: 1, sour: 10, bitter: 1, spicy: 0, boozy: 0 },
    suggestedPairings: ['tequila', 'rum_white', 'ginger_beer'],
    icon: '/icons/citrus.png'
  },
  {
    id: 'grapefruit',
    name: '西柚汁 (Grapefruit Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFB6C1', // Light Pink
    density: 1.04,
    flavor: { sweet: 4, sour: 6, bitter: 3, spicy: 0, boozy: 0 },
    suggestedPairings: ['tequila', 'gin', 'vodka'],
    icon: '/icons/juice.png'
  },
  {
    id: 'cranberry',
    name: '蔓越莓汁 (Cranberry)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#DC143C',
    density: 1.04,
    flavor: { sweet: 4, sour: 7, bitter: 2, spicy: 0, boozy: 0 },
    suggestedPairings: ['vodka', 'cointreau', 'lime'],
    icon: '/icons/juice.png'
  },
  {
    id: 'pineapple',
    name: '菠萝汁 (Pineapple)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFD700',
    density: 1.06,
    flavor: { sweet: 7, sour: 3, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['rum_white', 'coconut', 'campari'],
    icon: '/icons/juice.png'
  },
  {
    id: 'oj',
    name: '橙汁 (Orange Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFA500',
    density: 1.05,
    flavor: { sweet: 6, sour: 3, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['vodka', 'tequila', 'syrup_grenadine'],
    icon: '/icons/juice.png'
  },
  {
    id: 'tomato_juice',
    name: '番茄汁 (Tomato Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FF4500',
    density: 1.06,
    flavor: { sweet: 3, sour: 4, bitter: 1, spicy: 1, boozy: 0 },
    suggestedPairings: ['vodka', 'lemon', 'tabasco'],
    icon: '/icons/juice.png'
  },
  {
    id: 'tonic',
    name: '通宁水 (Tonic Water)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#F8F8FF',
    density: 1.01,
    flavor: { sweet: 4, sour: 1, bitter: 6, spicy: 0, boozy: 0 },
    suggestedPairings: ['gin'],
    icon: '/icons/soda.png'
  },
  {
    id: 'soda',
    name: '苏打水 (Soda Water)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#F0F8FF',
    density: 1.00,
    flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['campari', 'whiskey', 'vodka'],
    icon: '/icons/soda.png'
  },
  {
    id: 'ginger_beer',
    name: '姜汁啤酒 (Ginger Beer)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFF8DC', // Cornsilk
    density: 1.04,
    flavor: { sweet: 5, sour: 1, bitter: 1, spicy: 7, boozy: 0 },
    suggestedPairings: ['vodka', 'rum_white', 'lime'],
    icon: '/icons/soda.png'
  },
  {
    id: 'ginger_ale',
    name: '姜汁汽水 (Ginger Ale)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#F5DEB3',
    density: 1.04,
    flavor: { sweet: 7, sour: 0, bitter: 0, spicy: 3, boozy: 0 },
    suggestedPairings: ['whiskey_irish', 'rum_dark'],
    icon: '/icons/soda.png'
  },
  {
    id: 'cola',
    name: '可乐 (Cola)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#1a0500', // Very dark brown
    density: 1.05,
    flavor: { sweet: 8, sour: 1, bitter: 0, spicy: 1, boozy: 0 },
    suggestedPairings: ['rum_white', 'whiskey'],
    icon: '/icons/soda.png'
  },
  {
    id: 'egg_white',
    name: '蛋白 (Egg White)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFFFF0',
    density: 1.03,
    flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['whiskey', 'pisco', 'gin', 'lemon'],
    icon: '/icons/egg.png'
  },
  {
    id: 'egg_yolk',
    name: '蛋黄 (Egg Yolk)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFD700',
    density: 1.04,
    flavor: { sweet: 1, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['brandy', 'rum_dark', 'cream'],
    icon: '/icons/egg.png'
  },
  {
    id: 'cream',
    name: '鲜奶油 (Cream)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFFDD0',
    density: 1.01,
    flavor: { sweet: 2, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['kahlua', 'vodka', 'creme_de_cacao'],
    icon: '/icons/cream.png'
  },
  {
    id: 'bitters',
    name: '安格斯特拉苦精 (Bitters)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 44,
    color: '#800000',
    density: 0.98,
    flavor: { sweet: 0, sour: 1, bitter: 10, spicy: 6, boozy: 2 },
    suggestedPairings: ['whiskey', 'sugar'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'bitters_orange',
    name: '橙味苦精 (Orange Bitters)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 40,
    color: '#FFA500',
    density: 0.98,
    flavor: { sweet: 0, sour: 2, bitter: 9, spicy: 3, boozy: 2 },
    suggestedPairings: ['gin', 'vermouth_dry'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'bitters_peychaud',
    name: '裴硕苦精 (Peychaud\'s)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 35,
    color: '#DC143C',
    density: 0.98,
    flavor: { sweet: 1, sour: 0, bitter: 8, spicy: 4, boozy: 2 },
    suggestedPairings: ['cognac', 'absinthe'],
    icon: '/icons/syrup.png'
  },
  {
    id: 'coconut_cream',
    name: '椰浆 (Coconut Cream)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFFFF0',
    density: 1.10,
    flavor: { sweet: 7, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['rum_white', 'pineapple'],
    icon: '/icons/cream.png'
  },
  {
    id: 'coffee',
    name: '咖啡 (Coffee)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#3E2723',
    density: 1.01,
    flavor: { sweet: 1, sour: 0, bitter: 8, spicy: 0, boozy: 0 },
    suggestedPairings: ['kahlua', 'baileys', 'whiskey_irish'],
    icon: '/icons/coffee.png'
  },
  {
    id: 'milk',
    name: '牛奶 (Milk)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFFEF0',
    density: 1.03,
    flavor: { sweet: 1, sour: 0, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['kahlua', 'baileys', 'coffee'],
    icon: '/icons/cream.png'
  },
  {
    id: 'apple_juice',
    name: '苹果汁 (Apple Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFD700',
    density: 1.05,
    flavor: { sweet: 7, sour: 2, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['whiskey', 'cinnamon'],
    icon: '/icons/juice.png'
  },
  {
    id: 'peach_juice',
    name: '桃汁 (Peach Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFDAB9',
    density: 1.05,
    flavor: { sweet: 8, sour: 1, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['champagne', 'schnapps'],
    icon: '/icons/juice.png'
  },
  {
    id: 'lychee_juice',
    name: '荔枝汁 (Lychee Juice)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFE4E1',
    density: 1.05,
    flavor: { sweet: 8, sour: 1, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['sake', 'vodka', 'rose'],
    icon: '/icons/juice.png'
  },
  {
    id: 'energy_drink',
    name: '能量饮料 (Energy Drink)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#39FF14',
    density: 1.06,
    flavor: { sweet: 9, sour: 1, bitter: 0, spicy: 1, boozy: 0 },
    suggestedPairings: ['vodka', 'jagermeister'],
    icon: '/icons/soda.png'
  },
  {
    id: 'passion_fruit',
    name: '百香果汁 (Passion Fruit)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#FFA500',
    density: 1.05,
    flavor: { sweet: 6, sour: 8, bitter: 0, spicy: 0, boozy: 0 },
    suggestedPairings: ['rum_white', 'vanilla', 'pineapple'],
    icon: '/icons/juice.png'
  },
  {
    id: 'tabasco',
    name: '辣椒汁 (Tabasco)',
    category: IngredientCategory.SYRUP_MIXER,
    abv: 0,
    color: '#DC143C',
    density: 1.01,
    flavor: { sweet: 0, sour: 1, bitter: 0, spicy: 10, boozy: 0 },
    suggestedPairings: ['tomato_juice', 'vodka'],
    icon: '/icons/syrup.png'
  },

  // --- 装饰 (Garnish) ---
  { id: 'garnish_lemon', name: '柠檬皮 (Lemon Twist)', category: IngredientCategory.GARNISH, abv: 0, color: '#FFD700', density: 0.6, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_lime', name: '青柠轮 (Lime Wheel)', category: IngredientCategory.GARNISH, abv: 0, color: '#32CD32', density: 0.6, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_orange', name: '橙皮 (Orange Peel)', category: IngredientCategory.GARNISH, abv: 0, color: '#FFA500', density: 0.6, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_cherry', name: '酒浸樱桃 (Cherry)', category: IngredientCategory.GARNISH, abv: 0, color: '#8B0000', density: 0.7, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_mint', name: '薄荷叶 (Mint)', category: IngredientCategory.GARNISH, abv: 0, color: '#228B22', density: 0.5, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_olive', name: '橄榄 (Olive)', category: IngredientCategory.GARNISH, abv: 0, color: '#556B2F', density: 0.95, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_rosemary', name: '迷迭香 (Rosemary)', category: IngredientCategory.GARNISH, abv: 0, color: '#228B22', density: 0.5, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_cucumber', name: '黄瓜片 (Cucumber)', category: IngredientCategory.GARNISH, abv: 0, color: '#90EE90', density: 0.7, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_cinnamon', name: '肉桂棒 (Cinnamon)', category: IngredientCategory.GARNISH, abv: 0, color: '#8B4513', density: 0.8, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_salt', name: '盐边 (Salt Rim)', category: IngredientCategory.GARNISH, abv: 0, color: '#FFFFFF', density: 0, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_sugar', name: '糖边 (Sugar Rim)', category: IngredientCategory.GARNISH, abv: 0, color: '#FFFFFF', density: 0, flavor: { sweet: 2, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_pineapple', name: '菠萝角 (Pineapple Wedge)', category: IngredientCategory.GARNISH, abv: 0, color: '#FFD700', density: 0.6, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_celery', name: '芹菜 (Celery)', category: IngredientCategory.GARNISH, abv: 0, color: '#90EE90', density: 0.7, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'garnish_raspberry', name: '覆盆子 (Raspberry)', category: IngredientCategory.GARNISH, abv: 0, color: '#DC143C', density: 0.7, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },

  // --- 冰块 (Ice) ---
  { id: 'ice_cube', name: '方冰 (Cube)', category: IngredientCategory.ICE, abv: 0, color: '#FFFFFF', density: 0.92, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'ice_sphere', name: '老冰球 (Sphere)', category: IngredientCategory.ICE, abv: 0, color: '#FFFFFF', density: 0.92, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
  { id: 'ice_crushed', name: '碎冰 (Crushed)', category: IngredientCategory.ICE, abv: 0, color: '#FFFFFF', density: 0.92, flavor: { sweet: 0, sour: 0, bitter: 0, spicy: 0, boozy: 0 } },
];
