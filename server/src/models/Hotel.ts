import { Optional } from "@/utils/optional";
import drizzle from "@/db/drizzle";
import { hotels, rooms, amenities as s_amenities, hotelsAmenities, hotelsCatalogs, hotelsFees } from "../db/schema";
import Room from "./Room";
import { desc, eq, inArray, sql, exists, and } from "drizzle-orm";
import { HotelError, isCheckInDateSmallerThanCheckOutDateError } from "@/errors/hotelErrors";
import type { drizzle as d } from "drizzle-orm/node-postgres";

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

interface HotelFee {
    feeType: string
    amount: number
    isPercentage: boolean
}

interface HotelAmenity {
    id: number,
    slug: string
}

interface HotelCatalog {
    hotelId?: string,
    roomType: string,
    pricePerNight: number
    area: number
    imageUrl: string 
}

interface HotelRoom { 
    id?: string
    hotelId?: string
    type: string
    number: number
    status?: string
}

interface HotelData {
    id?: string
    name: string
    address: string
    exactAddress: string
    checkInTime: string,
    checkOutTime: string,
    timeZone: string,
    rating: number
    imageUrl: string
    fees?: HotelFee[]
    amenities?: { id: number }[]
    catalog?: HotelCatalog[]
    rooms?: HotelRoom[]
}

interface RowHotelData {
    hotel: Omit<HotelData, "rooms"> & { id: string };
    rooms: HotelRoom | null,
    catalog: { hotelId: string, catalog: HotelCatalog[] } | null,
    amenities: {
        hotelId: string,
        amenities: HotelAmenity[]
    } | null
    // amenities: { id: number, slug: string }[]
}

class Hotel {
    private static generateCatalogQuery = (drizzle: ReturnType<typeof d>) => {
        const catalogQuery = drizzle.select({
            hotelId: hotelsCatalogs.hotelId,
            catalog: 
                sql<HotelCatalog[]>`
                    json_agg(json_build_object(
                        'roomType', ${hotelsCatalogs.roomType}, 
                        'area', ${hotelsCatalogs.area}, 
                        'numberOfGuests', ${hotelsCatalogs.numberOfGuests}, 
                        'imageUrl', ${hotelsCatalogs.imageUrl}, 
                        'pricePerNight', ${hotelsCatalogs.pricePerNight}))`.as('catalog') 
        })
            .from(hotelsCatalogs)
            .groupBy(hotelsCatalogs.hotelId).as("catalog");

        return catalogQuery;
    }

    static processRawHotelData(rawData: RowHotelData[]) {
        const hotelMap = new Map<string, HotelData & { id: string }>();

        for (const row of rawData) {
            const hotelId = row.hotel.id;

            if(!hotelMap.has(hotelId)) {
                hotelMap.set(hotelId, {
                    ...row.hotel,
                    ...Optional("amenities", row.amenities?.amenities, row.amenities?.amenities),
                    ...Optional("catalog", row.catalog?.catalog, row.catalog?.catalog),
                    rooms: []
                })
            }

            if(row.rooms) hotelMap.get(hotelId)!.rooms?.push(row.rooms);
        }

        const hotelsArray = Array.from(hotelMap.values());
   
        return hotelsArray.length == 1 ? hotelsArray[0] : hotelsArray;
    }

    static async createCatalog(catalog: (HotelCatalog & { hotelId: string })[]) {
        return await drizzle.insert(hotelsCatalogs).values(catalog).returning().then((catalog) => catalog)!;
    }

