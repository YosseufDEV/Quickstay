import api from "./client";

const getHotels = async (limit?: number) => {
    return await api.get("/hotels", { params: { limit } }).then((res) => res.data.payload.hotels).catch((err) => {
        console.error("Error fetching hotels:", err);
        return [];
  });
}

export { getHotels };
