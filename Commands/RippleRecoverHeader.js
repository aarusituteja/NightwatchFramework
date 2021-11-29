/**
 *
 * Used to recover the header hidden by `sdpRippleHideHeaderMenu()`.
 */
exports.command = async function RippleRecoverHeader () {
  await this
    .execute('document.getElementsByClassName("rpl-site-header")[0].style.visibility = "visible";');

  return this;
};
