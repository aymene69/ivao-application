import { apiClient } from './client';
import { Booking, BookingInput } from '../types/booking';

export async function getFutureBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>('/bookings');
  return data;
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>('/bookings', { params: { date } });
  return data;
}

export async function getCurrentBookingForPosition(position: string): Promise<Booking | null> {
  const { data } = await apiClient.get<Booking | null>('/bookings/current', { params: { position } });
  return data;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const { data } = await apiClient.post<Booking>('/bookings', input);
  return data;
}

export async function updateBooking(id: number, input: Partial<BookingInput>): Promise<Booking> {
  const { data } = await apiClient.patch<Booking>(`/bookings/${id}`, input);
  return data;
}

export async function deleteBooking(id: number): Promise<void> {
  await apiClient.delete(`/bookings/${id}`);
}
