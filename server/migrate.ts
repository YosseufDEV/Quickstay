// Print better error messages for PostgreSQL errors when migrating.
// This hack is for drizzle-kit@0.45.2 compatibility, please remove it when it's fixed.
// See https://github.com/drizzle-team/drizzle-orm/pull/5426 for more details.
// Related issue: https://github.com/drizzle-team/drizzle-orm/issues/5178

import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const { Client } = pg;

function formatPgError(error) {
  if (!error || typeof error !== "object") {
    return { message: String(error) };
  }

  const fields = [
    "message",
    "severity",
    "code",
    "detail",
    "hint",
    "position",
    "where",
    "schema",
    "table",
    "column",
    "dataType",
    "constraint",
    "file",
    "line",
    "routine",
  ];

  const formatted = {};
  for (const field of fields) {
    if (error[field] !== undefined && error[field] !== null) {
      formatted[field] = error[field];
    }
  }

  if (error.cause) {
    formatted.cause = formatPgError(error.cause);
  }

  return formatted;
}

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const client = new Client({ connectionString });
  const loggerEnabled = process.env.DB_MIGRATE_DEBUG_SQL === "1";

  try {
    const db = drizzle(connectionString, { logger: loggerEnabled });

    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully.");
  } catch (error) {
    console.error("Migration failed with PostgreSQL error details:");
    console.error(JSON.stringify(formatPgError(error), null, 2));

    if (error?.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }

    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

await run();
