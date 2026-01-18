import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  displayName: "mini-saas-dashboard",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/lib/seed.ts"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/*.stories.{ts,tsx}",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

export default createJestConfig(config);