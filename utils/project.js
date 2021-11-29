/**
 * Is current project the one we want to check
 * @param {string} project the lagoon project name
 * @returns boolean
 */
 const isProject = (project) => {
    return process.env.PROJECT === project ? true : false;
  };
  
  module.exports  = {
    isProject
  };