import { prisma } from "../db/prisma.ts";
import { faker } from "@faker-js/faker";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomHotel() {
    const name = faker.company.name() + " Hotel";
    const address = faker.location.streetAddress() + ", " + faker.location.city() + ", " + faker.location.country();
    const pricePerNight = getRandomInt(50, 500);
    const rating = parseFloat((Math.random() * 5).toFixed(1));
    const imageUrl = `D:/Projects/assets/${getRandomInt(1, 12)}.jpg`;
    const tags = []

    for(let i = 0; i < 3; i++) {
        tags.push({ id: getRandomInt(1, 6) })
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
    await prisma.tag.createMany({
        data: [
            { name: "Free Wi-Fi" },
            { name: "Breakfast Included" },
            { name: "Mountain View" },
            { name: "Room Service" },
            { name: "Pool Access" },
        ],
        skipDuplicates: true,
    })

    for(let i = 0; i < 10000; i++) {
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

