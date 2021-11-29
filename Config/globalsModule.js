module.exports = {
  waitForConditionTimeout: 10000,

  'rename': {
    // If there is a test ID passed from environment, use it.
    // Otherwise, generate one for this particular process.
    testId: process.env.TESTID || Date.now(),
    // Fixtures
    fixtures: {}
  },
};
