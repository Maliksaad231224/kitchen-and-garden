"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, List, Link, Image, Heading1, Heading2, Heading3, Quote } from "lucide-react";

interface BackupTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onApply?: (value: string) => void;
  placeholder?: string;
}

export default function BackupTextEditor({ value, onChange, onApply, placeholder = "Write your content here..." }: BackupTextEditorProps) {
  const [content, setContent] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = selectedText || placeholder;

    const newContent = 
      textarea.value.substring(0, start) + 
      before + newText + after + 
      textarea.value.substring(end);

    handleContentChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + newText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => insertText("# ", "", "Heading 1")
    },
    {
      icon: Heading2,
      title: "Heading 2", 
      action: () => insertText("## ", "", "Heading 2")
    },
    {
      icon: Heading3,
      title: "Heading 3",
      action: () => insertText("### ", "", "Heading 3")
    },
    {
      icon: Bold,
      title: "Bold",
      action: () => insertText("**", "**", "bold text")
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => insertText("*", "*", "italic text")
    },
    {
      icon: Underline,
      title: "Underline",
      action: () => insertText("<u>", "</u>", "underlined text")
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => insertText("- ", "", "list item")
    },
    {
      icon: Quote,
      title: "Quote",
      action: () => insertText("> ", "", "quote")
    },
    {
      icon: Link,
      title: "Link",
      action: () => {
        const url = window.prompt("Enter URL:");
        if (url) {
          insertText("[", `](${url})`, "link text");
        }
      }
    },
    {
      icon: Image,
      title: "Image",
      action: () => {
        const url = window.prompt("Enter image URL:");
        if (url) {
          insertText("![alt text](", `${url})`, "image description");
        }
      }
    }
  ];

  const handleApply = () => {
    if (onApply) onApply(content);
  };

  const handleReset = () => {
    handleContentChange(value);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map(({ icon: Icon, title, action }, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={action}
            className="h-8 w-8 p-0 hover:bg-gray-200"
            title={title}
          >
            <Icon size={14} />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-96 p-4 resize-none border-none outline-none font-mono text-sm leading-relaxed"
          style={{ minHeight: '24rem' }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent h-4 pointer-events-none" />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          Markdown editor - Use toolbar or type markdown syntax
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleReset} size="sm">
            Reset
          </Button>
          {onApply && (
            <Button type="button" onClick={handleApply} size="sm">
              Apply
            </Button>
          )}
        </div>
      </div>

      {/* Preview toggle (optional) */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            Preview
          </summary>
          <div 
            className="mt-2 p-3 bg-white border border-gray-200 rounded prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/#{1,6}\s+(.*)/g, (match, text) => {
                  const level = match.indexOf(' ');
                  return `<h${level}>${text}</h${level}>`;
                })
                .replace(/^>\s+(.*)/gm, '<blockquote>$1</blockquote>')
                .replace(/^\s*-\s+(.*)/gm, '<li>$1</li>')
            }}
          />
        </details>
      </div>
    </div>
  );
}