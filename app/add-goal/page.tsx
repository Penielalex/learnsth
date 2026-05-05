"use client";

import { createGoalAction } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, Sparkles, Clock, Loader2 } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full gold-button text-xl py-4 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={24} />
                    Generating Path...
                </>
            ) : (
                <>
                    <Sparkles size={24} />
                    Generate Learning Path
                </>
            )}
        </button>
    );
}

export default function AddGoal() {
    const router = useRouter();
    const [state, formAction] = useFormState(createGoalAction, null);

    useEffect(() => {
        if (state?.success && state?.goalId) {
            router.push(`/goal/${state.goalId}`);
        }
    }, [state, router]);

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors">
                <ChevronLeft size={20} />
                Back to Dashboard
            </Link>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gold">Add New Goal</h2>
                <p className="text-foreground/60">Tell AI what you want to learn, and we&apos;ll break it down for you.</p>
            </div>

            <form action={formAction} className="space-y-6">
                {state?.error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                        {state.error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-foreground/80">
                        What do you want to learn?
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="e.g. Web Development, Playing Piano, Python..."
                        className="w-full bg-brown-dark border border-brown-light focus:border-gold outline-none p-4 rounded-lg text-lg text-white"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="hoursPerDay" className="block text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <Clock size={16} />
                        Daily Time Investment (Hours)
                    </label>
                    <input
                        type="number"
                        id="hoursPerDay"
                        name="hoursPerDay"
                        min="1"
                        max="24"
                        defaultValue="1"
                        className="w-full bg-brown-dark border border-brown-light focus:border-gold outline-none p-4 rounded-lg text-lg text-white"
                        required
                    />
                </div>

                <SubmitButton />

                <p className="text-xs text-center text-foreground/40 italic">
                    AI will generate a personalized path of bite-sized topics for you.
                </p>
            </form>
        </div>
    );
}
