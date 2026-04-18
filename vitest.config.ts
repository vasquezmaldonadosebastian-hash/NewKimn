import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "client/**/*.test.tsx"],
    environmentMatchGlobs: [["client/**/*.test.tsx", "jsdom"]],
    setupFiles: ["./client/src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Keep "global" coverage focused on the code we actively own/test in this repo.
      include: [
        "server/src/**/*.{ts,tsx}",
        "client/src/features/indicadores/components/**/*.{ts,tsx}",
        "client/src/lib/apiClient.ts",
        "client/src/contexts/IndicatorsContext.tsx",
      ],
      exclude: ["**/*.d.ts", "**/*.test.*", "server/src/app.ts"],
    },
  },
});
