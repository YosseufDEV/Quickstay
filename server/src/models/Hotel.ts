import { Optional } from "@/utils/optional";
import drizzle from "../db/drizzle";
import { hotels, rooms, amenities as s_amenities, hotelsAmenities, type RoomType, hotelsCatalogs } from "../db/schema";
import Room from "./Room";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

const AllowedFields = new Set(["price", "createdAt", "rating"]);

const getSortingOptions = (sortBy: string | undefined, order: "asc" | "desc" = "desc") => {
    if (!sortBy || !AllowedFields.has(sortBy)) return { createdAt: "desc" };
    const orderBy = order === "desc" ? desc : (field: any) => field;


    switch (sortBy) {
        case "id":
            return orderBy(hotels.id);
        case "rating":
            return orderBy(hotels.rating);
        case "createdAt":
            return orderBy(hotels.createdAt);
        default:
            return orderBy(hotels.createdAt);
    }
}

interface HotelData {
    name: string;
    address: string;
    exactAddress: string;
    rating: number;
    imageUrl: string;
    amenities: { id: number }[];
    counts: { roomType: RoomType, availableCount: number }[];
    catalog: {
        roomType: string;
        imageUrl: string;
        pricePerNight: number;
        area: number;

    }[],
    rooms: {
        id: string;
        roomType: string;
        roomNumber: number;
        status: string;
        imageUrl: string;
    }[];
}

interface RowHotelData {
    hotel: Omit<HotelData, "amenities" | "rooms"> & { id: string, amenities: any[] };
    rooms: {
        id: string;
        pricePerNight: number;
        roomType: RoomType;
        status: string;
        imageUrl: string;
    },
    roomsCounts?: { hotelId: string, catalog: { roomType: RoomType, available: number, pricePerNight: number }[] },
    amenities?: {
        hotelId: string,
        amenities: { id: number, slug: string }[]
    }
    // amenities: { id: number, slug: string }[]
}

class Hotel {
    static roomCatalogSQ = drizzle.select({ 
        hotelId: rooms.hotelId,
        roomType: rooms.roomType,
        count: sql`COUNT(${rooms.id})`.as("cnt")
    })
        .from(rooms)
        .where(eq(rooms.status, "AVAILABLE"))
        .groupBy(rooms.hotelId, rooms.roomType).as("hotelCatalog");

    static roomsCatalogQ = drizzle.select({
        hotelId: this.roomCatalogSQ.hotelId,
        catalog: 
            sql`
                json_agg(json_build_object(
                    'roomType', ${this.roomCatalogSQ.roomType}, 
                    'area', ${hotelsCatalogs.area}, 
                    'numberOfGuests', ${hotelsCatalogs.numberOfGuests}, 
                    'imageUrl', ${hotelsCatalogs.imageUrl}, 
                    'available', ${this.roomCatalogSQ.count}, 
                    'pricePerNight', ${hotelsCatalogs.pricePerNight}))`.as('catalog') 
    })
        .from(hotelsCatalogs)
        .innerJoin(this.roomCatalogSQ, and(eq(hotelsCatalogs.hotelId, this.roomCatalogSQ.hotelId), eq(hotelsCatalogs.roomType, this.roomCatalogSQ.roomType)))
        .groupBy(this.roomCatalogSQ.hotelId).as("roomsCounts");

    static processRawHotelData(rawData: RowHotelData[]) {
        const hotelMap = new Map<string, HotelData & { id: string }>();

        for (const row of rawData) {
            const hotelId = row.hotel.id;

            if(!hotelMap.has(hotelId)) {
                hotelMap.set(hotelId, {
                    ...row.hotel,
                    ...Optional("amenities", row.amenities?.amenities, row.amenities?.amenities),
                    ...Optional("catalog", row.roomsCounts?.catalog, row.roomsCounts?.catalog),
                    rooms: []
                })
            }

            hotelMap.get(hotelId)!.rooms.push(row.rooms);
        }

        const hotelsArray = Array.from(hotelMap.values());
   
        return hotelsArray.length == 1 ? hotelsArray[0] : hotelsArray;
    }

