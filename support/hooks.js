// Mocha root hooks: one browser per run, a fresh context and page per test.
// A fresh context means no cookies or storage leak from one test to the next.
const fs = require('fs');
const path = require('path');
const playwright = require('playwright');
const config = require('./config');

let browser;

exports.mochaHooks = {
  async beforeAll() {
    const engine = playwright[config.browser];
    if (!engine) throw new Error(`Unknown BROWSER "${config.browser}"`);
    browser = await engine.launch({ headless: config.headless });
  },

  async beforeEach() {
    // Tests can set this.contextOptions (e.g. a mobile device) before the page is created
    // by calling this.newPage(options) instead of using the default page.
    this.browserName = config.browser;
    this.newPage = async (options = {}) => {
      if (this.context) await this.context.close();
      this.context = await browser.newContext(options);
      this.page = await this.context.newPage();
      return this.page;
    };
    await this.newPage({ viewport: { width: 1366, height: 900 } });
  },

  async afterEach() {
    // Screenshot on failure, so a red CI run shows what the page looked like.
    if (this.currentTest && this.currentTest.state === 'failed' && this.page) {
      const dir = path.join(__dirname, '..', 'screenshots');
      fs.mkdirSync(dir, { recursive: true });
      const name = `${config.browser}-${this.currentTest.fullTitle()}`
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase();
      await this.page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true });
    }
    if (this.context) await this.context.close();
    this.context = null;
  },

  async afterAll() {
    if (browser) await browser.close();
  },
};
