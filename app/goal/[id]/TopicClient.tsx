"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Save, ChevronDown, ChevronUp, FileCode, ExternalLink, BookOpen } from "lucide-react";
import { toggleTopicCompletionAction, updateNoteAction } from "@/app/actions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import RichTextEditor from "@/app/components/RichTextEditor";

interface Resource {
    id: string;
    title: string;
    url: string;
}

interface Note {
    id: string;
    content: string;
}

interface Topic {
    id: string;
    title: string;
    isCompleted: boolean;
    notes: Note[];
    resources: Resource[];
}

export default function TopicClient({ topic, index }: { topic: Topic, index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [note, setNote] = useState(topic.notes[0]?.content || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isCompleted, setIsCompleted] = useState(topic.isCompleted);

    const handleToggleCompletion = async () => {
        const newState = !isCompleted;
        setIsCompleted(newState); // Optimistic UI
        await toggleTopicCompletionAction(topic.id, newState);
    };

    const handleSaveNote = async () => {
        setIsSaving(true);
        await updateNoteAction(topic.id, note);
        setIsSaving(false);
    };

    return (
        <div className={cn(
            "border rounded-xl transition-all duration-300",
            isOpen ? "bg-brown-light/40 border-gold/30" : "bg-brown-light/20 border-brown-light hover:border-gold/20"
        )}>
            <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={handleToggleCompletion}
                        className={cn(
                            "p-2 rounded-full transition-colors",
                            isCompleted ? "text-gold" : "text-foreground/20 hover:text-gold/40"
                        )}
                    >
                        {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>

                    <div className="flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground/40 font-mono">Day {index + 1}</span>
                            <h4 className={cn(
                                "text-lg font-medium",
                                isCompleted && "line-through opacity-50"
                            )}>
                                {topic.title}
                            </h4>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-foreground/40 hover:text-gold"
                >
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isOpen && (
                <div className="p-4 pt-0 border-t border-brown-light/30 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 flex items-center gap-2">
                                <FileCode size={14} />
                                Learning Notes
                            </label>
                            {isSaving && <span className="text-[10px] text-gold animate-pulse italic">Saving...</span>}
                        </div>
                        <RichTextEditor
                            content={note}
                            onChange={setNote}
                            placeholder="What did you learn about this topic? Write your thoughts here..."
                        />
                    </div>

                    <div className="space-y-3 pt-4 border-t border-brown-light/20">
                        <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 flex items-center gap-2">
                            <BookOpen size={14} />
                            Recommended Resources
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {topic.resources?.map((resource: any) => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-lg bg-brown-dark/30 border border-brown-light/30 hover:border-gold/40 hover:bg-gold/5 transition-all group/link"
                                >
                                    <span className="text-xs text-foreground/70 truncate mr-2">{resource.title}</span>
                                    <ExternalLink size={14} className="text-foreground/20 group-hover/link:text-gold transition-colors flex-shrink-0" />
                                </a>
                            ))}
                            {(!topic.resources || topic.resources.length === 0) && (
                                <p className="text-xs text-foreground/30 italic">No resources available for this topic.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSaveNote}
                            disabled={isSaving}
                            className="gold-button flex items-center gap-2 text-sm px-4 py-2"
                        >
                            <Save size={16} />
                            Save Note
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
