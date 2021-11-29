const {
    client,
    createSession,
    closeSession,
  } = require('nightwatch-api');
  const chalk = require('chalk');
  
  // Only check some of the fixture content, not all. Should be enough.
  const fixtureContent = [
    'embed video landing page - fixture',
    'site navigation landing page - fixture',
    'Contact Module landing page - fixture',
    'Accordion landing page - fixture',
    'Complex Image landing page - fixture',
    'navigation card landing page - fixture',
    '[SDPTA-190] Minimal landing page - fixture',
    'Related links landing page - fixture',
    'Debug WYSIWYG landing page - fixture'
  ];
  
  /**
   * Check test fixture in Backend
   *
   * @returns boolean. Indicates the fixture exist of not.
   */
  async function checkFixture () {
    let fixture = false;
  
    // Only check this in cucumber:backend test.
    if (process.env.APP !== 'BE') {
      return fixture;
    }
  
    console.info(chalk.cyanBright('ℹ Check the test fixture before starting the test.'));
    await createSession();
    try {
      await client.drupalLogin({ name: process.env.BE_ADMIN_USER, password: process.env.BE_ADMIN_PASS });
      for (let i = 0; i < fixtureContent.length; i++) {
        await client.sdpTideSearchContent(fixtureContent[i]);
      }
      fixture = true;
      console.info(chalk.green('√ Test fixture exists.'));
    } catch (error) {
      console.info(chalk.yellow('‼ Test fixture doesn\'t not exist. Create it now.'));
    }
    await closeSession();
  
    return fixture;
  }
  
  module.exports = {
    checkFixture
  };