import { useCurrentLocationData } from '@/hooks/useCurrentLocationData';
import { fetchAutocompletePredictions, getPlaceData } from '@/services/places.service';
import { LocationPoint, PlacePrediction } from '@/types';
import React, { useEffect, useState } from 'react';
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
  const [placesToRender, setPlacesToRender] = useState<PlacePrediction[] | null>(null)


  useEffect(() => {
    if (!currentLocationData) return

    console.log('currentLocationData', currentLocationData)
    console.log('currentCoords', currentCoords)

  }, [currentLocationData, currentCoords])

  // getting predictions by users query
  useEffect(() => {
    if (query?.length < minCharsToFetch) return
    if (placeSelected?.place_id) return
    if (!currentCoords?.latitude || !currentCoords?.longitude) return

    setLoading(true)

    const getPredictions = async () => {
      const predictions = await fetchAutocompletePredictions(query, currentCoords);
      console.log('predictions', predictions)

      const filteredPredictions = predictions.filter(prediction => prediction.description?.includes(currentLocationData?.city || ''))
      console.log('filteredPredictions', filteredPredictions)
      setPredictions(filteredPredictions)
    }

    getPredictions()
    setLoading(false)
  }, [query, currentCoords])

  // setting data to render 
  useEffect(() => {
    if (loading) return
    const predictedAdresses = currentLocationData?.addresses;

    if (predictedAdresses?.[0].formatted_address?.includes(query) && currentEnabled) {
      setPlacesToRender([...predictedAdresses.slice(0, 2), ...predictions])
    } else {
      setPlacesToRender([...predictions])
    }

  }, [query, predictions, currentEnabled])


  // actions
  const handleSelect = async (place: PlacePrediction) => {
    setLoading(true)

    const placeCoords = await getPlaceData(place.place_id)
    if (!placeCoords) return

    setPlaceSelected(place)
    onPlaceSelect(placeCoords)
    setQuery(place?.description || place?.formatted_address)
    setLoading(false)
  }

  const handleClear = () => {
    setQuery('')
    setPredictions([])
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
      {!loading && query?.length > minCharsToFetch && predictions?.length && !placeSelected?.place_id && (
        <FlatList
          style={styles.predictionsContainer}
          data={placesToRender}
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
