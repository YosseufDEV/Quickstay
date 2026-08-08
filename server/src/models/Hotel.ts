import { Optional } from "@/utils/optional";
import drizzle, { type Transaction } from "@/db/drizzle";
import { hotels, rooms, amenities as s_amenities, hotelsAmenities, hotelsCatalogs, hotelsFees } from "../db/schema";
import Room from "./Room";
import { eq, inArray, sql, and } from "drizzle-orm";
import { HotelError, isCheckInDateSmallerThanCheckOutDateError } from "@/errors/hotelErrors";
import type { drizzle as d } from "drizzle-orm/node-postgres";

export interface HotelFee {
    feeType: string
    // TODO: Rename this to percentage
    amount: number
}

export interface HotelAmenity {
    id: number,
    slug: string
}

export interface HotelCatalog {
    id?: string,
    hotelId?: string,
    roomType: string,
    pricePerNight: number
    area: number
    imageUrl: string 
}

export interface HotelRoom { 
    id?: string
    hotelId?: string
    typeId: string
    number: number
    status?: string
}

interface Hotel {
    id: string
    name: string
    address: string
    country: string
    city: string
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
    hotel: Omit<Hotel, "rooms"> & { id: string };
    rooms?: { hotelId: string, rooms: HotelRoom[] | null },
    catalog?: { hotelId: string, catalog: HotelCatalog[] } | null,
    amenities?: {
        hotelId: string,
        amenities: HotelAmenity[]
    } | null
    // amenities: { id: number, slug: string }[]
}

class Hotel {
    private static generateCatalogQuery = (drizzle: ReturnType<typeof d> | Transaction) => {
        const catalogQuery = drizzle.select({
            hotelId: hotelsCatalogs.hotelId,
            catalog: 
                sql<HotelCatalog[]>`
                    json_agg(
                        json_build_object(
                            'id', ${hotelsCatalogs.id},
                            'roomType', ${hotelsCatalogs.roomType}, 
                            'area', ${hotelsCatalogs.area}, 
                            'numberOfGuests', ${hotelsCatalogs.numberOfGuests}, 
                            'imageUrl', ${hotelsCatalogs.imageUrl}, 
                            'pricePerNight', ${hotelsCatalogs.pricePerNight}
                        )
                    )`
                .as('catalog') 
        })
            .from(hotelsCatalogs)
            .groupBy(hotelsCatalogs.hotelId).as("catalog");

        return catalogQuery;
    }

    private static generateRoomsQuery = (drizzle: ReturnType<typeof d> | Transaction, whereClause?: any) => {
        return drizzle
                    .select({
                        hotelId: rooms.hotelId,
                        rooms: sql<HotelRoom>`
                            json_agg(
                                json_build_object(
                                    'id', ${rooms.id},
                                    'hotelId', ${rooms.hotelId},
                                    'number', ${hotelsCatalogs.numberOfGuests},
                                    'status', ${rooms.status},
                                    'type', ${hotelsCatalogs.roomType}
                                )
                            )`.as("rooms"),
                    })
                    .from(rooms)
                    .innerJoin(hotelsCatalogs, eq(rooms.typeId, hotelsCatalogs.id))
                    .where(whereClause ?? sql`TRUE`)
                    .groupBy(rooms.hotelId)
                    .as("rooms")
    }

    static processRawHotelData(rawData: RowHotelData[]) {
        const hotels = [];

        for (const row of rawData) {
            hotels.push({
                ...row.hotel,
                ...Optional("amenities", row.amenities?.amenities, row.amenities?.amenities),
                ...Optional("catalog", row.catalog?.catalog, row.catalog?.catalog),
                ...Optional("rooms", row.rooms, row.rooms?.rooms),
            })
        }
   
        return hotels.length == 1 ? hotels[0] : hotels;
    }

    static async createCatalog(catalog: (HotelCatalog & { hotelId: string })[]) {
        return await drizzle.insert(hotelsCatalogs).values(catalog).returning().then((catalog) => catalog)!;
    }

