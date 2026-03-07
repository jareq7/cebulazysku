# 11. Decyzje architektoniczne

[← Powrót do spisu treści](./README.md)

---

## Dlaczego Supabase?
- Darmowy tier wystarczający na start (500MB DB, 50K auth users)
- Natywna integracja z Next.js (SSR, Server Components)
- Auth out-of-the-box (email, Google, magic links)
- Row Level Security — dane usera chronione na poziomie DB
- Realtime subscriptions — przyszłość (live updates trackera)
- Edge Functions — logika backendowa bez oddzielnego serwera
- Wspólny backend dla web + mobile (React Native)
- Multi-tenant ready — `tenant_id` + RLS per tenant

## Dlaczego Claude API do opisów?
- User ma Claude Pro (dostęp do API)
- Jakość generowanego tekstu w języku polskim — lepsza niż GPT dla polskiego kontekstu
- Możliwość fine-tuning promptu pod „cebulowy" ton (i inne tony per tenant/branża)
- Cache'owanie w DB — raz wygenerowany opis nie wymaga ponownego wywołania API

## Dlaczego ISR (Incremental Static Regeneration)?
- Oferty zmieniają się rzadko (co kilka tygodni)
- Statyczne strony = szybkość + SEO
- Revalidacja co 1h — nowe oferty pojawiają się automatycznie
- Fallback na SSR dla nowych ofert (blocking: false)

## Dlaczego Vercel?
- Natywna obsługa Next.js (ten sam twórca)
- Auto-deploy z GitHub
- Edge Network — szybkie dostarczanie w Polsce
- Cron Jobs — wbudowane, bez dodatkowej infrastruktury
- Darmowy tier wystarczający na start
- Multi-domain support — wiele domen na jednym deploy (white-label)

## Dlaczego Resend.com do emaili?
- 100 emaili/dzień za darmo — wystarczy na start
- Proste API, gotowe React Email templates
- Custom domena (cebulazysku.pl) po konfiguracji DNS
- Dobry deliverability

## Dlaczego React Native (Expo) dla mobile?
- Największy code sharing z istniejącym Next.js (React + TypeScript)
- Expo EAS — build + dystrybucja bez natywnego toolchaina
- Expo Router — file-based routing jak w Next.js
- OTA updates — aktualizacje bez App Store review
- Bogaty ekosystem (notifications, biometrics, offline)

## Dlaczego white-label / multi-tenant?
- Skalowalność — nowa branża = konfiguracja, nie nowy codebase
- Wspólny development — bugfix/feature dostępne wszędzie
- Niski koszt uruchomienia nowej instancji
- Potencjał B2B — licencjonowanie platformy
- Centralny panel admina dla wszystkich tenantów
