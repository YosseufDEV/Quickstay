type slag = "wifi" | "breakfast" | "mountain" | "service" | "pool";

interface ITag {
    id: number;
    text: string;
    slag: slag;
}

interface IHotel {
    id?: string;
    name: string;
    address: string;
    exactAddress: string;
    pricePerNight: number;
    rating: number;
    imageUrl: string;
    tags: ITag[];
}

export { slag, IHotel, ITag };
