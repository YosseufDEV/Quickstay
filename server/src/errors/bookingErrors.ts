import { DrizzleQueryError } from "drizzle-orm";
import { AppError } from "./errors";

export const isOverlappingDatesError = (err: any): boolean => {
    if(!(err instanceof DrizzleQueryError)) {
        return false;
    }
    const cause = err.cause;
    return (cause as any)?.constraint == "no_overlapping_bookings";
}

export const isDuplicateBookingError = (err: any): boolean => {
    if(!(err instanceof DrizzleQueryError)) {
        return false;
    }
    const cause = err.cause;
    return (cause as any)?.constraint == "hotels_bookings_room_type_time_range_user_id_unique";
}

export class BookingError extends AppError {
    constructor(message: string, code?: number, originalError?: Error) {
        super({ message, statusCode: code || 400, originalError });
        this.name = "BookingError";
    }
}
