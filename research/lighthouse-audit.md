# Audyt Lighthouse - CebulaZysku.pl
// @author Gemini CLI (gemini-3.1-pro-preview) | 2026-03-17

Przeprowadzono audyt na produkcji (cebulazysku.pl) przy użyciu Lighthouse CLI (mobile).

## Wyniki główne
- **Wydajność (Performance):** 71 / 100
- **Dostępność (Accessibility):** 90 / 100
- **Dobre praktyki (Best Practices):** 100 / 100
- **SEO:** 100 / 100

## Quick Wins (Co można poprawić od zaraz)

### Avoid multiple page redirects (Kategoria: redirects)
**Problem:** Redirects introduce additional delays before the page can be loaded. [Learn how to avoid page redirects](https://developer.chrome.com/docs/lighthouse/performance/redirects/).
**Wpływ / Wartość:** Est savings of 960 ms

### Buttons do not have an accessible name (Kategoria: button-name)
**Problem:** When a button doesn't have an accessible name, screen readers announce it as "button", making it unusable for users who rely on screen readers. [Learn how to make buttons more accessible](https://dequeuniversity.com/rules/axe/4.11/button-name).

### Background and foreground colors do not have a sufficient contrast ratio. (Kategoria: color-contrast)
**Problem:** Low-contrast text is difficult or impossible for many users to read. [Learn how to provide sufficient color contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast).

### Heading elements are not in a sequentially-descending order (Kategoria: heading-order)
**Problem:** Properly ordered headings that do not skip levels convey the semantic structure of the page, making it easier to navigate and understand when using assistive technologies. [Learn more about heading order](https://dequeuniversity.com/rules/axe/4.11/heading-order).

### Reduce unused JavaScript (Kategoria: unused-javascript)
**Problem:** Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).
**Wpływ / Wartość:** Est savings of 69 KiB

### Document request latency (Kategoria: document-latency-insight)
**Problem:** Your first network request is the most important. [Reduce its latency](https://developer.chrome.com/docs/performance/insights/document-latency) by avoiding redirects, ensuring a fast server response, and enabling text compression.
**Wpływ / Wartość:** Est savings of 340 ms

### LCP breakdown (Kategoria: lcp-breakdown-insight)
**Problem:** Each [subpart has specific improvement strategies](https://developer.chrome.com/docs/performance/insights/lcp-breakdown). Ideally, most of the LCP time should be spent on loading the resources, not within delays.

### Legacy JavaScript (Kategoria: legacy-javascript-insight)
**Problem:** Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile [Baseline](https://web.dev/articles/baseline-and-polyfills) features, unless you know you must support older browsers. [Learn why most sites can deploy ES6+ code without transpiling](https://developer.chrome.com/docs/performance/insights/legacy-javascript)
**Wpływ / Wartość:** Est savings of 14 KiB

### Network dependency tree (Kategoria: network-dependency-tree-insight)
**Problem:** [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.

### Render blocking requests (Kategoria: render-blocking-insight)
**Problem:** Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.
**Wpływ / Wartość:** Est savings of 260 ms

### Speed Index (Kategoria: speed-index)
**Problem:** Speed Index shows how quickly the contents of a page are visibly populated. [Learn more about the Speed Index metric](https://developer.chrome.com/docs/lighthouse/performance/speed-index/).
**Wpływ / Wartość:** 7.6 s

### Largest Contentful Paint (Kategoria: largest-contentful-paint)
**Problem:** Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)
**Wpływ / Wartość:** 5.0 s

### Improve image delivery (Kategoria: image-delivery-insight)
**Problem:** Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery)
**Wpływ / Wartość:** Est savings of 26 KiB

### First Contentful Paint (Kategoria: first-contentful-paint)
**Problem:** First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).
**Wpływ / Wartość:** 2.5 s

### Time to Interactive (Kategoria: interactive)
**Problem:** Time to Interactive is the amount of time it takes for the page to become fully interactive. [Learn more about the Time to Interactive metric](https://developer.chrome.com/docs/lighthouse/performance/interactive/).
**Wpływ / Wartość:** 5.0 s

