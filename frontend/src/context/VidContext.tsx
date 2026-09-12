import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RatingLevel } from '../types/booking';

const VID_STORAGE_KEY = 'ivao-booking-vid';
const RATING_STORAGE_KEY = 'ivao-booking-rating';

interface VidContextValue {
  vid: string;
  setVid: (vid: string) => void;
  rating: RatingLevel;
  setRating: (rating: RatingLevel) => void;
}

const VidContext = createContext<VidContextValue | undefined>(undefined);

function getInitialRating(): RatingLevel {
  const stored = localStorage.getItem(RATING_STORAGE_KEY);
  return (stored as RatingLevel | null) ?? 'AS1';
}

export function VidProvider({ children }: { children: ReactNode }) {
  const [vid, setVidState] = useState<string>(() => localStorage.getItem(VID_STORAGE_KEY) ?? '');
  const [rating, setRatingState] = useState<RatingLevel>(getInitialRating);

  useEffect(() => {
    if (vid) {
      localStorage.setItem(VID_STORAGE_KEY, vid);
    } else {
      localStorage.removeItem(VID_STORAGE_KEY);
    }
  }, [vid]);

  useEffect(() => {
    localStorage.setItem(RATING_STORAGE_KEY, rating);
  }, [rating]);

  return (
    <VidContext.Provider value={{ vid, setVid: setVidState, rating, setRating: setRatingState }}>
      {children}
    </VidContext.Provider>
  );
}

export function useVid(): VidContextValue {
  const ctx = useContext(VidContext);
  if (!ctx) {
    throw new Error('useVid must be used within a VidProvider');
  }
  return ctx;
}
