"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const buttons = [
        {
            icon: <Heading1 size={18} />,
            title: "Heading 1",
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive("heading", { level: 1 })
        },
        {
            icon: <Heading2 size={18} />,
            title: "Heading 2",
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive("heading", { level: 2 })
        },
        {
            icon: <Bold size={18} />,
            title: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive("bold")
        },
        {
            icon: <Italic size={18} />,
            title: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive("italic")
        },
        {
            icon: <List size={18} />,
            title: "Bullet List",
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList")
        },
        {
            icon: <ListOrdered size={18} />,
            title: "Ordered List",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList")
        },
        {
            icon: <Quote size={18} />,
            title: "Blockquote",
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive("blockquote")
        },
        {
            icon: <Undo size={18} />,
            title: "Undo",
            action: () => editor.chain().focus().undo().run(),
            isActive: false,
            disabled: !editor.can().undo()
        },
        {
            icon: <Redo size={18} />,
            title: "Redo",
            action: () => editor.chain().focus().redo().run(),
            isActive: false,
            disabled: !editor.can().redo()
        },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-brown-light/30 bg-brown-dark/30 rounded-t-lg">
            {buttons.map((btn, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        btn.action();
                    }}
                    disabled={btn.disabled}
                    className={`p-2 rounded transition-all ${btn.isActive
                        ? "bg-gold text-brown-dark"
                        : "text-foreground/60 hover:text-gold hover:bg-gold/10"
                        } ${btn.disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                    title={btn.title}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    // Ensure proper parsing of plain text content with newlines from DB
    let initialContent = content || "";
    if (initialContent && !/<[a-z][\s\S]*>/i.test(initialContent)) {
        initialContent = initialContent.split('\n').map(line => `<p>${line}</p>`).join('');
    }

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || "Write your notes here...",
            }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            // Force a re-render to update toolbar state on selection change
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-sm leading-relaxed text-foreground/80 outline-none",
            },
        },
    });

    // IMPORTANT: Only update editor content if it's truly external or initial
    // Don't sync back during typing as it resets cursor and state
    useEffect(() => {
        if (!editor || !content) return;

        let formattedContent = content;
        if (content && !/<[a-z][\s\S]*>/i.test(content)) {
            formattedContent = content.split('\n').map(line => `<p>${line}</p>`).join('');
        }

        const isSame = editor.getHTML() === content || editor.getHTML() === formattedContent;
        if (!isSame) {
            editor.commands.setContent(formattedContent);
        }
    }, [content, editor]);

    return (
        <div className="border border-brown-light/50 rounded-lg overflow-hidden bg-brown-dark/50 focus-within:border-gold transition-colors">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
