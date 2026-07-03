type slug = "wifi" | "breakfast" | "mountain" | "service" | "pool";

enum SortOptions {
    PRICE = "price",
    CREATED_AT = "created_At",
    RATING = "rating",
    PRICE_RANGE = "price_range"
}

interface IAmenities {
    id: number;
    slug: slug;
}

interface IRoom {
    id: string;
    hotelId: string;
    roomNumber: number;
    name: string;
}

interface IHotel {
    id: string;
    name: string;
    address: string;
    exactAddress: string;
    rating: number;
    imageUrl: string;
    amenities: IAmenities[];
    rooms: IRoom[];
    catalog: {
        roomType: string;
        pricePerNight: number;
        imageUrl: string;
        available: number;
    }[]
}

export { type slug, type IHotel, type IAmenities };
