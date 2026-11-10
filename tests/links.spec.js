const { expect } = require('chai');
const { HomePage } = require('../pages/HomePage');
const config = require('../support/config');

describe('Outbound links', function () {
  beforeEach(async function () {
    this.home = new HomePage(this.page);
    await this.home.open('en');
  });

  it('every App Store link points to the BystroBarista app', async function () {
    const hrefs = await this.home.appStoreLinks().evaluateAll((a) => a.map((l) => l.href));
    expect(hrefs).to.not.be.empty;
    for (const href of hrefs) expect(href).to.include(config.appStoreId);
  });

  it('every web-version link points to the web app', async function () {
    const hrefs = await this.home.webAppLinks().evaluateAll((a) => a.map((l) => l.href));
    expect(hrefs).to.not.be.empty;
    for (const href of hrefs) expect(new URL(href).host).to.equal(config.webAppHost);
  });

  it('legal pages in the footer respond with 200', async function () {
    const hrefs = (await this.home.footerLinkHrefs()).filter(
      (h) => h.startsWith('http') && new URL(h).host.endsWith('bystrobarista.com')
        && /privacy|terms|personal-data|consent/.test(h),
    );
    expect(hrefs, 'expected legal links in footer').to.have.length.of.at.least(4);
    for (const href of hrefs) {
      const res = await this.page.request.get(href);
      expect(res.status(), href).to.equal(200);
    }
  });

  it('the web app itself is up', async function () {
    const res = await this.page.request.get(`https://${config.webAppHost}`);
    expect(res.ok(), `status ${res.status()}`).to.equal(true);
  });
});
