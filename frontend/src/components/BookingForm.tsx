import { FormEvent, useMemo, useState } from 'react';
import { Booking, BookingInput, BookingType } from '../types/booking';
import { suggestPositions } from '../utils/positions';
import { getErrorMessage } from '../api/errors';

interface Props {
  initial?: Booking;
  submitLabel: string;
  onSubmit: (input: BookingInput) => Promise<void>;
  onCancel?: () => void;
}

const BOOKING_TYPES: BookingType[] = ['NORMAL', 'TRAINING', 'EVENT', 'EXAM'];

function toLocalInputValue(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BookingForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [position, setPosition] = useState(initial?.position ?? '');
  const [fromTime, setFromTime] = useState(toLocalInputValue(initial?.fromTime));
  const [toTime, setToTime] = useState(toLocalInputValue(initial?.toTime));
  const [type, setType] = useState<BookingType>(initial?.type ?? 'NORMAL');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const positionSuggestions = useMemo(() => suggestPositions(position), [position]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!position.trim() || !fromTime || !toTime) {
      setError('Please fill in position, from and to.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        position: position.trim().toUpperCase(),
        fromTime: new Date(fromTime).toISOString(),
        toTime: new Date(toTime).toISOString(),
        type,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <label htmlFor="position">Position (callsign)</label>
      <input
        id="position"
        type="text"
        list="position-suggestions"
        placeholder="e.g. LFPG_APP"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        autoComplete="off"
      />
      <datalist id="position-suggestions">
        {positionSuggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>

      <label htmlFor="fromTime">From</label>
      <input id="fromTime" type="datetime-local" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />

      <label htmlFor="toTime">To</label>
      <input id="toTime" type="datetime-local" value={toTime} onChange={(e) => setToTime(e.target.value)} />

      <label htmlFor="type">Type</label>
      <select id="type" value={type} onChange={(e) => setType(e.target.value as BookingType)}>
        {BOOKING_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
