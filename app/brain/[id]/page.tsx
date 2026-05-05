import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import BrainNoteClient from "@/app/components/BrainNoteClient";

export default async function BrainNoteDetail({ params }: { params: { id: string } }) {
    const note = await prisma.brainNote.findUnique({
        where: { id: params.id }
    });

    if (!note) return notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Link href="/brain" className="inline-flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors">
                    <ChevronLeft size={20} />
                    Back to Brain
                </Link>
                <div className="flex items-center gap-2 text-sm text-foreground/40">
                    <Calendar size={16} />
                    {new Date(note.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-gold gold-glow">{note.title}</h2>
                            {note.category && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase tracking-wider relative top-1">
                                    {note.category}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-brown-light/10 border border-brown-light/30 rounded-xl overflow-hidden shadow-lg">
                <BrainNoteClient noteId={note.id} initialContent={note.content || ""} />
            </div>
        </div>
    );
}
