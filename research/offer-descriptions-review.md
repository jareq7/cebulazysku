# Review opisów ofert (Quality Check) & Prompt Optimization
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-26

Na podstawie analizy przykładowych ofert w `src/data/banks.ts` oraz logiki generatora w `src/lib/generate-offer-content.ts`, przygotowałem audyt jakościowy oraz propozycje ulepszeń.

---

## 1. Analiza stanu obecnego (na podstawie banks.ts)

### Główne obserwacje:
*   **Zbyt duża poprawność:** Opisy są czytelne, ale brakuje im „pazura”. Brzmią bardziej jak streszczenie regulaminu niż zachęta od „ziomka z internetu”.
*   **Generyczne Pros/Cons:** Zalety typu „Największy bank w Polsce” lub „Dobra obsługa klienta” nie niosą wartości dla łowcy promocji. Cebularza interesuje „Łatwy warunek transakcyjny” lub „Brak opłaty za kartę bez gwiazdek”.
*   **FAQ bez charakteru:** Pytania są standardowe. Brakuje pytań o realne obawy (np. „Czy bank mnie oszuka?”, „Czy mogę zamknąć konto od razu?”).

---

## 2. Sugerowane poprawki do Promptu AI

Obecny prompt jest dobry, ale można go „podkręcić”, dodając mu konkretne techniki copywriterskie.

### Co dodać do Promptu (sekcja TONE OF VOICE):
- „Używaj metafor kulinarnych (cebula, warstwy, zapach zysku) oraz 'skokowych' (łupienie banków, sejf, szybki strzał).”
- „Zamiast pisać 'Bank oferuje', pisz 'Bank rzuca na stół' lub 'Wyciągnij od nich'.”
- „W sekcji CONS bądź brutalnie szczery – Cebularze nienawidzą ukrytych haczyków.”

### Propozycja ulepszonej sekcji PROS/CONS:
- Zamiast ogólnych zalet banku, skup się na **zaletach PROMOCJI**.
- Przykład: `["Banalny warunek (tylko 1 płatność)", "Premia wpada w jednym kawałku", "Konto dla młodych w pełni za 0 zł"]`

---

## 3. "Gold Standard" – Jak powinien wyglądać opis (Przykład)

**Oferta:** mBank eKonto z premią 300 zł

> **Szybki strzał (TL;DR)**: **Zgarnij równe 300 zł** za to, że po prostu zaczniesz płacić nową kartą za swoje codzienne zakupy. 
>
> **Dla kogo ta cebulka?**:
> - Nowi klienci (jeśli nie miałeś konta w mBanku przez ostatnie 12 miesięcy).
> - Osoby, które lubią jak aplikacja działa szybciej niż ich stary komputer.
> - Każdy, kto chce darmową kartę wielowalutową na wakacje.
>
> **Kluczowe kroki**:
> - **Krok 1**: Załóż eKonto z linku poniżej (przez selfie idzie najszybciej).
> - **Krok 2**: Przelej min. **1000 zł** (możesz je od razu odesłać, bank musi tylko zobaczyć ruch).
> - **Krok 3**: Zapłać kartą min. **5 razy** w każdym z 3 miesięcy. 
>
> **Cebulowy werdykt**: To jedna z najpewniejszych promocji na rynku. mBank wypłaca kasę jak w zegarku, a ich aplikacja to absolutny top. Jeśli nie masz tam konta, to te 3 stówy dosłownie leżą na ziemi i czekają, aż je podniesiesz.

---

## 4. Rekomendacje Techniczne (dla Claude Code)

1.  **Rozszerzenie Faq:** Sugeruję dodanie do generatora wymogu generowania min. 1 pytania o bezpieczeństwo lub zamykanie konta.
2.  **Walidacja Pros/Cons:** AI powinno odrzucić zalety, które są cechami banku (np. „Ma dużo placówek”), a skupić się na cechach OFERTY.
3.  **Dynamiczny styl:** Można dodać do promptu informację o stopniu trudności – jeśli oferta jest „hard”, AI powinno używać tonu mobilizującego („Tylko dla twardych zawodników”).
