const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ACHIEVEMENTS = [
  {
    key: "FIRST_GOAL",
    title: "The Journey Begins",
    description: "Create your first learning goal",
    xpReward: 100,
    icon: "🚀"
  },
  {
    key: "FIRST_TOPIC",
    title: "First Step",
    description: "Complete your first topic",
    xpReward: 50,
    icon: "🌱"
  },
  {
    key: "STREAK_7",
    title: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    xpReward: 500,
    icon: "🔥"
  },
  {
    key: "BRAIN_POWER",
    title: "Brain Power",
    description: "Create 10 notes in your Knowledge Base",
    xpReward: 200,
    icon: "🧠"
  },
];

async function main() {
  console.log("Seeding achievements...");
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {
        title: a.title,
        description: a.description,
        xpReward: a.xpReward,
        icon: a.icon,
      },
      create: a,
    });
  }
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};
