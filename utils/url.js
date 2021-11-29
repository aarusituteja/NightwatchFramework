/**
 * Normalize a url so we can deal with them easier
 *
 * @param {string} url
 * @returns {string} the normalized url
 */
 const normalizeUrl = (url) => {
    // Remove trailing slash if there is
    url = url.replace(/\/$/, '');
  
    return url;
  };
  
  module.exports = {
    normalizeUrl
  };