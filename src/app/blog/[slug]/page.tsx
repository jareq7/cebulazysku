import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getPublishedPosts, getPostBySlug } from "@/lib/blog";
import { blogPosts as staticPosts, getBlogPostBySlug } from "@/data/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { ArrowLeft, Clock, User } from "lucide-react";
import { TrackBlogRead } from "@/components/TrackBlogRead";

export const revalidate = 300;

export async function generateStaticParams() {
  const dbPosts = await getPublishedPosts();
  if (dbPosts.length > 0) {
    return dbPosts.map((post) => ({ slug: post.slug }));
  }
  return staticPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const dbPost = await getPostBySlug(slug);
  const staticPost = getBlogPostBySlug(slug);
  const post = dbPost || staticPost;
  if (!post) return {};

  const publishedAt = dbPost ? dbPost.published_at : (staticPost?.publishedAt || "");

  const coverImage = dbPost?.cover_image_url;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "pl_PL",
      publishedTime: publishedAt,
      ...(coverImage ? { images: [{ url: coverImage, width: 1200, height: 675 }] } : {}),
    },
    alternates: {
      canonical: `https://cebulazysku.pl/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const dbPost = await getPostBySlug(slug);
  const staticPost = getBlogPostBySlug(slug);

  // Normalize to a common shape
  const post = dbPost
    ? {
        title: dbPost.title,
        slug: dbPost.slug,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        author: dbPost.author,
        publishedAt: dbPost.published_at,
        readingTime: dbPost.reading_time,
        tags: dbPost.tags,
        coverImageUrl: dbPost.cover_image_url,
      }
    : staticPost
    ? {
        title: staticPost.title,
        slug: staticPost.slug,
        excerpt: staticPost.excerpt,
        content: staticPost.content,
        author: staticPost.author,
        publishedAt: staticPost.publishedAt,
        readingTime: staticPost.readingTime,
        tags: staticPost.tags,
        coverImageUrl: undefined as string | undefined,
      }
    : null;

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "CebulaZysku",
      url: "https://cebulazysku.pl",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: "https://cebulazysku.pl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://cebulazysku.pl/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://cebulazysku.pl/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <TrackBlogRead articleId={slug} articleTitle={post.title} />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{post.title}</span>
      </nav>

      <article>
        {post.coverImageUrl && (
          <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full rounded-lg object-cover max-h-80"
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
        </header>

        <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed space-y-4">
          {post.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              const items = paragraph.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="list-disc pl-6 space-y-1">
                  {items.map((item, j) => (
                    <li key={j}>{item.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t">
        <Link href="/blog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Wróć do bloga
          </Button>
        </Link>
      </div>
    </div>
  );
}
