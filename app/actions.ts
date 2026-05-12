"use server";

import prisma from "@/lib/prisma";
import { generateLearningTopics } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { awardXp, revokeXp } from "@/lib/gamification/xp-service";
import { updateStreak } from "@/lib/gamification/streak-service";
import { checkAchievements } from "@/lib/gamification/achievement-service";

/**
 * Utility to get current session and user ID.
 */
async function getAuthSession() {
  const session = await auth.api.getSession({ headers: headers() });
  return session;
}

/**
 * Security middleware for Server Actions.
 * Checks if user is authenticated and optionally if they own the resource.
 */
async function validateAccess(resourceId?: string, model?: "goal" | "brainNote" | "topic" | "brainSubtopic") {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Authentication required.");
  }

  if (resourceId && model) {
    let resource;
    if (model === "goal") {
      resource = await prisma.goal.findUnique({ where: { id: resourceId }, select: { userId: true } });
    } else if (model === "brainNote") {
      resource = await prisma.brainNote.findUnique({ where: { id: resourceId }, select: { userId: true } });
    } else if (model === "topic") {
      resource = await prisma.topic.findUnique({ 
        where: { id: resourceId }, 
        select: { goal: { select: { userId: true } } } 
      });
      if (resource) resource = { userId: resource.goal.userId };
    } else if (model === "brainSubtopic") {
      resource = await prisma.brainSubtopic.findUnique({
        where: { id: resourceId },
        select: { brainNote: { select: { userId: true } } }
      });
      if (resource) resource = { userId: resource.brainNote.userId };
    }

    if (!resource || resource.userId !== userId) {
      throw new Error("Access denied. You do not own this resource.");
    }
  }

  return userId;
}

