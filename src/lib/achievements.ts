export interface Achievement {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: "offers" | "streak" | "money" | "special";
}

export const ACHIEVEMENTS: Achievement[] = [
  // Offers
  {
    type: "pierwsza_cebulka",
    name: "Pierwsza Cebulka",
    description: "Zacząłeś śledzić swoją pierwszą ofertę",
    icon: "🧅",
    category: "offers",
  },
  {
    type: "cebularz",
    name: "Cebularz",
    description: "Śledzisz 3 oferty jednocześnie",
    icon: "🧅🧅",
    category: "offers",
  },
  {
    type: "cebulowy_baron",
    name: "Cebulowy Baron",
    description: "Śledzisz 5 lub więcej ofert",
    icon: "🧅🧅🧅",
    category: "offers",
  },
  {
    type: "cebulowy_magnat",
    name: "Cebulowy Magnat",
    description: "Śledzisz 10 lub więcej ofert",
    icon: "👑🧅",
    category: "offers",
  },
  {
    type: "odkrywca",
    name: "Odkrywca",
    description: "Śledzisz oferty z 5 różnych banków",
    icon: "🗺️",
    category: "offers",
  },

  // Streaks
  {
    type: "streak_3",
    name: "Rozgrzewka",
    description: "3-dniowy streak aktywności",
    icon: "🔥",
    category: "streak",
  },
  {
    type: "streak_7",
    name: "Stały Bywalec",
    description: "7-dniowy streak aktywności",
    icon: "🔥🔥",
    category: "streak",
  },
  {
    type: "streak_14",
    name: "Wytrwały Cebularz",
    description: "14-dniowy streak aktywności",
    icon: "💪",
    category: "streak",
  },
  {
    type: "streak_30",
    name: "Cebulowy Maraton",
    description: "30-dniowy streak aktywności",
    icon: "🏆",
    category: "streak",
  },
  {
    type: "streak_100",
    name: "Legenda",
    description: "100-dniowy streak aktywności!",
    icon: "⭐",
    category: "streak",
  },

  // Money
  {
    type: "tysiac",
    name: "Tysiącznik",
    description: "Potencjalna premia przekroczyła 1000 zł",
    icon: "💰",
    category: "money",
  },
  {
    type: "piec_tysiecy",
    name: "Pięciotysiącznik",
    description: "Potencjalna premia przekroczyła 5000 zł",
    icon: "💎",
    category: "money",
  },

  // Special
  {
    type: "perfekcjonista",
    name: "Perfekcjonista",
    description: "Spełnij wszystkie warunki w jednej ofercie",
    icon: "✨",
    category: "special",
  },
];

export function getAchievement(type: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.type === type);
}
