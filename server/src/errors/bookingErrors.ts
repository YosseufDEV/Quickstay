import { DrizzleQueryError } from "drizzle-orm";
import { AppError } from "./errors";

export const isOverlappingDatesError = (err: any): boolean => {
    if(!(err instanceof DrizzleQueryError)) {
        return false;
    }
    const cause = err.cause;
    return (cause as any)?.constraint == "no_overlapping_bookings";
}

export class BookingError extends AppError {
    constructor(message: string, code?: number, originalError?: Error) {
        super(message, code || 400, originalError);
        this.name = "BookingError";
    }
}
