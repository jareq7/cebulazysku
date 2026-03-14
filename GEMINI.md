# CebulaZysku.pl — Instrukcje dla AI

Ten plik to onboarding dla każdego AI asystenta pracującego z tym projektem. Przeczytaj go w całości zanim zaczniesz kodować.

## Co to jest?

**CebulaZysku.pl** to polski serwis porównujący promocje bankowe (premie za otwarcie konta). Użytkownicy przeglądają oferty, otwierają konta przez linki afiliacyjne i śledzą postępy w spełnianiu warunków promocji. Serwis zarabia na prowizjach afiliacyjnych z programu LeadStar.

Nazwa nawiązuje do cebuli — "każda warstwa to kolejny zysk". Użytkownicy to "cebularze", oferty to "cebulki do obrania". Ton komunikacji jest humorystyczny i ciepły.

**Produkcja:** https://cebulazysku.pl

## Stack technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Framework | Next.js 15 (App Router, SSR, ISR) |
| Baza danych + Auth | Supabase (PostgreSQL, RLS, email/password) |
| UI | Tailwind CSS v4 + shadcn/ui + Lucide icons |
| AI (opisy ofert) | Google Gemini free tier → OpenRouter fallback |
| Video | Remotion (programmatic 9:16 video ads) |
| TTS | ElevenLabs (Polish voiceovers) |
| Email | Resend.com |
| Hosting | Vercel (auto-deploy z `main`) |

## Obowiązkowy workflow

**NIGDY nie koduj od razu. Zawsze najpierw PRD, potem taski, potem kod.**

1. User opisuje co chce (brief)
2. Zadaj 3-5 pytań wyjaśniających z opcjami A/B/C/D do łatwego wyboru
3. Zapisz PRD → `/tasks/prd-[feature].md` (szablon: `create-prd.md` w root)
4. Wygeneruj high-level taski, pokaż userowi, czekaj na "Go"
5. Rozbij na sub-taski → `/tasks/tasks-[feature].md` (szablon: `generate-tasks.md` w root)
6. Task 0.0 zawsze = "Create feature branch"
7. Implementuj, odznaczaj checkboxy `- [ ]` → `- [x]` po każdym sub-tasku
8. Nie rób nic co nie jest w task liście

## Architektura — jak przepływają dane

```
LeadStar XML feed
    ↓ (cron, 01:00 UTC)
/api/sync-offers → parse-leadstar-conditions.ts (regex, BEZ AI!)
    ↓
Supabase DB (tabela `offers`)
    ↓ (cron, 02:00 UTC)
/api/cron/generate-descriptions → Gemini AI → opisy, pros/cons, FAQ (NIGDY warunki!)
    ↓ (cron, 03:00 UTC)
/api/cron/quality-check → scraping stron banków → weryfikacja kwot premii
    ↓ (cron, 08:00 UTC)
/api/cron/email-notifications → Resend → deadline reminders, weekly digest
```

**KRYTYCZNE:** Warunki ofert (conditions) ZAWSZE z parsera feedu, NIGDY z AI. AI generuje TYLKO opisy, zalety/wady, FAQ.

## Kluczowe pliki

| Co | Gdzie |
|----|-------|
| Landing page | `src/app/page.tsx` |
| Strona oferty | `src/app/oferta/[slug]/page.tsx` |
| Dashboard usera | `src/app/dashboard/page.tsx` |
| Sync ofert z LeadStar | `src/app/api/sync-offers/route.ts` |
| Parser warunków | `src/lib/parse-leadstar-conditions.ts` |
| AI opisy | `src/lib/generate-offer-content.ts` |
| AI client (Gemini/OpenRouter) | `src/lib/ai-client.ts` |
| Mapper DB → frontend | `src/lib/offers.ts` |
| ElevenLabs TTS | `src/lib/elevenlabs.ts` |
| Video Remotion | `src/remotion/OfferVideo.tsx` |
| Admin auth | `src/lib/admin-auth.ts` |
| Typy ofert | `src/data/banks.ts` |

## Baza danych (Supabase)

Kolumna z nazwą banku to `bank_name` (NIE `institution`). 18 migracji w `supabase/migrations/`.

Główne tabele: `offers`, `tracked_offers`, `condition_progress`, `user_achievements`, `user_streaks`, `user_banks`, `user_referrals`, `blog_posts`, `contact_messages`, `push_subscriptions`, `notification_preferences`, `sync_log`, `email_sends`.

## Czego NIE robić

- Nie koduj bez PRD i tasków
- Nie generuj warunków ofert przez AI — tylko parser feedu
- Nie używaj `leadstar.pl/img/programs/` do logotypów — wymaga auth, zwraca HTML. Używaj `img.leadmax.pl`
- Nie twórz nowych projektów na Vercel — jest jeden: `cebulazysku.pl`
- Nie wysyłaj do ElevenLabs tekstu bez `sanitizeForTTS()` ("5x" → "5 razy", "min." → "minimum")
- Nie hardcoduj timestampów w video — używaj proportional scene timing

## Komendy dev

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Build produkcyjny
npx remotion studio      # Podgląd video
```

## Status projektu (marzec 2026)

MVP jest GOTOWE i działa na produkcji. Wszystko co core — landing, oferty z DB, auth, dashboard z trackerem, admin panel, SEO, blog, PWA, push, email, AI opisy, video ads — jest zaimplementowane.

Szczegółowa dokumentacja: `docs/README.md` (44 plików tematycznych).
Roadmapa: `docs/03-roadmap.md`.
Zrealizowane fazy: `docs/04-fazy-zrealizowane.md`.

## O właścicielu

Jarek — solo developer, specjalista SEM z 10-letnim doświadczeniem. Pracuje na MacBooku Pro z VS Code. Preferuje krótkie, konkretne odpowiedzi (jedną rekomendację, nie listę opcji). Komunikacja po polsku.
