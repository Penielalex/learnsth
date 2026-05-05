"use client";

import { useState } from "react";
import RichTextEditor from "@/app/components/RichTextEditor";
import { updateBrainNoteContentAction } from "@/app/actions";
import { Save, Loader2 } from "lucide-react";

export default function BrainNoteClient({ noteId, initialContent }: { noteId: string, initialContent: string }) {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateBrainNoteContentAction(noteId, content);
        setIsSaving(false);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-foreground/40 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-code"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>
                        Brain Notes
                    </label>
                    {isSaving && <span className="text-[10px] text-gold animate-pulse italic">Saving...</span>}
                </div>
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Start writing your thoughts here..."
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gold-button flex items-center gap-2 text-sm px-4 py-2"
                >
                    <Save size={16} />
                    Save Note
                </button>
            </div>
        </div>
    );
}
