import type { BookingResponse } from "@/api/booking";
import { createContext, useContext } from "react";

export const BookingContext = createContext({ booking: null as BookingResponse["booking"] | null, formId: null as string | null, setProcessing: null as ((processing: boolean) => void) | null });

export const useBooking = () => {
    const context = useContext(BookingContext);

    if (!context) {
        throw new Error("useBooking must be used within a BookingContext.Provider");
    }

    return context;
}

    
