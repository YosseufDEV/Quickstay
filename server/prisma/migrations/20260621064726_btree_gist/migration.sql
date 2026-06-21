-- This is an empty migration.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "HotelBooking"
ADD CONSTRAINT no_overlapping_bookings  
EXCLUDE USING gist (
  hotel_id WITH =,
  from_to WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));
