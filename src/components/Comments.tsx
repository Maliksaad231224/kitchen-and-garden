"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CommentItem {
  id: number;
  post_id: number;
  user_id: number;
  username: string | null;
  content: string;
  created_at: string;
}

export default function Comments({ postId }: { postId: number }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const json = await res.json();
      setComments(json.comments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!session) {
      setError("You must be logged in to post a comment.");
      return;
    }
    // Only regular users can post comments
    const role = (session.user as any)?.role;
    if (role !== "user") {
      setError("Only account holders may post comments.");
      return;
    }
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      const json = await res.json();
      if (json?.ok) {
        setContent("");
        await fetchComments();
      } else {
        setError(json?.error || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      {comments.length === 0 ? (
        <p className="text-gray-600 mb-4">No comments yet. Be the first to comment!</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {comments.map((c) => {
            const canModify = session && (((session.user as any)?.role === 'admin') || String((session.user as any)?.id) === String(c.user_id));
            return (
              <li key={c.id} className="border rounded-md p-3 bg-white">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>{c.username || 'User'}</strong> ·{' '}
                    <span>{new Date(c.created_at).toLocaleString()}</span>
                  </div>
                  {canModify && (
                    <div className="flex gap-2">
                      {!editingId || editingId !== c.id ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(c.id);
                              setEditingContent(c.content);
                            }}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this comment?')) return;
                              try {
                                const res = await fetch(`/api/comments?commentId=${c.id}`, { method: 'DELETE' });
                                const j = await res.json();
                                if (j?.ok) await fetchComments();
                                else alert(j?.error || 'Failed to delete');
                              } catch (err) {
                                console.error(err);
                                alert('Server error');
                              }
                            }}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={async () => {
                              if (!editingContent.trim()) return;
                              try {
                                const res = await fetch(`/api/comments`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ commentId: c.id, content: editingContent }),
                                });
                                const j = await res.json();
                                if (j?.ok) {
                                  setEditingId(null);
                                  setEditingContent("");
                                  await fetchComments();
                                } else {
                                  alert(j?.error || 'Failed to update');
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Server error');
                              }
                            }}
                            className="text-sm text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingContent("");
                            }}
                            className="text-sm text-gray-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="whitespace-pre-wrap text-gray-800 mt-2">
                  {editingId === c.id ? (
                    <textarea className="w-full p-2 border rounded-md" value={editingContent} onChange={(e) => setEditingContent(e.target.value)} />
                  ) : (
                    c.content
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={session ? "Write a comment..." : "Sign in to write a comment"}
          disabled={!session || ((session.user as any)?.role !== "user")}
          className="w-full p-3 border rounded-md resize-none min-h-[80px] bg-white text-gray-900"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <button
            type="submit"
            disabled={!session || ((session.user as any)?.role !== "user") || loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post comment"}
          </button>
          {/* If not signed in, show sign in / signup links; if signed in but not a regular user, show note */}
          {!session ? (
            <div className="text-sm text-gray-600">
              <Link href="/login" className="text-red-600 underline mr-2">Sign in</Link>
              or
              <Link href="/signup" className="text-red-600 underline ml-2">Create account</Link>
            </div>
          ) : ((session.user as any)?.role !== "user") ? (
            <div className="text-sm text-gray-600">
              You are signed in as <strong>{(session.user as any)?.name || 'User'}</strong>. Only account holders may post comments.
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
