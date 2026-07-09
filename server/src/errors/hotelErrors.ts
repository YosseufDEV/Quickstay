import { AppError } from "@/errors/errors";
import { DrizzleQueryError } from "drizzle-orm";

export const isCheckInDateSmallerThanCheckOutDateError = (err: unknown): boolean => {
    if(!(err instanceof DrizzleQueryError)) {
        return false;
    }
    const cause = err.cause;
    return (cause as any)?.constraint == "hotel_check_in_out_date_check";
    
}

export class HotelError extends AppError {
    constructor(message: string, statusCode?: number) {
        super(message, statusCode || 400);
        this.name = "HotelError";
    }

}
