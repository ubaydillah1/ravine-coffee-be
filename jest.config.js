const jestConfig = {
  verbose: true,
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist"],

  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
          },
          target: "es2020",
        },
        module: {
          type: "commonjs",
        },
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.\\.?/.*)\\.js$": "$1",
  },

  moduleFileExtensions: ["js", "json", "ts"],
};

export default jestConfig;
