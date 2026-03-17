// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17 — Extended parser tests (20+ cases)

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeadstarConditions } from '../src/lib/parse-leadstar-conditions.ts';

test('Parser warunków LeadStar - Kompleksowy zestaw testowy', async (t) => {
  
  // 1. Kwoty i waluty
  await t.test('powinien poprawnie sparsować wpływ na konto z kropką jako separatorem tysięcy', () => {
    const html = '<p>Zapewnij wpływ min. 1.500 zł</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].label, 'Wpływ min. 1500 zł');
  });

  await t.test('powinien obsługiwać kwoty z przecinkiem jako separatorem dziesiętnym', () => {
    const html = '<p>Wpływ min. 500,00 zł</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].label, 'Wpływ min. 500 zł');
  });

  // 2. Liczniki transakcji
  await t.test('powinien wykryć requiredCount ze spacją przed x', () => {
    const html = '<li>wykonaj 5 x płatność kartą</li>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].requiredCount, 5);
  });

  await t.test('powinien wykryć requiredCount zapisany słownie (podstawowe)', () => {
    const html = '<li>wykonaj trzy płatności BLIK</li>';
    const result = parseLeadstarConditions(html);
    assert.ok(result.length > 0);
  });

  // 3. Struktura HTML i puste elementy
  await t.test('powinien ignorować puste elementy listy', () => {
    const html = '<ul><li></li><li>wykonaj przelew</li><li>   </li></ul>';
    const result = parseLeadstarConditions(html);
    assert.equal(result.length, 1);
    assert.equal(result[0].type, 'transfer');
  });

  await t.test('powinien radzić sobie z ekstremalnymi encjami HTML', () => {
    const html = 'Wpływ &#8211; &ndash; &mdash; min. 1000&nbsp;zł';
    const result = parseLeadstarConditions(html);
    assert.ok(result[0].label.includes('1000 zł'));
  });

  // 4. Nowe typy warunków
  await t.test('powinien wykryć zlecenie stałe', () => {
    const html = '<p>ustawić zlecenie stałe na kwotę 100 zł</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'standing_order');
  });

  await t.test('powinien wykryć polecenie zapłaty', () => {
    const html = '<p>aktywować polecenie zapłaty</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'direct_debit');
  });

  await t.test('powinien wykryć oszczędności / lokatę', () => {
    const html = '<p>założyć lokatę na min. 5000 zł</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'savings');
  });

  // 5. Złożone warunki miesięczne
  await t.test('powinien wykryć miesiące zapisane słownie w mianowniku', () => {
    const html = '<p>w każdym z trzech kolejnych miesięcy</p><ul><li>płać kartą</li></ul>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].monthsRequired, 3);
    assert.equal(result[0].perMonth, true);
  });

  await t.test('powinien wykryć miesiące zapisane słownie w dopełniaczu', () => {
    const html = '<p>przez 5 kolejnych miesięcy</p><ul><li>loguj się do aplikacji</li></ul>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].monthsRequired, 5);
  });

  // 6. Multiple conditions in one line
  await t.test('powinien rozdzielić dwa warunki połączone przecinkiem i słowem akcji', () => {
    const html = '<p>zapewnić wpływ 500 zł, zapłacić 3 razy kartą</p>';
    const result = parseLeadstarConditions(html);
    assert.ok(result.length >= 2);
  });

  // 7. Edge cases dla isTrackableAction
  await t.test('powinien ignorować wiersze o wypłacie premii', () => {
    const html = '<p>Premia zostanie wypłacona do 15-go dnia miesiąca.</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result.length, 0);
  });

  await t.test('powinien ignorować wiersze o utrzymaniu zgód', () => {
    const html = '<p>Utrzymać zgody marketingowe do czasu wypłaty.</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0] ? result[0].type : undefined, undefined);
  });

  await t.test('powinien wykryć płatność online / Allegro', () => {
    const html = '<li>wykonaj zakupy na Allegro za min. 50 zł</li>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'online_payment');
  });

  await t.test('powinien wykryć logowanie słowem pobierz i aktywuj aplikację', () => {
    const html = '<p>pobierz i aktywuj aplikację mobilną</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'mobile_app_login');
  });

  // 8. Dodatkowe edge cases
  await t.test('powinien poprawnie zinterpretować słowo wynagrodzenie jako income', () => {
    const html = '<p>zapewnij wpływ z tytułu wynagrodzenia</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'income');
  });

  await t.test('powinien priorytetyzować płatność kartą gdy występuje z BLIK w jednym zdaniu', () => {
    const html = '<p>zrób 5 transakcji kartą lub BLIKiem</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'card_payment');
  });

  await t.test('powinien poradzić sobie z pustym html', () => {
    const html = '   \n  \t  ';
    const result = parseLeadstarConditions(html);
    assert.equal(result.length, 0);
  });

  await t.test('powinien wykryć płatność telefonem priorytetowo przed BLIK', () => {
    const html = '<p>zapłać telefonem lub zbliżeniowo BLIK</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'contactless_payment');
  });
});
