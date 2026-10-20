/** jest.config.js — Jest config for API tests (uses babel to avoid ts-jest / TS7 conflict) */
module.exports = {
  testEnvironment: "node",
  rootDir: "../../",
  testMatch: ["**/scripts/api-test/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["babel-jest", {}],
  },
  reporters: [
    "default",
    ["<rootDir>/scripts/api-test/reporter.js", {}],
  ],
  testTimeout: 15000,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
