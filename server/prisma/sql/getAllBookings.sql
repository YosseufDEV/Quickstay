SELECT 
    "HotelBooking".from_to::text, 
    "HotelBooking".booking_status, 
    "HotelBooking".check_in_status,
    "HotelBooking".user_id,
    "HotelBooking".hotel_id,
    "Hotel".*,
    "User".*
    FROM "HotelBooking" JOIN "User" ON "HotelBooking".user_id = "User".id JOIN "Hotel" ON "HotelBooking".hotel_id = "Hotel".id LIMIT 30;
