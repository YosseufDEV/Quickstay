import drizzle from "@/db/drizzle";
import { hotels as h, rooms as r, hotelsAmenities, amenities as a, users as u, hotelsCatalogs, hotelsFees } from "../db/schema.ts";
import { sql } from "drizzle-orm";
import Booking from "@/models/Booking.ts";
import { generateRandomHotel, getRandomInt, generateUser, getRandomDate } from "./generate.ts";

const SEED_SIZE = 1_000;
const BATCH_SIZE = 1_000;

const batch = (arr: any[], size=BATCH_SIZE) => {
    const batches = [];
    for (let i = 0; i < arr.length; i += size) {
        batches.push(arr.slice(i, i + size));
    }
    return batches;
}

async function insertBatches(table: any, batches: any[][], concurrency = 5) {
    for (let i = 0; i < batches.length; i += concurrency) {
        const slice = batches.slice(i, i + concurrency);
        await Promise.all(slice.map(b => drizzle.insert(table).values(b)));
    }
}

await drizzle.delete(h);
await drizzle.delete(hotelsAmenities);
await drizzle.delete(a);
await drizzle.delete(u);
await drizzle.execute(sql`TRUNCATE TABLE amenities RESTART IDENTITY CASCADE;`);

await drizzle.insert(a).values([
    { slug: "wifi" },
    { slug: "breakfast" },
    { slug: "mountain" },
    { slug: "service" },
    { slug: "pool" },
])

console.log("Inserted amenities successfully");

const hotels = Array.from({ length: SEED_SIZE }).map(() => generateRandomHotel());

const batchedHotels = batch(hotels);

const users = Array.from({ length: SEED_SIZE }).map(() => generateUser());
const catalogs = batch(hotels.flatMap(hotel => hotel.catalog));
const fees = batch(hotels.flatMap(hotel => hotel.fees));

const hr = batch(hotels.flatMap(hotel => hotel.rooms));

const am = batch(hotels.flatMap(hotel => hotel.amenities));

await insertBatches(h, batchedHotels, 5);
console.log("Seeded hotels successfully");

await insertBatches(hotelsCatalogs, catalogs, 5);
console.log("Seeded catalogs successfully");

await insertBatches(hotelsFees, fees, 5);
console.log("Seeded fees successfully");

await insertBatches(r, hr, 5);
console.log("Seeded rooms successfully");

await insertBatches(hotelsAmenities, am, 5);
console.log("Seeded amenities successfully");

await drizzle.insert(u).values(users);
console.log("Seeded users successfully");
