import { faker } from "@faker-js/faker";
import rwt from "random-weighted-choice";
import { type RoomType, type UserRoles } from "../db/schema.ts";

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const roomTypes: RoomType[] = ["SINGLE", "DOUBLE", "SUITE"];
const roomStatus = [{ weight: 7, id: "AVAILABLE" }, { weight: 2 , id: "BOOKED" } , {  weight: 1, id: "MAINTENANCE" }];

export function generateRooms(count: number): {}[] {
    if (count <= 0) {
        return [];
    }
    const roomType = roomTypes[getRandomInt(0, roomTypes.length)];
    const pricePerNight = getRandomInt(150, 1000);
    const status = rwt(roomStatus);
    const imageUrl = `http://localhost:5001/rooms/${getRandomInt(1, 12)}.webp`;
    return [ {
        pricePerNight,
        roomType,
        status,
        imageUrl,
    }, generateRooms(count - 1)].flat();
}

export function generateRandomHotel() {
    const name = "Hotel" + faker.company.name();
    const address = faker.location.city() + ", " + faker.location.country();
    const rating = parseFloat(((Math.random() + 3) * 5 / 4).toFixed(2));
    const imageUrl = `http://localhost:5001/hotels/${getRandomInt(1, 7)}.webp`;
    const amenities: { id: number }[] = [];
    const rooms = generateRooms(getRandomInt(5, 20));

    for (let i = 0; i < 3; i++) {
        const id = getRandomInt(1, 6);
        if (!amenities.some(amenity => (amenity.id === id))) {

            amenities.push({ id })
        } else {
            i--;
        }
    }

    return {
        name,
        address,
        rooms,
        exactAddress: address,
        rating,
        imageUrl,
        amenities,
    };
}

const emails = new Set<string>();

export async function generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    if (emails.has(email)) {
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

