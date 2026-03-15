"use client";

import { adminFetch } from "@/lib/admin-fetch";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  SplitSquareHorizontal,
} from "lucide-react";
import { RenderMarkdown } from "@/components/RenderMarkdown";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string | null;
  reading_time: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const emptyPost: Omit<BlogPost, "id" | "created_at" | "updated_at"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  author: "Zespół CebulaZysku",
  published_at: null,
  reading_time: "5 min",
  tags: [],
  is_published: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyPost);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    adminFetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => setError("Nie udało się załadować postów."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyPost);
    setTagsInput("");
    setCreating(true);
  };

  const startEdit = (post: BlogPost) => {
    setCreating(false);
    setEditing(post);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      published_at: post.published_at,
      reading_time: post.reading_time,
      tags: post.tags,
      is_published: post.is_published,
    });
    setTagsInput(post.tags.join(", "));
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (creating) {
        const res = await adminFetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, tags }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPosts((prev) => [data.post, ...prev]);
        setCreating(false);
      } else if (editing) {
        const res = await adminFetch("/api/admin/blog", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...form, tags }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPosts((prev) =>
          prev.map((p) => (p.id === editing.id ? data.post : p))
        );
        setEditing(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zapisu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) return;

    try {
      const res = await adminFetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Nie udało się usunąć posta.");
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const res = await adminFetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          is_published: !post.is_published,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? data.post : p))
      );
    } catch {
      setError("Nie udało się zmienić statusu.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isEditorOpen = creating || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog ({posts.length})</h1>
        {!isEditorOpen && (
          <Button onClick={startCreate} className="gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nowy post
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40">
          {error}
        </div>
      )}

      {/* Editor */}
      {isEditorOpen && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">
                {creating ? "Nowy post" : "Edytuj post"}
              </h2>
              <Button variant="ghost" size="icon" onClick={cancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Tytuł</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    if (creating) {
                      const slug = e.target.value
                        .toLowerCase()
                        .replace(/[ąćęłńóśźż]/g, (c) =>
                          "acelnoszz"["ąćęłńóśźż".indexOf(c)]
                        )
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      setForm((f) => ({ ...f, slug }));
                    }
                  }}
                  placeholder="Tytuł artykułu"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="tytul-artykulu"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={form.excerpt}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
                placeholder="Krótki opis artykułu"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="content">Treść (Markdown)</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs h-7"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <SplitSquareHorizontal className="h-3 w-3" />
                  {showPreview ? "Ukryj podgląd" : "Podgląd"}
                </Button>
              </div>
              <div className={showPreview ? "grid grid-cols-2 gap-4" : ""}>
                <textarea
                  id="content"
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="## Nagłówek&#10;&#10;Treść artykułu..."
                />
                {showPreview && (
                  <div className="min-h-[300px] rounded-md border border-input bg-muted/30 px-4 py-3 overflow-auto">
                    {form.content ? (
                      <RenderMarkdown text={form.content} />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Wpisz treść aby zobaczyć podgląd...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) =>
                    setForm({ ...form, author: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="reading_time">Czas czytania</Label>
                <Input
                  id="reading_time"
                  value={form.reading_time}
                  onChange={(e) =>
                    setForm({ ...form, reading_time: e.target.value })
                  }
                  placeholder="5 min"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tagi (oddzielone przecinkami)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="poradnik, promocje"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={cancel}>
                Anuluj
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Zapisuję..." : "Zapisz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {post.title}
                    </p>
                    {post.is_published ? (
                      <Badge className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Opublikowany
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Szkic
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{post.slug}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>
                      {new Date(post.updated_at).toLocaleDateString("pl-PL")}
                    </span>
                    {post.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{post.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => togglePublish(post)}
                    title={
                      post.is_published ? "Cofnij publikację" : "Opublikuj"
                    }
                  >
                    {post.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => startEdit(post)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Brak postów. Kliknij "Nowy post" aby dodać pierwszy artykuł.
          </p>
        )}
      </div>
    </div>
  );
}
