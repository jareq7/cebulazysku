// @author Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — Blog drafts import script

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Załaduj zmienne z .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (!ADMIN_PASSWORD) {
  console.error('BŁĄD: Brak ADMIN_PASSWORD w zmiennych środowiskowych.');
  process.exit(1);
}

const draftsDir = join(__dirname, '..', 'research', 'content', 'blog-drafts');

async function importDrafts() {
  if (!existsSync(draftsDir)) {
    console.error('Katalog draftów nie istnieje: ' + draftsDir);
    return;
  }

  const files = readdirSync(draftsDir).filter(f => f.endsWith('.md'));
  console.log('Znaleziono ' + files.length + ' szkiców do importu.\n');

  for (const file of files) {
    console.log('Przetwarzanie: ' + file + '...');
    const filePath = join(draftsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    
    // Proste parsowanie
    const lines = content.split('\n');
    const titleLine = lines.find(l => l.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : file.replace('.md', '');
    const slug = file.replace('.md', '');
    
    // Excerpt: pierwszy akapit po tytule (pomijając komentarze i puste linie)
    let excerpt = '';
    let bodyStart = false;
    for (const line of lines) {
      if (line.startsWith('# ')) {
        bodyStart = true;
        continue;
      }
      if (bodyStart && line.trim() && !line.startsWith('<!--') && !line.startsWith('---')) {
        excerpt = line.trim().slice(0, 200);
        if (excerpt.length < line.trim().length) excerpt += '...';
        break;
      }
    }

    const payload = {
      title,
      slug,
      excerpt: excerpt || 'Przeczytaj nasz najnowszy poradnik!',
      content,
      author: 'Gemini CLI',
      reading_time: '5 min',
      tags: ['poradnik', 'finanse', 'cebula'],
      is_published: false
    };

    try {
      const res = await fetch(SITE_URL + '/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': ADMIN_PASSWORD
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log('  ✓ Zaimportowano pomyślnie.');
      } else {
        const err = await res.json();
        console.error('  ✗ Błąd importu (' + res.status + '): ' + (err.error || 'Nieznany błąd'));
      }
    } catch (err) {
      console.error('  ✗ Błąd połączenia: ' + err.message);
    }
  }
}

importDrafts().then(() => console.log('\n--- Gotowe ---'));
