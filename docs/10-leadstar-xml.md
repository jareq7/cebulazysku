# 10. Źródło danych — LeadStar XML

[← Powrót do spisu treści](./README.md) | [Fazy planowane](./05-fazy-planowane.md)

---

## Feed URL

```
https://leadstar.pl/xml?pid=93050&code=9f3d50f263d704d90b38d3f6549b11cc&ha=4242926830
```

## Aktualne oferty (stan na 7.03.2026)

| # | Bank | Program | Premia |
|---|------|---------|--------|
| 1 | BNP Paribas | Konto Osobiste „Smak korzyści" | do 300 zł |
| 2 | Bank Pekao | Konto Przekorzystne | do 450 zł |
| 3 | Bank Pekao | Konto Przekorzystne dla Młodych | do 450 zł |
| 4 | Santander | Konto Santander | do 800 zł |
| 5 | Santander | Konto Santander dla młodych | do 800 zł |
| 6 | Santander | Konto Santander dla studenta | do 800 zł |
| 7 | Alior Bank | Alior Konto Plus | do 1000 zł |
| 8 | Alior Bank | Alior Konto | do 1000 zł |
| 9 | Millennium | Konto 360° | do 900 zł |
| 10 | Citi Handlowy | CitiKonto | do 650 zł |
| 11 | mBank | eKonto dla młodych (18-24) | do 620 zł |
| 12 | mBank | eKonto dla młodych (do wyboru) | — |
| 13 | mBank | eKonto z zyskiem | do 720 zł |
| 14 | mBank | eKonto dla młodych (13-17) | do 210 zł |
| 15 | mBank | mKonto Intensive | do 720 zł |
| 16 | PKO BP | Konto Za Zero | cashback Allegro |
| 17 | VeloBank | VeloKonto | 6,5% + cashback |
| 18 | VeloBank | VeloKonto dla młodych | 6% + cashback |

## Struktura jednej oferty w XML

```xml
<item>
  <id>6198</id>
  <branch_id>1</branch_id>
  <branch>Finanse</branch>
  <product_id>11</product_id>
  <product>konto osobiste</product>
  <institution>Bank BNP Paribas S.A.</institution>
  <program_name>Konto Osobiste w promocji „Smak korzyści"</program_name>
  <description><!-- HTML z krótkim opisem --></description>
  <benefits><!-- HTML z warunkami promocji --></benefits>
  <free_first>0</free_first>
  <logo>//img.leadmax.pl/logo/xxx.png</logo>
  <url>https://prostodo.pl/c?zid=...&tid=6198&ha=...&r=...</url>
</item>
```

## Pola XML per oferta

| Pole | Typ | Opis |
|------|-----|------|
| `id` | int | Unikalny ID oferty w LeadStar |
| `branch_id` | int | ID branży (1 = Finanse) |
| `branch` | string | Nazwa branży |
| `product_id` | int | ID produktu (11 = konto osobiste) |
| `product` | string | Typ produktu |
| `institution` | string | Nazwa banku |
| `program_name` | string | Nazwa programu/promocji |
| `description` | HTML | Krótki opis z bullet pointami |
| `benefits` | HTML | Szczegółowe warunki promocji |
| `free_first` | 0/1 | Czy konto bezpłatne w pierwszym okresie |
| `logo` | URL | Logo banku (bez protokołu) |
| `url` | URL | Link afiliacyjny (do przekierowania usera) |
