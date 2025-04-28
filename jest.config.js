module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@/lib/(.*)$': '<rootDir>/lib/$1',
      '^@/app/(.*)$': '<rootDir>/app/$1'
    }
  };
  