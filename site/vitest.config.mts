import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

// Testes de lógica pura (sem navegador): rodam em Node com os mesmos
// atalhos de import do projeto ("@/lib/..."). `npm test` roda uma vez.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
  },
})
