
import { DailyMission, MissionRequirement } from '../types';

const STORAGE_KEY = 'liquid_art_mission_status';

const NPCs = [
    { name: '赛博霓虹', avatar: '👾', bio: '来自新东京的数字游民，对极简主义和高科技感有独特偏好。' },
    { name: '调酒博士', avatar: '👨‍🔬', bio: '液体实验室的首席科学家，追求完美的配比与严谨的科学风味。' },
    { name: 'Echo-7', avatar: '🤖', bio: '正在探索人类味觉感官的 AI 单元，最近在研究“辛辣”与“情感”的联系。' },
    { name: '露娜', avatar: '🌙', bio: '寻找“杯中月光”的夜班职员，渴望一份温柔且能抚慰灵魂的饮品。' },
    { name: '爵士老枪', avatar: '🎷', bio: '沉浸在蓝调音乐中的老牌绅士，只钟情于经典的烟熏感与苦涩感。' },
    { name: '流浪猫咖', avatar: '🐱', bio: '神秘的猫耳调酒师，喜欢一切甜腻、粉嫩且充满童趣的创意。' },
    { name: '极地探险家', avatar: '❄️', bio: '刚从冰川归来，需要一杯能让他想起极光色彩的、极致冰爽的特调。' },
    { name: '森林女巫', avatar: '🧙‍♀️', bio: '采集了晨露与草药，寻找一种带有泥土芬芳和神秘魔力的绿色调和。' }
];

const POSSIBLE_REQUIREMENTS: MissionRequirement[][] = [
    [
        { type: 'ingredient', target: 'gin', value: 30 },
        { type: 'flavor', target: 'bitter', value: 4 }
    ],
    [
        { type: 'alcohol_level', target: 'non_alcoholic', value: 0 },
        { type: 'flavor', target: 'sweet', value: 6 }
    ],
    [
        { type: 'glass', target: '马提尼杯' },
        { type: 'flavor', target: 'boozy', value: 7 }
    ],
    [
        { type: 'ingredient', target: 'vodka', value: 45 },
        { type: 'flavor', target: 'spicy', value: 5 }
    ],
    [
        { type: 'flavor', target: 'sour', value: 6 },
        { type: 'flavor', target: 'bitter', value: 3 },
        { type: 'glass', target: '古典杯' }
    ],
    [
        { type: 'ingredient', target: 'rum_white', value: 60 },
        { type: 'glass', target: '海波杯' }
    ],
    [
        { type: 'flavor', target: 'sweet', value: 8 },
        { type: 'flavor', target: 'sour', value: 4 }
    ],
    [
        { type: 'alcohol_level', target: 'boozy', value: 20 },
        { type: 'flavor', target: 'bitter', value: 5 }
    ]
];

const NPC_QUOTES = [
    "“我需要一种能让电路板都感到凉爽的液体...”",
    "“实验表明，这个比例的酸度能引发最强烈的情感波动。”",
    "“人类所谓的‘苦涩’，是什么样的电信号？”",
    "“今晚的月亮很圆，适合喝点透明的东西。”",
    "“像爵士乐一样，要在不经意间流露出那股苦味。”",
    "“喵~ 要那种甜到心里，颜色亮亮的！”",
    "“把极光的颜色装进杯子里，要够冰。”",
    "“森林里的草药已经准备好了，帮我调和它们。”"
];

export const missionService = {
    getDailyMission: (): DailyMission => {
        const today = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === today) return parsed;
        }

        // Generate new mission based on date seed
        const dateNum = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
        const npcIndex = dateNum % NPCs.length;
        const reqIndex = dateNum % POSSIBLE_REQUIREMENTS.length;
        const quoteIndex = dateNum % NPC_QUOTES.length;

        const npc = NPCs[npcIndex];
        const requirements = POSSIBLE_REQUIREMENTS[reqIndex];

        const newMission: DailyMission = {
            id: `mission_${today}`,
            date: today,
            npcName: npc.name,
            npcAvatar: npc.avatar,
            requestDescription: `${npc.bio} ${NPC_QUOTES[quoteIndex]}`,
            requirements,
            reward: '调酒大师徽章',
            isCompleted: false
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMission));
        return newMission;
    },

    completeMission: (): void => {
        const mission = missionService.getDailyMission();
        mission.isCompleted = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
    }
};
