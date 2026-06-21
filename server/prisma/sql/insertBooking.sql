INSERT INTO "HotelBooking" (user_id, hotel_id, from_to)
VALUES ($1, $2, tsrange($3, $4, '[]'));
