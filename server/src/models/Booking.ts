import drizzle from "../db/drizzle";
import { hotelsBookings } from "../db/schema";

interface BookingData {
    userId: string;
    hotelId: string;
    from: Date;
    to: Date;
}

class Booking {
    static async createBooking(data: BookingData): Promise<any> {
        return await drizzle.insert(hotelsBookings).values({
            hotelId: data.hotelId,
            userId: data.userId,
            fromTo: {
                from: data.from,
                to: data.to
            }
        }).returning().then(([booking]) => booking)!;
    }

    static async  getBookingById(id: string) {
        return await drizzle.query.hotelsBookings.findFirst({
            where: {
                id
            },
            with: {
                hotel: true,
                user: true
            }
        });
    }

    // TODO: add pagination and filtering
    static async  getAllBookings() {
        const bookings =  await drizzle.query.hotelsBookings.findMany({
            with: {
                hotel: true,
                user: true
            }
        });

        return bookings;
    }
}

// INFO: Benchmarking code (uncomment to run benchmarks, requires a populated database and may take time to execute)
// const ITERATIONS = 1000;
// const WARMUP = 50;
//
// function percentile(arr, p) {
//   const sorted = [...arr].sort((a, b) => a - b);
//   const idx = Math.ceil((p / 100) * sorted.length) - 1;
//   return sorted[idx];
// }
//
// function stats(arr) {
//   const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
//   return {
//     avg,
//     median: percentile(arr, 50),
//     p95: percentile(arr, 95),
//     p99: percentile(arr, 99),
//     min: Math.min(...arr),
//     max: Math.max(...arr),
//   };
// }
//
// // Warm-up (discarded)
// for (let i = 0; i < WARMUP; i++) {
//   await Booking.getAllBookings();
//   await prisma.$queryRawTyped(getAllBookings());
// }
//
// const processedDurations = [];
// const rawDurations = [];
//
// for (let i = 0; i < ITERATIONS; i++) {
//   const t0 = performance.now();
//   await Booking.getAllBookings();
//   processedDurations.push(performance.now() - t0);
//
//   const t1 = performance.now();
//   await prisma.$queryRawTyped(getAllBookings());
//   rawDurations.push(performance.now() - t1);
// }
//
// console.log("Processed:", stats(processedDurations));
// console.log("Raw:", stats(rawDurations));
//
// export default Booking;
