const { setDefaultTimeout, AfterAll, BeforeAll, After, Before } = require('@cucumber/cucumber');
require('dotenv').config();
require('module-alias/register');
const fetch = require('node-fetch');
const {
  client,
  createSession,
  closeSession,
  startWebDriver,
  stopWebDriver,
  getNewScreenshots
} = require('nightwatch-api');
const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const chalk = require('chalk');
const { checkFixture } = require('./utils/fixture');
const { isDefectOrSkip } = require('./utils/tags');

let skipBE = false;

// https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/timeouts.md
setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  await startWebDriver({ env: process.env.NIGHTWATCH_ENV || 'chrome_headless' });
  console.log(chalk.cyanBright('ℹ WebDriver Started'));
  // Set TESTID to `fixture` can allow FE tests using fixture instead of relying on BE tests
  if (process.env.TESTID === 'fixture' && process.env.APP === 'BE') {
    skipBE = await checkFixture();
  }
});

/**
 * The order of below Before hooks execution is from top to bottom
 */

// Skip BE tests if fixture exists
Before(async () => {
  if (skipBE) {
    return 'skipped';
  }
});

// Skip defect test cases automatically by tag "@defect" and "@defect-<project>"
Before(function (scenario) {
  if (isDefectOrSkip(scenario)) {
    return 'skipped';
  }
});

Before(async (scenario) => {
  // Set feature and scenario name for Percy use.
  // This may will have issue in parallel run, so need to be careful.
  process.env.SCENARIO_NAME = scenario.pickle.name;
  process.env.FEATURE_NAME = scenario.gherkinDocument.feature.name;
  // Create selenium session
  await createSession();
});

// Generate the HTML report
AfterAll(async () => {
  await stopWebDriver();
  if (skipBE) return;

  // Use timestamp as a unique report id.
  // So we won't override previous report.
  const timestamp = new Date().getTime();
  setTimeout(() => {
    reporter.generate({
      theme: 'bootstrap',
      jsonFile: 'report/cucumber_report.cucumber',
      output: 'report/cucumber_report_' + timestamp + '.html',
      reportSuiteAsScenarios: true,
      launchReport: true,
      brandTitle: 'End to end test report - ' + (process.env.TEST_GROUP || ''),
      storeScreenshots: true,
      metadata: {
        'FE URL': process.env.FE_BASE_URL,
        'BE URL': process.env.BE_BASE_URL,
        'Browser': process.env.NIGHTWATCH_ENV,
        'PR': process.env.CIRCLE_PULL_REQUEST || 'No PR',
        'Test id': process.env.TESTID
      }
    });
  }, 1000);
});

/**
 * The order of below After hooks execution is from bottom to top
 */

// After each Scenario
After(async function (scenario) {
  // No need to close session if this scenario is skipped
  if (skipBE || isDefectOrSkip(scenario)) return;

  await closeSession();
  getNewScreenshots().forEach(file => this.attach(fs.readFileSync(file), 'image/png'));
});

// Update BrowserStack Automate session name to scenario name
After(async (scenario) => {
  // No need to update session if this scenario is skipped
  if (skipBE || isDefectOrSkip(scenario)) return;

  if (process.env.BROWSERSTACK=='true') {
    //Browserstack Session ID
    let sessionID = client.sessionId;
    //Join feature - scenario name
    let featureScenarioName = scenario.gherkinDocument.feature.name + ' - ' + scenario.pickle.name;
    //Use fetch to update to browserstack API
    let response = await fetch(`https://api.browserstack.com/automate/sessions/${sessionID}?status=${scenario.result.status}&name=${featureScenarioName}`, { method:'PUT',
      headers: {  'Authorization': 'Basic ' + Buffer.from(process.env.BROWSERSTACK_USER + ':' + process.env.BROWSERSTACK_KEY).toString('base64') } });
    let data = await response.json();
    //Log for debug that it received response
    console.log(`Updated session: ${data.automation_session.name} with test result: ${data.automation_session.status}`);
    //await client.end();
  }
});
