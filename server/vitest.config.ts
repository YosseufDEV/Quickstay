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
                    name: "integration",
                    setupFiles: ["./src/tests/setup-env.ts"],
                    include: ["./src/tests/**/*.test.ts"],
                }
            },
            {
                resolve: {
                    tsconfigPaths: true,
                },
                test: {
                    name: "unit",
                    include: ["./src/**/*.test.ts"],
                    exclude: ["./src/tests"],
                }
            }
        ]
    }
})

