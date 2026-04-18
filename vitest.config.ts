import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "client/**/*.test.tsx"],
    environmentMatchGlobs: [["client/**/*.test.tsx", "jsdom"]],
    setupFiles: ["./client/src/test/setup.ts"],
  },
});
