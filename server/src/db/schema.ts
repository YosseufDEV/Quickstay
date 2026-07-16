import {
    pgTable,
    pgEnum,
    foreignKey,
    uuid,
    text,
    time,
    real,
    integer,
    timestamp,
    unique,
    serial,
    primaryKey,
    index,
    check,
    boolean
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "HOTEL_OWNER", "HOTEL_STAFF", "GUEST"]);

export const bookingStatus = pgEnum("booking_status", [
    "PENDING_PAYMENT",
    "CONFIRMED",
    "CANCELLED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
    "PENDING",
    "PAID",
    "CANCELLED",
]);

export const checkInStatusEnum = pgEnum("check_in_status", [
    "NOT_CHECKED_IN",
    "CHECKED_IN",
    "CHECKED_OUT",
]);

export const roomStatusEnum = pgEnum("room_status", ["READY", "CLEANING", "MAINTENANCE"]);

export type UserRole = typeof roleEnum.enumValues[number];
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

        return { from: new Date(matches[0]?.slice(1, -1)!), to: new Date(matches[1]?.slice(1, -1)!) };
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
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});


export const amenities  = pgTable("amenities", {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
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
        checkInTime: time("check_in_time").notNull(),
        checkOutTime: time("check_out_time").notNull(),
        timeZone: text("time_zone").notNull().default("UTC"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        index("hotel_created_at_idx").on(table.createdAt),
        check("hotel_check_in_out_date_check", sql`${table.checkInTime} > ${table.checkOutTime}`),
    ]
);

export const hotelsFees = pgTable("hotels_fees", {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
    feeType: text("fee_type").notNull(),
    amount: integer("amount").notNull(),
    isPercentage: boolean("is_percentage").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
},
(table) => [
    index("hotels_fees_hotel_id_idx").on(table.hotelId),
    unique("hotels_fees_hotel_fee_type_unique").on(table.hotelId, table.feeType)
]);

export const rooms = pgTable("rooms", {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    number: integer("number").notNull(),
    status: roomStatusEnum("status").notNull().default("READY"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
},
(table) => [
    foreignKey({ name: "rooms_hotel_id_room_type_fkey", columns: [table.hotelId, table.type], foreignColumns: [hotelsCatalogs.hotelId, hotelsCatalogs.roomType] }).onDelete("cascade"),
    index("rooms_hotel_id_idx").on(table.hotelId), 
    index("rooms_hotel_status_idx").on(table.hotelId, table.status), 
    index("rooms_room_type_idx").on(table.type),
    unique("rooms_hotel_room_number_unique").on(table.hotelId, table.number)
]);

export const hotelsCatalogs = pgTable("hotels_catalogs", {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelId: uuid("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
    roomType: text("room_type").notNull().default("Standard Room"),
    imageUrl: text("image_url").notNull(),
    area: integer("area").notNull(),
    numberOfGuests: integer("number_of_guests").notNull().default(1),
    pricePerNight: integer("price_per_night").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
},

(table) => [
    index("hotel_catalog_id_idx").on(table.hotelId), 
    unique("hotel_catalog_hotel_room_type_unique").on(table.hotelId, table.roomType)
]);

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
        bookingStatus: text("booking_status").notNull().default("PENDING"),
        checkInStatus: checkInStatusEnum("check_in_status")
            .notNull()
            .default("NOT_CHECKED_IN"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
        deletedAt: timestamp("deleted_at", { withTimezone: true }),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
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
    (table) => [
        primaryKey({ columns: [table.hotelId, table.amenityId] })
    ]
);

export const payments = pgTable("payments", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => hotelsBookings.id, { onDelete: "cascade" }),
    stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
    // stripeChargeId: text("stripe_charge_id").notNull().unique(),
    // stripeRefundId: text("stripe_refund_id").unique(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: paymentStatusEnum("payment_status").notNull().default("PENDING"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const relations = defineRelations({ hotels, rooms, hotelsBookings, hotelsCatalogs, users, amenities, hotelsAmenities }, (r) => ({
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
        catalog: r.many.hotelsCatalogs({
            from: r.hotels.id,
            to: r.hotelsCatalogs.hotelId,
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
        catalog: r.one.hotelsCatalogs({
            from: r.rooms.hotelId,
            to: r.hotelsCatalogs.hotelId,
        }),
        bookings: r.many.hotelsBookings({
            from: r.rooms.id,
            to: r.hotelsBookings.roomId,
        })
    }
}));

