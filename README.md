# bystrobarista-e2e

End-to-end tests for the public website of [BystroBarista](https://www.bystrobarista.com/en), a two-sided marketplace for barista shifts that I build and run (iOS app + web).

The app itself is covered by Jest unit and integration tests and TestFlight beta rounds. This repo adds browser-level end-to-end tests with **Playwright** (as a library) and **Mocha**, run in CI across Chromium, Firefox and WebKit.

## What's covered

| Spec | Checks |
|---|---|
| `home.spec.js` | Page loads, English title and headline, every main section renders, no broken images |
| `navigation.spec.js` | Each header link updates the URL hash and scrolls its section into view |
| `language.spec.js` | Language switcher goes to the default locale and back to English |
| `links.spec.js` | App Store and web-app links point to the right targets, legal pages return 200, the web app is up |
| `mobile.spec.js` | iPhone 13 emulation: headline and App Store button visible, no horizontal scroll (Chromium/WebKit) |

All tests are read-only: nothing is submitted to production.

## Structure

```
pages/        Page Objects (selectors live here, not in tests)
tests/        Mocha specs
support/      Root hooks (browser per run, fresh context per test, screenshot on failure) and config
.github/      CI: browser matrix on every push + nightly run against production
```

## Running locally

```bash
npm install
npx playwright install          # downloads the browsers once
npm test                        # Chromium, headless
npm run test:webkit             # or test:firefox
npm run test:headed             # watch it run
npm run test:report             # HTML report in reports/index.html
```

Settings via environment variables: `BASE_URL` (default `https://www.bystrobarista.com`), `BROWSER` (`chromium` | `firefox` | `webkit`), `HEADED=1`.

## Why Playwright as a library with Mocha

Instead of `@playwright/test`, the suite uses Playwright's browser API directly inside Mocha. Browser lifecycle, isolation and failure screenshots are handled explicitly in `support/hooks.js`, which keeps the runner swappable and makes the setup easy to read.

## Next steps

- Visual regression snapshots for the landing page
- API-level tests for the backend (Supabase edge functions)
- Web-app flows (sign-in, shift search) against a staging environment with test accounts
- Accessibility checks with axe-core
