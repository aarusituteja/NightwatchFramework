// Import all shared components here.
const selectImage = require('./components/selectImage');
const richText = require('./components/richText');
const accordionComponent = require('./components/accordionComponent');

// Include them into the elements and commands exported variables.
module.exports = {
  elements: {
    ...selectImage.elements,
    ...richText.elements,
    ...accordionComponent.elements,
  },
  commands: [
    ...selectImage.commands,
    ...richText.commands,
    ...accordionComponent.commands,
  ]
};
