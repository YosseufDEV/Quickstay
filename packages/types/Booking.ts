import type { IHotel } from "./Hotel";
import type { IUser } from "./User";

interface IBooking {
    id: string;
    userId: string;
    hotelId: string;
    fromTo: string; 
    hotel: IHotel;
    user: IUser;
}

export type { IBooking };
