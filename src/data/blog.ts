export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "jak-bezpiecznie-korzystac-z-promocji-bankowych",
    title: "Jak bezpiecznie korzystać z promocji bankowych?",
    excerpt:
      "Dowiedz się, na co zwrócić uwagę przy korzystaniu z promocji bankowych. Praktyczne porady dotyczące bezpieczeństwa i unikania pułapek.",
    content: `
## Czym są promocje bankowe?

Promocje bankowe to oferty kierowane najczęściej do nowych klientów, którzy otwierają konto osobiste i spełniają określone warunki. W zamian bank wypłaca premię pieniężną – zazwyczaj od 100 do 400 zł.

## Na co zwrócić uwagę?

### 1. Sprawdź warunki dokładnie

Każda promocja ma swój regulamin. Najważniejsze elementy to:
- **Minimalna kwota wpływu** – często wymaga regularnego zasilania konta
- **Liczba transakcji** – ile płatności kartą lub BLIK musisz wykonać
- **Okres promocji** – ile miesięcy musisz spełniać warunki

### 2. Upewnij się, że konto jest bezpłatne

Wiele kont jest darmowych pod warunkiem spełnienia określonych kryteriów (np. wpływ min. 1000 zł/mies.). Sprawdź, czy po zakończeniu promocji nie będziesz ponosić dodatkowych opłat.

### 3. Zwróć uwagę na BFG

Bankowy Fundusz Gwarancyjny chroni depozyty do 100 000 EUR. Korzystaj wyłącznie z ofert licencjonowanych banków objętych gwarancją BFG.

### 4. Nie podawaj danych w podejrzanych miejscach

Zakładaj konta wyłącznie przez oficjalne strony banków. Nigdy nie podawaj danych logowania osobom trzecim.

## Podsumowanie

Promocje bankowe to bezpieczny sposób na dodatkowe środki, o ile podchodzisz do nich świadomie. Sprawdzaj warunki, korzystaj z licencjonowanych banków i śledź postępy za pomocą narzędzi takich jak BankPremie.
    `.trim(),
    author: "Zespół BankPremie",
    publishedAt: "2026-03-01",
    readingTime: "4 min",
    tags: ["poradnik", "bezpieczeństwo", "promocje bankowe"],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
