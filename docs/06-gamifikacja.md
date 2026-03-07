# 6. Gamifikacja, System Zachęt, Streaki, Rankingi

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

**Cel:** Motywacja użytkowników do regularnego korzystania z serwisu i dokańczania promocji. Użytkownik powinien czuć satysfakcję i chcieć wracać.

---

## 6.1. Statystyki na dashboardzie

- Łącznie obrane: X zł z Y banków (potwierdzone wypłaty)
- W trakcie: X ofert, potencjalnie X zł
- Ranking miesięczny i ogólny
- Wykres postępu w czasie (ile zarobiono per miesiąc)

## 6.2. System odznak/achievementów

| Odznaka | Warunek | Ikona |
|---------|---------|-------|
| Pierwsza Cebulka | Obrałeś pierwszą premię | 🧅 |
| Cebularz | 3 premie odebrane | 🧅🧅 |
| Cebulowy Baron | 5+ premii odebranych | 🧅🧅🧅 |
| Cebulowy Magnat | 10+ premii odebranych | 👑🧅 |
| Tysiącznik | Łącznie >1000 zł obranych | 💰 |
| Pięciotysiącznik | Łącznie >5000 zł obranych | 💎 |
| Błyskawica | Spełnił warunki w <50% dostępnego czasu | ⚡ |
| Perfekcjonista | 100% warunków spełnionych w 3 ofertach z rzędu | ✨ |
| Stały Bywalec | 7-dniowy streak logowań | 🔥 |
| Cebulowy Maraton | 30-dniowy streak logowań | 🏆 |
| Odkrywca | Skorzystał z ofert 5 różnych banków | 🗺️ |
| Ambasador | Zaprosił znajomego który się zarejestrował | 🤝 |

## 6.3. System streaków

- **Streak dzienny** — logowanie + jakiekolwiek działanie (zaznaczenie warunku, sprawdzenie oferty)
- Streak wyświetlany na dashboardzie z animacją ognia 🔥
- Po przerwaniu streaka — delikatny komunikat zachęcający do powrotu
- Milestone'y: 3, 7, 14, 30, 60, 100 dni → dodatkowe odznaki

## 6.4. System zachęt i motywacji

- **Daily nudge** — codzienne powiadomienie „Hej cebularzu, masz 3 rzeczy do zrobienia dziś"
- **Progress celebrations** — animacja konfetti po spełnieniu warunku
- **Milestone alerts** — „Brawo! Jesteś w połowie drogi do 300 zł z BNP Paribas!"
- **Porównania** — „Jesteś w top 10% cebularzy pod względem szybkości obierania"
- **Sugestie** — „Masz otwarte konto w mBanku ale nie śledzisz żadnej promocji. Może czas obrać kolejną warstwę?"

## 6.5. Status wypłaty

- User oznacza „premia wpłynęła na konto" → zmiana statusu oferty na „Obrana! 🧅"
- Potwierdzenie kwoty — statystyki realnych zarobków (nie tylko potencjalnych)
- Timeline: kiedy zacząłeś → kiedy spełniłeś warunki → kiedy premia wpłynęła

## 6.6. Rankingi (opt-in)

- „Top cebularze miesiąca" — publiczny ranking zarobków
- „Najszybszy cebularz" — kto najszybciej spełnił warunki
- Anonimowe uczestnictwo domyślnie (pseudonim)
- Nagrody symboliczne — specjalne odznaki za top 3

## 6.7. Program poleceń

- Unikalny link polecający per user
- Za każdego zaproszonego usera który się zarejestruje → odznaka + punkty
- Za każdego który obrał pierwszą premię → dodatkowe punkty
- Leaderboard poleceń

## Schemat DB (rozszerzenie)

```sql
user_achievements (
  id, user_id, achievement_type, unlocked_at
)

user_streaks (
  id, user_id, current_streak, longest_streak,
  last_activity_date, updated_at
)

user_referrals (
  id, referrer_user_id, referred_user_id,
  referral_code, registered_at, first_offer_completed_at
)
```
