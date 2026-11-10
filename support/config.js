// Central settings. Everything can be overridden with environment variables,
// so the same suite runs locally and in CI.
module.exports = {
  baseUrl: process.env.BASE_URL || 'https://www.bystrobarista.com',
  browser: process.env.BROWSER || 'chromium', // chromium | firefox | webkit
  headless: !process.env.HEADED,
  appStoreId: 'id6769029521',
  webAppHost: 'app.bystrobarista.com',
};
