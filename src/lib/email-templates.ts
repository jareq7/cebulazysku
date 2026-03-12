const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cebulazysku.pl";

function layout(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${previewText}</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; color: white; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
    .header p { margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; }
    .body { padding: 32px; }
    .body p { margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6; }
    .highlight { background: #ecfdf5; border-left: 3px solid #10b981; border-radius: 0 8px 8px 0; padding: 14px 18px; margin: 20px 0; }
    .highlight strong { color: #065f46; font-size: 16px; }
    .btn { display: inline-block; background: #059669; color: white !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0; }
    .reward { font-size: 32px; font-weight: 800; color: #059669; }
    .footer { padding: 20px 32px; border-top: 1px solid #f0f0f0; text-align: center; }
    .footer p { margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.7; }
    .footer a { color: #6b7280; text-decoration: underline; }
    .tag { display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 14px; display: flex; justify-content: space-between; align-items: center; }
    .list li:last-child { border-bottom: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🧅 CebulaZysku</h1>
      <p>Obieramy premie bankowe warstwa po warstwie</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>
        Wysłano przez <a href="${BASE_URL}">cebulazysku.pl</a><br/>
        <a href="${BASE_URL}/dashboard">Zarządzaj powiadomieniami</a> &nbsp;·&nbsp;
        <a href="${BASE_URL}/dashboard">Wypisz się</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export interface DeadlineEmailData {
  userName: string;
  bankName: string;
  offerName: string;
  reward: number;
  daysLeft: number;
  offerSlug: string;
}

export function deadlineReminderEmail(data: DeadlineEmailData): { subject: string; html: string } {
  const { userName, bankName, offerName, reward, daysLeft, offerSlug } = data;

  const urgencyTag =
    daysLeft === 1 ? "OSTATNI DZIEŃ" : daysLeft === 3 ? "3 dni" : "7 dni";

  const greeting =
    daysLeft === 1
      ? `To jest <strong>ostatni dzień</strong>, żeby zgarnąć premię`
      : `Zostało Ci tylko <strong>${daysLeft} dni</strong>, żeby zgarnąć premię`;

  const subject =
    daysLeft === 1
      ? `⚠️ OSTATNI DZIEŃ na ${reward} zł z ${bankName}!`
      : `⏰ ${daysLeft} dni do deadline — ${reward} zł z ${bankName}`;

  const content = `
    <p>Hej <strong>${userName}</strong>! 👋</p>
    <p>${greeting} z <strong>${bankName}</strong>. Nie daj się obrać bankowi — to Ty masz zgarnąć premię!</p>
    <div class="highlight">
      <span class="tag">${urgencyTag}</span><br/><br/>
      <strong>${offerName}</strong><br/>
      <span class="reward">${reward} zł</span>
    </div>
    <p>Sprawdź swoje postępy w trackerze i uzupełnij brakujące warunki, zanim okno się zamknie.</p>
    <p style="text-align: center; margin-top: 24px;">
      <a href="${BASE_URL}/oferta/${offerSlug}" class="btn">Sprawdź postępy →</a>
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
      Dobra rada od cebularza: ustaw przypomnienie w kalendarzu na dziś wieczór. Jutro może być za późno 🧅
    </p>
  `;

  return { subject, html: layout(content, subject) };
}

export interface WeeklySummaryEmailData {
  userName: string;
  trackedCount: number;
  totalReward: number;
  offers: { bankName: string; offerName: string; reward: number; slug: string }[];
}

export function weeklySummaryEmail(data: WeeklySummaryEmailData): { subject: string; html: string } {
  const { userName, trackedCount, totalReward, offers } = data;

  const subject = `🧅 Twój tygodniowy raport cebulowy — ${totalReward} zł do obrania`;

  const offerRows = offers
    .slice(0, 5)
    .map(
      (o) => `
      <li>
        <span><a href="${BASE_URL}/oferta/${o.slug}" style="color: #374151; text-decoration: none;">${o.bankName} — ${o.offerName}</a></span>
        <strong style="color: #059669; white-space: nowrap; margin-left: 12px;">${o.reward} zł</strong>
      </li>`
    )
    .join("");

  const content = `
    <p>Hej <strong>${userName}</strong>! 👋</p>
    <p>Czas na Twój tygodniowy raport cebulowy. Oto co masz do obrania:</p>
    <div class="highlight">
      <strong>Śledzisz ${trackedCount} ${trackedCount === 1 ? "ofertę" : "oferty/ofert"}</strong><br/>
      <span class="reward">${totalReward} zł</span>
      <span style="color: #059669; font-size: 14px;"> potencjalnej premii</span>
    </div>
    ${
      offers.length > 0
        ? `<p style="font-weight: 600; margin-bottom: 8px;">Twoje aktywne oferty:</p>
           <ul class="list">${offerRows}</ul>`
        : ""
    }
    <p style="text-align: center; margin-top: 24px;">
      <a href="${BASE_URL}/dashboard" class="btn">Otwórz tracker →</a>
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
      Pamiętaj: każda nieodebrana premia to warstwa cebuli, którą oddajesz bankowi za darmo 🧅
    </p>
  `;

  return { subject, html: layout(content, subject) };
}
