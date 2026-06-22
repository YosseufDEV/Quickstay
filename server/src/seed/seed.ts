import type { ITag } from "@quickstay/types/Hotel.ts";
import prisma from "../db/prisma.ts";
import { faker } from "@faker-js/faker";
import { Role } from "@/generated/prisma/enums.ts";
import Booking from "../models/Booking.ts";

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
    const role = Role.USER;
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
    await prisma.hotel.deleteMany({});
    await prisma.hotelTag.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.hotelBooking.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.tag.createMany({
        data: [
            { id: 1,name: "Free Wi-Fi", slag: "wifi" },
            { id:2, name: "Breakfast Included", slag: "breakfast" },
            { id: 3, name: "Mountain View", slag: "mountain" },
            { id: 4, name: "Room Service", slag: "service" },
            { id: 5, name: "Pool Access", slag: "pool" },
        ],
    })

    for(let i = 0; i < 3000; i++) {
        const hotelData = generateRandomHotel();
        const userData = await generateUser();

        await prisma.user.create({
            data: userData,
        });

        await prisma.hotel.create({
            data: {
                ...hotelData,
                tags: {
                    connect: hotelData.tags
                }
            }
        });
    }

    const allUsers = await prisma.user.findMany();
    const allHotels = await prisma.hotel.findMany();

    for(let i = 0; i < 3000; i++) {
        const user = allUsers[getRandomInt(0, allUsers.length)]!;
        const hotel = allHotels[getRandomInt(0, allHotels.length)]!;

        let date = new Date();
        date.setDate(date.getDate()-i);

        await Booking.createBooking({
            userId: user.id,
            hotelId: hotel.id,
            startDate: date,
            endDate: date,
        })

    }

} catch (error) {
    console.error("Error seeding tags:", error);
}

