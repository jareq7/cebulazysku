# 7. Panel Administracyjny

[← Powrót do spisu treści](./README.md) | [Roadmapa](./03-roadmap.md)

---

**Cel:** Umożliwienie właścicielowi serwisu zarządzanie ofertami, użytkownikami, treściami i monitorowanie statystyk bez ingerencji w kod.

**Dostęp:** `/admin` — zabezpieczony rolą `admin` w Supabase Auth (RLS + middleware check)

---

## 7.1. Dashboard admina

- Liczba użytkowników (total, nowi dziś/tydzień/miesiąc)
- Liczba aktywnych ofert
- Łączna liczba kliknięć w linki afiliacyjne (dziś/tydzień/miesiąc)
- CTR per oferta
- Wykres rejestracji i aktywności w czasie
- Top 5 najczęściej wybieranych ofert
- Top 5 najczęściej klikanych linków afiliacyjnych

## 7.2. Zarządzanie ofertami

- Lista ofert z XML + status (aktywna/nieaktywna/wstrzymana)
- Podgląd oryginalnych danych z LeadStar vs. wygenerowany opis
- Ręczna edycja opisów (override AI)
- Przycisk „Regeneruj opis" → trigger AI
- Dodawanie własnych ofert (nie tylko z XML)
- Ustawianie kolejności/wyróżnienia ofert (pinned/featured)
- Archiwizacja nieaktualnych ofert

## 7.3. Zarządzanie użytkownikami

- Lista użytkowników z filtrowaniem i wyszukiwaniem
- Szczegóły usera: data rejestracji, śledzone oferty, postępy, streaki, odznaki
- Blokowanie/odblokowanie kont
- Reset hasła
- Przypisywanie roli admin

## 7.4. Zarządzanie treściami

- Edytor postów blogowych (WYSIWYG lub Markdown)
- Zarządzanie FAQ per oferta
- Edycja stron statycznych (o nas, jak to działa)

## 7.5. Powiadomienia

- Podgląd kolejki powiadomień
- Ręczne wysłanie powiadomienia (do jednego usera lub masowe)
- Statystyki: ile wysłano, ile otwarto, ile kliknięto

## 7.6. Logi i monitoring

- Logi sync XML (ostatni sync, ile ofert zaktualizowano, błędy)
- Logi generowania opisów AI (tokeny, koszty, błędy)
- Logi emaili (delivered, bounced, opened)
- Error tracking

## 7.7. Ustawienia serwisu

- Częstotliwość sync XML (co ile godzin)
- Włączanie/wyłączanie powiadomień
- Konfiguracja prompt'a AI do generowania opisów
- Maintenance mode (wyłączenie serwisu z komunikatem)

## 7.8. Zarządzanie tenantami (white-label)

- Lista tenantów (domen/instancji)
- Konfiguracja per tenant: domena, branding, paleta kolorów, logo
- Przypisanie feedów XML per tenant
- Statystyki per tenant

Szczegóły white-label: → [09-white-label.md](./09-white-label.md)

---

## Technologia

- Next.js route group `(admin)` z osobnym layoutem
- Middleware sprawdzający rolę `admin` na poziomie Supabase RLS
- Recharts/Tremor do wykresów
- DataTable z tanstack/react-table do tabel
- React Hook Form do formularzy edycji
