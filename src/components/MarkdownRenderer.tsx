"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="overflow-x-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ node, ...props }) => (
              <table className="min-w-full border-collapse" {...props} />
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-gray-50" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2 text-sm text-gray-800 border" {...props} />
            ),
            tbody: ({ node, ...props }) => (
              <tbody className="bg-white" {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
