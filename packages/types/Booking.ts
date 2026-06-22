import type { IHotel } from "./Hotel";
import type { IUser } from "./User";

interface IBooking extends IHotel, IUser {
    id: string;
    userId: string;
    hotelId: string;
    from: Date; 
    to: Date; 
}

export type { IBooking };
