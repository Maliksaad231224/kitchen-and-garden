"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// react-quill is client-only; import a local shim that patches findDOMNode when needed
const ReactQuill: any = dynamic(() => import("@/lib/react-quill-shim"), { ssr: false });
// Quill stylesheet (client-only)
// @ts-ignore
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string; // HTML string used by Quill
  onApply?: (value: string) => void; // called when user clicks Apply
  placeholder?: string;
}

export default function RichTextEditorQuill({ value, onApply, placeholder = "Write your post content here..." }: RichTextEditorProps) {
  const [content, setContent] = useState<string>(value || "");
  const quillRef = useRef<any>(null);

  useEffect(() => {
    setContent(value || "");
  }, [value]);

  const handleApply = () => {
    if (onApply) onApply(content);
  };

  // Custom image handler: prompt for URL (simple and avoids upload infra)
  const imageHandler = () => {
    const url = window.prompt("Image URL (https://...):");
    if (!url) return;
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, "image", url, "user");
    editor.setSelection(range.index + 1);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="space-y-2">
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* ReactQuill is dynamically loaded only on client */}
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={(val: string) => setContent(val)}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[24rem]"
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => setContent(value || "")} className="mr-2">
          Reset
        </Button>
        <Button type="button" variant="default" onClick={handleApply}>
          Apply
        </Button>
      </div>

      <p className="text-xs text-gray-500">Rich text editor (Quill) — content is stored as HTML. Use Apply to emit changes.</p>
    </div>
  );
}
