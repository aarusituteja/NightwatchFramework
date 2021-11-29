/**
 * Hide Drupal admin the tool bar.
 *
 * The sticky tool bar blocks the view of element when we use command like elementIdClick().
 */
exports.command = async function TideHideToolbar () {
  await this
    .execute('document.getElementById("toolbar-administration").style.display = "none";');

  return this;
};
