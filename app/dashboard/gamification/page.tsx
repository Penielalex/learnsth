import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLevelProgress } from "@/lib/gamification/xp-service";
import GamificationStats from "@/app/components/gamification/GamificationStats";
import { Trophy, Info } from "lucide-react";
import { getWeakTopics } from "@/lib/gamification/mastery-service";

export default async function GamificationDashboard() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session?.user) redirect("/welcome");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      achievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
      },
      xpEvents: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  const progress = getLevelProgress(user.xp);
  const weakTopics = await getWeakTopics(user.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Your Mastery Dashboard</h1>
        <p className="text-foreground/60 text-sm">Track your learning progress, levels, and achievements.</p>
      </header>

      <GamificationStats 
        xp={user.xp} 
        level={user.level} 
        streak={user.currentStreak} 
        progress={progress} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-brown-light pb-2">
            <Trophy className="text-gold" size={20} />
            <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.achievements.map((ua) => (
              <div 
                key={ua.id} 
                className="bg-brown-dark/20 border border-brown-light/20 p-4 rounded-xl flex items-center gap-4 hover:border-gold/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl">
                  {ua.achievement.icon || "🏆"}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{ua.achievement.title}</h3>
                  <p className="text-xs text-foreground/50">{ua.achievement.description}</p>
                </div>
              </div>
            ))}
            {user.achievements.length === 0 && (
              <p className="text-sm text-foreground/40 italic py-4">No achievements unlocked yet. Keep learning!</p>
            )}
          </div>
        </section>

        {/* Weak Topics / Recommendations */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-brown-light pb-2">
            <Info className="text-gold" size={20} />
            <h2 className="text-xl font-bold text-white">Focus Areas</h2>
          </div>

          <div className="space-y-4">
            {weakTopics.map((topic) => (
              <div key={topic.id} className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl space-y-1">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">{topic.goalTitle}</p>
                <h4 className="font-semibold text-foreground">{topic.title}</h4>
                <p className="text-[10px] text-foreground/40">{topic.reason}</p>
              </div>
            ))}
            {weakTopics.length === 0 && (
              <p className="text-sm text-foreground/40 italic">You're doing great! No weak areas identified.</p>
            )}
          </div>

          {/* Recent Activity Feed */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground/60 uppercase tracking-widest">Recent Activity</h3>
            <div className="space-y-3">
              {user.xpEvents.map((event) => (
                <div key={event.id} className="flex justify-between items-center text-xs">
                  <span className="text-foreground/60">{event.description || event.type}</span>
                  <span className="text-gold font-bold">+{event.amount} XP</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
