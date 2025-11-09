"use client";

import { useState } from "react";
import RichTextEditorQuill from "@/components/RichTextEditorQuill";
import BackupTextEditor from "@/components/BackupTextEditor";
import { Button } from "@/components/ui/button";

export default function TestEditor() {
  const [quillContent, setQuillContent] = useState("<h2>Test Quill Editor</h2><p>This is a test of the ReactQuill editor with the React 18 fix.</p>");
  const [backupContent, setBackupContent] = useState("# Backup Editor Test\n\nThis is a test of the backup markdown editor.\n\n**Bold text** and *italic text*");
  const [showBackup, setShowBackup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Text Editor Test Page</h1>
          <p className="text-gray-600 mb-4">
            This page tests both the ReactQuill editor and the backup markdown editor.
          </p>
          
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={() => setShowBackup(false)}
              variant={!showBackup ? "default" : "outline"}
            >
              Test ReactQuill
            </Button>
            <Button 
              onClick={() => setShowBackup(true)}
              variant={showBackup ? "default" : "outline"}
            >
              Test Backup Editor
            </Button>
          </div>

          {!showBackup ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">ReactQuill Editor (Fixed)</h2>
              <RichTextEditorQuill
                value={quillContent}
                onApply={(content) => setQuillContent(content)}
                placeholder="Test the ReactQuill editor with React 18 compatibility..."
              />
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <strong>Current Content:</strong>
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: quillContent }} />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-2">Backup Markdown Editor</h2>
              <BackupTextEditor
                value={backupContent}
                onChange={setBackupContent}
                onApply={(content) => setBackupContent(content)}
                placeholder="Test the backup markdown editor..."
              />
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <strong>Current Content:</strong>
                <pre className="whitespace-pre-wrap">{backupContent}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Fix Summary</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• Updated react-quill-shim.ts with enhanced React 18+ compatibility</li>
            <li>• Implemented proper findDOMNode fallback for React 18 strict mode</li>
            <li>• Added multiple fallback strategies for ReactQuill initialization</li>
            <li>• Created backup markdown editor as alternative solution</li>
            <li>• Enhanced error handling and logging</li>
          </ul>
        </div>
      </div>
    </div>
  );
}