import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  // The booking draft persists across page navigation so the customer can
  // pick a decoration, optionally log in, and then submit without losing state.
  const [bookingDraft, setBookingDraft] = useState({
    eventType: '',
    decorationId: '',
    decorationName: '',
    decoratorSuggestion: false,
    customerName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    venue: '',
    //landmark: '',
    guests: '',
    requirements: '',
  });
  const [lastBooking, setLastBooking] = useState(null);

  const updateDraft = useCallback((updates) => {
    setBookingDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetDraft = useCallback(() => {
    setBookingDraft({
      eventType: '',
      decorationId: '',
      decorationName: '',
      decoratorSuggestion: false,
      customerName: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      venue: '',

      guests: '',
      requirements: '',
    });
  }, []);

  const value = { bookingDraft, updateDraft, resetDraft, lastBooking, setLastBooking };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
