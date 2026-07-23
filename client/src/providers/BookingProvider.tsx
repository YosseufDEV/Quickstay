import { BookingContext } from "@/hooks/useBooking"

const BookingProvider = ({ children, booking, formId, setProcessing } ) => {
  return (
    <BookingContext.Provider value={{ booking, formId, setProcessing }}>
      {children}
    </BookingContext.Provider>
  )
}

export default BookingProvider
