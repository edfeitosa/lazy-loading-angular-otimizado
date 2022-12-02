const baseConfig = require('./jest.base.config');
 
module.exports = {
  ...baseConfig,
  modulePathIgnorePatterns: ['projects/.*/package.json'],
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/dist']
};