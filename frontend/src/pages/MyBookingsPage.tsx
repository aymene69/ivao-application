import { useCallback, useEffect, useState } from 'react';
import { useVid } from '../context/VidContext';
import { createBooking, deleteBooking, getFutureBookings, updateBooking } from '../api/bookings';
import { getErrorMessage } from '../api/errors';
import { BookingForm } from '../components/BookingForm';
import { BookingsTable } from '../components/BookingsTable';
import { Booking, BookingInput } from '../types/booking';

export function MyBookingsPage() {
  const { vid } = useVid();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    return getFutureBookings()
      .then(setBookings)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!vid) {
    return (
      <section>
        <h2>My bookings</h2>
        <p>Enter your VID above to manage your bookings.</p>
      </section>
    );
  }

  const myBookings = bookings.filter((b) => b.vid === vid);

  async function handleCreate(input: BookingInput) {
    await createBooking(input);
    await refresh();
  }

  async function handleUpdate(input: BookingInput) {
    if (!editing) return;
    await updateBooking(editing.id, input);
    setEditing(null);
    await refresh();
  }

  async function handleDelete(booking: Booking) {
    if (!window.confirm(`Delete booking on ${booking.position}?`)) {
      return;
    }
    try {
      await deleteBooking(booking.id);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section>
      <h2>My bookings</h2>

      {editing ? (
        <div className="card">
          <h3>Edit booking</h3>
          <BookingForm
            key={editing.id}
            initial={editing}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <div className="card">
          <h3>Book a position</h3>
          <BookingForm key="create" submitLabel="Book position" onSubmit={handleCreate} />
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <BookingsTable bookings={myBookings} currentVid={vid} onEdit={setEditing} onDelete={handleDelete} />
      )}
    </section>
  );
}
