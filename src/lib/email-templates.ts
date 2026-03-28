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

function newsletterLayout(content: string, previewText: string, unsubscribeToken?: string): string {
  const unsubLink = unsubscribeToken
    ? `${BASE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`
    : `${BASE_URL}`;
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
        <a href="${unsubLink}">Wypisz się z newslettera</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ---------- Newsletter email templates ----------

export interface NewsletterConfirmEmailData {
  email: string;
  confirmUrl: string;
}

export function newsletterConfirmEmail(data: NewsletterConfirmEmailData): { subject: string; html: string } {
  const { email, confirmUrl } = data;

  const subject = "🧅 Potwierdź subskrypcję CebulaZysku";

  const content = `
    <p>Hej <strong>${email}</strong>! 👋</p>
    <p>Ktoś (mamy nadzieję, że Ty!) zapisał ten adres do newslettera CebulaZysku.</p>
    <p>Kliknij przycisk poniżej, żeby potwierdzić subskrypcję i zacząć otrzymywać powiadomienia o najlepszych premiach bankowych.</p>
    <p style="text-align: center; margin-top: 24px;">
      <a href="${confirmUrl}" class="btn">Potwierdzam subskrypcję →</a>
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
      Jeśli to nie Ty — po prostu zignoruj tego maila. Link wygasa automatycznie.
    </p>
  `;

  return { subject, html: newsletterLayout(content, subject) };
}

export type WelcomeVariant = "A" | "B" | "C";

export interface NewsletterWelcomeEmailData {
  name: string;
  topOffer: { bankName: string; reward: number; slug: string } | null;
  unsubscribeToken?: string;
  variant?: WelcomeVariant;
}

export function pickWelcomeVariant(): WelcomeVariant {
  const variants: WelcomeVariant[] = ["A", "B", "C"];
  return variants[Math.floor(Math.random() * variants.length)];
}

export function newsletterWelcomeEmail(data: NewsletterWelcomeEmailData): { subject: string; html: string } {
  const { name, topOffer, unsubscribeToken, variant = "A" } = data;

  const offerBlock = topOffer
    ? `
    <div class="highlight">
      <span class="tag">TOP OFERTA</span><br/><br/>
      <strong>${topOffer.bankName}</strong><br/>
      <span class="reward">${topOffer.reward} zł</span>
    </div>
    <p style="text-align: center;">
      <a href="${BASE_URL}/oferta/${topOffer.slug}" class="btn">Sprawdź ofertę →</a>
    </p>`
    : `
    <p style="text-align: center;">
      <a href="${BASE_URL}/ranking" class="btn">Zobacz ranking ofert →</a>
    </p>`;

  if (variant === "A") {
    // Wariant A: Zbudowanie autorytetu — profesjonalny, obalający obawy
    const subject = "Potwierdzenie. Twój Tracker Zysków jest aktywny 🧅";
    const content = `
      <p>Cześć <strong>${name}</strong>!</p>
      <p>Dzięki, że dołączyłeś do społeczności CebulaZysku. Wiemy, że na początku „sprzedaż premiowa" i rozdawanie gotówki przez banki wydaje się podejrzana.</p>
      <p>Prawda jest prosta: banki robią to, bo liczą, że z nimi zostaniesz. Ale <strong>to Ty rozdajesz karty</strong>. Naszym zadaniem jest pomóc Ci wejść, odebrać premię i wyjść — bez płacenia ani grosza za ukryte opłaty.</p>
      <p><strong>Co zrobić w ciągu 24 godzin:</strong></p>
      <p>1️⃣ Zaloguj się na <a href="${BASE_URL}/dashboard">Dashboard</a> i dodaj ofertę do Trackera<br/>
      2️⃣ Zobaczysz dokładną datę i warunek do spełnienia<br/>
      3️⃣ My za parę dni przyślemy Ci maila z przypomnieniem</p>
      ${offerBlock}
      <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
        To legalne i wolne od podatku dochodowego 🧅
      </p>
    `;
    return { subject, html: newsletterLayout(content, subject, unsubscribeToken) };
  }

  if (variant === "B") {
    // Wariant B: Krótki i brutalny — konwersyjny, FOMO
    const subject = "Twoje 500 zł już na Ciebie czeka 💸";
    const content = `
      <p>Siema <strong>${name}</strong>!</p>
      <p>Dzięki za dołączenie. Nie będę przedłużał — obaj wiemy, po co tu jesteś. Chcesz przestać przepłacać i zacząć wykorzystywać budżety reklamowe wielkich banków.</p>
      <p>W tym miesiącu w naszym rankingu wiszą promocje o łącznej wartości <strong>ponad 1500 zł</strong>. Najlepsze z nich znikają szybciej niż się spodziewasz — banki często limitują liczbę wniosków.</p>
      <p><strong>Zacznij od najprostszej promocji (0 zł za konto, 0 zł za kartę):</strong></p>
      ${offerBlock}
      <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
        Będę podsyłał Ci tylko najważniejsze oferty. Żadnego spamu — tylko pieniądze do obrania 🧅
      </p>
    `;
    return { subject, html: newsletterLayout(content, subject, unsubscribeToken) };
  }

  // Wariant C: Storytelling — "Oops" format, budowanie relacji
  const subject = "Prawie straciłem pierwszą stówę (Nie rób tego błędu)";
  const content = `
    <p>Cześć <strong>${name}</strong>! Super, że jesteś z nami.</p>
    <p>Chcę Ci od razu opowiedzieć jedną szybką historię.</p>
    <p>Pamiętam, kiedy zakładałem swoje pierwsze konto promocyjne. Bank obiecał 300 zł za założenie karty i wykonanie pięciu płatności. Założyłem, wyklikałem i w piątek zapłaciłem „przelewem na telefon".</p>
    <p>Wiesz co? <strong>Nie dostałem nagrody.</strong></p>
    <p>Okazało się, że „przelew P2P" to nie to samo co płatność BLIK. Popełniłem błąd nowicjusza.</p>
    <p>Zbudowaliśmy CebulaZysku właśnie po to, żebyś <strong>Ty</strong> nie tracił pieniędzy przez takie detale. Z naszym <a href="${BASE_URL}/dashboard">darmowym Trackerem</a> dokładnie wiesz:</p>
    <p>✅ Kiedy płacić<br/>
    ✅ Czym płacić<br/>
    ✅ Kiedy bezpiecznie zamknąć konto, by uciec od opłat</p>
    ${offerBlock}
    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
      Piona! 🧅
    </p>
  `;
  return { subject, html: newsletterLayout(content, subject, unsubscribeToken) };
}

export interface NewsletterDigestEmailData {
  name: string;
  offers: { bankName: string; reward: number; slug: string }[];
  newOffersCount: number;
  unsubscribeToken: string;
}

export function newsletterDigestEmail(data: NewsletterDigestEmailData): { subject: string; html: string } {
  const { name, offers, newOffersCount, unsubscribeToken } = data;

  const subject = `🧅 Tygodniowy przegląd cebulowy — ${offers.length} ofert do obrania`;

  const offerRows = offers
    .slice(0, 8)
    .map(
      (o) => `
      <li>
        <span><a href="${BASE_URL}/oferta/${o.slug}" style="color: #374151; text-decoration: none;">${o.bankName}</a></span>
        <strong style="color: #059669; white-space: nowrap; margin-left: 12px;">${o.reward} zł</strong>
      </li>`
    )
    .join("");

  const newBadge = newOffersCount > 0
    ? `<p>🆕 W tym tygodniu pojawiło się <strong>${newOffersCount} ${newOffersCount === 1 ? "nowa oferta" : "nowe oferty/nowych ofert"}</strong>!</p>`
    : "";

  const content = `
    <p>Hej <strong>${name}</strong>! 👋</p>
    <p>Oto Twój cotygodniowy przegląd najlepszych premii bankowych.</p>
    ${newBadge}
    <p style="font-weight: 600; margin-bottom: 8px;">TOP oferty do obrania:</p>
    <ul class="list">${offerRows}</ul>
    <p style="text-align: center; margin-top: 24px;">
      <a href="${BASE_URL}/ranking" class="btn">Zobacz pełny ranking →</a>
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
      Nie przegap żadnej warstwy — im więcej obierzesz, tym więcej zarobisz 🧅
    </p>
  `;

  return { subject, html: newsletterLayout(content, subject, unsubscribeToken) };
}

export interface NewsletterNewOfferEmailData {
  name: string;
  bankName: string;
  reward: number;
  offerSlug: string;
  offerName: string;
  unsubscribeToken: string;
}

export function newsletterNewOfferEmail(data: NewsletterNewOfferEmailData): { subject: string; html: string } {
  const { name, bankName, reward, offerSlug, offerName, unsubscribeToken } = data;

  const subject = `🆕 Nowa oferta: ${reward} zł premii w ${bankName}!`;

  const content = `
    <p>Hej <strong>${name}</strong>! 👋</p>
    <p>Właśnie pojawiła się nowa oferta, która może Cię zainteresować:</p>
    <div class="highlight">
      <span class="tag">NOWA OFERTA</span><br/><br/>
      <strong>${offerName}</strong><br/>
      <span class="reward">${reward} zł</span>
    </div>
    <p style="text-align: center;">
      <a href="${BASE_URL}/oferta/${offerSlug}" class="btn">Sprawdź szczegóły →</a>
    </p>
    <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
      Okazje szybko się kończą — lepiej obrać cebulkę, zanim zniknie z półki 🧅
    </p>
  `;

  return { subject, html: newsletterLayout(content, subject, unsubscribeToken) };
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
