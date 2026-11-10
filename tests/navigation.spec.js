const { HomePage } = require('../pages/HomePage');

// Each header link should jump to its section and leave the section on screen.
const NAV = [
  { text: 'For baristas', hash: '#features', heading: 'For baristas' },
  { text: 'For coffee shops', hash: '#for-cafes', heading: 'For coffee shops' },
  { text: 'How it works', hash: '#how-it-works', heading: 'How it works' },
  { text: 'Web version', hash: '#web', heading: 'Works in the browser too' },
  { text: 'FAQ', hash: '#faq', heading: 'Frequently asked questions' },
];

describe('Header navigation', function () {
  beforeEach(async function () {
    this.home = new HomePage(this.page);
    await this.home.open('en');
  });

  for (const item of NAV) {
    it(`"${item.text}" scrolls to its section`, async function () {
      await this.home.navLink(item.text).click();
      await this.page.waitForURL((url) => url.hash === item.hash);

      const heading = this.home.sectionHeading(item.heading);
      await heading.waitFor({ state: 'visible' });
      // give smooth scrolling time to finish
      await this.page.waitForFunction(
        (el) => {
          const r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight;
        },
        await heading.elementHandle(),
        { timeout: 5000 },
      );
    });
  }
});
