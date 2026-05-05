"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createBrainNoteAction } from "@/app/actions";
import { PlusCircle, Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="gold-button flex items-center gap-2 justify-center w-full mt-4"
        >
            {pending ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    Categorizing with AI...
                </>
            ) : (
                <>
                    <PlusCircle size={18} />
                    Add Knowledge Topic
                </>
            )}
        </button>
    );
}

export default function BrainCreateForm() {
    const [state, action] = useFormState(createBrainNoteAction, null);

    return (
        <form action={action} className="w-full">
            {state?.error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4">
                    {state.error}
                </div>
            )}
            
            <div className="relative">
                <input
                    type="text"
                    name="title"
                    required
                    placeholder="E.g., Quantum Physics, React Hooks..."
                    className="w-full bg-brown-dark/50 border border-brown-light focus:border-gold rounded-lg px-4 py-3 outline-none transition-colors pr-12"
                />
            </div>
            
            <SubmitButton />
        </form>
    );
}
