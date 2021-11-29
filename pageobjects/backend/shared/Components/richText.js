/*global XPathEvaluator, document*/
module.exports = {
  commands: [{
    async sharedRichTextEnterValue (scopeSelector, label, content, index = 1) {
      index = parseInt(index) - 1;
      const fieldXPath = `${scopeSelector}//label[text()="${label}"]//parent::div/div/div`;

      // TODO: Consider using the collapse button and then checking whether text was really entered properly.
      // const collapse = '//div[@data-drupal-selector="edit-field-landing-page-component-0"]//div[@class="paragraphs-actions"]//input[@value="Collapse"]';

      // Wait for our indexed rich text field to load.
      await this.useXpath()
        .waitForElementVisible({ selector: fieldXPath, index }, 30000);

      // Find the cke_X class for our indexed rich text field.
      const fieldClassPromise = new Promise((resolve, reject) => {
        this.api.execute(function (xpath) {
          let results = [];
          let elements = new XPathEvaluator().evaluate(xpath, document);
          let nextItem;
          while ((nextItem = elements.iterateNext())) {
            results.push(nextItem.classList[0]);
          }

          return results;
        }, [fieldXPath], (result) => {
          resolve(result.value[index]);
        });
      });
      const fieldClass = await fieldClassPromise;

      // Find and action the iframe and input fields within the cke_X class.
      const iframe = `//div[contains(@class, "${fieldClass}")]//iframe[contains(@class, "cke_wysiwyg_frame")]`;
      const input = `//div[contains(@class, "${fieldClass}")]//span[@class="cke_path"]//a[@title="p element"]`;
      this.useXpath()
        .sdpTideMoveToElement(iframe)
        .waitForElementVisible(iframe)
        .pause(1000) // Without this the iframe is often not selected and text is not entered.
        .click(iframe);

      this.api
        .useXpath()
        .frame(0)
        .setValue('//body', ' ' + content)
        .frameParent()
        .pause(500);

      return this;
    },
  }]
};