    static async createHotel({ fees, rooms, amenities, catalog, ...hotelData }: Omit<Hotel, "id"> & { id?: string }) {
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
                    percentage: fee.amount,
                }))
            );
        }

        const createdTags = await drizzle.select({ id: s_amenities.id, slug: s_amenities.slug }).from(hotelsAmenities).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).where(eq(hotelsAmenities.hotelId, hotel.id));

        return { ...hotel, amenities: createdTags, catalog, rooms };
    }

    // TEST: Test the sorting and pagination of the hotels list
    static async getHotels(limit?: number, offset?: number, sortBy?: string, order?: "asc" | "desc", withRooms: boolean = false) {
        const paginatedHotels = drizzle.select()
                                .from(hotels)
                                .offset(offset || 0)
                                .limit(limit || 20)
                                .as("hotel")
        const hotelsIdsQ = drizzle.select({ id: paginatedHotels.id }).from(paginatedHotels);

        const amenitiesQuery = drizzle.select({
            hotelId: hotelsAmenities.hotelId,
            amenities: sql<HotelAmenity[]>`json_agg(json_build_object('id', ${s_amenities.id}, 'slug', ${s_amenities.slug}))`.as("amenities"),
        }).from(hotelsAmenities).where(inArray(hotelsAmenities.hotelId, hotelsIdsQ)).innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id)).groupBy(hotelsAmenities.hotelId).as("amenities");


        const catalogQuery = this.generateCatalogQuery(drizzle);

        let hotelsQ = drizzle.select()
                                    .from(paginatedHotels)
                                    .leftJoin(amenitiesQuery, eq(paginatedHotels.id, amenitiesQuery.hotelId))
                                    .leftJoin(catalogQuery, eq(paginatedHotels.id, catalogQuery.hotelId));
        if(withRooms) {
            const roomsQuery = this.generateRoomsQuery(drizzle, inArray(rooms.hotelId, hotelsIdsQ));
            hotelsQ = hotelsQ
                        .leftJoin(
                            roomsQuery,
                            eq(roomsQuery.hotelId, hotels.id)
                        )
        }

        return this.processRawHotelData(await hotelsQ);

    }

    static async getHotelById(hotelId: string, tx?: Transaction, withRooms: boolean = false): Promise<Hotel>{
        const hotelSq = (tx ?? drizzle).select().from(hotels).where(eq(hotels.id, hotelId)).as("hotel");

        const amenitiesQuery = (tx ?? drizzle).select({
            hotelId: hotelsAmenities.hotelId,
            amenities: sql<HotelAmenity[]>`json_agg(json_build_object('id', ${s_amenities.id}, 'slug', ${s_amenities.slug}))`.as("amenities"),
        })
            .from(hotelsAmenities)
            .where(eq(hotelsAmenities.hotelId, hotelId))
            .innerJoin(s_amenities, eq(hotelsAmenities.amenityId, s_amenities.id))
            .groupBy(hotelsAmenities.hotelId)
            .as("amenities");

        const catalogQuery = this.generateCatalogQuery(tx ?? drizzle);

        let hotelQ = (tx ?? drizzle).select()
            .from(hotelSq)
            .leftJoin(amenitiesQuery, eq(hotelSq.id, amenitiesQuery.hotelId))
            .leftJoin(catalogQuery, eq(hotelSq.id, catalogQuery.hotelId))
            .where(eq(hotelSq.id, hotelId))

        if(withRooms) {
            const roomsQuery = this.generateRoomsQuery(drizzle);
            hotelQ = hotelQ.leftJoin(roomsQuery, eq(hotelSq.id, roomsQuery.hotelId))
        }

        return this.processRawHotelData(await hotelQ) as unknown as Hotel;
     }

     static async getHotelCatalogById(hotelId: string) {
        const catalogQuery = this.generateCatalogQuery(drizzle);
        return await drizzle.select().from(catalogQuery).where(eq(catalogQuery.hotelId, hotelId)).then((result) => result[0]?.catalog || {});
    }

     static async hasRoomType(hotelId: string, roomTypeId: string) {
         return (
                ( await drizzle
                        .select()
                        .from(hotelsCatalogs)
                        .where(and(eq(hotelsCatalogs.hotelId, hotelId), eq(hotelsCatalogs.id, roomTypeId)))
                        .limit(1)
                        .execute()
                        .then((result) => result) 
                      )
                        .length == 1 
         );
     }

}

export default Hotel;
