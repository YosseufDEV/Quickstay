import { faker } from "@faker-js/faker";
import Booking from "../models/Booking.ts";
import drizzle from "@/src/db/drizzle";
import { hotels, hotelsTags, tags, users, type UserRoles } from "../db/schema.ts";
import { User } from "../models/User.ts";
import Hotel from "../models/Hotel.ts";
import { sql } from "drizzle-orm";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateRandomHotel() {
    const name = faker.company.name() + " Hotel";
    const address = faker.location.city() + ", " + faker.location.country();
    const pricePerNight = getRandomInt(150, 500);
    const rating = parseFloat(((Math.random()+3)*5/4).toFixed(2));
    const imageUrl = `http://localhost:5001/${getRandomInt(1, 12)}.webp`;
    const tags: { id: number }[] = [];

    for(let i = 0; i < 3; i++) {
        const id = getRandomInt(1, 6);
        if(!tags.some(tag => (tag.id === id)) ) {

            tags.push({ id })
        } else {
            i--;
        }
    }

    return {
        name,
        address,
        exactAddress: address,
        pricePerNight,
        rating,
        imageUrl,
        tags,
    };
}

const emails = new Set<string>();

async function generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    if(emails.has(email)) {
        return await generateUser();

    }
    emails.add(email);
    const password = faker.internet.password();
    const country = faker.location.country();
    const role: UserRoles = "USER";
    return {
        firstName,
        lastName,
        email,
        password,
        country,
        role,
    }
}

try {
    await drizzle.delete(hotels);
    await drizzle.delete(hotelsTags);
    await drizzle.delete(tags);
    await drizzle.delete(users);
    await drizzle.execute(sql`TRUNCATE TABLE tags RESTART IDENTITY CASCADE;`);

    await drizzle.insert(tags).values([
        { slag: "wifi" },
        { slag: "breakfast" },
        { slag: "mountain" },
        { slag: "service" },
        { slag: "pool" },
    ])

    console.log(await drizzle.query.tags.findMany());

    for(let i = 0; i < 3000; i++) {
        const hotelData = generateRandomHotel();
        const userData = await generateUser();

        // await drizzle.insert(users).values(userData);
        await User.createUser(userData);

        await Hotel.createHotel(hotelData as any);
    }

    const allHotels = await Hotel.getHotels();
    const allUsers = await User.getAllUsers();

    for(let i = 0; i < 3000; i++) {
        const user = allUsers[getRandomInt(0, allUsers.length)]!;
        const hotel = allHotels[getRandomInt(0, allHotels.length)]!;

        let date = new Date();
        date.setDate(date.getDate()-i);

        await Booking.createBooking({
            userId: user.id,
            hotelId: hotel.id,
            from: date,
            to: date,
        })

    }

} catch (error) {
    console.error("Error seeding tags:", error);
}

