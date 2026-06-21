SELECT * FROM "HotelBooking" JOIN "Hotel" ON hotel_id = "Hotel".id JOIN "User" ON user_id = "User".id WHERE "HotelBooking".id = $1;
