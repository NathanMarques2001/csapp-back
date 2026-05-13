module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
  coverageDirectory: 'coverage',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: [],
};