export async function createGoalAction(prevState: any, formData: FormData) {
  try {
    const userId = await validateAccess();
    
    const title = formData.get("title")?.toString().trim();
    const hoursStr = formData.get("hoursPerDay")?.toString();
    const hoursPerDay = hoursStr ? parseInt(hoursStr, 10) : NaN;

    if (!title || isNaN(hoursPerDay) || hoursPerDay < 1 || hoursPerDay > 24) {
      return { error: "Please provide a valid title and hours per day (1-24)." };
    }

    const result = await generateLearningTopics(title, hoursPerDay);

    if (!result || !result.topics || result.topics.length === 0) {
      return { error: "AI failed to generate a learning path. Please try again." };
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        hoursPerDay,
        userId,
        category: result.category,
        topics: {
          create: result.topics.map((topic, i) => ({
            title: topic.title,
            order: i,
            notes: {
              create: [{ content: "" }],
            },
            resources: {
              create: topic.resources.map((r) => ({
                title: r.title,
                url: r.url,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/");
    await updateStreak(userId);
    await awardXp(userId, "GOAL_COMPLETE", `Started goal: ${title}`);
    await checkAchievements(userId);

    return { success: true, goalId: goal.id };
  } catch (error: any) {
    console.error("Error creating goal:", error);
    return { error: error.message || "Failed to create goal." };
  }
}

export async function deleteGoalAction(goalId: string) {
  try {
    const userId = await validateAccess(goalId, "goal");
    const goal = await prisma.goal.findUnique({ where: { id: goalId }, select: { title: true } });
    
    await prisma.goal.delete({ where: { id: goalId } });
    
    if (goal) {
      await revokeXp(userId, "GOAL_COMPLETE", `Deleted goal: ${goal.title}`);
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    return { error: error.message || "Failed to delete goal." };
  }
}

export async function updateNoteAction(topicId: string, content: string) {
  try {
    await validateAccess(topicId, "topic");
    const existingNote = await prisma.note.findFirst({ where: { topicId } });

    if (existingNote) {
      await prisma.note.update({ where: { id: existingNote.id }, data: { content } });
    } else {
      await prisma.note.create({ data: { content, topicId } });
    }

    const session = await getAuthSession();
    if (session?.user?.id) {
      await updateStreak(session.user.id);
      await awardXp(session.user.id, "NOTE_CREATE", "Updated study notes");
      await checkAchievements(session.user.id);
    }

    revalidatePath(`/goal/[id]`, "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating note:", error);
    return { error: error.message || "Failed to update note." };
  }
}

export async function toggleTopicCompletionAction(topicId: string, isCompleted: boolean) {
  try {
    await validateAccess(topicId, "topic");
    await prisma.topic.update({ where: { id: topicId }, data: { isCompleted } });

    const session = await getAuthSession();
    if (session?.user?.id && isCompleted) {
      await updateStreak(session.user.id);
      await awardXp(session.user.id, "TOPIC_COMPLETE", "Completed a topic");
      await checkAchievements(session.user.id);
    }

    revalidatePath(`/goal/[id]`, "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling completion:", error);
    return { error: error.message || "Failed to toggle completion." };
  }
}

export async function createBrainNoteAction(prevState: any, formData: FormData) {
  try {
    const userId = await validateAccess();
    const title = formData.get("title")?.toString().trim();
    if (!title) return { error: "Title is required" };

    const { generateCategoryForTopic } = await import("@/lib/gemini");
    const category = await generateCategoryForTopic(title);

    const note = await prisma.brainNote.create({
      data: {
        title,
        content: "",
        category: category || "Uncategorized",
        userId,
      },
    });

    revalidatePath("/brain");
    await updateStreak(userId);
    await awardXp(userId, "BRAIN_NOTE_CREATE", `Added to Brain: ${title}`);
    await checkAchievements(userId);

    return { success: true, noteId: note.id };
  } catch (error: any) {
    console.error("Error creating Brain Note:", error);
    return { error: error.message || "Failed to create note." };
  }
}

export async function updateBrainNoteContentAction(id: string, content: string) {
  try {
    await validateAccess(id, "brainNote");
    await prisma.brainNote.update({ where: { id }, data: { content } });
    revalidatePath(`/brain/[id]`, "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating Brain Note:", error);
    return { error: error.message || "Failed to update note." };
  }
}

export async function deleteBrainNoteAction(id: string) {
  try {
    const userId = await validateAccess(id, "brainNote");
    const note = await prisma.brainNote.findUnique({ where: { id }, select: { title: true } });
    
    await prisma.brainNote.delete({ where: { id } });
    
    if (note) {
      await revokeXp(userId, "BRAIN_NOTE_CREATE", `Deleted from Brain: ${note.title}`);
    }
    
    revalidatePath("/brain");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting Brain Note:", error);
    return { error: error.message || "Failed to delete note." };
  }
}

/**
 * Brain Subtopic Actions
 */

export async function createBrainSubtopicAction(brainNoteId: string, title: string) {
  try {
    const userId = await validateAccess(brainNoteId, "brainNote");
    
    const subtopic = await prisma.brainSubtopic.create({
      data: {
        title,
        content: "",
        brainNoteId,
      },
    });

    await awardXp(userId, "NOTE_CREATE", `Added subtopic: ${title}`);
    revalidatePath(`/brain/[id]`, "page");
    return { success: true, subtopicId: subtopic.id };
  } catch (error: any) {
    console.error("Error creating Brain Subtopic:", error);
    return { error: error.message || "Failed to create subtopic." };
  }
}

export async function updateBrainSubtopicContentAction(id: string, content: string) {
  try {
    await validateAccess(id, "brainSubtopic");
    await prisma.brainSubtopic.update({ where: { id }, data: { content } });
    revalidatePath(`/brain/[id]`, "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating Brain Subtopic:", error);
    return { error: error.message || "Failed to update subtopic." };
  }
}

export async function deleteBrainSubtopicAction(id: string) {
  try {
    const userId = await validateAccess(id, "brainSubtopic");
    const subtopic = await prisma.brainSubtopic.findUnique({ where: { id }, select: { title: true } });
    
    await prisma.brainSubtopic.delete({ where: { id } });
    
    if (subtopic) {
      await revokeXp(userId, "NOTE_CREATE", `Deleted subtopic: ${subtopic.title}`);
    }
    
    revalidatePath(`/brain/[id]`, "page");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting Brain Subtopic:", error);
    return { error: error.message || "Failed to delete subtopic." };
  }
}
