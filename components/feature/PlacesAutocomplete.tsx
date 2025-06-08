import { useRegionData } from '@/hooks/useRegionData';
import { fetchAutocompletePredictions, getAddressFromCoords, getPlaceData } from '@/services/places.service';
import { useLocationStore } from '@/stores/locationStore';
import { LocationPoint, PlacePrediction } from '@/types';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  onPlaceSelect: (place: LocationPoint) => void;
  placeholder?: string
  minCharsToFetch?: number
}

const homeAddress = false;

const PlacesAutocomplete: React.FC<Props> = ({ onPlaceSelect, placeholder, minCharsToFetch = 2 }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [regionPredictions, setRegionPredictions] = useState<PlacePrediction[]>([])
  const locationData = useLocationStore(state => state.location)
  const { regionData } = useRegionData()
  const [loading, setLoading] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<PlacePrediction | null>(null)
  const [predictedAddresses, setPredictedAddresses] = useState<PlacePrediction[] | null>(null)
  const [placesToRender, setPlacesToRender] = useState<PlacePrediction[] | null>(null)

  // getting user location address
  useEffect(() => {
    if (homeAddress) return
    if (!locationData?.coords.latitude || !locationData?.coords.longitude) return

    setLoading(true)
    const getLocationAddress = async () => {
      const locationAddress = await getAddressFromCoords(locationData.coords.latitude, locationData.coords.longitude);
      console.log('locationAddress', locationAddress.slice(0, 2))
      setPredictedAddresses(locationAddress.slice(0, 2))
      setLoading(false)
    }
    getLocationAddress()
  }, [homeAddress]) // locationData

  // getting predictions by users query
  useEffect(() => {
    if (loading) return
    if (query?.length < minCharsToFetch) return
    if (placeSelected) return
    if (!locationData?.coords.latitude || !locationData?.coords.longitude) return

    setLoading(true)

    const getPredictions = async () => {
      const predictions = await fetchAutocompletePredictions(query, locationData);
      setPredictions(predictions)
    }

    getPredictions()
    setLoading(false)
  }, [query])

  // filtering predictions by region
  useEffect(() => {
    if (!predictions.length || loading) return

    setRegionPredictions(predictions.filter(prediction => prediction.description?.includes(regionData?.region || '')))
  }, [predictions, query, loading])

  // setting data to render
  useEffect(() => {
    if (loading) return

    const dataToRender = predictedAddresses?.[0].formatted_address?.includes(query) ? [...(predictedAddresses || []), ...regionPredictions] : regionPredictions
    setPlacesToRender(dataToRender)
  }, [regionPredictions, query, predictedAddresses, loading])

  const handleSelect = async (place: PlacePrediction) => {
    setLoading(true)

    const placeCoords = await getPlaceData(place.place_id)

    setRegionPredictions([])
    setPlaceSelected(place)
    onPlaceSelect(placeCoords)
    setQuery(place.description)
    setLoading(false)
  }

  const handleClear = () => {
    setQuery('')
    setPredictions([])
    setRegionPredictions([])
    setPlaceSelected(null)
    setPlacesToRender(null)
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder || 'Search for a place'}
          placeholderTextColor="#000"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        {query && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
      {!loading && query.length > minCharsToFetch && (
        <FlatList
          style={styles.predictionsContainer}
          data={placesToRender?.length ? placesToRender : []}
          keyExtractor={(item) => `${item.place_id}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.predictionItem}>
              <Text style={styles.predictionText}>{item.formatted_address || item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 40,
    borderRadius: 8,
    color: '#000',
    width: '100%',
    backgroundColor: '#fff',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: '-50%' }],
    padding: 5,
    backgroundColor: 'transparent',
  },
  clearButtonText: {
    fontSize: 20,
    color: '#666',
  },
  predictionsContainer: {
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  predictionItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  predictionText: {
    fontSize: 14,
    flex: 1,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: 25,
    lineHeight: 25,
  },
});

export default PlacesAutocomplete;
