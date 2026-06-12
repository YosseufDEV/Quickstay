import { prisma } from "../db/prisma.ts";
import { faker } from "@faker-js/faker";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomHotel() {
    const name = faker.company.name() + " Hotel";
    const address = faker.location.city() + ", " + faker.location.country();
    const pricePerNight = getRandomInt(50, 500);
    const rating = parseFloat((Math.random() * 5).toFixed(2));
    const imageUrl = `${getRandomInt(1, 12)}.jpg`;
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
            { name: "Free Wi-Fi", slag: "wifi" },
            { name: "Breakfast Included", slag: "breakfast" },
            { name: "Mountain View", slag: "mountain" },
            { name: "Room Service", slag: "service" },
            { name: "Pool Access", slag: "pool" },
        ],
        skipDuplicates: true,
    })

    await prisma.hotel.deleteMany({});

    for(let i = 0; i < 1000; i++) {
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

