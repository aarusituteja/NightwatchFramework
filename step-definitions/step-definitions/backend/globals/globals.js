const { client } = require('nightwatch-api');
const { Given, Then } = require('@cucumber/cucumber');
const { tideContentTypes } = require('@/config/constants');


// @TODO: STA-144 This should be replaced by `I log into the CMS as "role".`
Given(/^I log into the CMS with valid credentials$/, () => {
  return client
    // Make sure it's on BE site before login.
    .drupalRelativeURL('/')
    // If there's complaints from a previous test/scenario re leaving an unsaved page,
    // accept any alert. See https://digital-engagement.atlassian.net/browse/STA-127
    .acceptAlert()
    // This will log out then login again if already logged in
    .drupalLogin({ name: process.env.BE_ADMIN_USER, password: process.env.BE_ADMIN_PASS });
});

Given(/^I log into the CMS as "(.*)"$/, (role) => {
  let credentials;
  switch (role) {
    case 'admin':
      credentials = { name: process.env.BE_ADMIN_USER, password: process.env.BE_ADMIN_PASS };
      break;
    case 'editor':
      credentials = { name: process.env.BE_EDITOR_USER, password: process.env.BE_EDITOR_PASS };
      break;
    default:
      console.log(role, 'No role provided.');
  }

  return client
  // This will log out then login again if already logged in
    .drupalLogin(credentials);
});

Given(/^the editor user has the site permission$/, () => {
  const editorUserSearch = '/admin/people?user=' + process.env.BE_EDITOR_USER + '&status=All&role=All&permission=All';
  const editUserButton = '//form[@id="views-form-user-admin-people-page-1"]//a[text()="Edit"]';
  // The editor test user has no required field initialized in Tide demo content module.
  // TODO: add them to Tide demo content module instead we do here as a fix.
  const firstName = '//form[@id="user-form"]//input[@id="edit-field-name-0-value"]';
  const lastName = '//form[@id="user-form"]//input[@id="edit-field-last-name-0-value"]';
  const department = '//form[@id="user-form"]//input[@id="edit-field-department-agency-0-target-id"]';
  // Above should be handled in the TODO.
  const site = '//div[@id="edit-field-user-site-wrapper"]//label[text()="' + process.env.BE_SITE + '"]';
  const saveButton = '//form[@id="user-form"]//div[@id="edit-actions"]//input[@value="Save"]';
  const savedConfirm = '//div[contains(@class,"messages--status")]';

  return page.useXpath()
    .drupalRelativeURL(editorUserSearch)
    .click(editUserButton)
    .clearValue(firstName)
    .setValue(firstName, 'Editor')
    .clearValue(lastName)
    .setValue(lastName, '1')
    .clearValue(department)
    .setValue(department, 'Demo Department')
    .click('//li//a[text()="Demo Department"]')
    .sdpTideMoveToElement(site)
    .getAttribute(site + '//parent::div//input', 'checked', function (result) {
      if (!result.value) {
        this.click(site);
      }
    })
    .click(saveButton)
    .waitForElementVisible(savedConfirm);
});

Given(/^I am on the backend page "(.*)"$/, (url) => {
  return client.drupalRelativeURL(url);
});

Then(/^I navigate to the "(.*)" tab$/, (tabText) => {
  // Find the tab case-insensitive.
  tabText = tabText.toLowerCase();
  // Should work for horizontal tabs and local tasks.
  // Translate the Tab text into lowercase, so we can select it in case-insensitive.
  // The reason is the tab text case are inconsistent across sites.
  const tab = `//li[contains(@class, "horizontal-tab-button")]//strong[translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${tabText}']//parent::a|
  //div[@id="block-seven-primary-local-tasks"]//a[translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${tabText}']`;

  return page.useXpath()
    .sdpTideMoveToElement(tab)
    .waitForElementVisible(tab, 30000)
    .click(tab);
});

Then(/^I select the Add (Component|Paragraph) button$/, (componentLabel) => {
  return page.useXpath()
    .sdpTideMoveToElement('@globalBodyContentAddComponent')
    .waitForElementVisible('@globalBodyContentAddComponent')
    .click('@globalBodyContentAddComponent');
});

