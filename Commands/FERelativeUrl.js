const { normalizeUrl } = require('@/utils/url');

/**
 * Concatenate a FE_BASE_URL variable and a pathname.
 * This will bust cache automatically by attaching a random query string.
 * Also it will retry in case there is a network issue.
 *
 * @param {*} pathname
 * @param {*} callback
 * @returns
 */
exports.command = function FERelativeUrl (pathname, callback) {
  const self = this;
  // Make sure env var is set.
  if (!process.env.FE_BASE_URL) {
    throw new Error('Nightwatch: missing env vars `FE_BASE_URL`.');
  }
  const feUrl = normalizeUrl(process.env.FE_BASE_URL);
  // Remove the trailing slash to avoid double slash when concat cache buster.
  pathname = pathname.replace(/\/$/, '');
  // Cache buster query string with timestamp in seconds.
  const cacheBuster = '/?cache=' + Math.floor(Date.now() / 1000);
  this.url(feUrl + pathname + cacheBuster, function () {
    // Refresh the current page if it's a server error page.
    // Because Selenium has no way to get http response code,
    // so we use HTML title to tell if it's a error page here.
    function retryOnServerError (retryTimes = 3, waitTime = 3000) {
      retryTimes--;
      self.getTitle(function (title) {
        if (typeof title === 'string' && title.includes('Error')) {
          self.refresh(function () {
            if (retryTimes > 0) {
              setTimeout(function () {
                retryOnServerError(retryTimes);
              }, waitTime);
            }
          });
        }
      });
    }

    // If BE is not ready yet, FE will fail.
    // So we give it a retry.
    retryOnServerError();
  });

  if (typeof callback === 'function') {
    callback.call(self);
  }

  return this;
};
