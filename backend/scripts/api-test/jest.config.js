/** Jest config for API tests. */
module.exports = {
  testEnvironment: "node",
  rootDir: "../../",
  testMatch: ["**/scripts/api-test/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            decorators: true,
            dynamicImport: true,
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
      },
    ],
  },
  reporters: [
    "default",
    ["<rootDir>/scripts/api-test/reporter.js", {}],
  ],
  testTimeout: 15000,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
