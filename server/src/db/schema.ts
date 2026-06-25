import {
    pgTable,
    pgEnum,
    uuid,
    text,
    real,
    integer,
    timestamp,
    serial,
    primaryKey,
    index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const bookingStatusEnum = pgEnum("booking_status", [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
]);

export const checkInStatusEnum = pgEnum("check_in_status", [
    "NOT_CHECKED_IN",
    "CHECKED_IN",
    "CHECKED_OUT",
]);

export const roomTypeEnum = pgEnum("room_type", ["SINGLE", "DOUBLE", "SUITE"]);
export const roomStatusEnum = pgEnum("room_status", ["AVAILABLE", "BOOKED", "MAINTENANCE"]);

export type UserRoles = typeof roleEnum.enumValues[number];
export type RoomType = typeof roomTypeEnum.enumValues[number];
export type RoomStatus = typeof roomStatusEnum.enumValues[number];


export const tstzrange = customType<{ data: { from: Date, to: Date } }>({
    dataType() {
        return "tstzrange";
    },

    toDriver(value) {
        const from = value.from.toISOString();
        const to = value.to.toISOString();
        return `[${from},${to}]`;
    },

    fromDriver(value) {
        if (typeof value !== 'string') {
            throw new Error(`Driver return invalid type for tstzrange: ${typeof value}`);
        }

        const matches = value.slice(1, -1).split(",");

        if (matches.length !== 2) {
            throw new Error(`Invalid tstzrange format: ${value}`);
        }

        // INFO: The +Z is to treat the date as UTC since tstzrange doesn't store the timezone
        return { from: new Date(matches[0]?.slice(1, -1)!), to: new Date(matches[1]?.slice(1, -1)!) }; // Placeholder implementation
    }
});

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    country: text("country").notNull(),
    password: text("password").notNull(),
    role: roleEnum("role").notNull().default("USER"),
});


export const amenities  = pgTable("amenities", {
    id: serial("id").primaryKey(),
    slag: text("slag").notNull().unique(),
});

export const hotels = pgTable(
    "hotels",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        rating: real("rating").notNull(),
        name: text("name").notNull(),
        exactAddress: text("exact_address").notNull(),
        address: text("address").notNull(),
        imageUrl: text("image_url").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [index("hotel_created_at_idx").on(table.createdAt)]
);

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
    roomType: roomTypeEnum("room_type").notNull().default("SINGLE"),
    status: roomStatusEnum("status").notNull().default("AVAILABLE"),
    imageUrl: text("image_url").notNull(),
    bookedBy: uuid("booked_by").references(() => users.id, { onDelete: "set null" }),
    pricePerNight: integer("price_per_night").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});


export const hotelsBookings = pgTable(
    "hotels_bookings",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        roomId: uuid("room_id")
            .notNull()
            .references(() => rooms.id, { onDelete: "cascade" }),
        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        timeRange: tstzrange("time_range").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        bookingStatus: bookingStatusEnum("booking_status")
            .notNull()
            .default("PENDING"),
        checkInStatus: checkInStatusEnum("check_in_status")
            .notNull()
            .default("NOT_CHECKED_IN"),
    },
    (table) => [
        index("hotels_bookings_room_id_idx").on(table.roomId),
        index("hotels_bookings_user_id_idx").on(table.userId),
        index("hotels_bookings_time_range_idx").using("gist", table.timeRange),
    ]
);

export const hotelsAmenities = pgTable(
    "hotels_amenities",
    {
        hotelId: uuid("hotel_id")
            .notNull()
            .references(() => hotels.id, { onDelete: "cascade" }),
        amenityId: integer("amenity_id")
            .notNull()
            .references(() => amenities.id, { onDelete: "cascade" }),
    },
    (table) => [primaryKey({ columns: [table.hotelId, table.amenityId] })]
);

export const relations = defineRelations({ hotels, rooms, hotelsBookings, users, amenities, hotelsAmenities }, (r) => ({
    hotelsBookings: {
        room: r.one.rooms({
            from: r.hotelsBookings.roomId,
            to: r.rooms.id,
        }),
        user: r.one.users({
            from: r.hotelsBookings.userId,
            to: r.users.id,
        })
    },
    hotelsAmenities: {
        hotel: r.one.hotels({
            from: r.hotelsAmenities.hotelId,
            to: r.hotels.id,
        }),
        tag: r.one.amenities({
            from: r.hotelsAmenities.amenityId,
            to: r.amenities.id,
        })
    },
    hotels: {
        amenities: r.many.amenities({
            from: r.hotels.id.through(r.hotelsAmenities.hotelId),
            to: r.amenities.id.through(r.hotelsAmenities.amenityId),
        }),
        rooms: r.many.rooms({
            from: r.hotels.id,
            to: r.rooms.hotelId,
        })
    },
    users: {
        bookings: r.many.hotelsBookings({
            from: r.users.id,
            to: r.hotelsBookings.userId,
        })
    },
    rooms: {
        hotel: r.one.hotels(),
        bookedUser: r.one.users({
            from: r.rooms.bookedBy,
            to: r.users.id,
        }),
        bookings: r.many.hotelsBookings({
            from: r.rooms.id,
            to: r.hotelsBookings.roomId,
        })
    }
}));

