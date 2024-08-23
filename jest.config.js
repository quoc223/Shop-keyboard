module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/',
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
};