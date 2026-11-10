const { expect } = require('chai');
const { devices } = require('playwright');
const { HomePage } = require('../pages/HomePage');

// Firefox does not support mobile emulation (isMobile), so this runs on Chromium and WebKit.
describe('Mobile layout (iPhone 13)', function () {
  beforeEach(async function () {
    if (this.browserName === 'firefox') this.skip();
    await this.newPage({ ...devices['iPhone 13'] });
    this.home = new HomePage(this.page);
    await this.home.open('en');
  });

  it('shows the headline and the App Store button', async function () {
    expect(await this.home.h1.isVisible()).to.equal(true);
    expect(await this.home.appStoreLinks().first().isVisible()).to.equal(true);
  });

  it('has no horizontal scrolling', async function () {
    await this.page.waitForLoadState('load');
    expect(await this.home.hasHorizontalOverflow()).to.equal(false);
  });
});
