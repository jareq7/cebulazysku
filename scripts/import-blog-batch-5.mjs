// @author Claude Code (claude-opus-4-6) | 2026-03-29
// One-time script to import blog batch 5 into Supabase
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://ndhcyrivrvoagfyqewfm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const articles = [
  {
    file: 'research/content/blog-batch-5/czy-promocje-bankowe-sa-bezpieczne.md',
    slug: 'czy-promocje-bankowe-sa-bezpieczne',
    tags: ['bezpieczenstwo', 'poradnik', 'dla-poczatkujacych'],
    reading_time: '6 min',
  },
  {
    file: 'research/content/blog-batch-5/jak-sprawdzic-karencje.md',
    slug: 'jak-sprawdzic-karencje',
    tags: ['karencja', 'poradnik', 'strategia'],
    reading_time: '6 min',
  },
  {
    file: 'research/content/blog-batch-5/kilka-kont-bankowych.md',
    slug: 'kilka-kont-bankowych',
    tags: ['poradnik', 'strategia', 'dla-poczatkujacych'],
    reading_time: '7 min',
  },
  {
    file: 'research/content/blog-batch-5/konto-dla-studenta-z-premia.md',
    slug: 'konto-dla-studenta-z-premia',
    tags: ['studenci', 'ranking', 'promocje'],
    reading_time: '6 min',
  },
  {
    file: 'research/content/blog-batch-5/podatek-od-premii-bankowej.md',
    slug: 'podatek-od-premii-bankowej',
    tags: ['podatki', 'prawo', 'poradnik'],
    reading_time: '6 min',
  },
];

async function importArticle(article) {
  const raw = readFileSync(article.file, 'utf-8');

  // Extract title from first line (# Title)
  const lines = raw.split('\n');
  const title = lines[0].replace(/^#\s+/, '');

  // Remove title line and @author line, trim
  const contentLines = lines.slice(1).filter(l => !l.startsWith('// @author'));
  let content = contentLines.join('\n').trim();

  // Fix /ranking links → / (homepage, no /ranking page exists)
  content = content.replace(/\[([^\]]+)\]\(\/ranking\)/g, '[$1](/)');

  // Extract excerpt from first paragraph (skip empty lines and ---)
  const paragraphs = content.split('\n\n').filter(p => p.trim() && !p.trim().startsWith('---'));
  const excerpt = paragraphs[0]
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[„"]/g, '"')
    .slice(0, 250)
    .trim();

  const payload = {
    title,
    slug: article.slug,
    excerpt,
    content,
    author: 'Zespół CebulaZysku',
    reading_time: article.reading_time,
    tags: article.tags,
    is_published: true,
    published_at: new Date().toISOString(),
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ ${article.slug}: ${res.status} ${err}`);
    return false;
  }

  const data = await res.json();
  console.log(`✅ ${article.slug} → id: ${data[0]?.id}`);
  return true;
}

console.log('Importing blog batch 5 (5 articles)...\n');

let ok = 0;
for (const article of articles) {
  if (await importArticle(article)) ok++;
}

console.log(`\nDone: ${ok}/${articles.length} imported.`);
