// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '.tmp', '.cache'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '#constant/(.*)': '<rootDir>/constant/$1',
  },
};

module.exports = config;

// Or async function
module.exports = async () => {
  return {
    verbose: true,
    testPathIgnorePatterns: ['/node_modules/', '.tmp', '.cache'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    moduleNameMapper: {
      '#constant/(.*)': '<rootDir>/constant/$1',
    },
  };
};
