import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import TopicClient from "./TopicClient";
import { notFound } from "next/navigation";

export default async function GoalDetail({ params }: { params: { id: string } }) {
    type GoalWithTopics = Prisma.GoalGetPayload<{
        include: {
            topics: {
                include: {
                    notes: true,
                    resources: true,
                }
            }
        }
    }>;

    const goal = await prisma.goal.findUnique({
        where: { id: params.id },
        include: {
            topics: {
                include: {
                    notes: true,
                    resources: true,
                },
                orderBy: { order: "asc" },
            },
        } as any,
    }) as GoalWithTopics | null;

    if (!goal) return notFound();

    const totalTopics = goal.topics.length;
    const completedCount = goal.topics.filter(t => t.isCompleted).length;
    const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors">
                    <ChevronLeft size={20} />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 text-sm text-foreground/40">
                    <Calendar size={16} />
                    {new Date(goal.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-gold gold-glow">{goal.title}</h2>
                            {goal.category && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase tracking-wider relative top-1">
                                    {goal.category}
                                </span>
                            )}
                        </div>
                        <p className="text-foreground/60 mt-2">
                            Time Investment: {goal.hoursPerDay} hour{goal.hoursPerDay > 1 ? "s" : ""} daily
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gold">{progress}%</p>
                        <p className="text-xs text-foreground/40 uppercase tracking-widest">Progress</p>
                    </div>
                </div>

                <div className="h-3 bg-brown-dark rounded-full overflow-hidden border border-brown-light/50">
                    <div
                        className="h-full bg-gold transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b border-brown-light pb-2">Learning Path</h3>
                <div className="space-y-4">
                    {goal.topics.map((topic, index) => (
                        <TopicClient key={topic.id} topic={topic} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
