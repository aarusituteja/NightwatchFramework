const { client } = require('nightwatch-api');
const { Given, Then } = require('@cucumber/cucumber');
const { tideContentTypes } = require('./../../../config/constants');
const util = require('@/utils/getBrowser');

const page = client.page.frontend.globals.globals();

/**
 * Navigation
 */

/**
 * Used for nav to a frontend relative url.
 * For example, I am on "/contact-us".
 */
Given(/^I am on "([^"]*)"$/, (pathname) => {
  return client.FERelativeUrl(pathname);
});

/**
 * Used for nav to a test content.
 * The difference between this one and `I am on ""` step is this one will attache the test id automatically.
 * For example, `I am on FE test content "/card-test-page"` will nav to `/card-test-page-your-test-id`.
 */
Given(/^I am on FE test content "(.*)"/, (url) => {
  url = url.replace(/\/$/, '');
  const pathname = url + `-${client.globals.sdp.testId}`;

  return client.FERelativeUrl(pathname);
});

/**
 * Error page
 */

Then(/^I verify if there is an app error$/, () => {
  return page.useCss()
    .waitForElementVisible('.app-error');
});

Then(/^I verify if there is no app error$/, () => {
  return page.useCss()
    .waitForElementNotPresent('.app-error');
});

/**
 * Browser console
 */
Then(/^I verify if there is no error in browser Console$/, async () => {
  // WebDriver has issue to get browser log in IE
  // https://stackoverflow.com/a/41569149/1212791
  if (util.isBrowser('ie11')) {
    return 'skipped';
  }

  // To allow all JS loaded including those from GTM.
  await client.pause(5000);
  await client.getLog('browser', function (result) {
    let errors = [];
    result.forEach(item => {
      if (item.level === 'SEVERE') {
        errors.push(item.message);
      }
    });
    if (errors.length > 0) {
      const message = errors.length > 1 ? `There are ${errors.length} errors` : 'There is an error';
      throw new Error(message + ' in the browser Console: ' + JSON.stringify(errors));
    }
  });
});


