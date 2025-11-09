"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackupTextEditor from "@/components/BackupTextEditor";
import { Plus, Trash2, Edit, LogOut, Loader, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "",
  });
  // Keep editor content separate so edits don't immediately mutate formData on every keystroke
  const [editorDraft, setEditorDraft] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus("saving");

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
      const method = editingPost ? "PUT" : "POST";

  // Use the editor draft value which is kept in sync by the BackupTextEditor component
  const latestContent = editorDraft;
  const payload = { ...formData, content: latestContent };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus("success");
        await fetchPosts();
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          image: "",
          author: "",
        });
        setEditorDraft("");
        setEditingPost(null);
        setShowForm(false);
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      author: post.author || "",
    });
    // populate the editor draft but don't push edits back to formData until submit
    setEditorDraft(post.content || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
  <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recipe Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your recipes and content</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-900">{session.user?.name}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ redirect: true, callbackUrl: "/admin/login" })}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>
    <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Status Messages */}
        {saveStatus !== "idle" && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              saveStatus === "saving" || saveStatus === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-gray-50 border border-gray-200 text-gray-800"
            }`}
          >
            {saveStatus === "saving" && <Loader className="h-5 w-5 animate-spin" />}
            {saveStatus === "success" && <div className="h-5 w-5 text-green-600">✓</div>}
            {saveStatus === "error" && <AlertCircle className="h-5 w-5" />}
            <span>
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "success" && "Post saved successfully!"}
              {saveStatus === "error" && "Error saving post. Please try again."}
            </span>
          </div>
        )}

        {/* Create/Edit Form */}
  <div className={`bg-white rounded-xl shadow-md p-8 mb-8 transition-all ${showForm ? "border-2 border-gray-200" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingPost ? "Edit Recipe" : "Create New Recipe"}
            </h2>
            {showForm && (
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  setFormData({
                    title: "",
                    excerpt: "",
                    content: "",
                    image: "",
                    author: "",
                  });
                  setEditorDraft("");
                }}
              >
                ✕ Close
              </Button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Recipe Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e: any) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Classic Chocolate Chip Cookies"
                    required
                    className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Author Name
                  </label>
                  <Input
                    value={formData.author}
                    onChange={(e: any) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Your name or Kitchen & Garden"
                    className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Brief Excerpt (Description)
                </label>
                <Input
                  value={formData.excerpt}
                  onChange={(e: any) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="A short summary that will appear in recipe listings"
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Featured Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e: any) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  type="url"
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-3 max-h-48 rounded-lg object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Recipe Content *
                </label>
                <BackupTextEditor
                  value={editorDraft}
                  onChange={(content: string) => setEditorDraft(content)}
                  onApply={(content: string) => setEditorDraft(content)}
                  placeholder="Write your recipe with ingredients, instructions, and tips..."
                />
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    setFormData({
                      title: "",
                      excerpt: "",
                      content: "",
                      image: "",
                      author: "",
                    });
                    setEditorDraft("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.title}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  {isLoading ? "Saving..." : editingPost ? "Update Recipe" : "Publish Recipe"}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingPost(null);
                setFormData({ title: "", excerpt: "", content: "", image: "", author: "" });
                setEditorDraft("");
              }}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            >
              <Plus className="mr-2" size={20} />
              Create New Recipe
            </Button>
          )}
        </div>

        {/* Recipes List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Recipes ({posts.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-lg">No recipes yet. Create your first one!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex gap-4">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By {post.author || "Kitchen & Garden"}</span>
                        <span>
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-gray-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}