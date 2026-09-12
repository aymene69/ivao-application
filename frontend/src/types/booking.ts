export type BookingType = 'NORMAL' | 'TRAINING' | 'EVENT' | 'EXAM';

export type RatingLevel = 'AS1' | 'AS2' | 'AS3' | 'ADC' | 'APC' | 'ACC' | 'SEC';

export interface Booking {
  id: number;
  vid: string;
  rating: RatingLevel;
  position: string;
  fromTime: string;
  toTime: string;
  type: BookingType;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInput {
  position: string;
  fromTime: string;
  toTime: string;
  type?: BookingType;
}
