import prisma from "@/lib/prisma";
import { awardXp } from "./xp-service";

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastActive: true },
  });

  if (!user) return;

  const now = new Date();
  const lastActive = user.lastActive ? new Date(user.lastActive) : null;
  
  // Set times to midnight for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActiveDate = lastActive ? new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()) : null;

  let newStreak = user.currentStreak;
  let isNewDay = false;

  if (!lastActiveDate) {
    // First time activity
    newStreak = 1;
    isNewDay = true;
  } else if (lastActiveDate.getTime() === yesterday.getTime()) {
    // Consecutive day
    newStreak += 1;
    isNewDay = true;
  } else if (lastActiveDate.getTime() < yesterday.getTime()) {
    // Streak broken
    newStreak = 1;
    isNewDay = true;
  } else if (lastActiveDate.getTime() === today.getTime()) {
    // Already active today
    isNewDay = false;
  }

  if (isNewDay) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak),
        lastActive: now,
      },
    });

    // Award XP for activity
    await awardXp(userId, "DAILY_STREAK", `Day ${newStreak} streak!`);
    
    return updatedUser;
  }

  return user;
}
