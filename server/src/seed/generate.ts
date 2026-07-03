import { faker } from "@faker-js/faker";
import rwt from "random-weighted-choice";
import { type UserRole } from "../db/schema.ts";

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const roomTypes = ["Single Standard Room", "Double Standard Room", "Comfort Room", "Deluxe Room", "Suite", "Presidential Suite"];
const roomStatus = [{ weight: 7, id: "AVAILABLE" }, {  weight: 1, id: "MAINTENANCE" }];
const roomsNumbers = new Map<number, boolean>();

export function generateRooms(count: number, hotelId: string, catalog): {}[] {
    const room = () => {
        const id = crypto.randomUUID();
        const roomType = catalog[getRandomInt(0, catalog.length)].roomType;
        const status = rwt(roomStatus);
        const roomNumber = getRandomInt(1, 999);

        if(roomsNumbers.has(roomNumber)) {
            return room();
        }
        roomsNumbers.set(roomNumber, true);

        return {
            id,
            hotelId,
            roomType,
            roomNumber,
            status,
        }

    }


    return Array.from({ length: count }).map(() => room());
}

const roomTypesCatalog = ["Single Standard Room", "Double Standard Room", "Comfort Room", "Deluxe Room", "Suite", "Presidential Suite", "Single Room", "Double Room", "Triple Room", "Quadruple Room", "Family Room", "Studio Room"];

export function generateRandomHotel() {
    roomsNumbers.clear();

    const id = crypto.randomUUID();
    const name = "Hotel " + faker.company.name();
    const address = faker.location.city() + ", " + faker.location.country();
    const rating = parseFloat(((Math.random() + 3) * 5 / 4).toFixed(2));
    const imageUrl = `http://localhost:5001/hotels/${getRandomInt(1, 7)}.webp`;
    const amenities: { amenityId: number, hotelId: string }[] = [];

    const typeMap = new Map<string, boolean>();

    const f_catalog = () => {
        const roomType = roomTypesCatalog[getRandomInt(0, roomTypesCatalog.length)]!;
        const pricePerNight = getRandomInt(50, 500);
        const imageUrl = `http://localhost:5001/rooms/${getRandomInt(1, 7)}.webp`;
        const numberOfGuests = getRandomInt(1, 5);
        const area = getRandomInt(20, 100);

        if(typeMap.has(roomType)) {
            return f_catalog();
        }

        typeMap.set(roomType, true);

        return {
            hotelId: id,
            roomType,
            pricePerNight,
            imageUrl,
            numberOfGuests,
            area,
        }
    }

    const catalog = Array.from({ length: getRandomInt(3, 6) }).map(f_catalog);

    const rooms = generateRooms(getRandomInt(5, 20), id, catalog);

    for (let i = 0; i < 3; i++) {
        const a_id = getRandomInt(1, 6);
        if (!amenities.some(amenity => (amenity.amenityId === a_id))) {

            amenities.push({ amenityId: a_id, hotelId: id });
        } else {
            i--;
        }
    }

    return {
        id,
        name,
        address,
        rooms,
        exactAddress: address,
        catalog,
        rating,
        imageUrl,
        amenities,
    };
}

const emails = new Set<string>();

export function generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    if (emails.has(email)) {
        return generateUser();

    }
    emails.add(email);
    const password = faker.internet.password();
    const country = faker.location.country();
    const role: UserRole = "USER";
    return {
        firstName,
        lastName,
        email,
        password,
        country,
        role,
    }
}

