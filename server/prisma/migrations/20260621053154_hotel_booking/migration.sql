-- This is an empty migration.

ALTER TABLE "HotelBooking"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  hotel_id WITH =,
  from_to WITH &&
)
WHERE (status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));
