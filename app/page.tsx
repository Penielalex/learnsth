import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import GoalCard from "@/app/components/GoalCard";
import SearchInput from "@/app/components/SearchInput";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: { category?: string, search?: string } }) {
    const session = await auth.api.getSession({ headers: headers() });
    
    if (!session?.user) {
        redirect("/welcome");
    }

    const userId = session.user.id;
    const selectedCategory = searchParams.category;
    const searchQuery = searchParams.search;

    const allGoalsForCategories = await prisma.goal.findMany({
        where: { userId },
        select: { category: true },
    });
    
    const categories = Array.from(new Set(allGoalsForCategories.map(g => g.category).filter(Boolean))) as string[];

    const goals = await prisma.goal.findMany({
        where: { 
            userId,
            ...(selectedCategory ? { category: selectedCategory } : {}),
            ...(searchQuery ? { title: { contains: searchQuery, mode: "insensitive" } } : {})
        },
        include: {
            topics: { select: { isCompleted: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <section className="text-center space-y-4 py-8">
                <h2 className="text-4xl font-bold text-gold gold-glow">What do you want to learn today?</h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                    Start your learning journey with AI-generated bite-sized topics tailored to your schedule.
                </p>
                <Link href="/add-goal" className="inline-flex items-center gap-2 gold-button text-lg px-6 py-3">
                    <PlusCircle size={20} />
                    Add Learning Goal
                </Link>
            </section>

            <SearchInput placeholder="Search your learning goals..." />

            {categories.length > 0 && (
                <section className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            !selectedCategory 
                                ? 'bg-gold text-brown-dark shadow' 
                                : 'bg-brown-light/30 border border-brown-light hover:border-gold/50 text-foreground/80'
                        }`}
                    >
                        All
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category}
                            href={`/?category=${encodeURIComponent(category)}`}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                selectedCategory === category 
                                    ? 'bg-gold text-brown-dark shadow' 
                                    : 'bg-brown-light/30 border border-brown-light hover:border-gold/50 text-foreground/80'
                            }`}
                        >
                            {category}
                        </Link>
                    ))}
                </section>
            )}

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}

                {goals.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-brown-light rounded-xl opacity-50">
                        {selectedCategory 
                            ? <p>No learning goals found in this category. Click the button above to add one!</p>
                            : <p>No learning goals yet. Click the button above to start!</p>
                        }
                    </div>
                )}
            </section>
        </div>
    );
}
