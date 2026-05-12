import prisma from "@/lib/prisma";
import { XP_VALUES, LEVEL_FORMULA, XpEventType } from "./constants";

export async function awardXp(userId: string, type: XpEventType, description?: string) {
  const amount = XP_VALUES[type];

  return await prisma.$transaction(async (tx) => {
    // 1. Create XP Event
    await tx.xpEvent.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    });

    // 2. Update User XP
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        xp: { increment: amount },
      },
    });

    // 3. Check for Level Up
    const newLevel = LEVEL_FORMULA.calculateLevel(user.xp);
    if (newLevel > user.level) {
      await tx.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
      // Optional: Add level up notification/achievement here
    }

    return { xpGained: amount, newTotalXp: user.xp, level: newLevel };
  });
}

export function getLevelProgress(xp: number) {
  const currentLevel = LEVEL_FORMULA.calculateLevel(xp);
  const xpForCurrentLevel = LEVEL_FORMULA.calculateXpForLevel(currentLevel);
  const xpForNextLevel = LEVEL_FORMULA.calculateXpForLevel(currentLevel + 1);
  
  const progressInLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  
  const percentage = Math.min(Math.round((progressInLevel / xpNeededForLevel) * 100), 100);
  
  return {
    currentLevel,
    xpInLevel: progressInLevel,
    xpForNextLevel: xpNeededForLevel,
    percentage,
  };
}
