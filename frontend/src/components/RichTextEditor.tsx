import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Toolbar } from './Toolbar';

interface RichTextEditorProps {
  content: string; // JSON string or HTML string
  onChange: (jsonContent: string) => void;
  readOnly?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  readOnly = false,
}) => {
  const parseContent = (raw: string) => {
    if (!raw) return '<p></p>';
    try {
      if (raw.trim().startsWith('{')) {
        return JSON.parse(raw);
      }
      return raw;
    } catch {
      return raw;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your document here...',
      }),
    ],
    content: parseContent(content),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      // Store editor content as JSON string as required in specification
      const jsonString = JSON.stringify(editor.getJSON());
      onChange(jsonString);
    },
  });

  // Keep content synced if external document changes
  useEffect(() => {
    if (editor && content) {
      const parsed = parseContent(content);
      const currentJSON = JSON.stringify(editor.getJSON());
      const newJSON = typeof parsed === 'object' ? JSON.stringify(parsed) : null;

      if (newJSON && currentJSON !== newJSON) {
        editor.commands.setContent(parsed, false);
      }
    }
  }, [content, editor]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
      {!readOnly && <Toolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto bg-white cursor-text">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
