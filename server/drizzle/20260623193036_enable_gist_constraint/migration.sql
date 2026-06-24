-- Custom SQL migration file, put your code below! --
ALTER TABLE hotels_bookings
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  room_id WITH =,
  time_range WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));
