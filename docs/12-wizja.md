# 12. Wizja produktu — pełny ekosystem

[← Powrót do spisu treści](./README.md)

---

CebulaZysku w pełnej wersji to **ekosystem do zarządzania zarobkami z promocji** — nie tylko bankowych, ale dowolnej branży (white-label).

## Diagram ekosystemu

```
┌────────────────────────────────────────────────────────────────┐
│                    🧅 EKOSYSTEM CebulaZysku                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Web App    │  │  Mobile App  │  │   Panel Admina       │ │
│  │  (Next.js)   │  │ (React Nat.) │  │   (Next.js /admin)   │ │
│  │              │  │              │  │                      │ │
│  │ • Oferty     │  │ • Quick Track│  │ • Zarządzanie ofertami│
│  │ • Blog       │  │ • Push notif.│  │ • Użytkownicy        │ │
│  │ • Dashboard  │  │ • Offline    │  │ • Statystyki         │ │
│  │ • Tracker    │  │ • Widgety    │  │ • Treści             │ │
│  │ • Gamifikacja│  │ • Biometrics │  │ • Powiadomienia      │ │
│  │              │  │              │  │ • Zarządzanie tenant. │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│         │                 │                      │             │
│         ▼                 ▼                      ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Supabase (wspólny backend)                 │   │
│  │  • PostgreSQL (oferty, użytkownicy, tracker, streaki)   │   │
│  │  • Auth (email, Google, biometrics)                     │   │
│  │  • Realtime Subscriptions (sync mobile ↔ web)           │   │
│  │  • Row Level Security (dane per user + per tenant)      │   │
│  │  • Edge Functions (logika biznesowa)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│         ▲                 ▲                      ▲             │
│  ┌──────┴───────┐  ┌─────┴──────┐  ┌───────────┴───────────┐ │
│  │  XML Feeds   │  │ Claude API │  │    Resend.com         │ │
│  │  (LeadStar,  │  │ (opisy AI  │  │    (email notif.)     │ │
│  │  TradeDoubl.)│  │  per branża)│  │    + Expo Push        │ │
│  └──────────────┘  └────────────┘  └───────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Multi-tenant / White-label                  │   │
│  │  🧅 cebulazysku.pl  📱 simzysku.pl  🎰 betzysku.pl      │   │
│  │  🛡️ polisazysku.pl  ⚡ energiazysku.pl  ...              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## User journey (docelowy)

1. **Odkrycie** → User trafia na cebulazysku.pl (SEO/reklama/polecenie)
2. **Przeglądanie** → Widzi oferty z cebulowym humorem, filtruje, porównuje
3. **Rejestracja** → Zakłada konto, onboarding „w których bankach masz konto"
4. **Otwarcie konta** → Klika link afiliacyjny, zakłada konto w banku
5. **Śledzenie** → Dodaje ofertę do trackera, zaznacza warunki na bieżąco
6. **Motywacja** → Streaki, odznaki, milestone'y, daily nudge, konfetti
7. **Powiadomienia** → Przypomnienia o terminach (email + push mobilny)
8. **Quick Track (mobile)** → Zaraz po zakupach w sklepie: tap → „transakcja kartą ✓"
9. **Wypłata** → Premia wpływa → user oznacza „obrana cebulka! 🧅"
10. **Powtarzanie** → Sugestie kolejnych ofert, program poleceń, rankingi
11. **Cross-branża** → User z cebulazysku dostaje sugestię simzysku (zmień telekom i zaoszczędź)

---

## Monetyzacja (docelowa)

| Źródło | Opis | Priorytet |
|--------|------|-----------|
| **Prowizje afiliacyjne** | Za otwarcie konta/umowy przez link afiliacyjny | Główne |
| **Premium (przyszłość)** | Zaawansowane statystyki, priorytetowe powiadomienia, ekskluzywne odznaki | Opcjonalne |
| **Newsletter sponsorowany** | Cotygodniowy email z wyróżnioną ofertą | Opcjonalne |
| **B2B licencja** | White-label platformy dla firm afiliacyjnych | Przyszłość |

---

## Kluczowe metryki (KPI)

- **CTR** — % userów klikających linki afiliacyjne
- **Konwersja** — % userów otwierających konto/umowę po kliknięciu
- **Retencja 7d/30d** — % userów wracających do serwisu
- **Streak retention** — % userów z aktywnym streakiem >7 dni
- **Completion rate** — % ofert z w pełni spełnionymi warunkami
- **NPS** — Net Promoter Score (czy user poleci serwis)
- **Referral rate** — ile nowych userów z poleceń
- **Tenant growth** — ile aktywnych tenantów/branż
- **Revenue per tenant** — przychód z prowizji per instancja
