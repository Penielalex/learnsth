import prisma from "@/lib/prisma";
import { XP_VALUES, LEVEL_FORMULA, XpEventType } from "./constants";

export async function awardXp(userId: string, type: XpEventType, description?: string) {
  const amount = XP_VALUES[type];
  return await updateXp(userId, amount, type, description);
}

export async function revokeXp(userId: string, type: XpEventType, description?: string) {
  const amount = -XP_VALUES[type];
  return await updateXp(userId, amount, type, description);
}

async function updateXp(userId: string, amount: number, type: XpEventType, description?: string) {
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

    // Ensure XP doesn't go below 0
    if (user.xp < 0) {
      await tx.user.update({
        where: { id: userId },
        data: { xp: 0 }
      });
    }

    // 3. Recalculate Level
    const newLevel = LEVEL_FORMULA.calculateLevel(Math.max(0, user.xp));
    
    // Update level if it changed (up or down)
    if (newLevel !== user.level) {
      await tx.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }

    return { xpChanged: amount, newTotalXp: Math.max(0, user.xp), level: newLevel };
  });
}

export function getLevelProgress(xp: number) {
  const currentLevel = LEVEL_FORMULA.calculateLevel(xp);
  const xpForCurrentLevel = LEVEL_FORMULA.calculateXpForLevel(currentLevel);
  const xpForNextLevel = LEVEL_FORMULA.calculateXpForLevel(currentLevel + 1);
  
  const progressInLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  
  const percentage = Math.max(0, Math.min(Math.round((progressInLevel / xpNeededForLevel) * 100), 100));
  
  return {
    currentLevel,
    xpInLevel: progressInLevel,
    xpForNextLevel: xpNeededForLevel,
    percentage,
  };
}
