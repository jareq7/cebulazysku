// @author Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Testy dla sanitizeForTTS

import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeForTTS } from '../src/lib/elevenlabs.ts';

test('sanitizeForTTS - podstawowe skróty', async (t) => {
  await t.test('powinien zamienić X na razy', () => {
    assert.equal(sanitizeForTTS('wykonaj 5x płatność'), 'wykonaj 5 razy płatność');
  });

  await t.test('powinien zamienić min. na minimum', () => {
    assert.equal(sanitizeForTTS('wpływ min. 1000 zł'), 'wpływ minimum 1000 złotych');
  });

  await t.test('powinien zamienić maks. na maksimum', () => {
    assert.equal(sanitizeForTTS('premia maks. 500 zł'), 'premia maksimum 500 złotych');
  });

  await t.test('powinien zamienić zł na złotych', () => {
    assert.equal(sanitizeForTTS('nagroda 300 zł'), 'nagroda 300 złotych');
  });
});

test('sanitizeForTTS - czas i daty', async (t) => {
  await t.test('powinien zamienić mies. na miesięcznie', () => {
    assert.equal(sanitizeForTTS('płatność co mies.'), 'płatność co miesięcznie');
  });

  await t.test('powinien zamienić zł/mies. na złotych miesięcznie', () => {
    assert.equal(sanitizeForTTS('opłata 15 zł/mies.'), 'opłata 15 złotych miesięcznie');
  });

  await t.test('powinien zamienić r. na roku', () => {
    assert.equal(sanitizeForTTS('w 2026 r.'), 'w 2026 roku');
  });
});

test('sanitizeForTTS - liczebniki i inne', async (t) => {
  await t.test('powinien zamienić tys. na tysięcy', () => {
    assert.equal(sanitizeForTTS('bonus 2 tys. zł'), 'bonus 2 tysięcy złotych');
  });

  await t.test('powinien zamienić nr. na numer', () => {
    assert.equal(sanitizeForTTS('konto nr. 1'), 'konto numer 1');
  });

  await t.test('powinien usuwać nadmiarowe spacje', () => {
    assert.equal(sanitizeForTTS('wpływ   min.  500   zł'), 'wpływ minimum 500 złotych');
  });
});

test('sanitizeForTTS - edge cases', async (t) => {
  await t.test('nie powinien zamieniać x wewnątrz słowa', () => {
    assert.equal(sanitizeForTTS('ekstra premia'), 'ekstra premia');
  });

  await t.test('powinien radzić sobie z wieloma skrótami w jednej linii', () => {
    const input = 'Min. 5x płatność kartą, maks. 200 zł/mies. w 2026 r.';
    const expected = 'minimum 5 razy płatność kartą, maksimum 200 złotych miesięcznie w 2026 roku';
    assert.equal(sanitizeForTTS(input), expected);
  });
});
