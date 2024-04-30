module.exports = {
  verbose: true,
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: [
    '.local',
    '.bundle',
    '/node_modules/',
    '<rootDir>/foreman/',
  ],
  moduleDirectories: ['node_modules', 'webpack'],
  testURL: 'http://localhost/',
  collectCoverage: true,
  collectCoverageFrom: [
    'webpack/**/*.js',
    '!webpack/js-yaml.js',
    '!webpack/index.js',
    '!webpack/test_setup.js',
    '!webpack/**/bundle*',
    '!webpack/stories/**',
    '!webpack/**/*stories.js',
  ],
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^.+\\.(png|gif|css|scss)$': 'identity-obj-proxy',
  },
  globals: {
    __testing__: true,
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFiles: [
    'raf/polyfill',
    'jest-prop-type-error',
    './webpack/test_setup.js',
  ],
};
