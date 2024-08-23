module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)', // Ensure axios is transformed by Babel
  ],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // Map axios to CommonJS version
  },
};
