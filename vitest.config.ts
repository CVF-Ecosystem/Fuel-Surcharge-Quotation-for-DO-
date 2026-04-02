import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["backend/__tests__/**/*.test.ts"],
  },
});
