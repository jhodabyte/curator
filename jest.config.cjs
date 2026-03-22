/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "commonjs",
          moduleResolution: "node",
          target: "ES2023",
          lib: ["ES2023", "DOM", "DOM.Iterable"],
          esModuleInterop: true,
          strict: true,
          baseUrl: ".",
          paths: { "@/*": ["./src/*"] },
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterSetup: ["./src/test/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/router.tsx",
    "!src/test/**",
    "!src/**/*.d.ts",
    "!src/components/ui/**",
    "!src/types/**",
    "!src/layouts/**",
    "!src/components/stepper-with-description.tsx",
    "!src/store/index.ts",
  ],
  coverageReporters: ["text", "html", "lcov"],
};