Then(/^I select the (Component|Paragraph) type drop down value of "(.*)"$/, (componentLabel, option) => {
  // Find the item case-insensitive.
  option = option.toLowerCase();

  return page.useXpath()
    // Use translate to make the option text lowercase.
    .click(`//label[text()="${componentLabel} type"]//parent::div//select//option[translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')="${option}"]`);
});

// Use this for body text added via paragraph components.
Then(/^I enter "(.*)" rich text field "(.*)" as "(.*)"$/, (label, index, content) => {
  const scope = '//div[@data-drupal-selector="edit-field-landing-page-component"]';

  return page.useXpath()
    .sharedRichTextEnterValue(scope, label, content, index);
});

// Use this for standard body text fields.
Then(/^I enter the main Body text as "(.*)"$/, (content) => {
  const scope = '//div[@data-drupal-selector="edit-body-wrapper"]';
  const label = 'Body';
  const index = 1;

  return page.useXpath()
    .sharedRichTextEnterValue(scope, label, content, index);
});

Then(/^the following page displays "(.*)"$/, (url) => {
  return page.useXpath()
    .assert.urlContains(url);
});

// TODO: Move the logic in this step into the sharedSelectImage() command.
Then(/^I add an image of type (Featured Image|Feature Image|Hero Image|Hero Logo|Top Graphical Image|Complex Image|card Image|timeline Image) to the page$/, (imageType) => {
  imageType = imageType.toLowerCase();
  const checkPreview = true;
  let selector = '';

  // Use the top-level field name class to access the nested elements to avoid dynamic
  // renaming of the accordion @data-drupal-selector, which can happen after the image
  // has been added and shows as preview.
  switch (imageType) {
    case 'featured image':
    case 'feature image':
      selector = 'field--name-field-featured-image';
      break;
    case 'hero image':
      selector = 'field--name-field-landing-page-hero-image';
      break;
    case 'hero logo':
      selector = 'field--name-field-landing-page-hero-logo';
      break;
    case 'top graphical image':
      selector = 'field--name-field-graphical-image';
      break;
    case 'complex image':
      selector = 'field--name-field-complex-image-media';
      break;
    case 'card image':
      selector = 'field--type-entity-reference field--name-field-paragraph-media field--widget-entity-browser-entity-reference paragraphs-content js-form-wrapper form-wrapper';
      break;
    case 'timeline image':
      selector = 'field--name-field-paragraph-media';
      break;
    default:
      selector = '';
  }
  const imageAccordion = `//div[contains(@class, "${selector}")]//details`;

  return page.useXpath()
    .sdpTideMoveToElement(imageAccordion)
    .sharedSelectImage(imageAccordion, checkPreview);
});

Then(/^I open the documents browser$/, () => {
  const documentsLinkSelector = '//div[@id="edit-field-node-documents-wrapper"]';
  const selectDocumentsButton = '//div[@data-drupal-selector="edit-field-node-documents-wrapper"]//input[@id="edit-field-node-documents-entity-browser-entity-browser-open-modal"]';
  const documentsDialogBoxBanner = '//div[contains(@role, "dialog")]';

  // TODO: Still need to check whether selected documents will display in the page after selecting in modal.
  // const documentsSelectedSection = '//div[@data-drupal-selector="edit-field-node-documents-current"]';

  return page.useXpath()
    .waitForElementVisible(documentsLinkSelector)
    .click(documentsLinkSelector)
    .waitForElementVisible(selectDocumentsButton)
    .click(selectDocumentsButton)
    .waitForElementVisible(documentsDialogBoxBanner, 30000)
    .click(documentsDialogBoxBanner);
});

Then('I select the first {int} documents in the list to be added', function (int) {
  const selectDocumentsLibraryTab = '//ul[@role="navigation"]//a[text()="Library"]';
  const selectDocumentsButtonDialogBox = '//input[(@value="Select documents") and (@data-drupal-selector="edit-submit")]';
  let selecDocuments = client.frame('entity_browser_iframe_tide_document_browser').useXpath()
    .waitForElementVisible(selectDocumentsLibraryTab);

  for (let i = 0; i <= int ; i++) {
    selecDocuments.click('//tbody//tr['+i+']//input');
  }

  selecDocuments.pause(10000).click(selectDocumentsButtonDialogBox);

  return selecDocuments;
});

