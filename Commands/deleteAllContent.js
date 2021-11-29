// Custom Style Command to delete the content from the admin dashboard
const { client } = require('nightwatch-api');

module.exports.command= function deleteAllContent (title) {
  try {
    this
      .drupalRelativeURL('/admin/content')
      .waitForElementVisible('xpath', '//input[@id="edit-title"]', 'Title Field is visible')
      .setValue('xpath', '//input[@id="edit-title"]', title)
      .waitForElementVisible('xpath', '//input[@value="Filter"]', 'Filter button is visible')
      .click('xpath', '//input[@value="Filter"]', function () {
        this.elements('xpath', '//td[@headers="view-field-node-primary-site-table-column"]//parent::tr', function (result) {
          let rowSize = result.value.length;
          // console.log(rowSize);
          if (rowSize > 0) {
            this.useXpath()
              .waitForElementVisible('//input[@title="Select all rows in this table"]')
              .click('//input[@title="Select all rows in this table"]')
              .timeoutsImplicitWait(3000)
              .click('//option[@value="node_delete_action"]')
              .click('//input[@id="edit-submit"]')
              .waitForElementVisible('//h1[@class="page-title"]')
              .waitForElementVisible('//input[@id="edit-submit"]')
              .click('//input[@id="edit-submit"]')
              .waitForElementPresent('//div[@aria-label="Status message"]/h2', 8000, 'Status message is visible');
          } else {
            this.useXpath()
              .waitForElementPresent('//td[@class="views-empty"]')
              .assert.containsText('//td[@class="views-empty"]', 'No content available.', 'There is no content to delete');
          }

        }.bind(this));
      });

    return this;
  } catch (err) {
    console.log('Error is : >>>>>>>>>   ', err);
  }

};
