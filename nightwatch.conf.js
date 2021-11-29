require('dotenv').config();
//const percy = require('@percy/nightwatch');//

const config = {
  'page_objects_path': ['pageObjects'],
  'custom_commands_path': [
    'commands',
    //percy.path//
  ],
  'globals_path': 'config/globalsModule.js',
  'test_settings' : {
    'default' : {
      screenshots: {
        enabled: true,
        path: './report'
      }
    }
  }
};

switch (process.env.BROWSERSTACK) {
  case 'true':
    // Guide: https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/nightwatch#integrating-your-tests-with-browserstack
    config.test_settings.default.selenium = {
      start_process: false,
      host: 'hub-cloud.browserstack.com',
      port: 80,
      'timeout_options': {
        timeout: 60000,
        retry_attempts: 5
      }
    };
    config.test_settings.default.desiredCapabilities = {
      'browserstack.user': process.env.BROWSERSTACK_USERNAME,
      'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
      'browserstack.use_w3c': true,
      'browserstack.debug': true,
      'browserstack.console': 'errors',
      'browserstack.networkLogs': true,
      'project': process.env.PROJECT
    };

    // Set a user friendly name for build
    if (process.env.CIRCLECI) {
      config.test_settings.default.desiredCapabilities.build = process.env.CIRCLE_BRANCH + '_' + process.env.CIRCLE_JOB;
    } else {
      config.test_settings.default.desiredCapabilities.build = process.env.BROWSERSTACK_BUILD || null;
    }

    // Set your own session name in local env BROWSERSTACK_SESSION_NAME var
    config.test_settings.default.desiredCapabilities.name = process.env.BROWSERSTACK_SESSION_NAME || null;

    config.test_settings.chrome = {
      desiredCapabilities : {
        os : 'mac',
        os_version : '10.15.7',
        browser : 'chrome',
        browser_version : 'latest',
        resolution: '1920x1080',
        chromeOptions : {
          w3c: true,
          args:[
            'window-size=1920,1080'
          ]
        },
        ['browserstack.local']: false
      }
    };

    config.test_settings.edge = {
      desiredCapabilities : {
        os : 'mac',
        os_version : '10.15.7',
        browser : 'edge',
        browser_version : 'latest',
        resolution: '1920x1080',
        ['browserstack.local']: false
      }
    };

    config.test_settings.firefox = {
      desiredCapabilities : {
        os : 'mac',
        os_version : '10.15.7',
        browser : 'firefox',
        browser_version : 'latest',
        resolution: '1920x1080',
        ['browserstack.local']: false
      }
    };

    // TODO: safari doesn't work as basic auth issue https://digital-engagement.atlassian.net/browse/SDPTA-211
    config.test_settings.osxSafari = {
      desiredCapabilities : {
        os : 'OS X',
        os_version : 'Mojave',
        browser : 'safari',
        resolution: '1920x1080',
        browser_version : '12.1',
        ['browserstack.local']: false
      }
    };

    config.test_settings.ie11 = {
      desiredCapabilities : {
        os : 'mac',
        os_version : '10.15.7',
        browser : 'ie',
        browser_version : '11.0',
        resolution: '1920x1080',
        ['browserstack.local']: false
      }
    };

    config.test_settings.androidChrome = {
      desiredCapabilities : {
        os : 'android',
        os_version : '9.0',
        deviceName: 'Samsung Galaxy S10',
        realMobile: true,
        browser : 'chrome',
        browser_version : 'latest',
        resolution: '1920x1080',
        ['browserstack.local']: false
      }
    };

    // Configuration setting loop for different browsers where the test need to be run
    for (let i in config.test_settings) {
      let test_setting = config.test_settings[i];
      test_setting['selenium_host'] = config.test_settings.default.selenium.host;
      test_setting['selenium_port'] = config.test_settings.default.selenium.port;
    }
    break;

  default:
  // Configuration for local run
    config.webdriver = {
      'start_process': true,
      'server_path': 'node_modules/.bin/chromedriver',
      'port': 9515,
      'timeout_options': {
        timeout: 60000,
        retry_attempts: 5
      }
    };

    config.test_settings.chrome = {
      'desiredCapabilities' : {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': [
          // https://stackoverflow.com/questions/53902507/unknown-error-session-deleted-because-of-page-crash-from-unknown-error-cannot
            '--disable-dev-shm-usage',
            'window-size=1280,800'
          ]
        }
      }
    };

    config.test_settings.chrome_headless = {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': [
            '--headless',
            // Use no-sandbox here to avoid random "socket hang up" issue.
            // https://stackoverflow.com/questions/41487659/nightwatch-selenium-socket-hang-up
            'no-sandbox',
            // https://stackoverflow.com/questions/53902507/unknown-error-session-deleted-because-of-page-crash-from-unknown-error-cannot
            '--disable-dev-shm-usage',
            'window-size=1280,800'
          ]
        }
      }
    };
}

module.exports = config;
