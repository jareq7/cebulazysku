import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-4xl font-extrabold mb-3">404</h1>
        <h2 className="text-xl font-semibold mb-4">Strona nie znaleziona</h2>
        <p className="text-muted-foreground mb-8">
          Przepraszamy, nie możemy znaleźć strony, której szukasz. Być może
          została usunięta lub zmienił się jej adres.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2">
            Wróć do ofert
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
