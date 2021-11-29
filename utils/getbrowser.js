const { client } = require('nightwatch-api');

module.exports = {
  isBrowser : function (browserName) {
    let testEnv = process.env.NIGHTWATCH_ENV;
    if (testEnv != undefined) {
      if (testEnv && testEnv.toLowerCase().includes(browserName))
        return true;
    } else
      return false;
  }
};