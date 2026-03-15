import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeadstarConditions } from './src/lib/parse-leadstar-conditions.ts';

test('Parser warunków LeadStar - Kompleksowe testy', async (t) => {
  
  await t.test('powinien poprawnie sparsować wpływ na konto (różne kwoty)', () => {
    const html = '<p>Zapewnij jednorazowy wpływ na konto w wysokości min. 1 500,00 zł</p>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'income');
    assert.equal(result[0].label, 'Wpływ min. 1500 zł');
  });

  await t.test('powinien wykryć płatności BLIK', () => {
    const html = '<li>wykonaj min. 3 płatności kodem BLIK</li>';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'blik_payment');
    assert.equal(result[0].requiredCount, 3);
    assert.equal(result[0].label, '3x płatność BLIK');
  });

  await t.test('powinien obsługiwać warunki miesięczne i kontekst zagnieżdżony', () => {
    const html = `
      <p>KROK 2: W każdym z 5 kolejnych miesięcy kalendarzowych:</p>
      <ul>
        <li>a) wykonaj min. 1 płatność kartą</li>
        <li>b) zaloguj się do aplikacji mobilnej</li>
      </ul>
    `;
    const result = parseLeadstarConditions(html);
    assert.equal(result.length, 2);
    
    assert.equal(result[0].type, 'card_payment');
    assert.equal(result[0].perMonth, true);
    assert.equal(result[0].monthsRequired, 5);
    
    assert.equal(result[1].type, 'mobile_app_login');
    assert.equal(result[1].perMonth, true);
    assert.equal(result[1].monthsRequired, 5);
  });

  await t.test('powinien ignorować wiersze informacyjne', () => {
    const html = `
      <p>Jak ołupić bank?</p>
      <p>1. Otwórz konto z linku poniżej.</p>
      <p>Premia wpadnie jak tylko bank się rozliczy.</p>
    `;
    const result = parseLeadstarConditions(html);
    assert.equal(result.length, 1);
    assert.equal(result[0].type, 'setup');
  });

  await t.test('powinien poprawnie czyścić encje HTML LeadStar', () => {
    const html = 'Wpływ &nbsp; min. 500&nbsp;zł';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].label, 'Wpływ min. 500 zł');
  });

  await t.test('powinien wykryć płatność telefonem (contactless)', () => {
    const html = 'zapłać telefonem (Apple Pay / Google Pay)';
    const result = parseLeadstarConditions(html);
    assert.equal(result[0].type, 'contactless_payment');
    assert.equal(result[0].label, 'Płatność telefonem');
  });
});