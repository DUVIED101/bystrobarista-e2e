const { expect } = require('chai');
const { HomePage } = require('../pages/HomePage');

describe('Language switcher', function () {
  it('switches from English to the default locale and back', async function () {
    const home = new HomePage(this.page);
    await home.open('en');
    const englishH1 = await home.h1.innerText();

    await home.languageSwitch().click();
    await this.page.waitForURL((url) => !url.pathname.startsWith('/en'));
    const otherH1 = await home.h1.innerText();
    expect(otherH1).to.not.equal(englishH1);

    await home.languageSwitch().click();
    await this.page.waitForURL((url) => url.pathname.startsWith('/en'));
    expect(await home.h1.innerText()).to.equal(englishH1);
  });
});
