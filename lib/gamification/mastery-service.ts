import prisma from "@/lib/prisma";

export async function calculateTopicMastery(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { notes: true },
  });

  if (!topic) return 0;

  let score = 0;

  // 1. Completion (70%)
  if (topic.isCompleted) score += 70;

  // 2. Note Density (30%)
  // Simple heuristic: > 200 chars in notes = full density points
  const totalNoteLength = topic.notes.reduce((acc, note) => acc + note.content.length, 0);
  const densityScore = Math.min((totalNoteLength / 200) * 30, 30);
  score += densityScore;

  return Math.round(score);
}

export async function calculateGoalMastery(goalId: string) {
  const topics = await prisma.topic.findMany({
    where: { goalId },
    include: { notes: true },
  });

  if (topics.length === 0) return 0;

  const topicScores = await Promise.all(
    topics.map(async (t) => {
      let score = t.isCompleted ? 70 : 0;
      const totalNoteLength = t.notes.reduce((acc, note) => acc + note.content.length, 0);
      const densityScore = Math.min((totalNoteLength / 200) * 30, 30);
      return score + densityScore;
    })
  );

  const average = topicScores.reduce((acc, s) => acc + s, 0) / topics.length;
  return Math.round(average);
}

export async function getWeakTopics(userId: string) {
  const topics = await prisma.topic.findMany({
    where: { goal: { userId }, isCompleted: false },
    include: { notes: true, goal: true },
    take: 5,
  });

  return topics.map(t => ({
    id: t.id,
    title: t.title,
    goalTitle: t.goal.title,
    reason: t.notes.length === 0 ? "No notes created yet" : "Topic not completed",
  }));
}
