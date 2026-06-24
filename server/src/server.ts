import { app } from "./app";
import redis from "@/src/db/redis";
import drizzle from "@/src/db/drizzle";

const PORT = process.env.PORT || 5050;

await redis.connect().then(() => console.log('Connected to Redis')).catch((error) => console.error('Redis connection error:', error));
await drizzle.$client.connect().then(() => console.log('Connected to PostgreSQL')).catch((error) => console.error('PostgreSQL connection error:', error));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

