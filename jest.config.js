export default {
  setupFiles: ["<rootDir>/jest.setup.js"],
  projects: [
    {
      // name displayed during tests
      displayName: "frontend",

      // simulates browser environment in jest
      // e.g., using document.querySelector in your tests
      testEnvironment: "jest-fixed-jsdom",

      // jest does not recognise jsx files by default, so we use babel to transform any jsx files
      transform: {
        "^.+\\.jsx?$": "babel-jest",
      },

      // tells jest how to handle css/scss imports in your tests
      moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
      },

      // ignore all node_modules except styleMock (needed for css imports)
      transformIgnorePatterns: ["/node_modules/(?!(styleMock\\.js)$)"],

      // only run these tests : "<rootDir>/client/src/components/Form/*.test.js", "<rootDir>/client/src/pages/*.test.js"
      testMatch: [
        "<rootDir>/client/src/pages/Auth/*.test.js",
        "<rootDir>/client/src/components/Form/*.test.js",
        "<rootDir>/client/src/pages/*.test.js",
        "<rootDir>/client/src/pages/admin/*.test.js",
        "<rootDir>/client/src/context/*.test.js",
        "<rootDir>/client/src/components/*.test.js",
      ],

      // jest code coverage
      collectCoverage: true,
      collectCoverageFrom: ["client/src/pages/**"],
      coverageThreshold: {
        global: {
          lines: 100,
          functions: 100,
        },
      },
    },
    {
      // display name
      displayName: "backend",

      // when testing backend
      testEnvironment: "node",

      // which test to run
      testMatch: ["<rootDir>/controllers/*.test.js"],

      // jest code coverage
      collectCoverage: true,
      collectCoverageFrom: ["controllers/**"],
      coverageThreshold: {
        global: {
          lines: 100,
          functions: 100,
        },
      },
    },
  ],
};
