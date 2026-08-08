import { Faker, faker } from "@faker-js/faker";
import rwt from "random-weighted-choice";
import { type UserRole } from "../db/schema.ts";

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomDate(start: Date, end: Date) {
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  
  // Calculate a random time value between the two timestamps
  const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  
  return new Date(randomTimestamp);
}


const roomStatus = [{ weight: 7, id: "READY" }, {  weight: 1, id: "MAINTENANCE" }, { weight: 2, id: "CLEANING" }];
const roomsNumbers = new Map<number, boolean>();
const roomTypesCatalog = [
            "Single Standard Room", 
            "Double Standard Room", 
            "Comfort Room", 
            "Deluxe Room", 
            "Suite", 
            "Presidential Suite", 
            "Single Room", 
            "Double Room", "Triple Room", "Quadruple Room", "Family Room", "Studio Room"];
const roomTypesCatalogIds = roomTypesCatalog.map((type) => ({ id: crypto.randomUUID(), roomType: type }));

export function generateRooms(count: number, hotelId: string, catalog): {}[] {
    const room = () => {
        const id = crypto.randomUUID();
        const typeId = catalog[getRandomInt(0, catalog.length)].id;
        const status = rwt(roomStatus);
        const roomNumber = getRandomInt(1, 900);

        if(roomsNumbers.has(roomNumber)) {
            return room();
        }
        roomsNumbers.set(roomNumber, true);

        return {
            id,
            hotelId,
            typeId,
            number: roomNumber,
            status,
        }

    }

    return Array.from({ length: count }).map(() => room());
}

export function generateRandomHotel() {
    roomsNumbers.clear();
    
    const id = crypto.randomUUID();
    const name = "Hotel " + faker.company.name();
    const address = faker.location.streetAddress();
    const country = faker.location.country();
    const city = faker.location.city();

    const rating = parseFloat(((Math.random() + 3) * 5 / 4).toFixed(2));
    const imageUrl = `http://localhost:5001/hotels/${getRandomInt(1, 7)}.webp`;
    const amenities: { amenityId: number, hotelId: string }[] = [];
    const currency = faker.finance.currencyCode();

    const typeMap = new Map<string, boolean>();

    const f_catalog = () => {
        const f_id = crypto.randomUUID();
        const roomType = roomTypesCatalog[getRandomInt(0, roomTypesCatalog.length)]!;
        const pricePerNight = getRandomInt(50, 500);
        const imageUrl = `http://localhost:5001/rooms/${getRandomInt(1, 7)}.webp`;
        const numberOfGuests = getRandomInt(1, 5);
        const area = getRandomInt(4, 20);

        if(typeMap.has(roomType)) {
            return f_catalog();
        }

        typeMap.set(roomType, true);

        return {
            id: f_id,
            hotelId: id,
            roomType,
            pricePerNight,
            imageUrl,
            numberOfGuests,
            area,
        }
    }

    const feesMap = new Map<string, boolean>();

    const generateFee = () => {
        const feeType = faker.commerce.product();
        const amount = getRandomInt(5, 50);

        if(feesMap.has(feeType)) {
            return generateFee();
        }
        feesMap.set(feeType, true);

        return {
            hotelId: id,
            feeType,
            percentage: amount,
        }
    }

    const fees = Array.from({ length: getRandomInt(2, 4) }).map(generateFee);
    const catalog = Array.from({ length: getRandomInt(3, 6) }).map(f_catalog);

    const rooms = generateRooms(200, id, catalog);

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
        country,
        city,
        rooms,
        fees,
        currency,
        checkInTime: "18:00:00",
        checkOutTime: "14:00:00",
        timeZone: faker.location.timeZone(),
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

