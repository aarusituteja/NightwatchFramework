const { client } = require('nightwatch-api');

const common = client.page.backend.globals.globals();
module.exports = {
  elements: {
    accordionTitleField: {
      selector: '//label[text()="Accordion title"]//parent::div//input',
      locateStrategy: 'xpath'
    },
    accordionStyleStandard: {
      selector: '//label[text()="Standard"]//parent::div//input',
      locateStrategy: 'xpath'
    },
    accordionStyleNumbered: {
      selector: '//label[text()="Numbered"]//parent::div//input',
      locateStrategy: 'xpath'
    },
    accordionItemField: {
      selector: '//label[text()="Item title"]//parent::div//input',
      locateStrategy: 'xpath'
    },
    accordionBodyIframe: {
      selector: '//iframe[@title="Rich Text Editor, Item content field"]',
      locateStrategy: 'xpath'
    },
    accordionItemContent: {
      selector: '//div[@id="cke_1_contents"]//body',
      locateStrategy: 'xpath'
    },
    accordionAddAccordionContentButton: {
      selector: '//input[@type="submit"][translate(@value,"ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "add accordion content"] | //input[@type="submit"][translate(@value,"ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "add another accordion item"]',
      locateStrategy: 'xpath'
    },
  },
  commands: [{
    async accordionComponent (dataTable) {
      try {
        const data = dataTable.hashes();
        const label = data[0].buttonText;
        const adjustedIndex = data[0].index - 1;
        const accordionContentButton = `//input[@type="submit"][@value="${label}"]`;
        await this
          .waitForElementVisible('@accordionTitleField', 5000, 'Accordion title field is visible')
          .setValue('@accordionTitleField', data[0].title)
          .click('@accordionStyle');
        // .pause(4000);
        for (let i = 0; i <= adjustedIndex; i++) {
          this
            .waitForElementPresent('@accordionItemField', 5000, 'Accordion item field is present')
            .setValue('@accordionItemField', data[0].item + '-' + i)
            // .pause(3000)
            .waitForElementPresent('@accordionBodyIframe')
            .click('@accordionBodyIframe')
            .click('@accordionItemContent')
            .setValue('@accordionItemContent', data[0].body + '-' + i);
          if (i < adjustedIndex) {
            this.useXpath()
              .waitForElementVisible(accordionContentButton, 8000, 'Accordion content is visible')
              .click(accordionContentButton)
              .pause(5000);
          }
        }

        return this;
      } catch (err) {
        throw (err.message);
      }
    },

    async fillAccordionComponent (accordionTitle, style, dataTable) {

      try {

        const data = dataTable.hashes();
        const numberOfRows = Object.keys(data).length;
        const scope = '//div[@data-drupal-selector="edit-field-landing-page-component"]';
        const numberOfRowsAdjusted = numberOfRows - 1;

        this
        //Fill in Accordion Title
          .waitForElementVisible('@accordionTitleField', 5000, 'Accordion title field is visible')
          .setValue('@accordionTitleField', accordionTitle);

        //Fill Accordion Style
        if (style == 'Numbered') {
          this.click('@accordionStyleNumbered');
        }

        //Fill in accordion items
        for (let i = 0; i <= numberOfRowsAdjusted; i++) {
          this
            //Fill in the Accordion Item Title
            .waitForElementPresent('@accordionItemField', 7000, 'Accordion item field is present')
            .setValue('@accordionItemField', data[i].item)
            .pause(5000)
            .waitForElementVisible('@accordionItemField', data[0].item + '-' + (i + 1));

          //Fill in accordion item content body in common wysiwyg
          await common.useXpath()
            .sharedRichTextEnterValue(scope, 'Item content', data[i].body, 1);

          if (i < numberOfRowsAdjusted) {
            await this
              //Click add accordion content button
              .waitForElementVisible('@accordionAddAccordionContentButton', 8000, 'Accordion - add content button is visible')
              .click('@accordionAddAccordionContentButton')
              .waitForElementVisible(`(//div[contains(@class,"field field--name-field-paragraph-accordion-name field")])[${i+1}]`, 7000);
          }
        }

        return this;

      } catch (err) {
        throw (err.message);
      }
    }
  }]
};
