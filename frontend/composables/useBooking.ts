export function useBooking() {
  const isBookingOpen = useState('diy-booking-open', () => false)
  const handleBooking = () => { isBookingOpen.value = true }
  const closeBooking = () => { isBookingOpen.value = false }
  return { isBookingOpen, handleBooking, closeBooking }
}
