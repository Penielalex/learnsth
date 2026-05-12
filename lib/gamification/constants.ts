export const XP_VALUES = {
  TOPIC_COMPLETE: 50,
  GOAL_COMPLETE: 300,
  NOTE_CREATE: 20,
  BRAIN_NOTE_CREATE: 30,
  DAILY_STREAK: 25,
  STREAK_7_DAY: 100,
} as const;

export type XpEventType = keyof typeof XP_VALUES;

export const LEVEL_FORMULA = {
  // Level = floor(0.1 * sqrt(XP)) + 1
  calculateLevel: (xp: number) => Math.floor(0.1 * Math.sqrt(xp)) + 1,
  
  // XP = ( (Level - 1) / 0.1 )^2
  calculateXpForLevel: (level: number) => Math.pow((level - 1) / 0.1, 2),
};
