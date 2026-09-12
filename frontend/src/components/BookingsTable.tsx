import { Booking } from '../types/booking';

interface Props {
  bookings: Booking[];
  currentVid?: string;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
}

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function TypeBadge({ type }: { type: Booking['type'] }) {
  const className = type === 'NORMAL' ? 'badge' : `badge badge-${type.toLowerCase()}`;
  return <span className={className}>{type}</span>;
}

export function BookingsTable({ bookings, currentVid, onEdit, onDelete }: Props) {
  const showActions = Boolean(onEdit || onDelete);

  if (bookings.length === 0) {
    return <p className="empty-state">No bookings found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>VID</th>
            <th>Rating</th>
            <th>Type</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const from = formatDateTime(booking.fromTime);
            const to = formatDateTime(booking.toTime);
            const isMine = currentVid && booking.vid === currentVid;
            return (
              <tr key={booking.id}>
                <td>{booking.position}</td>
                <td className="mono">{from.date}</td>
                <td className="mono">{from.time}</td>
                <td className="mono">
                  {to.time}
                  {to.date !== from.date && <span className="muted"> ({to.date})</span>}
                </td>
                <td className="mono">{booking.vid}</td>
                <td>
                  <span className="badge">{booking.rating}</span>
                </td>
                <td>
                  <TypeBadge type={booking.type} />
                </td>
                {showActions && (
                  <td>
                    {isMine ? (
                      <>
                        {onEdit && (
                          <button type="button" onClick={() => onEdit(booking)}>
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button type="button" onClick={() => onDelete(booking)}>
                            Delete
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
