const tfmConfig = require('@theforeman/test/src/pluginConfig');
const {
  foremanRelativePath,
  foremanLocation,
} = require('@theforeman/find-foreman');

const foremanReactRelative = 'webpack/assets/javascripts/react_app';
const foremanFull = foremanLocation();
const foremanReactFull = foremanRelativePath(foremanReactRelative);

// Find correct path to foremanReact so we do not have to mock it in tests
tfmConfig.moduleNameMapper['^foremanReact(.*)$'] = `${foremanReactFull}/$1`;

tfmConfig.setupFiles = ['./webpack/test_setup.js'];
tfmConfig.setupFilesAfterEnv = [
  './webpack/global_test_setup.js',
  '@testing-library/jest-dom',
];

// Do not use default resolver
tfmConfig.resolver = null;
// Specify module dirs instead
tfmConfig.moduleDirectories = [
  `${foremanFull}/node_modules`,
  `${foremanFull}/node_modules/@theforeman/vendor-core/node_modules`,
  'node_modules',
  'webpack/test-utils',
];

module.exports = tfmConfig;
