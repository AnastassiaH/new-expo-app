import RideForm from '@/components/feature/RideForm';
import { useCitySelectorStore } from '@/stores/cityStore';
import { useLocationStore } from '@/stores/locationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

describe('CitySelector', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    useLocationStore.setState({ location: null });
    await AsyncStorage.clear();
  });

  it('shows CitySelector modal when no location and no city in AsyncStorage', async () => {
    const { getByTestId, queryByTestId } = render(
      <RideForm />
    );

    const input = getByTestId('from-input');

    fireEvent(input, 'focus');

    await waitFor(() => {
      expect(useCitySelectorStore.getState().selectorVisible).toBe(true)
    });
  });
});