/**
 * TideMoveToElement
 * An alternative to moveToElement(). Positions an element in the centre of the
 * viewport (instead of the top) to avoid the fixed Drupal Admin Toolbar
 * overlapping and intercepting click events.
 */

/*global document, XPathEvaluator, window*/
module.exports = class TideMoveToElement {
  command (element, using) {
    // Get selector string if element is an object.
    let selector = (typeof element === 'object') ? element.selector : element;
    let isCss = (using === 'css') ? true : false;
    this.api.execute(function (selector, isCss) {
      let elem = null;
      if (isCss) {
        elem = document.querySelector(selector);
      } else {
        let xpe = new XPathEvaluator();
        elem = xpe.evaluate(selector, document).iterateNext();
      }
      if (elem) {
        let windowHalfHeight = window.innerHeight * 0.5;
        let pageScrollPos =  window.pageYOffset;
        let elemRect = elem.getBoundingClientRect();
        let elemTop = elemRect.top;
        let elemHalfHeight = elemRect.height * 0.5;
        let goTo = pageScrollPos + elemTop + elemHalfHeight - windowHalfHeight;
        window.scrollTo(0, goTo);

        return true;
      } else {
        return false;
      }
    }, [selector, isCss], (result) => {
      if (!result.value) {
        console.log(`Unable to find selector: ${selector}`);
      }
    });

    return this;
  }
};