    static async createHotel({ fees, rooms, amenities, catalog, ...hotelData }: HotelData) {
        const [hotel] = await drizzle.insert(hotels).values({
            ...hotelData,
        }).
            returning()
            .catch((err) => {
                if(isCheckInDateSmallerThanCheckOutDateError(err)) {
                    throw new HotelError("check_in_time_before_check_out_time");
                }
                throw err;
            });

        if (!hotel) {
            throw new Error("Failed to create hotel");
        }

        if (amenities && amenities.length !== 0) {
            await drizzle.insert(hotelsAmenities).values(
                amenities.map(amentiy => ({
                    hotelId: hotel.id,
                    amenityId: amentiy.id
                }))
            )
        }

        if(catalog?.length) {
            catalog = await Hotel.createCatalog(catalog.map(room => ({...room, hotelId: hotel.id })));
        }

        if(rooms?.length) {
            rooms = await Room.createRoom(rooms.map(room => ({...room, hotelId: hotel.id })));
        }

        if(fees?.length) {
            await drizzle.insert(hotelsFees).values(
                fees.map(fee => ({
                    hotelId: hotel.id,
                    feeType: fee.feeType,
                    amount: fee.amount,
                    isPercentage: fee.isPercentage
                }))
            );
        }

        const createdTags = await drizzle.select({ id: s_amenities.id, slug: s_amenities.slug }).from(hotelsAmenities).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).where(eq(hotelsAmenities.hotelId, hotel.id));

        return { ...hotel, amenities: createdTags, catalog, rooms };
    }

    // TEST: Test the sorting and pagination of the hotels list
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
            amenities: sql<HotelAmenity[]>`json_agg(json_build_object('id', ${s_amenities.id}, 'slug', ${s_amenities.slug}))`.as("amenities"),
        }).from(hotelsAmenities).where(inArray(hotelsAmenities.hotelId, hotelIdsSq)).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).groupBy(hotelsAmenities.hotelId).as("amenities");


        const catalogQuery = this.generateCatalogQuery(drizzle);

        const dbHotels = await drizzle.select()
                                    .from(paginatedHotels)
                                    .leftJoin(amenitiesQuery, eq(paginatedHotels.id, amenitiesQuery.hotelId))
                                    .leftJoin(rooms, eq(paginatedHotels.id, rooms.hotelId))
                                    .leftJoin(catalogQuery, eq(paginatedHotels.id, catalogQuery.hotelId));

        return this.processRawHotelData(dbHotels);

    }

    static async getHotelById(hotelId: string) {
        const hotelSq = drizzle.select().from(hotels).where(eq(hotels.id, hotelId)).as("hotel");

        const amenitiesQuery = drizzle.select({
            hotelId: hotelsAmenities.hotelId,
            amenities: sql<HotelAmenity[]>`json_agg(json_build_object('id', ${s_amenities.id}, 'slug', ${s_amenities.slug}))`.as("amenities"),
        })
            .from(hotelsAmenities)
            .where(eq(hotelsAmenities.hotelId, hotelId))
            .innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id))
            .groupBy(hotelsAmenities.hotelId)
            .as("amenities");

        const catalogQuery = this.generateCatalogQuery(drizzle);

        const hotel = await drizzle.select()
            .from(hotelSq)
            .where(eq(hotelSq.id, hotelId))
            .leftJoin(amenitiesQuery, eq(hotelSq.id, amenitiesQuery.hotelId))
            .leftJoin(rooms, eq(hotelSq.id, rooms.hotelId))
            .leftJoin(catalogQuery, eq(hotelSq.id, catalogQuery.hotelId))

        return this.processRawHotelData(hotel);
     }

     static async getHotelCatalogById(hotelId: string) {
        const catalogQuery = this.generateCatalogQuery(drizzle);
        return await drizzle.select().from(catalogQuery).where(eq(catalogQuery.hotelId, hotelId)).then((result) => result[0]?.catalog || {});
    }

     static async hasRoomType(hotelId: string, roomType: string) {
         return (
                ( await drizzle
                        .select()
                        .from(hotelsCatalogs)
                        .where(and(eq(hotelsCatalogs.hotelId, hotelId), eq(hotelsCatalogs.roomType, roomType)))
                        .limit(1)
                        .execute()
                        .then((result) => result) 
                      )
                        .length == 1 
         );
     }

}

export default Hotel;
