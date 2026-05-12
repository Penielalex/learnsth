"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteBrainNoteAction } from "@/app/actions";

export default function BrainNoteDeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this topic and all its subtopics?")) {
      return;
    }

    setIsDeleting(true);
    const res = await deleteBrainNoteAction(id);
    if (res.error) {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-4 right-4 p-2 text-foreground/20 hover:text-red-400 transition-colors bg-transparent rounded-lg hover:bg-red-400/5"
      title="Delete Topic"
    >
      {isDeleting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
