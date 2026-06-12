import api from "./client";

const getHotels = async (limit?: number) => {
    return await api.get("/hotels", { params: { limit } }).then((res) => res.data.payload.hotels).catch((err) => {
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

export { getHotels, getHotelById };
