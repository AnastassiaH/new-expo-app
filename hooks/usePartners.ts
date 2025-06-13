import { useState, useEffect, useCallback } from 'react';
import { getPartners } from '@/services/api.service';
import useRideStore from '@/stores/rideStore';
import usePartnersStore from '@/stores/partnersStore';
import { PartnerData } from '@/types';

export const usePartners = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { activeRide } = useRideStore();
  const { partners, setPartners } = usePartnersStore();

  const fetchPartners = useCallback(async () => {
    if (!activeRide?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getPartners(activeRide.id);
      setPartners(response as PartnerData[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [activeRide?.id, setPartners]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPartners().finally(() => setRefreshing(false));
  }, [fetchPartners]);

  return {
    isLoading,
    error,
    refreshing,
    partners,
    handleRefresh,
  };
};
