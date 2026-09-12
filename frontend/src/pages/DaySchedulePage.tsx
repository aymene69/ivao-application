import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { getBookingsByDate } from '../api/bookings';
import { getErrorMessage } from '../api/errors';
import { Booking } from '../types/booking';

interface HoverState {
  booking: Booking;
  x: number;
  y: number;
}

const HOUR_MARKS = [0, 3, 6, 9, 12, 15, 18, 21];

function toIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(iso: string, delta: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + delta);
  return toIsoDate(d);
}

function formatHeaderDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface PositionRow {
  position: string;
  bookings: Booking[];
}

export function DaySchedulePage() {
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBookingsByDate(date)
      .then(setBookings)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [date]);

  const dayStart = useMemo(() => new Date(`${date}T00:00:00`), [date]);
  const dayEnd = useMemo(() => {
    const d = new Date(dayStart);
    d.setDate(d.getDate() + 1);
    return d;
  }, [dayStart]);

  const rows: PositionRow[] = useMemo(() => {
    const byPosition = new Map<string, Booking[]>();
    for (const booking of bookings) {
      const list = byPosition.get(booking.position) ?? [];
      list.push(booking);
      byPosition.set(booking.position, list);
    }
    return Array.from(byPosition.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([position, positionBookings]) => ({ position, bookings: positionBookings }));
  }, [bookings]);

  const isToday = date === toIsoDate(new Date());
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!isToday) return undefined;
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [isToday]);

  function fraction(d: Date): number {
    const clamped = Math.min(Math.max(d.getTime(), dayStart.getTime()), dayEnd.getTime());
    return (clamped - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime());
  }

  const showNowLine = isToday && now >= dayStart && now < dayEnd;

  const [hover, setHover] = useState<HoverState | null>(null);

  function handleBlockHover(e: MouseEvent, booking: Booking) {
    setHover({ booking, x: e.clientX, y: e.clientY });
  }

  return (
    <section>
      <h2>Day schedule</h2>

      <div className="day-toolbar">
        <button type="button" className="day-nav-btn" onClick={() => setDate((d) => addDays(d, -1))} aria-label="Previous day">
          ‹
        </button>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="button" className="day-nav-btn" onClick={() => setDate((d) => addDays(d, 1))} aria-label="Next day">
          ›
        </button>
        <button type="button" onClick={() => setDate(toIsoDate(new Date()))}>
          Today
        </button>
        <span className="day-toolbar-label">{formatHeaderDate(date)}</span>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading &&
        !error &&
        (rows.length === 0 ? (
          <p className="empty-state">No bookings for this day.</p>
        ) : (
          <div className="schedule">
            <div className="schedule-ruler">
              <div className="schedule-row-label" />
              <div className="schedule-hours">
                {HOUR_MARKS.map((h) => (
                  <span key={h} style={{ left: `${(h / 24) * 100}%` }}>
                    {String(h).padStart(2, '0')}:00
                  </span>
                ))}
              </div>
            </div>

            <div className="schedule-body">
              {rows.map((row) => (
                <div className="schedule-row" key={row.position}>
                  <div className="schedule-row-label">{row.position}</div>
                  <div className="schedule-track">
                    {showNowLine && <div className="now-line" style={{ left: `${fraction(now) * 100}%` }} />}
                    {row.bookings.map((booking) => {
                      const left = fraction(new Date(booking.fromTime)) * 100;
                      const right = fraction(new Date(booking.toTime)) * 100;
                      const width = Math.max(right - left, 0.8);
                      return (
                        <div
                          key={booking.id}
                          className={`schedule-block schedule-block-${booking.type.toLowerCase()}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                          onMouseEnter={(e) => handleBlockHover(e, booking)}
                          onMouseMove={(e) => handleBlockHover(e, booking)}
                          onMouseLeave={() => setHover((h) => (h?.booking.id === booking.id ? null : h))}
                        >
                          <span className="schedule-block-time">
                            {formatTime(booking.fromTime)}–{formatTime(booking.toTime)}
                          </span>
                          <span className="schedule-block-vid">{booking.vid}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {hover && (
        <div
          className={`schedule-tooltip${hover.y < 90 ? ' schedule-tooltip-below' : ''}`}
          style={{ left: hover.x, top: hover.y }}
        >
          <strong>{hover.booking.position}</strong>
          <span>
            {formatTime(hover.booking.fromTime)}–{formatTime(hover.booking.toTime)}
          </span>
          <span>
            VID {hover.booking.vid} ({hover.booking.rating}) · {hover.booking.type}
          </span>
        </div>
      )}
    </section>
  );
}
