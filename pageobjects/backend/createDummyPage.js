module.exports = {
  elements: {
  },
  commands: {
    /**
     * Create a dummy content page and store the nid.
     * We will able to get the nid id by scope and contentType.
     *
     * A dummy content page is for component level testing, so we don't need to take care these irrelevant details.
     *
     * @param {Object[]} pageConfigs
     * @param {string} pageConfigs[].scope - The feature, should be unique for each component test.
     * @param {string} pageConfigs[].contentType - The id of content type
     * @param {string} pageConfigs[].title - The test content title
     * @param {boolean} pageConfigs[].featureImage - Add feature image or not
     *
     * @returns
     */
    createDummyPage: async function (pageConfigs = {}) {
      const scope = pageConfigs.scope;
      const contentType = pageConfigs.contentType;
      let title = pageConfigs.title;
      const commonPage = this.api.page.backend.shared.common.pageElements();
      const globals = this.api.page.backend.globals.globals();

      // If the page has been created already, let's do nothing.
      if (this.api.globals.sdp.fixtures[scope] && this.api.globals.sdp.fixtures[scope][contentType]) {
        return this;
      }

      if (!contentType || !title) {
        throw new Error('Missing required arguments');
      }

      const site = process.env.BE_SITE;
      const primarySite = process.env.BE_PRIMARY_SITE;
      // Set unique title
      title +=  ` - ${this.api.globals.sdp.testId}`;

      await this
        .drupalRelativeURL('/node/add/' + pageConfigs.contentType);

      await commonPage
        .enterTitle(title)
        .selectDepartment('Another Demo Department')
        .addAllSites();

      // Fill in body text
      if (pageConfigs.contentType === 'page' || pageConfigs.contentType === 'news') {
        await globals.useXpath()
          .sharedRichTextEnterValue('//div[@data-drupal-selector="edit-body-wrapper"]', 'Body', 'Some body content text.');
      }

      switch (pageConfigs.contentType) {
        case 'news':
        case 'publication':
        case 'landing_page':
          await commonPage
            .enterSummary('Some summary text')
          //Fill body
            .selectTopic('Another Demo Topic');
          break;
        case 'publication_page':
          break;
        case 'page':
          await commonPage
            .selectTopic('Another Demo Topic');
          break;

        default:
          return;
      }

      if (pageConfigs.featureImage) {
        const checkPreview = true;
        const imageAccordion = '//div[contains(@class, "field--name-field-featured-image")]//details';
        await globals
          .sdpTideMoveToElement(imageAccordion)
          .sharedSelectImage(imageAccordion, checkPreview);
      }

      await commonPage
        .selectSaveAsOption('Published')
        // After page saved, store the node id in fixture object so we can use it later.
        .getAttribute('//ul[contains(@class, "tabs primary")]//a[text()="Edit"]', 'href', function (editUrl) {
          const regex = /node\/(\d*)\/edit/;
          const matches = editUrl.value.match(regex);
          const nid = matches[1];
          this.globals.sdp.fixtures[scope] = this.globals.sdp.fixtures[scope] || {};
          this.globals.sdp.fixtures[scope][contentType] = nid;
        });

      return this;
    }
  }
};
