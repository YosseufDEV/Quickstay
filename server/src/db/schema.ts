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

export const tsrange = customType<{ data: string }>({
  dataType() {
    return "tsrange";
  },
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
  name: text("name").notNull().unique(),
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


export const hotelBookings = pgTable(
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

export const hotelTags = pgTable(
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
