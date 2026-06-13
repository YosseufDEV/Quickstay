import { afterAll, beforeAll, vi } from "vitest";

import { execSync } from 'node:child_process';

import { type StartedTestContainer, GenericContainer } from "testcontainers";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "redis";


let postgresContainer: StartedTestContainer, redisContainer: StartedTestContainer;

const mocks = vi.hoisted(() => ({
    prisma: null as unknown as PrismaClient,
    redis: null as unknown as ReturnType<typeof createClient>,
}));

vi.mock("../db/prisma", () => {
    return {
        get default() { 
            return mocks.prisma 
        },
    }
});

vi.mock("../db/redis", () => {
    return { 
        get default() { 
            return mocks.redis
        }
    }
});

beforeAll(async () => {
    postgresContainer = await new GenericContainer("postgres:latest")
        .withName("vitest-postgres")
        .withEnvironment({
            POSTGRES_PASSWORD: "admin",
        })
        .withExposedPorts(5432)
        .start();

    redisContainer = await new GenericContainer("redis:latest").withName("vitest-redis").withExposedPorts(6379).start();

    mocks.redis = createClient({
        socket: {
            host: redisContainer.getHost(),
            port: redisContainer.getMappedPort(6379),
        },
    });

    let prismaConfig = new PrismaPg({
        connectionString: `postgresql://postgres:admin@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/postgres`,
    });

    mocks.prisma = new PrismaClient({ adapter: prismaConfig });

    execSync(`npx prisma migrate deploy --schema=./prisma/schema.prisma`, {
        env: {
            ...process.env,
            POSTGRES_URL: `postgresql://postgres:admin@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/postgres`,
        },
    });
    execSync(`npx prisma generate --schema=./prisma/schema.prisma`);
}, 90_000);

afterAll(async () => {
    await postgresContainer.stop();
    await redisContainer.stop();
});
