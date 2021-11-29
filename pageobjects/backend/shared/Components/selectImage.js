const { client } = require('nightwatch-api');

module.exports = {
  elements: {
    sharedSelectImageDialog: {
      selector: '//div[contains(@role, "dialog")]',
      locateStrategy: 'xpath'
    },
    sharedSelectImageIFrame: {
      selector: '//iframe[@name="entity_browser_iframe_tide_image_browser"]',
      locateStrategy: 'xpath'
    },
  },
  commands: [{
    async sharedSelectImage (scopeSelector, checkPreview = false) {
      // Click "Select Images" button.
      const dialogLaunch = await this.useXpath()
        .getAttribute(`${scopeSelector}//summary`, 'aria-expanded', function (result) {
          if (result.value === 'false') {
            console.log('Expanding image accordion');
            this.click(`${scopeSelector}//summary`);
          }
        })
        .waitForElementNotPresent('@sharedSelectImageDialog')
        .click(`${scopeSelector}//input[@value="Select images"]`)
        .waitForElementVisible('@sharedSelectImageDialog', 30000)
        .waitForElementVisible('@sharedSelectImageIFrame', 30000);

      let imageBrowser;
      await this
        .useXpath()
        .findElement('@sharedSelectImageIFrame', function (result) {
          if (result.value) {
            imageBrowser = result.value;
          }
        });

      if (imageBrowser) {
        // Within the dialog, select first item and click submit.
        await client.frame(imageBrowser).useXpath()
          .waitForElementVisible('//ul[@role="navigation"]//a[text()="Library"]', 30000)
          .click('//tbody//tr[1]//input')
          .click('//form//div[@data-drupal-selector="edit-actions"]//input[@value="Select images"]');

        // Wait until the selected image shows up as a preview before moving on.
        if (checkPreview) {
          await this.useXpath()
            .waitForElementVisible(`${scopeSelector}//article[contains(@class, "media--type-image")]`, 30000);
        }
      }
    },
  }]
};