// This might be adaptable to most paragraph/component buttons.
Then(/^I click the "(.*)" button$/, (label) => {
  label = label.toLowerCase();
  const button = `//input[@type="submit"][translate(@value,"ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "${label}"]`;

  return page.useXpath()
    .waitForElementVisible(button)
    .click(button);
});

// Universal label locater, can be used for "Given" steps at the beginning of
// short scenarios.
Then(/^I see the "(.*)" label/, (label) => {
  // The below uses the pipe | character to OR different label types.
  // Add new ones as required.
  const fieldLabel = `//h4[@class="label"][text()="${label}"]|
  //span[contains(@class, "fieldset-legend")][text()="${label}"]|
  //label[text()="${label}"]`;

  // Not used yet, expandable fieldset labels.
  //span[text()="${label}"]//parent::summary[@class="seven-details__summary"]

  return page.useXpath()
    .waitForElementVisible(fieldLabel)
    .sdpTideMoveToElement(fieldLabel)
    .click(fieldLabel);
});

// Almost same as above, but does not click to focus.
Given(/^I can see the "(.*)" element/, (label) => {
  label = label.toLowerCase();
  // The below uses the pipe | character to OR different label types.
  // Add new ones as required.
  const elementLabel = `//h4[@class="label"][translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${label}']|
  //span[contains(@class, "fieldset-legend")][translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${label}']|
  //label[translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${label}']|
  //span[translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${label}']//parent::summary[@class="seven-details__summary"]|
  //li[contains(@class, "horizontal-tab-button")]//strong[translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='${label}']|
  //input[translate(@value,"ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "${label}"]`;

  return page.useXpath()
    .waitForElementVisible(elementLabel)
    .sdpTideMoveToElement(elementLabel);
});

// More generic, not used yet.
Then(/^I apply the "(.*)" action$/, (action) => {
  const actionOption = `//select[@data-drupal-selector="edit-action"]//option[text()="${action}"]`;

  return page.useXpath()
    .waitForElementVisible('@globalContentAdminActionSelect')
    .click(actionOption)
    .click('@globalContentAdminActionApply');
});

Then(/^I pause for "(.*)" seconds$/, (seconds) => {
  return page.pause(seconds * 1000);
});

Then(/^I delete all content with "([^"]*)" in the title if they exist in the cms$/, (title) => {
  return client
    .deleteAllContent(title);
});

/**
 * Example:
 * the "promo card" base "landing page" content is exist
 * As createDummyPage may take longer time to wait, so set 90s to timeout.
 */
Given(/^the "(.*)" base "(.*)" content is exist$/, { timeout: 90 * 1000 }, (scope, contentType) => {
  const contentTypeId = tideContentTypes[contentType];

  // if nid is null then create a page and get the nid
  return client.page.backend.createDummyPage()
    .createDummyPage({
      scope: scope,
      contentType: contentTypeId,
      title: scope + ' ' + contentType
    });
});

/**
 * Example:
 * I edit the "promo card" base "landing page" content.
 */
Given(/^I edit the "(.*)" base "(.*)" content$/, (scope, contentType) => {
  const contentTypeId = tideContentTypes[contentType];
  const nid = client.globals.sdp.fixtures[scope][contentTypeId];
  const url = '/node/' + nid + '/edit';

  return client
    .drupalRelativeURL(url);
});

// As createDummyPage may take longer time to wait, so set 90s to timeout.
Given(/^the "(.*)" base "(.*)" content with feature image is exist$/, { timeout: 90 * 1000 }, (scope, contentType) => {
  const contentTypeId = tideContentTypes[contentType];

  return client.page.backend.createDummyPage()
    .createDummyPage({
      scope: scope,
      contentType: contentTypeId,
      title: scope + ' ',
      featureImage: true,
    });
});
