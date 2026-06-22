type slag = "wifi" | "breakfast" | "mountain" | "service" | "pool";

enum SortOptions {
    PRICE = "price",
    CREATED_AT = "created_At",
    RATING = "rating",
    PRICE_RANGE = "price_range"
}

interface ITag {
    id: number;
    slag: slag;
}

interface IHotel {
    id: string;
    name: string;
    address: string;
    exactAddress: string;
    pricePerNight: number;
    rating: number;
    imageUrl: string;
    tags: ITag[];
}

export { type slag, type IHotel, type ITag };
