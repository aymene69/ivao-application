import { useState } from 'react';
import { useVid } from '../context/VidContext';
import { RatingLevel } from '../types/booking';

const RATINGS: RatingLevel[] = ['AS1', 'AS2', 'AS3', 'ADC', 'APC', 'ACC', 'SEC'];

export function VidInput() {
  const { vid, setVid, rating, setRating } = useVid();
  const [draft, setDraft] = useState(vid);

  return (
    <form
      className="vid-input"
      onSubmit={(e) => {
        e.preventDefault();
        setVid(draft.trim());
      }}
    >
      <label htmlFor="vid">Your VID</label>
      <input
        id="vid"
        type="text"
        inputMode="numeric"
        placeholder="e.g. 123456"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />

      <label htmlFor="rating">Rating</label>
      <select id="rating" value={rating} onChange={(e) => setRating(e.target.value as RatingLevel)}>
        {RATINGS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <button type="submit">Save</button>
      {vid && (
        <span className="vid-status">
          Identified as {vid} · {rating}
        </span>
      )}
    </form>
  );
}
