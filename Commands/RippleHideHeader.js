/**
 * Hide Header Menu
 *
 * The sticky header menu blocks the view of element when we use command like elementIdClick().
 */
exports.command = function RippleHideHeader () {
  this
    .execute('document.getElementsByClassName("rpl-site-header")[0].style.visibility = "hidden";');

  return this;
};
