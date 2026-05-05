"use server";

import prisma from "@/lib/prisma";
import { generateLearningTopics } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createGoalAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const hoursPerDay = parseInt(formData.get("hoursPerDay") as string, 10);
  
  const session = await auth.api.getSession({ headers: headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "You must be signed in to create a goal." };
  }

  if (!title || isNaN(hoursPerDay) || hoursPerDay < 1) {
    return { error: "Invalid input" };
  }

  try {
    // 1. Generate Topics via Gemini FIRST
    const result = await generateLearningTopics(title, hoursPerDay);

    if (!result || !result.topics || result.topics.length === 0) {
      return { error: "AI failed to generate a learning path. Please try again." };
    }

    // 2. Create Goal, Topics, and Resources
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
    return { success: true, goalId: goal.id };
  } catch (error: any) {
    console.error("Error creating goal:", error);
    if (error.message === "HIGH_DEMAND") {
      return { error: "The AI is currently experiencing high demand. Please try again after a few minutes." };
    }
    return { error: "Failed to create goal. Please try again." };
  }
}

export async function deleteGoalAction(goalId: string) {
  try {
    await prisma.goal.delete({
      where: { id: goalId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { error: "Failed to delete goal" };
  }
}

export async function updateNoteAction(topicId: string, content: string) {
  try {
    const existingNote = await prisma.note.findFirst({
      where: { topicId },
    });

    if (existingNote) {
      await prisma.note.update({
        where: { id: existingNote.id },
        data: { content },
      });
    } else {
      await prisma.note.create({
        data: {
          content,
          topicId,
        },
      });
    }

    revalidatePath(`/goal/[id]`, "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    return { error: "Failed to update note" };
  }
}

export async function toggleTopicCompletionAction(topicId: string, isCompleted: boolean) {
  try {
    await prisma.topic.update({
      where: { id: topicId },
      data: { isCompleted },
    });

    revalidatePath(`/goal/[id]`, "page");
    return { success: true };
  } catch (error) {
    console.error("Error toggling completion:", error);
    return { error: "Failed to toggle completion" };
  }
}

export async function createBrainNoteAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const session = await auth.api.getSession({ headers: headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "You must be signed in." };
  }

  if (!title) return { error: "Title is required" };

  try {
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
    return { success: true, noteId: note.id };
  } catch (error: any) {
    console.error("Error creating Brain Note:", error);
    if (error?.message === "HIGH_DEMAND") {
      return { error: "The AI is currently experiencing high demand. Please try again after a few minutes." };
    }
    return { error: "Failed to create topic. Please try again." };
  }
}

export async function updateBrainNoteContentAction(id: string, content: string) {
  try {
    await prisma.brainNote.update({
      where: { id },
      data: { content },
    });
    revalidatePath(`/brain/[id]`, "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating Brain Note:", error);
    return { error: "Failed to update note." };
  }
}

export async function deleteBrainNoteAction(id: string) {
  try {
    await prisma.brainNote.delete({ where: { id } });
    revalidatePath("/brain");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Brain Note:", error);
    return { error: "Failed to delete note." };
  }
}
