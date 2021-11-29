const { elements, commands } = require('../shared');
/**
 * Legacy elements
 * TODO: double check and remove them later
 */
module.exports = {
  elements: {
    ...elements,
    // // Login
    // loginPageContents: {
    //   selector: '//div[@class="dialog-off-canvas-main-canvas"]',
    //   locateStrategy: 'xpath'
    // },
    // loginPageTitle: {
    //   selector: '//h1[@class="page-title"]',
    //   locateStrategy: 'xpath'
    // },
    // usernameTextbox: {
    //   selector: '//input[@id="edit-name"]',
    //   locateStrategy: 'xpath'
    // },
    // passwordTextbox: {
    //   selector: '//input[@id="edit-pass"]',
    //   locateStrategy: 'xpath'
    // },
    // loginButton: {
    //   selector: '//input[@value="Log in"]',
    //   locateStrategy: 'xpath'
    // },
    // toolbarAfterLoginSuccess: {
    //   selector: '//nav[@id="toolbar-bar"]',
    //   locateStrategy: 'xpath'
    // },
    // // Saving
    // globalSaveAsLabel: {
    //   selector: '//label[text()="Save as"]',
    //   locateStrategy: 'xpath'
    // },
    // globalChangeToLabel: {
    //   selector: '//label[text()="Change to"]',
    //   locateStrategy: 'xpath'
    // },
    // globalSaveAsDropDownElement: {
    //   selector: '//select[@data-drupal-selector="edit-moderation-state-0-state"]',
    //   locateStrategy: 'xpath'
    // },
    // globalSaveAsDropDownPublishedOption: {
    //   selector: '//select[@data-drupal-selector="edit-moderation-state-0-state"]//option[@value="published"]',
    //   locateStrategy: 'xpath'
    // },
    // globalSaveButton: {
    //   selector: '//input[@value="Save"]',
    //   locateStrategy: 'xpath'
    // },
    // globalSaveSuccessMessage: {
    //   // "status" type is for success in Drupal message. See:
    //   // https://api.drupal.org/api/drupal/core%21includes%21bootstrap.inc/function/drupal_set_message/8.2.x
    //   selector: '//div[@data-drupal-messages]//div[contains(@class, "messages--status")]',
    //   locateStrategy: 'xpath'
    // },
    // // Common Elements
    // globalTitle: {
    //   selector: '//input[@id="edit-title-0-value"]',
    //   locateStrategy: 'xpath'
    // },
    // globalSummary: {
    //   selector: '//textarea[@id="edit-field-landing-page-summary-0-value"]',
    //   locateStrategy: 'xpath'
    // },
    // globalTopicLabel: {
    //   selector: '//div[contains(@class, "form-item-field-topic-0-target-id")]//label[contains(text(), "Topic")]',
    //   locateStrategy: 'xpath'
    // },
    // globalTopicTextBox: {
    //   selector: '//div[contains(@class, "form-item-field-topic-0-target-id")]//input[contains(@data-drupal-selector, "edit-field-topic-0-target-id")]',
    //   locateStrategy: 'xpath'
    // },
    globalBodyContentAddComponent: {
      selector: '//input[@data-drupal-selector="edit-field-landing-page-component-add-more-add-more-button"]',
      locateStrategy: 'xpath'
    },
    // globalDepartmentOrAgencyLabel: {
    //   selector: '//div[contains(@class, "form-item-field-department-agency")]//label[contains(text(), "Department/agency")]',
    //   locateStrategy: 'xpath'
    // },
    // globalDepartmentOrAgencyDropDownElement: {
    //   selector: '//span[@class="select2-selection__rendered"]',
    //   locateStrategy: 'xpath'
    // },
    // globalContentAdminTitleFilter: {
    //   selector: '//input[@data-drupal-selector="edit-title"]',
    //   locateStrategy: 'xpath'
    // },
    // globalContentAdminSubmitFilter: {
    //   selector: '//input[@data-drupal-selector="edit-submit-summary-contents-filters"]',
    //   locateStrategy: 'xpath'
    // },
    // globalContentAdminBulkCheck: {
    //   selector: '//input[@title="Select all rows in this table"]',
    //   locateStrategy: 'xpath'
    // },
    // globalContentAdminActionSelect: {
    //   selector: '//select[@data-drupal-selector="edit-action"]',
    //   locateStrategy: 'xpath'
    // },
    // globalContentAdminActionApply: {
    //   selector: '//input[@value="Apply to selected items"][@id="edit-submit"]',
    //   locateStrategy: 'xpath'
    // },
    // globalContentAdminConfirmDelete: {
    //   selector: '//input[@value="Delete"][@id="edit-submit"]',
    //   locateStrategy: 'xpath'
    // },
    // // Accordion Elements
    // globalAccordionTitleField :{
    //   selector : '//label[text()="Accordion title"]//parent::div//input',
    //   locateStrategy : 'xpath'
    // },
    // globalAccordionStyle :{
    //   selector : '//label[text()="Standard"]//parent::div//input',
    //   locateStrategy : 'xpath'
    // },
    // globalAccordionItemField :{
    //   selector : '//label[text()="Item title"]//parent::div//input',
    //   locateStrategy : 'xpath'
    // },
    // globalAccordionBodyIframe :{
    //   selector : '//iframe[@title="Rich Text Editor, Item content field"]',
    //   locateStrategy : 'xpath'
    // },
    // globalAccordionItemContent : {
    //   selector : '//div[contains(@class, "cke_inner cke_reset")]//span[@class="cke_path"]//a[@title="p element"]',
    //   locateStrategy : 'xpath'
    // },
  },
  commands: [
    ...commands
  ]
};
