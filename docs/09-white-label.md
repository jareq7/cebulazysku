# 9. White-label & Multi-branża

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

## Wizja

Platforma CebulaZysku jest projektowana tak, aby w przyszłości mogła działać jako **silnik white-label** — ten sam codebase, wspólny backend, ale różne domeny, brandingi i branże. Każda instancja (tenant) to osobna „marka" z własnymi:

- Domeną i brandingiem (logo, kolory, ton komunikacji)
- Branżą i źródłami ofert (banki, telekom, bukmacherzy, ubezpieczenia...)
- Feedami XML/API od sieci afiliacyjnych
- Konfiguracją trackera warunków dostosowaną do branży
- Panelem admina per tenant

---

## Przykładowe instancje (tenants)

| Tenant ID | Domena | Branża | Feed | Branding |
|-----------|--------|--------|------|----------|
| `cebulazysku` | cebulazysku.pl | Bankowość (konta, karty, lokaty) | LeadStar XML | 🧅 Amber/cebulowy humor |
| `simzysku` | simzysku.pl | Telekomunikacja (abonamenty, internet) | TBD | 📱 Blue/techowy ton |
| `betzysku` | betzysku.pl | Bukmacherka (bonusy powitalne, freebet) | TBD | 🎰 Green/sportowy ton |
| `polisazysku` | polisazysku.pl | Ubezpieczenia (OC/AC, na życie) | TBD | 🛡️ Teal/bezpieczny ton |
| `energiazysku` | energiazysku.pl | Energia (prąd, gaz, fotowoltaika) | TBD | ⚡ Yellow/energetyczny ton |

> Nazwy robocze — do weryfikacji dostępność domen.

---

## Architektura multi-tenant

### Podejście: Single codebase, multi-tenant config

```
┌─────────────────────────────────────────────────────┐
│                  Shared Codebase                     │
│              (Next.js + React Native)                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ cebulazysku │  │  simzysku   │  │  betzysku   │ │
│  │    .pl      │  │    .pl      │  │    .pl      │ │
│  │ 🧅 Banki    │  │ 📱 Telekom  │  │ 🎰 Bukmach. │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │         │
│         ▼                ▼                ▼         │
│  ┌─────────────────────────────────────────────┐    │
│  │         Supabase (wspólna instancja)        │    │
│  │                                             │    │
│  │  tenants           → config per tenant      │    │
│  │  offers            → tenant_id FK           │    │
│  │  user_profiles     → tenant_id FK           │    │
│  │  user_tracked_*    → tenant_id FK (via user)│    │
│  │  feed_sources      → tenant_id + URL + type │    │
│  │  notifications     → tenant_id FK           │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Alternatywa: Osobna instancja Supabase per tenant

Możliwe w przyszłości jeśli tenants wymagają pełnej izolacji danych (np. dla klientów B2B). Na start wspólna instancja z `tenant_id` na każdej tabeli.

---

## Konfiguracja tenanta

Każdy tenant definiowany jest plikiem konfiguracyjnym (lub wpisem w DB):

```typescript
// lib/tenant/types.ts
interface TenantConfig {
  id: string;                    // np. "cebulazysku"
  domain: string;                // np. "cebulazysku.pl"
  name: string;                  // np. "CebulaZysku"
  tagline: string;               // np. "Obierz premie bankowe warstwa po warstwie"
  emoji: string;                 // np. "🧅"
  
  // Branża
  industry: Industry;            // "banking" | "telecom" | "betting" | "insurance" | "energy"
  offerLabel: string;            // np. "oferta bankowa", "abonament", "bonus powitalny"
  conditionTypes: ConditionType[]; // typy warunków specyficzne dla branży
  
  // Branding
  theme: {
    primary: string;             // kolor główny (CSS oklch)
    primaryForeground: string;
    gradient: string;            // np. "from-amber-600 to-orange-500"
    accentLight: string;         // bg-amber-100
    accentDark: string;          // bg-amber-900
  };
  
  // Humor / ton komunikacji
  tone: {
    userNoun: string;            // np. "cebularz", "simowiec", "typowiec"
    userNounPlural: string;      // np. "cebularze", "simowcy", "typowcy"
    actionVerb: string;          // np. "obrać", "wykręcić", "trafić"
    celebrationEmoji: string;    // np. "🧅💰", "📱✨", "🎰🤑"
    humorStyle: "onion" | "tech" | "sport" | "safety" | "energy";
  };
  
  // Źródła danych
  feeds: FeedSource[];           // XML/API feeds z ofertami
  
  // AI prompt template
  aiPromptTemplate: string;      // prompt do generowania opisów
  
  // Kontakt
  contactEmail: string;
  socialLinks?: Record<string, string>;
  
  // Legal
  companyName: string;
  registrationInfo?: string;
}

