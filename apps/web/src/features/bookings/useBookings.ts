import { useState, useEffect } from 'react';
import { Booking } from '@socio-do-tabuleiro/shared';
import { apiClient, handleApiError } from '../../lib/apiClient';

export const useBookings = (autoFetch: boolean = true) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const bookingsData = await apiClient.bookings.getMy();
      setBookings(bookingsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const newBooking = await apiClient.bookings.create(sessionId);
      setBookings(prev => [newBooking, ...prev]);

      return newBooking;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const confirmedBooking = await apiClient.bookings.confirm(id);
      setBookings(prev => prev.map(b => (b.id === id ? confirmedBooking : b)));

      return confirmedBooking;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient.bookings.cancel(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    confirmBooking,
    cancelBooking,
    refetch: fetchBookings,
  };
};
