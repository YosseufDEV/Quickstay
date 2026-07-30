import api from "./client";

const getHotels = async (limit?: number, offset?: number, sortBy?: string, order?: string) => {
    return await api.get("/hotels", { params: { limit, offset } }).then((res) => res.data.payload.hotels).catch((err) => {
        console.error("Error fetching hotels:", err);
        return [];
  });
}

const getHotelById = async (id: string) => {
    return await api.get(`/hotels/${id}`).then((res) => res.data.payload.hotel).catch((err) => {
        console.error(`Error fetching hotel with id ${id}:`, err);
        return null;
    });

}

export interface AvailabilityResponse {
    hotelId: string
    availability: {
        typeId: string
        isAvailalbe: boolean
    }[]
}

const checkAvailability = async (hotelId: string, checkIn: Date, checkOut: Date): Promise<AvailabilityResponse> => {
    const { data } = await api.post(`/hotels/${hotelId}/availability`, { checkIn, checkOut });
    return data.payload as AvailabilityResponse;
}

export { getHotels, getHotelById, checkAvailability };
