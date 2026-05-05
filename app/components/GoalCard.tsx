"use client";

import Link from "next/link";
import { Target, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { deleteGoalAction } from "@/app/actions";
import { useState } from "react";

interface GoalCardProps {
    goal: {
        id: string;
        title: string;
        hoursPerDay: number;
        category?: string | null;
        isCompleted: boolean;
        topics: {
            isCompleted: boolean;
        }[];
    };
}

export default function GoalCard({ goal }: GoalCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const completedTopics = goal.topics.filter((t) => t.isCompleted).length;
    const totalTopics = goal.topics.length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete "${goal.title}"?`)) return;

        setIsDeleting(true);
        try {
            const result = await deleteGoalAction(goal.id);
            if (result.error) {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to delete goal");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative group">
            <Link
                href={`/goal/${goal.id}`}
                className={`block p-6 rounded-xl bg-brown-light/30 border border-brown-light hover:border-gold/50 transition-all ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gold/10 rounded-lg text-gold group-hover:scale-110 transition-transform">
                        <Target size={24} />
                    </div>
                    {goal.isCompleted && <CheckCircle2 className="text-gold" size={20} />}
                </div>

                <div className="mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-gold transition-colors pr-8">
                        {goal.title}
                    </h3>
                    {goal.category && (
                        <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase tracking-wider">
                            {goal.category}
                        </span>
                    )}
                </div>

                <p className="text-sm text-foreground/50 mb-4">
                    Spend {goal.hoursPerDay} hour{goal.hoursPerDay > 1 ? "s" : ""} daily
                </p>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-brown-dark rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gold transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-foreground/40 text-right">
                        {completedTopics} / {totalTopics} topics completed
                    </p>
                </div>
            </Link>

            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete Goal"
            >
                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            </button>
        </div>
    );
}
