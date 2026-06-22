import p from "../db/prisma";
import { insertBooking, getAllBookings } from "@/generated/prisma/sql";
import { type IBooking } from "@quickstay/types/Booking";
import type { HotelBooking } from "@/generated/prisma/client";
import camelcaseKeys from "camelcase-keys";

interface BookingData {
    userId: string;
    hotelId: string;
    startDate: Date;
    endDate: Date;
}

const prisma = p.$extends({
    client: {
        async $queryRawTypedCamel(...args: any) {
          // @ts-ignore - spreading tagged template args
          const result = await prisma.$queryRawTyped(...args);
          return camelcaseKeys(result, { deep: true });
        }
    }
});

class Booking {
    private processBooking = (booking: HotelBooking & { from_to: string | undefined, from: Date, to: Date }): IBooking => {
        const { from, to } = Booking.parseTSRangeToDates(booking.from_to!);

        booking.from_to = undefined; 
        booking.from = from as Date;
        booking.to = to as Date;

        return camelcaseKeys(booking, { deep: true }) as unknown as IBooking;
    }

    static parseTSRangeToDates(tsrange: string) {
        if(!tsrange || typeof tsrange !== 'string') {
            // throw new Error(`Invalid tsrange format: ${tsrange}`);
            return { }
        }

        const regex = /^[\[(]"?([^",)]*)"?,"?([^",)\]]*)"?[\])]$/;
        const match = tsrange.match(regex);

        if (!match || !match[1] || !match[2]) {
            // throw new Error(`Invalid tsrange format: ${tsrange}`);
            return { } 
        }

        return {
            from: new Date(match[1]),
            to: new Date(match[2])
        };
    }

    static async createBooking(data: BookingData): Promise<HotelBooking> {
        return await prisma.$queryRawTypedCamel(insertBooking(data.userId, data.hotelId, data.startDate, data.endDate)) as unknown as HotelBooking;
    }

    static async  getBookingById(id: string) {
        return await prisma.hotelBooking.findUnique({
            where: {
                id
            },
            include: {
                hotel: true,
                user: true
            }
        });
    }

    // TODO: add pagination and filtering
    static async  getAllBookings() {
        const bookings =  await prisma.$queryRawTypedCamel(getAllBookings()) as unknown as (IBooking & { fromTo: string | undefined })[];

        bookings.forEach(booking => {
            const { from, to } = Booking.parseTSRangeToDates(booking.fromTo as string);

            booking.fromTo = undefined; // Remove the original tsrange string
            booking.from = from as Date;
            booking.to = to as Date;
        });
        return bookings;
    }
}

// INFO: Benchmarking code (uncomment to run benchmarks, requires a populated database and may take time to execute)
const ITERATIONS = 1000;
const WARMUP = 50;

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[idx];
}

function stats(arr) {
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return {
    avg,
    median: percentile(arr, 50),
    p95: percentile(arr, 95),
    p99: percentile(arr, 99),
    min: Math.min(...arr),
    max: Math.max(...arr),
  };
}

// Warm-up (discarded)
for (let i = 0; i < WARMUP; i++) {
  await Booking.getAllBookings();
  await prisma.$queryRawTyped(getAllBookings());
}

const processedDurations = [];
const rawDurations = [];

for (let i = 0; i < ITERATIONS; i++) {
  const t0 = performance.now();
  await Booking.getAllBookings();
  processedDurations.push(performance.now() - t0);

  const t1 = performance.now();
  await prisma.$queryRawTyped(getAllBookings());
  rawDurations.push(performance.now() - t1);
}

console.log("Processed:", stats(processedDurations));
console.log("Raw:", stats(rawDurations));

export default Booking;
