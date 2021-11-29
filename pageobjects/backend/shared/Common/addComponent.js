const { client } = require('nightwatch-api');

module.exports = {
  elements : {
    pageContentLabel : {
      selector : '//strong[normalize-space()="Page content"]',
      locateStrategy : 'xpath'
    },
    addComponentButton : {
      selector : '//div[@data-drupal-selector="edit-field-landing-page-component"]//input[@value="Add Component"]',
      locateStrategy : 'xpath'
    },
    addComponentModalwindowLabel : {
      selector : '//span[@class="ui-dialog-title"]',
      locateStrategy : 'xpath'
    },
  },
  commands : [{
    addComponent : function (componentLabel) {
      componentLabel = componentLabel.toLowerCase();
      const componentCard = `//div[contains(@class, "ui-dialog")]//input[translate(@value,"ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "${componentLabel}"]`;
      this
        .waitForElementPresent('@pageContentLabel', 'Page Content Label is present')
        .sdpTideMoveToElement('@addComponentButton')
        .waitForElementPresent('@addComponentButton', 'Add Component Button is visible')
        .click('@addComponentButton')
        .waitForElementPresent('@addComponentModalwindowLabel');
      this
        .getAttribute('xpath', componentCard, 'value', function (result) {
          if (result.value) {
            this.useXpath()
              .waitForElementPresent(componentCard)
              .click(componentCard)
              .timeoutsImplicitWait(8000);
          }
        });

      return this;
    },
    expandCollapseComponent : async function (action, row) {
      const expandCollapseLocator = `(//table//tr[contains(@class,'draggable paragraph-type-')]//div[@class='paragraphs-actions']/input)[${row}]`;

      if (action=='collapse') {
        await client.getAttribute(expandCollapseLocator, 'value')=='Collapse';
      } else {
        await client.getAttribute(expandCollapseLocator, 'value')=='Edit';
      }
      await client.sdpTideHideToolbar();

      await client.click('xpath', expandCollapseLocator);
      await client.sdpTideRecoverToolbar();

      if (action=='collapse') {
        await client.waitForElementPresent(`(//table//tr[contains(@class,'draggable paragraph-type-')]//div[@class='paragraphs-actions']/input)[${row}][@value='Edit']`, 10000);
      } else {
        await client.waitForElementPresent(`(//table//tr[contains(@class,'draggable paragraph-type-')]//div[@class='paragraphs-actions']/input)[${row}][@value='Collapse']`, 10000);
      }

      return client;
    }
  }]
};
