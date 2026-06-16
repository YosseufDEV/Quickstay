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
                    name: "Controllers",
                    globalSetup: "./src/tests/global-setup.ts",
                    setupFiles: ["./src/tests/setup-env.ts"],
                    include: ["./src/tests/controllers/*.test.ts"],
                }
            },
            {
                resolve: {
                    tsconfigPaths: true,
                },
                test: {
                    name: "Integration",
                    include: ["./src/tests/**/*.test.ts"],
                    exclude: ["./src/tests/controllers/*.test.ts"],
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

