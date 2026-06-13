import { app } from "./app";
import prisma from "@/src/db/prisma";
import redis from "@/src/db/redis";

const PORT = process.env.PORT || 5050;

await prisma.$connect().then(() => console.log('Connected to the database')).catch((error) => console.error('Database connection error:', error));
await redis.connect().then(() => console.log('Connected to Redis')).catch((error) => console.error('Redis connection error:', error));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

