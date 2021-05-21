module.exports = {
  roots: ["<rootDir>/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/e2e-tests/.*|(\\.|/)spec)\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  collectCoverage: true,
};
