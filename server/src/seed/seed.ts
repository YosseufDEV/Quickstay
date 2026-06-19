import type { ITag } from "@quickstay/types/Hotel.ts";
import prisma from "../db/prisma.ts";
import { faker } from "@faker-js/faker";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateRandomHotel() {
    const name = faker.company.name() + " Hotel";
    const address = faker.location.city() + ", " + faker.location.country();
    const pricePerNight = getRandomInt(150, 500);
    const rating = parseFloat(((Math.random()+3)*5/4).toFixed(2));
    const imageUrl = `${getRandomInt(1, 12)}.jpg`;
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

try {
    await prisma.hotel.deleteMany({});
    await prisma.hotelTag.deleteMany({});
    await prisma.tag.deleteMany({});

    await prisma.tag.createMany({
        data: [
            { id: 1,name: "Free Wi-Fi", slag: "wifi" },
            { id:2, name: "Breakfast Included", slag: "breakfast" },
            { id: 3, name: "Mountain View", slag: "mountain" },
            { id: 4, name: "Room Service", slag: "service" },
            { id: 5, name: "Pool Access", slag: "pool" },
        ],
    })

    for(let i = 0; i < 100_000; i++) {
        const hotelData = generateRandomHotel();

        await prisma.hotel.create({
            data: {
                ...hotelData,
                tags: {
                    connect: hotelData.tags
                }
            }
        });
    }
} catch (error) {
    console.error("Error seeding tags:", error);
}

