import { createClient } from "@supabase/supabase-js";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  reading_time: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  cover_image_url?: string;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }

  return data || [];
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }

  return data;
}
