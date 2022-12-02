module.exports = {
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^environments/(.*)$': '<rootDir>/src/environments/$1',
  },
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/**/*.module.ts",
    "!src/app/**/*.array.ts",
    "!src/app/**/*.model.ts",
    "!src/app/fragmentTypes.ts"
  ],
  modulePaths: ['<rootDir>/dist'],
  transformIgnorePatterns: ['node_modules/(?!@ngrx)'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  setupFilesAfterEnv: [
    './node_modules/@angular-builders/jest/dist/jest-config/setup.js',
    './setupJest.ts'
  ],
  testTimeout: 30000
};