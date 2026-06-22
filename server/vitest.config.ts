import { defineConfig, defineProject } from 'vitest/config'

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        projects: [ 
            {
                resolve: {
                    tsconfigPaths: true,
                },
                test: {
                    name: "Integration -- Databases",
                    setupFiles: ["./src/tests/setup-env.ts"],
                    include: ["./src/tests/integration/**/*.test.ts"],
                }
            },
            {
                resolve: {
                    tsconfigPaths: true,
                },
                test: {
                    name: "Integration -- Network",
                    setupFiles: ["./src/tests/setup-env.ts"],
                    include: ["./src/tests/integration/*.test.ts"],
                }
            },
            {
                resolve: {
                    tsconfigPaths: true,
                },
                test: {
                    name: "Unit",
                    include: ["./src/*/*.test.ts"],
                    exclude: ["./src/tests/**/*.test.ts"],
                }
            },
        ]
    }
})

