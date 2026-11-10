// Page Object for the public landing page.
// Tests talk to this class, not to raw selectors, so a markup change
// is fixed in one place.
const config = require('../support/config');

class HomePage {
  constructor(page) {
    this.page = page;
    this.header = page.locator('header').first();
    this.footer = page.locator('footer').first();
    this.h1 = page.locator('h1').first();
  }

  async open(locale = 'en') {
    const path = locale === 'en' ? '/en' : '/';
    await this.page.goto(config.baseUrl + path, { waitUntil: 'domcontentloaded' });
  }

  sectionHeading(text) {
    return this.page.getByRole('heading', { level: 2, name: text });
  }

  navLink(text) {
    return this.header.getByRole('link', { name: text, exact: true }).filter({ visible: true }).first();
  }

  anchorLink(hash) {
    return this.page.locator(`a[href="${hash}"]`).first();
  }

  languageSwitch() {
    // EN page links to RU ("/"), RU page links to EN ("/en")
    return this.page.locator('a[href$="/en"], a[href="https://www.bystrobarista.com/"], a[href="/"]')
      .filter({ hasText: /^(EN|RU)$/ })
      .first();
  }

  appStoreLinks() {
    return this.page.locator('a[href*="apps.apple.com"]');
  }

  webAppLinks() {
    return this.page.locator(`a[href*="${config.webAppHost}"]`);
  }

  footerLinkHrefs() {
    return this.footer.locator('a').evaluateAll((links) => links.map((a) => a.href));
  }

  async hasHorizontalOverflow() {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
  }
}

module.exports = { HomePage };
