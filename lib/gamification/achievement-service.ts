import prisma from "@/lib/prisma";
import { awardXp } from "./xp-service";

export const ACHIEVEMENTS = [
  {
    key: "FIRST_GOAL",
    title: "The Journey Begins",
    description: "Create your first learning goal",
    xpReward: 100,
  },
  {
    key: "FIRST_TOPIC",
    title: "First Step",
    description: "Complete your first topic",
    xpReward: 50,
  },
  {
    key: "STREAK_7",
    title: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    xpReward: 500,
  },
  {
    key: "BRAIN_POWER",
    title: "Brain Power",
    description: "Create 10 notes in your Knowledge Base",
    xpReward: 200,
  },
];

export async function checkAchievements(userId: string) {
  // 1. Get user's current achievements
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
  });
  const unlockedKeys = new Set(unlocked.map((ua) => ua.achievement.key));

  // 2. Get user stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          goals: true,
          brainNotes: true,
        },
      },
    },
  });

  if (!user) return;

  const topicsCompleted = await prisma.topic.count({
    where: { goal: { userId }, isCompleted: true },
  });

  // 3. Logic for each achievement
  const toUnlock = [];

  if (!unlockedKeys.has("FIRST_GOAL") && user._count.goals > 0) {
    toUnlock.push("FIRST_GOAL");
  }

  if (!unlockedKeys.has("FIRST_TOPIC") && topicsCompleted > 0) {
    toUnlock.push("FIRST_TOPIC");
  }

  if (!unlockedKeys.has("STREAK_7") && user.currentStreak >= 7) {
    toUnlock.push("STREAK_7");
  }

  if (!unlockedKeys.has("BRAIN_POWER") && user._count.brainNotes >= 10) {
    toUnlock.push("BRAIN_POWER");
  }

  // 4. Unlock and award XP
  for (const key of toUnlock) {
    const achievement = await prisma.achievement.findUnique({ where: { key } });
    if (achievement) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
        },
      });
      await awardXp(userId, "TOPIC_COMPLETE", `Unlocked achievement: ${achievement.title}`);
    }
  }
}

/**
 * Ensures achievement definitions exist in the database.
 */
export async function seedAchievements() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {
        title: a.title,
        description: a.description,
        xpReward: a.xpReward,
      },
      create: a,
    });
  }
}
