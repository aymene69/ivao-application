import { useEffect, useState } from 'react';
import { getFutureBookings } from '../api/bookings';
import { getErrorMessage } from '../api/errors';
import { BookingsTable } from '../components/BookingsTable';
import { Booking } from '../types/booking';

export function FutureBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFutureBookings()
      .then(setBookings)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Future bookings</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && <BookingsTable bookings={bookings} />}
    </section>
  );
}
