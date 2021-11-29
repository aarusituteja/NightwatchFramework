const { normalizeUrl } = require('@/utils/url');

/**
 * Concatenate a DRUPAL_TEST_BASE_URL variable and a pathname.
 *
 * This provides a custom command, .relativeURL()
 *
 * @param {string} pathname
 *   The relative path to append to DRUPAL_TEST_BASE_URL
 * @param {function} callback
 *   A callback which will be called.
 * @return {object}
 *   The 'browser' object.
 */
exports.command = function drupalRelativeURL (pathname, callback) {
  const self = this;
  // Make sure env var is set.
  if (!process.env.BE_BASE_URL) {
    throw new Error('Nightwatch: missing env vars `BE_BASE_URL`.');
  }
  const beUrl = normalizeUrl(process.env.BE_BASE_URL);
  this.url(`${beUrl}${pathname}`);

  if (typeof callback === 'function') {
    callback.call(self);
  }

  return this;
};