interface FeedSource {
  id: string;
  type: "leadstar_xml" | "tradedoubler_xml" | "custom_api" | "manual";
  url?: string;
  syncIntervalHours: number;
  fieldMapping: Record<string, string>;  // mapowanie pól feed → DB
}

type Industry = "banking" | "telecom" | "betting" | "insurance" | "energy";

type ConditionType = 
  // Banking
  | "card_transaction" | "bank_transfer" | "direct_debit" | "minimum_balance"
  // Telecom
  | "contract_duration" | "number_porting" | "monthly_topup" | "data_usage"
  // Betting
  | "first_deposit" | "min_odds_bet" | "rollover" | "verification"
  // Insurance
  | "policy_purchase" | "claim_free_period" | "bundle_discount"
  // Energy
  | "contract_switch" | "installation" | "referral";
```

---

## Schemat DB (rozszerzenie multi-tenant)

```sql
-- Tabela tenantów
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,              -- np. "cebulazysku"
  domain TEXT UNIQUE NOT NULL,      -- np. "cebulazysku.pl"
  name TEXT NOT NULL,               -- np. "CebulaZysku"
  config JSONB NOT NULL,            -- pełna konfiguracja TenantConfig
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rozszerzenie tabeli ofert
ALTER TABLE offers ADD COLUMN tenant_id TEXT REFERENCES tenants(id);
CREATE INDEX idx_offers_tenant ON offers(tenant_id);

-- Rozszerzenie tabeli user_profiles  
ALTER TABLE user_profiles ADD COLUMN tenant_id TEXT REFERENCES tenants(id);
CREATE INDEX idx_users_tenant ON user_profiles(tenant_id);

-- Źródła feedów per tenant
CREATE TABLE feed_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT REFERENCES tenants(id),
  feed_type TEXT NOT NULL,          -- "leadstar_xml", "tradedoubler_xml", etc.
  feed_url TEXT,
  sync_interval_hours INT DEFAULT 6,
  field_mapping JSONB,
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT,
  is_active BOOLEAN DEFAULT true
);

-- RLS: user widzi tylko dane swojego tenanta
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_offers ON offers
  USING (tenant_id = current_setting('app.tenant_id')::TEXT);
```

---

## Routing i identyfikacja tenanta

### Podejście 1: Osobne domeny (rekomendowane)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  
  // Mapowanie domena → tenant
  const tenantMap: Record<string, string> = {
    "cebulazysku.pl": "cebulazysku",
    "www.cebulazysku.pl": "cebulazysku",
    "simzysku.pl": "simzysku",
    "betzysku.pl": "betzysku",
    // dev/preview
    "localhost:3000": "cebulazysku",
  };
  
  const tenantId = tenantMap[hostname] || "cebulazysku";
  
  // Ustawienie tenant ID w headerze (dostępne w Server Components)
  const response = NextResponse.next();
  response.headers.set("x-tenant-id", tenantId);
  return response;
}
```

### Podejście 2: Subdomeny (alternatywa)

```
cebulazysku.zysku.pl
sim.zysku.pl
bet.zysku.pl
```

### Podejście 3: Path-based (najprostsze na start)

```
zysku.pl/banki/        → cebulazysku
zysku.pl/telekom/      → simzysku  
zysku.pl/bukmacherzy/  → betzysku
```

---

## Co się zmienia per tenant

| Element | Jak parametryzowany |
|---------|-------------------|
| Logo + emoji | `tenant.emoji` + `tenant.name` |
| Paleta kolorów | `tenant.theme.*` → CSS variables |
| Ton komunikacji | `tenant.tone.*` → szablony tekstów |
| Typy ofert | `tenant.industry` → filtrowanie, etykiety |
| Typy warunków | `tenant.conditionTypes` → tracker UI |
| Źródła feedów | `tenant.feeds` → sync XML/API |
| AI prompt | `tenant.aiPromptTemplate` → generowanie opisów |
| Strony prawne | Generowane z `tenant.companyName`, `tenant.domain` |
| SEO metadata | `tenant.name`, `tenant.tagline`, `tenant.domain` |
| Email kontakt | `tenant.contactEmail` |

## Co jest współdzielone (nie zmienia się per tenant)

| Element | Opis |
|---------|------|
| Codebase Next.js | Jedna apka, routing per tenant |
| Supabase instancja | Wspólna DB z `tenant_id` |
| Infrastruktura Vercel | Jeden deploy, wiele domen |
| Panel admina | Jeden panel z filtrem per tenant |
| Auth system | Supabase Auth (user przypisany do tenanta) |
| Gamifikacja | Wspólna logika, odznaki dostosowane do branży |
| Mobile app | Jedna apka z tenant switch |

---

## Specyfika branżowa — warunki trackera

### 🏦 Bankowość (cebulazysku)
- Transakcje kartą (min. X/miesiąc)
- Przelewy przychodzące (min. kwota)
- Polecenia zapłaty (ZUS, rachunki)
- Utrzymanie salda (min. kwota na koncie)
- Płatność mobilna (BLIK, Google/Apple Pay)

