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
          strict: false,
          baseUrl: ".",
          paths: { "@/*": ["./src/*"] },
          types: ["jest", "@testing-library/jest-dom"],
        },
        diagnostics: false,
        astTransformers: {
          before: [
            {
              path: "ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_BASE_URL: "http://localhost:3000/api",
                    VITE_WOMPI_API_URL:
                      "https://api-sandbox.co.uat.wompi.dev/v1",
                    VITE_WOMPI_PUBLIC_KEY:
                      "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["./src/test/polyfills.js"],
  setupFilesAfterEnv: ["./src/test/setup.ts"],
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
