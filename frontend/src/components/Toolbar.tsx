import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Minus,
  Undo,
  Redo,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const items = [
    {
      icon: Bold,
      title: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      title: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: UnderlineIcon,
      title: 'Underline (Ctrl+U)',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    { type: 'divider' },
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    { type: 'divider' },
    {
      icon: List,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      title: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Minus,
      title: 'Horizontal Line',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: false,
    },
    { type: 'divider' },
    {
      icon: Undo,
      title: 'Undo (Ctrl+Z)',
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo,
      title: 'Redo (Ctrl+Y)',
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10 rounded-t-xl">
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={`divider-${index}`} className="w-px h-5 bg-slate-300 mx-1" />;
        }

        const Icon = item.icon!;
        return (
          <button
            key={index}
            onClick={item.action}
            disabled={item.disabled}
            title={item.title}
            className={`p-2 rounded-lg text-sm font-medium transition ${
              item.isActive
                ? 'bg-brand-100 text-brand-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            } ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};