    static async createCatalog(catalog: { roomType: RoomType, imageUrl: string, pricePerNight: number, hotelId: string }[]) {
        await drizzle.insert(hotelsCatalogs).values(catalog);
    }

    static async createHotel({ rooms, amenities, catalog, ...hotelData }: HotelData) {
        const [hotel] = await drizzle.insert(hotels).values({
            ...hotelData,
        }).returning();

        if (!hotel) {
            throw new Error("Failed to create hotel");
        }

        if (amenities.length !== 0) {
            await drizzle.insert(hotelsAmenities).values(
                amenities.map(amentiy => ({
                    hotelId: hotel.id,
                    amenityId: amentiy.id
                }))
            )
        }

        if(catalog && catalog.length !== 0) {
            await Hotel.createCatalog(catalog.map(room => ({...room, hotelId: hotel.id })));
        }

        if(rooms && rooms.length !== 0) {
            await Room.createRoom(rooms.map(room => ({...room, hotelId: hotel.id })));
        }

        const createdTags = await drizzle.select({ id: s_amenities.id, slug: s_amenities.slug }).from(hotelsAmenities).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).where(eq(hotelsAmenities.hotelId, hotel.id));

        return { ...hotel, amenities: createdTags };
    }

    static async getHotels(limit?: number, offset?: number, sortBy?: string, order?: "asc" | "desc") {
        const paginatedHotels = drizzle.select()
                                .from(hotels)
                                .offset(offset || 0)
                                .limit(limit || 20)
                                .orderBy(getSortingOptions(sortBy, order))
                                .as("hotel")

        const hotelIdsSq = drizzle.select({ id: paginatedHotels.id }).from(paginatedHotels);

        const amenitiesQuery = drizzle.select({
            hotelId: hotelsAmenities.hotelId,
            amenities: sql`json_agg(json_build_object('id', ${s_amenities.id}, 'slug', ${s_amenities.slug}))`.as("amenities"),
        }).from(hotelsAmenities).where(inArray(hotelsAmenities.hotelId, hotelIdsSq)).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).groupBy(hotelsAmenities.hotelId).as("amenities");


        const dbHotels = await drizzle.select()
                                    .from(paginatedHotels)
                                    .leftJoin(amenitiesQuery, eq(paginatedHotels.id, amenitiesQuery.hotelId))
                                    .leftJoin(rooms, eq(paginatedHotels.id, rooms.hotelId))
                                    .leftJoin(this.roomsCatalogQ, eq(paginatedHotels.id, this.roomsCatalogQ.hotelId));
        return this.processRawHotelData(dbHotels as unknown as RowHotelData[]);

    }

    static async getHotelById(hotelId: string) {
        const hotelSq = drizzle.select().from(hotels).where(eq(hotels.id, hotelId)).as("hotel");

        const amenitiesQuery = drizzle.select({
            hotelId: hotelsAmenities.hotelId,
            amenities: sql`json_agg(json_build_object('id', ${s_amenities.id}, 'slug', ${s_amenities.slug}))`.as("amenities"),
        }).from(hotelsAmenities).where(eq(hotelsAmenities.hotelId, hotelId)).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).groupBy(hotelsAmenities.hotelId).as("amenities");

        const hotel = await drizzle.select()
            .from(hotelSq)
            .where(eq(hotelSq.id, hotelId))
            .leftJoin(amenitiesQuery, eq(hotelSq.id, amenitiesQuery.hotelId))
            .leftJoin(rooms, eq(hotelSq.id, rooms.hotelId))
            .leftJoin(this.roomsCatalogQ, eq(hotelSq.id, this.roomsCatalogQ.hotelId))

        return this.processRawHotelData(hotel);
    }
}

export default Hotel;
