// Custom Style Command to search the content from the admin dashboard
const { client } = require('nightwatch-api');

/**
 * Search Tide CMS content by a title
 *
 * If the content is not found, an error is thrown which will cause the test to fail.
 *
 * @param {string} title
 */
module.exports.command= function TideSearchContent (title) {
  this
    .drupalRelativeURL('/admin/content')
    .waitForElementVisible('xpath', '//input[@id="edit-title"]', 'Title Field is visible')
    .setValue('xpath', '//input[@id="edit-title"]', title)
    .waitForElementVisible('xpath', '//input[@value="Filter"]', 'Filter button is visible')
    .click('xpath', '//input[@value="Filter"]', function () {
      this.elements('xpath', '//td[@headers="view-field-node-primary-site-table-column"]//parent::tr', function (result) {
        let rowSize = result.value.length;
        const contentExist = rowSize > 0;
        this.assert.equal(contentExist, true, `Found content "${title}"`);
      }.bind(this));
    });

  return this;
};
