import Booking from "../models/Booking.ts";
import drizzle from "@/src/db/drizzle";
import { hotels, hotelsTags, amenities, users } from "../db/schema.ts";
import { User } from "../models/User.ts";
import Hotel from "../models/Hotel.ts";
import { sql } from "drizzle-orm";
import { generateRandomHotel, generateUser, getRandomInt } from "./generate.ts";

try {
    await drizzle.delete(hotels);
    await drizzle.delete(hotelsTags);
    await drizzle.delete(amenities);
    await drizzle.delete(users);
    await drizzle.execute(sql`TRUNCATE TABLE amenities RESTART IDENTITY CASCADE;`);

    await drizzle.insert(amenities).values([
        { slag: "wifi" },
        { slag: "breakfast" },
        { slag: "mountain" },
        { slag: "service" },
        { slag: "pool" },
    ])

    console.log(await drizzle.query.amenities.findMany());

    for (let i = 0; i < 3000; i++) {
        const hotelData = generateRandomHotel();
        const userData = await generateUser();

        // await drizzle.insert(users).values(userData);
        await User.createUser(userData);

        await Hotel.createHotel(hotelData as any);
    }

    const allHotels = await Hotel.getHotels();
    const allUsers = await User.getAllUsers();

    for (let i = 0; i < 3000; i++) {
        const user = allUsers[getRandomInt(0, allUsers.length)]!;
        const hotel = allHotels[getRandomInt(0, allHotels.length)]!;
        const room = hotel.rooms[getRandomInt(0, hotel.rooms.length)]!;

        let date = new Date();
        date.setDate(date.getDate() - i);

        await Booking.book({
            userId: user.id,
            roomId: room.id,
            from: date,
            to: date,
        })

        console.log(`Created booking for user ${user.id} in room ${room.id} of hotel ${hotel.id}`);

    }

} catch (error) {
    console.error("Error seeding amenities:", error);
}

