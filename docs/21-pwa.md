# 21. PWA (Progressive Web App)

[← Powrót do spisu treści](./README.md)

---

## 1. Wprowadzenie

### Cel
Umożliwić użytkownikom instalację CebulaZysku jako aplikacji na telefonie/desktopie, z obsługą offline i szybkim ładowaniem z cache.

---

## 2. Co zostało zrobione

### 2.1 Web App Manifest
**Plik:** `public/manifest.json`

- Nazwa: "CebulaZysku – Premie bankowe"
- Tryb: `standalone` (bez paska przeglądarki)
- Kolor motywu: `#059669` (emerald-600)
- Ikony: 192x192 i 512x512 (wygenerowane z logo-icon.png)
- Kategorie: finance, utilities
- Język: pl

### 2.2 Service Worker
**Plik:** `public/sw.js`

Strategia: **Network First, Cache Fallback**
- Przy instalacji cachuje statyczne assety (/, ikony, manifest)
- Przy fetch: próbuje sieć, jeśli offline → serwuje z cache
- Pomija requesty POST i `/api/`, `/auth/`
- Przy aktywacji czyści stare cache

### 2.3 Ikony PWA
- `public/icon-192x192.png` — 192x192 (z logo-icon.png)
- `public/icon-512x512.png` — 512x512 (z logo-icon.png)

### 2.4 Metatagi
W `src/app/layout.tsx`:
- `manifest: "/manifest.json"`
- `themeColor: "#059669"`
- `appleWebApp: { capable: true, statusBarStyle: "default", title: "CebulaZysku" }`
- `<link rel="apple-touch-icon" href="/icon-192x192.png" />`

### 2.5 Rejestracja SW
**Plik:** `src/components/ServiceWorkerRegister.tsx`

Komponent kliencki rejestrujący `/sw.js` przy montowaniu. Dodany do `layout.tsx`.

---

## 3. Jak działa

1. Użytkownik odwiedza stronę w Chrome/Safari
2. Przeglądarka wykrywa manifest → pokazuje prompt "Zainstaluj"
3. Po instalacji: app w trybie standalone (bez paska URL)
4. Service worker cachuje strony → działa offline
5. Nowe wersje SW automatycznie zastępują stare (`skipWaiting`)

---

## 4. Testowanie

### Chrome DevTools:
1. F12 → Application → Manifest (sprawdź dane)
2. Application → Service Workers (sprawdź status)
3. Application → Cache Storage (sprawdź cached assets)
4. Network → Offline checkbox → odśwież stronę

### Lighthouse:
1. F12 → Lighthouse → PWA audit
2. Powinno przejść: installable, offline, manifest, icons

---

## 5. Pliki źródłowe

```
public/manifest.json              # Web App Manifest
public/sw.js                      # Service Worker
public/icon-192x192.png           # Ikona 192x192
public/icon-512x512.png           # Ikona 512x512
src/components/ServiceWorkerRegister.tsx  # Rejestracja SW
src/app/layout.tsx                # Metatagi PWA
```

---

## 6. Status

✅ **Ukończone** — 7 marca 2026

- Manifest, service worker, ikony — gotowe
- Metatagi i apple-touch-icon — gotowe
- Rejestracja SW — gotowa
- Build przechodzi bez błędów
