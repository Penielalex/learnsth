"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2 } from "lucide-react";
import { createBrainSubtopicAction, deleteBrainSubtopicAction, updateBrainSubtopicContentAction } from "@/app/actions";
import RichTextEditor from "./RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";

interface Subtopic {
  id: string;
  title: string;
  content: string | null;
}

interface BrainSubtopicListProps {
  brainNoteId: string;
  initialSubtopics: Subtopic[];
}

export default function BrainSubtopicList({ brainNoteId, initialSubtopics }: BrainSubtopicListProps) {
  const [subtopics, setSubtopics] = useState<Subtopic[]>(initialSubtopics);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || loading) return;

    setLoading(true);
    const res = await createBrainSubtopicAction(brainNoteId, newTitle);
    if (res.success && res.subtopicId) {
      setSubtopics([...subtopics, { id: res.subtopicId, title: newTitle, content: "" }]);
      setNewTitle("");
      setExpandedId(res.subtopicId);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subtopic?")) return;
    const res = await deleteBrainSubtopicAction(id);
    if (res.success) {
      setSubtopics(subtopics.filter(s => s.id !== id));
    }
  };

  const handleSaveContent = async (id: string, content: string) => {
    setSavingId(id);
    await updateBrainSubtopicContentAction(id, content);
    
    // Update local state to reflect saved content
    setSubtopics(subtopics.map(s => s.id === id ? { ...s, content } : s));
    setSavingId(null);
  };

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between border-b border-brown-light pb-2">
        <h3 className="text-xl font-bold text-white">Subtopics</h3>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a subtopic..."
            className="bg-brown-dark/40 border border-brown-light/30 rounded-lg px-3 py-1 text-sm outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !newTitle.trim()}
            className="p-1.5 bg-gold text-brown-dark rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {subtopics.map((subtopic) => (
          <div key={subtopic.id} className="bg-brown-dark/20 border border-brown-light/20 rounded-xl overflow-hidden shadow-sm">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-brown-light/5 transition-colors"
              onClick={() => setExpandedId(expandedId === subtopic.id ? null : subtopic.id)}
            >
              <h4 className="font-semibold text-foreground">{subtopic.title}</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(subtopic.id);
                  }}
                  className="text-foreground/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === subtopic.id ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className="text-foreground/40" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedId === subtopic.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-brown-light/10"
                >
                  <div className="p-4">
                    <SubtopicEditor 
                      initialContent={subtopic.content || ""} 
                      onSave={(content) => handleSaveContent(subtopic.id, content)}
                      isSaving={savingId === subtopic.id}
                      placeholder={`Notes for ${subtopic.title}...`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {subtopics.length === 0 && (
          <p className="text-center text-sm text-foreground/40 py-8 italic border border-dashed border-brown-light/20 rounded-xl">
            No subtopics yet. Breakdown your topic into smaller parts.
          </p>
        )}
      </div>
    </div>
  );
}

function SubtopicEditor({ initialContent, onSave, isSaving, placeholder }: { 
  initialContent: string, 
  onSave: (content: string) => void, 
  isSaving: boolean,
  placeholder: string 
}) {
  const [localContent, setLocalContent] = useState(initialContent);

  return (
    <div className="space-y-4">
      <RichTextEditor
        content={localContent}
        onChange={setLocalContent}
        placeholder={placeholder}
      />
      <div className="flex justify-end">
        <button
          onClick={() => onSave(localContent)}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-bold px-4 py-2 rounded-lg transition-all border border-gold/20"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? "Saving..." : "Save Subtopic Notes"}
        </button>
      </div>
    </div>
  );
}
