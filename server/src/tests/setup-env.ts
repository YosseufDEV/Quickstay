import { afterAll, beforeAll, vi } from "vitest";
import { type StartedTestContainer, GenericContainer } from "testcontainers";
import { createClient } from "redis";
import { drizzle } from 'drizzle-orm/node-postgres';
import d from "../db/drizzle";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "../db/schema";

let postgresContainer: StartedTestContainer, redisContainer: StartedTestContainer;

vi.stubEnv("JWT_ACCESS_SECRET", "access_secret");
vi.stubEnv("JWT_REFRESH_SECRET", "refresh_secret");
vi.stubEnv("NODE_ENV", "testing");

const mocks = vi.hoisted(() => ({
    drizzle: null as unknown as typeof d,
    redis: null as unknown as ReturnType<typeof createClient>,
}));

vi.mock("../db/redis", () => {
    return { 
        get default() { 
            return mocks.redis
        }
    }
});

vi.mock("../db/drizzle", () => {
    return { 
        get default() {
            return mocks.drizzle;
        }
    }
});

beforeAll(async () => {
    postgresContainer = await new GenericContainer("postgres:latest")
        .withEnvironment({
            POSTGRES_PASSWORD: "admin",
        })
        .withExposedPorts(5432)
        .start();

    redisContainer = await new GenericContainer("redis:latest").withExposedPorts(6379).withStartupTimeout(60000).start();

    mocks.redis = createClient({
        socket: {
            host: redisContainer.getHost(),
            port: redisContainer.getMappedPort(6379),
        },
    });

    vi.stubEnv("DATABASE_URL", `postgresql://postgres:admin@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/postgres`);
        
    mocks.drizzle = drizzle(process.env.DATABASE_URL!, { schema, relations: { ...schema.relations }});

    await migrate(mocks.drizzle, { migrationsFolder: "./drizzle" })

    await mocks.redis.connect();
}, 100_000);

afterAll(async () => {
    if(mocks.redis && mocks.redis.isOpen) await mocks.redis.disconnect();
    mocks.drizzle.$client.end();
    await postgresContainer.stop();
    await redisContainer.stop();
}, 100_000)
