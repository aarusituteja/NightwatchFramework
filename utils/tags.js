/**
 * Check if the cucumber scenario tags includes tag "@defect" or "@defect-<project>"
 * @param {Array} scenarioTags
 * @returns boolean
 */
 const isDefect = function (scenarioTags) {
    const defectTagForProject = '@defect-' + process.env.PROJECT;
    const defect = scenarioTags.find(tag => {
      return (tag.name === '@defect' || tag.name === defectTagForProject);
    });
  
    return !!defect;
  };
  
  /**
   * Check if the cucumber scenario tags includes tag "@skip" or "@skip-<env>"
   * @param {Array} scenarioTags
   * @returns boolean
   */
  const isSkip = function (scenarioTags) {
    const skipTagForProject = '@skip-' + process.env.NIGHTWATCH_ENV;
    const skip = scenarioTags.find(tag => {
      return (tag.name === '@skip' || tag.name === skipTagForProject);
    });
  
    return !!skip;
  };
  
  /**
   * Check if the given scenario is tagged by defect of skip
   * @param {*} scenario Cucumber scenario object
   * @returns boolean
   */
  const isDefectOrSkip = function (scenario) {
    const scenarioTags = scenario.pickle.tags;
  
    return (isDefect(scenarioTags) || isSkip(scenarioTags));
  };
  
  module.exports  = {
    isDefect,
    isSkip,
    isDefectOrSkip
  };