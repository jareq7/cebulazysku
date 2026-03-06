import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog – Poradniki i artykuły o promocjach bankowych",
  description:
    "Praktyczne poradniki, porównania i aktualności ze świata promocji bankowych. Dowiedz się, jak bezpiecznie korzystać z premii.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold">Blog</h1>
      </div>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        Praktyczne poradniki i aktualności ze świata promocji bankowych.
      </p>

      {blogPosts.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Wkrótce pojawią się artykuły</h2>
          <p className="text-muted-foreground">
            Pracujemy nad poradnikami, które pomogą Ci w korzystaniu z promocji
            bankowych.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="group hover:shadow-md transition-shadow">
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
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Czytaj
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
