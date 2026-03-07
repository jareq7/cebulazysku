# 22. Gamifikacja (streaki, odznaki)

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Cel
Motywacja użytkowników do regularnego korzystania z serwisu poprzez system streaków (codziennej aktywności) i odznak (achievementów) za osiągnięcia.

---

## 2. Architektura

```
Dashboard
├── StreakBadge       → POST /api/gamification/streak (record + get)
├── AchievementsList  → GET /api/gamification/achievements
└── (unlock logic)    → POST /api/gamification/achievements
```

### Tabele Supabase:
- `user_streaks` — current_streak, longest_streak, last_activity_date
- `user_achievements` — achievement_type, unlocked_at

---

## 3. Tabele SQL

### Plik: `supabase/migrations/005_gamification.sql`

```sql
-- user_achievements: typ odznaki + data odblokowania
-- user_streaks: current/longest streak + last activity date
-- RLS: user widzi tylko swoje dane, service_role full access
```

---

## 4. System streaków

### Mechanizm:
1. Użytkownik wchodzi na dashboard → `POST /api/gamification/streak`
2. Backend sprawdza `last_activity_date`:
   - **Dziś** → nic nie zmienia (już policzony)
   - **Wczoraj** → `current_streak + 1`
   - **Wcześniej** → reset do 1
3. `longest_streak` aktualizowany jeśli nowy rekord

### Komponent: `StreakBadge`
- Gradient card z ikoną ognia 🔥
- Wyświetla aktualny streak i rekord
- Ukrywa się gdy streak = 0

---

## 5. System odznak

### 12 odznak w 4 kategoriach:

| Kategoria | Odznaka | Warunek | Ikona |
|-----------|---------|---------|-------|
| Oferty | Pierwsza Cebulka | 1 śledzona oferta | 🧅 |
| Oferty | Cebularz | 3 śledzone oferty | 🧅🧅 |
| Oferty | Cebulowy Baron | 5+ śledzonych | 🧅🧅🧅 |
| Oferty | Cebulowy Magnat | 10+ śledzonych | 👑🧅 |
| Oferty | Odkrywca | 5 różnych banków | 🗺️ |
| Streak | Rozgrzewka | 3-dniowy streak | 🔥 |
| Streak | Stały Bywalec | 7 dni | 🔥🔥 |
| Streak | Wytrwały Cebularz | 14 dni | 💪 |
| Streak | Cebulowy Maraton | 30 dni | 🏆 |
| Streak | Legenda | 100 dni | ⭐ |
| Pieniądze | Tysiącznik | >1000 zł potencjalnej premii | 💰 |
| Pieniądze | Pięciotysiącznik | >5000 zł | 💎 |
| Specjalne | Perfekcjonista | 100% warunków w 1 ofercie | ✨ |

### Komponent: `AchievementsList`
- Grid 2x3 / 3x4 z wszystkimi odznakami
- Odblokowane: kolorowe, z datą
- Zablokowane: wyszarzone (grayscale), z opisem warunku
- Licznik: X/13 zdobytych

### Definicje: `src/lib/achievements.ts`
- Typy, nazwy, opisy, ikony, kategorie
- Helper `getAchievement(type)` do pobierania danych

---

## 6. API Endpoints

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/gamification/streak` | GET | Pobierz streak usera |
| `/api/gamification/streak` | POST | Zarejestruj aktywność (auto-bump streak) |
| `/api/gamification/achievements` | GET | Lista odblokowanych odznak |
| `/api/gamification/achievements` | POST | Odblokuj odznakę |

Wszystkie wymagają zalogowanego użytkownika (Supabase Auth).

---

## 7. Pliki źródłowe

```
src/lib/achievements.ts                          # Definicje odznak
src/components/StreakBadge.tsx                    # Komponent streaka
src/components/AchievementsList.tsx               # Lista odznak
src/app/api/gamification/streak/route.ts          # Streak API
src/app/api/gamification/achievements/route.ts    # Achievements API
src/app/dashboard/page.tsx                        # Dashboard (zintegrowany)
supabase/migrations/005_gamification.sql          # Tabele SQL
```

---

## 8. Status

✅ **Ukończone** — 7 marca 2026

- Tabele SQL (user_streaks, user_achievements) z RLS
- 13 odznak w 4 kategoriach
- Streak tracking z auto-bump na dashboard
- Komponenty StreakBadge + AchievementsList na dashboard
- API endpoints streak + achievements
- Build przechodzi bez błędów
- **Akcja wymagana**: uruchomić SQL z `005_gamification.sql` w Supabase Dashboard
