// tests/global-setup.ts
import { execSync } from "node:child_process";

export default function setup() {
    execSync("npx prisma generate --schema=./prisma/schema.prisma");
}
