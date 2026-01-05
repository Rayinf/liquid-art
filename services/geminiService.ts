import { GoogleGenAI, Type } from "@google/genai";
import { AIDrinkResult } from "../types";

let apiKey = '';
let ai: GoogleGenAI | null = null;

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('GEMINI_API_KEY', key);
  ai = new GoogleGenAI({ apiKey });
};

export const hasApiKey = () => {
  if (apiKey) return true;
  const stored = localStorage.getItem('GEMINI_API_KEY');
  if (stored) {
    setApiKey(stored);
    return true;
  }
  return false;
};

const getAI = () => {
  if (!ai) {
    const stored = localStorage.getItem('GEMINI_API_KEY');
    if (stored) {
      setApiKey(stored);
    } else {
      // Attempt to get from env if available (legacy support)
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      if (envKey) {
        setApiKey(envKey);
      } else {
        throw new Error("API_KEY_NOT_SET");
      }
    }
  }
  return ai!;
};

// --- Robust Parsing Helper ---
const safeParseJSON = (text: string): any => {
  try {
    // 1. Remove Markdown code blocks if present
    let cleaned = text.trim();

    // Handle cases where the whole thing is wrapped in ```json ... ```
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      cleaned = match[1];
    } else {
      // Fallback: Remove leading/trailing backticks and extra characters
      cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '').trim();
    }

    // 2. Remove potential trailing backticks that sometimes escape responseSchema
    // (Additional safeguard for messy outputs)
    cleaned = cleaned.replace(/`+$/, '').trim();

    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text);
    // If it's the specific complex case from the user, try a more aggressive regex
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (innerE) { }
    throw new Error("AI 返回数据格式错误");
  }
};

const validateRecipe = (data: any): AIDrinkResult => {
  // Try common key variations
  const name = data.name || data.title || "未知鸡尾酒";
  const description = data.description || data.tastingNotes || data.story || "一段神秘的品鉴记录。";
  const ingredients = Array.isArray(data.ingredients) ? data.ingredients : [];
  const instructions = Array.isArray(data.instructions) ? data.instructions : (Array.isArray(data.steps) ? data.steps : ["搅拌均匀。"]);

  const flavor = data.flavorProfile || data.flavors || data.stats || {};

  const result: AIDrinkResult = {
    name,
    description,
    ingredients,
    instructions,
    visualPrompt: data.visualPrompt || data.imagePrompt || "A beautiful cocktail on a bar.",
    flavorProfile: {
      sweet: Number(flavor.sweet) ?? 5,
      sour: Number(flavor.sour) ?? 5,
      bitter: Number(flavor.bitter) ?? 0,
      spicy: Number(flavor.spicy) ?? 0,
      boozy: Number(flavor.boozy) ?? 5,
      salty: Number(flavor.salty) ?? 0,
    },
    lore: data.lore || data.backstory || data.story || "关于这杯酒的传说，还有待你去书写。"
  };
  return result;
};

// --- AI Bartender (Text to Recipe) ---
export const generateDrinkRecipe = async (prompt: string, preferences: string): Promise<AIDrinkResult> => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `你是一位世界顶级的调酒大师和诗人。请根据用户的情绪描述或要求创作一款鸡尾酒配方。
  你的输出必须是完整的 JSON 对象，严禁省略任何字段。
  
  任务要求：
  1. 将抽象概念（如“东京的雨”）转化为具体的味觉符号（如黄瓜、金酒）。
  2. 名字 (name)：创意中文名。
  3. 描述 (description)：30-50字的诗意中文描述。
  4. 原料 (ingredients)：仅包含最终成品中包含的液体原料列表。
  5. 步骤 (instructions)：必须拆分为原子化动作。
  6. 视觉提示词 (visualPrompt)：英文描述这杯酒的样子。
  7. 风味数据 (flavorProfile)：0-10数值。
  8. 调酒师故事 (lore)：撰写一段80-120字的中文背景故事。这杯酒背后代表了什么？是在哪个雨夜诞生的？它属于谁？文字要优雅、有画面感、富有哲理。
  
  注意：即便用户请求模糊，你也必须生成完整的、包含故事的数据。`;

  const fullPrompt = `用户请求: "${prompt}".\n偏好设置: ${preferences}.`;

  const response = await getAI().models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING }
              }
            }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          visualPrompt: { type: Type.STRING, description: "Detailed visual description in English for image generation." },
          flavorProfile: {
            type: Type.OBJECT,
            properties: {
              sweet: { type: Type.NUMBER },
              sour: { type: Type.NUMBER },
              bitter: { type: Type.NUMBER },
              spicy: { type: Type.NUMBER },
              boozy: { type: Type.NUMBER },
              salty: { type: Type.NUMBER }
            },
            required: ["sweet", "sour", "bitter", "spicy", "boozy", "salty"]
          },
          lore: { type: Type.STRING }
        },
        required: ["name", "description", "ingredients", "instructions", "visualPrompt", "flavorProfile", "lore"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI未响应");

  const rawData = safeParseJSON(text);
  return validateRecipe(rawData);
};

// --- DIY Analyzer (Recipe to Story/Image) ---
export const analyzeCustomDrink = async (ingredients: { name: string, amount: string }[], steps: string[], glassType: string): Promise<AIDrinkResult> => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `你是一位拥有诗人灵魂的毒舌酒评家。以犀利、优雅、带有黑色幽默的风格著称。
  请根据原料、步骤和杯型(${glassType})，给出**兼具文学性与客观性**的评价。

  任务：
  1. 中文名字(name)：起一个极具意境的名字。
  2. 品尝描述(description)：**拒绝平庸的赞美**。用华丽辞藻包裹犀利的真相。字数在150字左右。如果酒很难喝，请用优美的诗句来形容这种灾难（例如“像是在拥抱腐烂的玫瑰”）；如果很好喝，请用深邃的隐喻来赞叹。
  3. 风味数据(flavorProfile)：客观打分（0-10）。
  4. Visual Prompt：英文，明确包含杯型特征，且描述应侧重于中心化的正方形构图(1:1 aspect ratio)。
  5. 调酒师故事(lore)：撰写一段80-120字的微小说。基调应是**冷峻、深沉、甚至略带颓废**的。脑补这杯酒属于哪个失意的人，或是哪个荒诞的夜晚。
  
  **重要：在 instructions 中描述步骤时，必须使用与 ingredients 列表中完全一致的名称，不要使用代词或变体。**

  输出必须是完整的 JSON 格式，包含以上所有字段。`;

  const inputData = JSON.stringify({ ingredients, steps });
  const fullPrompt = `分析这杯自制酒: \n${inputData} `;

  const response = await getAI().models.generateContent({
    model,
    contents: fullPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          // Note: We return ingredients/instructions as provided, but formatted
          flavorProfile: {
            type: Type.OBJECT,
            properties: {
              sweet: { type: Type.NUMBER },
              sour: { type: Type.NUMBER },
              bitter: { type: Type.NUMBER },
              spicy: { type: Type.NUMBER },
              boozy: { type: Type.NUMBER },
              salty: { type: Type.NUMBER }
            },
            required: ["sweet", "sour", "bitter", "spicy", "boozy", "salty"]
          },
          visualPrompt: { type: Type.STRING },
          lore: { type: Type.STRING }
        },
        required: ["name", "description", "visualPrompt", "flavorProfile", "lore"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI分析失败");

  const analysis = safeParseJSON(text);
  const validated = validateRecipe(analysis);

  // Merge analysis with original data
  return {
    ...validated,
    ingredients: ingredients, // Prefer original data
    instructions: steps
  };
};

// --- Image Generator ---
export const generateDrinkImage = async (visualPrompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';

  try {
    const response = await getAI().models.generateContent({
      model: model,
      contents: {
        parts: [{ text: `${visualPrompt}, 1:1 aspect ratio, centered square composition, high quality pixel art` }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType}; base64, ${part.inlineData.data} `;
      }
    }

    throw new Error("无图像数据返回");
  } catch (e) {
    console.error("Image generation failed", e);
    // Fallback or re-throw
    return "";
  }
}

// --- Mission Evaluation ---
export const evaluateMissionSuccess = async (recipe: AIDrinkResult, requirements: any[]): Promise<{ success: boolean, reason: string }> => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `你是一位严格的调酒比赛裁判。
  你需要判断用户制作的这杯酒是否满足所有给定的任务要求。
  
  输出必须是 JSON 格式：
  {
    "success": boolean,
    "reason": "一段简短的评价，如果失败请说明哪个要求没达到"
  }`;

  const inputData = JSON.stringify({ recipe, requirements });
  const fullPrompt = `请判断这杯酒是否满足任务要求: \n${inputData}`;

  try {
    const response = await getAI().models.generateContent({
      model,
      contents: fullPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const result = safeParseJSON(response.text || '{}');
    return {
      success: !!result.success,
      reason: result.reason || "评价已生成"
    };
  } catch (e) {
    console.error("Mission evaluation failed", e);
    return { success: false, reason: "系统暂时无法判定" };
  }
};
