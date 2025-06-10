import { useCurrentLocationData } from '@/hooks/useCurrentLocationData';
import { fetchAutocompletePredictions, getPlaceData } from '@/services/places.service';
import { LocationPoint, PlacePrediction } from '@/types';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  onPlaceSelect: (place: LocationPoint) => void;
  placeholder?: string
  minCharsToFetch?: number
  currentEnabled?: boolean
}

const PlacesAutocomplete: React.FC<Props> = ({ onPlaceSelect, placeholder, currentEnabled = false, minCharsToFetch = 2 }) => {
  const { currentLocationData, currentCoords } = useCurrentLocationData()
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<PlacePrediction | null>(null)

  const handleSearch = async (query: string, city?: string) => {
    if (query?.length < minCharsToFetch || !city) return

    setLoading(true)

    const predictions = await fetchAutocompletePredictions(query, currentCoords);
    const filteredPredictions = predictions.filter(prediction => prediction.description?.includes(city))
    const currentAdresses = currentLocationData?.addresses;

    if (currentAdresses?.[0].formatted_address?.includes(query) && currentEnabled) {
      setPredictions([...currentAdresses.slice(0, 2), ...filteredPredictions])
    } else {
      setPredictions([...filteredPredictions])
    }

    setLoading(false)
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  const handleChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value, currentLocationData?.city);
  }

  const handleSelect = async (place: PlacePrediction) => {
    setLoading(true)

    const placeCoords = await getPlaceData(place.place_id)
    if (!placeCoords) {
      console.log('placeCoords not found')
      return
    }

    setPlaceSelected(place)
    onPlaceSelect(placeCoords)
    setQuery(place?.description || place?.formatted_address)
    setLoading(false)
  }

  const handleClear = () => {
    setQuery('')
    setPredictions([])
    setPlaceSelected(null)
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder || 'Search for a place'}
          placeholderTextColor="#000"
          value={query}
          onChangeText={handleChange}
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
      {!loading && query?.length > minCharsToFetch && predictions?.length && !placeSelected?.place_id && (
        <FlatList
          style={styles.predictionsContainer}
          data={predictions}
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
