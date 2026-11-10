const { expect } = require('chai');
const { HomePage } = require('../pages/HomePage');

describe('Home page (EN)', function () {
  beforeEach(async function () {
    this.home = new HomePage(this.page);
    await this.home.open('en');
  });

  it('loads with the English title', async function () {
    expect(await this.page.title()).to.match(/^BystroBarista/);
  });

  it('shows the main headline', async function () {
    expect(await this.home.h1.innerText()).to.equal(
      'Shifts for baristas. Baristas for coffee shops.',
    );
  });

  it('renders every main section', async function () {
    const sections = [
      'For baristas',
      'For coffee shops',
      'How it works',
      'Works in the browser too',
      'Frequently asked questions',
    ];
    for (const name of sections) {
      expect(await this.home.sectionHeading(name).isVisible(), name).to.equal(true);
    }
  });

  it('has no broken images', async function () {
    await this.page.waitForLoadState('load');
    const broken = await this.page.locator('img').evaluateAll((imgs) =>
      imgs.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
    );
    expect(broken, `broken images: ${broken.join(', ')}`).to.be.empty;
  });
});
