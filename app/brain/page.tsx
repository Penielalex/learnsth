import prisma from "@/lib/prisma";
import Link from "next/link";
import { Brain, PlusCircle } from "lucide-react";
import BrainCreateForm from "@/app/components/BrainCreateForm";
import BrainNoteDeleteButton from "@/app/components/BrainNoteDeleteButton";
import SearchInput from "@/app/components/SearchInput";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BrainPage({ searchParams }: { searchParams: { category?: string, search?: string } }) {
    const session = await auth.api.getSession({ headers: headers() });
    
    if (!session?.user) {
        redirect("/welcome");
    }

    const userId = session.user.id;
    const selectedCategory = searchParams.category;
    const searchQuery = searchParams.search;

    const allNotesForCategories = await prisma.brainNote.findMany({
        where: { userId },
        select: { category: true },
    });
    
    const categories = Array.from(new Set(allNotesForCategories.map(n => n.category).filter(Boolean))) as string[];

    const notes = await prisma.brainNote.findMany({
        where: { 
            userId,
            ...(selectedCategory ? { category: selectedCategory } : {}),
            ...(searchQuery ? { title: { contains: searchQuery, mode: "insensitive" } } : {})
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8">
            <section className="text-center space-y-4 py-8">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gold/10 rounded-full text-gold">
                        <Brain size={48} />
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-gold gold-glow">The Brain</h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                    A space for your specific topics and notes. AI will automatically categorize them for you.
                </p>
                <div className="max-w-md mx-auto mt-6">
                    <BrainCreateForm />
                </div>
            </section>

            <SearchInput placeholder="Search your brain notes..." />

            {categories.length > 0 && (
                <section className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/brain"
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
                            href={`/brain?category=${encodeURIComponent(category)}`}
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
                {notes.map((note) => (
                    <div key={note.id} className="relative">
                        <Link
                            href={`/brain/${note.id}`}
                            className="block p-6 rounded-xl bg-brown-light/30 border border-brown-light hover:border-gold/50 transition-all group h-full"
                        >
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors pr-8">
                                {note.title}
                            </h3>
                            {note.category && (
                                <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase tracking-wider">
                                    {note.category}
                                </span>
                            )}
                            <p className="mt-4 text-xs text-foreground/40">
                                {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                        </Link>
                        <BrainNoteDeleteButton id={note.id} />
                    </div>
                ))}

                {notes.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-brown-light rounded-xl opacity-50">
                        {selectedCategory 
                            ? <p>No notes found in this category. Add a topic above!</p>
                            : <p>Your brain is empty. Add a topic above to start categorizing your knowledge!</p>
                        }
                    </div>
                )}
            </section>
        </div>
    );
}
