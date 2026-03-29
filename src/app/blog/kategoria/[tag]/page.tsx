// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-26
// @author Windsurf (claude-sonnet-4-20250514) | 2026-03-29 — code review fixes: shared slugify, Button asChild, next/image, pluralize
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedPosts } from "@/lib/blog";
import { blogPosts as staticPosts } from "@/data/blog";
import { polishSlugify } from "@/lib/slugify";
import { pluralize } from "@/lib/pluralize";
import { JsonLd } from "@/components/JsonLd";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, Clock, Tag } from "lucide-react";

export const revalidate = 300;

interface BlogPostView {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  coverImageUrl?: string;
}

function tagToSlug(tag: string): string {
  return polishSlugify(tag);
}

async function getAllPosts(): Promise<BlogPostView[]> {
  const dbPosts = await getPublishedPosts();

  if (dbPosts.length > 0) {
    return dbPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      publishedAt: p.published_at,
      readingTime: p.reading_time,
      tags: p.tags,
      coverImageUrl: p.cover_image_url,
    }));
  }

  return staticPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
    tags: p.tags,
  }));
}

function getAllTags(posts: BlogPostView[]): Map<string, string> {
  const tagMap = new Map<string, string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = tagToSlug(tag);
      if (!tagMap.has(slug)) {
        tagMap.set(slug, tag);
      }
    }
  }
  return tagMap;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  return Array.from(tags.keys()).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  const tagName = tags.get(tagSlug);

  if (!tagName) return {};

  const filtered = posts.filter((p) =>
    p.tags.some((t) => tagToSlug(t) === tagSlug)
  );

  const title = `Artykuły o: ${tagName} — Blog CebulaZysku`;
  const description = `${filtered.length} artykułów na temat "${tagName}". Poradniki, porównania i aktualności ze świata promocji bankowych.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://cebulazysku.pl/blog/kategoria/${tagSlug}`,
    },
    alternates: {
      canonical: `https://cebulazysku.pl/blog/kategoria/${tagSlug}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: { tag: string };
}) {
  const { tag: tagSlug } = await params;
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  const tagName = tags.get(tagSlug);

  if (!tagName) notFound();

  const filtered = posts.filter((p) =>
    p.tags.some((t) => tagToSlug(t) === tagSlug)
  );

  const allTagEntries = Array.from(tags.entries()).sort((a, b) =>
    a[1].localeCompare(b[1], "pl")
  );

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
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
        name: tagName,
        item: `https://cebulazysku.pl/blog/kategoria/${tagSlug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Strona główna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tagName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-6 w-6 text-emerald-500" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {tagName}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {filtered.length} {pluralize(filtered.length, "artykuł", "artykuły", "artykułów")} z tagiem{" "}
            <Badge variant="secondary">{tagName}</Badge>
          </p>
        </div>

        {/* Tag cloud */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTagEntries.map(([slug, name]) => (
            <Link key={slug} href={`/blog/kategoria/${slug}`}>
              <Badge
                variant={slug === tagSlug ? "default" : "outline"}
                className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                {name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-30" />
            <p className="text-muted-foreground">
              Brak artykułów z tym tagiem.
            </p>
            <Button variant="outline" className="gap-2 mt-4" asChild>
              <Link href="/blog">
                Wszystkie artykuły
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((post) => (
              <Card
                key={post.slug}
                className="group hover:shadow-md transition-shadow overflow-hidden"
              >
                {post.coverImageUrl && (
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      width={800}
                      height={450}
                      loading="lazy"
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </Link>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((t) => (
                        <Link key={t} href={`/blog/kategoria/${tagToSlug(t)}`}>
                          <Badge
                            variant={tagToSlug(t) === tagSlug ? "default" : "secondary"}
                            className="text-xs cursor-pointer"
                          >
                            {t}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Czytaj
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to blog */}
        <div className="text-center mt-12">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/blog">
              Wszystkie artykuły
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
