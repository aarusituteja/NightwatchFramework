/**
 * Recover the Drupal admin toolbar.
 *
 * Used to recover the toolbar hidden by `sdpTideHideToolbar()`.
 */
exports.command = async function TideRecoverToolbar () {
  await this
    .execute('document.getElementById("toolbar-administration").style.display = "block";');

  return this;
};