### 📱 Telekomunikacja (simzysku)
- Przeniesienie numeru
- Czas trwania umowy (min. 12/24 mies.)
- Doładowania (min. kwota/miesiąc)
- Zużycie danych (min. X GB)
- Aktywacja usług dodatkowych

### 🎰 Bukmacherka (betzysku)
- Pierwsza wpłata (min. kwota)
- Zakład na min. kurs X.XX
- Obrót bonusem (rollover × kwota)
- Weryfikacja tożsamości
- Zakłady w określonym okresie

### 🛡️ Ubezpieczenia (polisazysku)
- Zakup polisy (OC/AC/życie)
- Okres bezszkodowy
- Rabat za pakiet (bundle)
- Kontynuacja polisy

### ⚡ Energia (energiazysku)
- Zmiana dostawcy
- Podpisanie umowy (min. okres)
- Instalacja (fotowoltaika, pompa ciepła)
- Polecenie znajomego

---

## Dostosowanie AI prompt'a per branża

```typescript
const promptTemplates: Record<Industry, string> = {
  banking: `Jesteś copywriterem serwisu CebulaZysku. Pisz w humorystycznym, 
    przystępnym tonie nawiązującym do cebuli i obierania warstw zysku...`,
    
  telecom: `Jesteś copywriterem serwisu SimZysku. Pisz w nowoczesnym, 
    technicznym ale przystępnym tonie. Nawiązuj do „łapania sygnału" 
    i „wykręcania" najlepszych ofert...`,
    
  betting: `Jesteś copywriterem serwisu BetZysku. Pisz energicznie, 
    sportowym językiem. Nawiązuj do „trafiania" bonusów i „strzelania" 
    freebet'ów. Bądź odpowiedzialny — zawsze przypominaj o ryzyku...`,
    
  insurance: `Jesteś copywriterem serwisu PolisaZysku. Pisz spokojnie, 
    budząc zaufanie. Nawiązuj do „ochrony" i „zabezpieczenia". 
    Podkreślaj bezpieczeństwo i oszczędności...`,
    
  energy: `Jesteś copywriterem serwisu EnergiaZysku. Pisz z energią (!), 
    nawiązuj do „ładowania" portfela i „zasilania" oszczędności. 
    Podkreślaj ekologię i nowoczesność...`,
};
```

---

## Plan implementacji white-label

### Krok 1: Przygotowanie abstrakcji (w trakcie faz 1–3)
- Wydzielenie hardcoded stringów do pliku konfiguracji
- CSS variables zamiast hardcoded kolorów (już zrobione — `globals.css`)
- Typy TypeScript dla TenantConfig

### Krok 2: Tenant resolver (po fazie 3)
- Middleware rozpoznający tenanta po domenie
- `TenantProvider` — React Context z konfiguracją tenanta
- Dynamiczne CSS variables na podstawie `tenant.theme`

### Krok 3: Multi-feed support (po fazie 2)
- Abstrakcja parsera XML → interfejs `FeedParser`
- Implementacje per sieć afiliacyjna (LeadStar, TradeDoubler, etc.)
- Tabela `feed_sources` w DB

### Krok 4: Pierwszy dodatkowy tenant
- Wybór branży (najprawdopodobniej telekom — duży rynek afiliacyjny)
- Rejestracja domeny
- Konfiguracja tenanta
- Podpięcie feedu afiliacyjnego
- Dostosowanie AI prompt'a
- Testowe uruchomienie

### Krok 5: Panel admina — zarządzanie tenantami
- UI do tworzenia/edycji tenantów w panelu admina
- Podgląd statystyk per tenant
- Zarządzanie feedami per tenant

---

## Sieci afiliacyjne per branża

| Branża | Potencjalne sieci | Format feedu |
|--------|-------------------|--------------|
| Bankowość | LeadStar, TradeDoubler, Awin | XML |
| Telekomunikacja | TradeDoubler, Awin, MyLead | XML/API |
| Bukmacherka | BetPartners, Income Access | API |
| Ubezpieczenia | Leadstar, TradeDoubler | XML |
| Energia | Dedykowane programy partnerskie | API |

---

## Korzyści white-label

1. **Skalowalność** — nowa branża = nowy tenant, bez pisania kodu od zera
2. **Wspólny development** — bugfix/feature w jednym codebase → dostępne wszędzie
3. **Niski koszt uruchomienia** — nowy tenant to konfiguracja + domena + feed
4. **Centralny panel admina** — zarządzanie wszystkimi instancjami z jednego miejsca
5. **Wspólna baza użytkowników** — user może mieć konto na wielu tenantach (opcjonalnie SSO)
6. **Potencjał B2B** — licencjonowanie platformy innym firmom afiliacyjnym
