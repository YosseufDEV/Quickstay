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

export const tsrange = customType<{ data: { from: Date, to: Date } }>({
    dataType() {
        return "tsrange";
    },

    toDriver(value) {
        const from = value.from.toISOString();
        const to = value.to.toISOString();
        return `[${from},${to}]`;
    },

    fromDriver(value) {
        if(typeof value !== 'string') {
            throw new Error(`Driver return invalid type for tsrange: ${typeof value}`);
        }

        const matches = value.slice(1, -1).split(",");

        if (matches.length !== 2) {
          throw new Error(`Invalid tsrange format: ${value}`);
        }

        return { from: new Date(matches[0]!), to: new Date(matches[1]!) }; // Placeholder implementation
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


export const tags = pgTable("tags", {
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
    pricePerNight: integer("price_per_night").notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("hotel_created_at_idx").on(table.createdAt)]
);


export const hotelsBookings = pgTable(
  "hotels_bookings",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: uuid("hotel_id")
      .notNull()
      .references(() => hotels.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fromTo: tsrange("from_to").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    bookingStatus: bookingStatusEnum("booking_status")
      .notNull()
      .default("PENDING"),
    checkInStatus: checkInStatusEnum("check_in_status")
      .notNull()
      .default("NOT_CHECKED_IN"),
  },
  (table) => [
    index("hotels_bookings_hotel_id_idx").on(table.hotelId),
    index("hotels_bookings_user_id_idx").on(table.userId),
    index("hotels_bookings_from_to_idx").using("gist", table.fromTo),
  ]
);

export const hotelsTags = pgTable(
  "hotels_tags",
  {
    hotelId: uuid("hotel_id")
      .notNull()
      .references(() => hotels.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.hotelId, table.tagId] })]
);

export const relations = defineRelations({ hotels, hotelsBookings, users, tags, hotelsTags }, (r) => ({
    hotelsBookings: {
        hotel: r.one.hotels({
            from: r.hotelsBookings.hotelId,
            to: r.hotels.id,
        }),
        user: r.one.users({
            from: r.hotelsBookings.userId,
            to: r.users.id,
        })
    },
    hotelsTags: {
        hotel: r.one.hotels({
            from: r.hotelsTags.hotelId,
            to: r.hotels.id,
        }),
        tag: r.one.tags({
            from: r.hotelsTags.tagId,
            to: r.tags.id,
        })
    },
    hotels: {
        bookings: r.many.hotelsBookings({
            from: r.hotels.id,
            to: r.hotelsBookings.hotelId,
        }),
        tags: r.many.tags({
            from: r.hotels.id.through(r.hotelsTags.hotelId),
            to: r.tags.id.through(r.hotelsTags.tagId),
        })
    },
    users: {
        bookings: r.many.hotelsBookings({
            from: r.users.id,
            to: r.hotelsBookings.userId,
        })
    },
}));

