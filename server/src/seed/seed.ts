import drizzle from "@/db/drizzle";
import { hotels as h, rooms as r, hotelsAmenities, amenities as a, users as u, hotelsCatalogs } from "../db/schema.ts";
import { sql } from "drizzle-orm";
import Booking from "@/models/Booking.ts";
import { generateRandomHotel, getRandomInt, generateUser, getRandomDate } from "./generate.ts";

const SEED_SIZE = 10_000;
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

const hr = batch(hotels.flatMap(hotel => hotel.rooms));

const am = batch(hotels.flatMap(hotel => hotel.amenities));

await insertBatches(h, batchedHotels, 5);
console.log("Seeded hotels successfully");

await insertBatches(hotelsCatalogs, catalogs, 5);
console.log("Seeded catalogs successfully");

await insertBatches(r, hr, 5);
console.log("Seeded rooms successfully");

await insertBatches(hotelsAmenities, am, 5);
console.log("Seeded amenities successfully");

await drizzle.insert(u).values(users);
console.log("Seeded users successfully");

const allUsers = await drizzle.query.users.findMany();
const hh = await drizzle.query.hotels.findMany({ with: { catalog: true } });

const bookings = [];

for (let i = 0; i < SEED_SIZE; i++) {
    const user = allUsers[getRandomInt(0, allUsers.length)]!;
    const h = hh[getRandomInt(0, hh.length)]!;
    const rt = h.catalog[getRandomInt(0, h.catalog.length)]!;

    let from = getRandomDate(new Date(2020, 0, 1), new Date(2024, 11, 30));
    let to = getRandomDate(from, new Date(2024, 11, 31));

    bookings.push({
        userId: user.id,
        roomType: rt.roomType,
        hotelId: h.id,
        from,
        to,
    })
}

await Promise.all(bookings.map(b => Booking.book(b)));

console.log("Seeded bookings successfully");
