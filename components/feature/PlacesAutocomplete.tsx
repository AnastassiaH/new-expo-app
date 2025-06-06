import { useRegionData } from '@/hooks/useRegionData';
import { fetchAutocompletePredictions, getPlaceCoordinates } from '@/services/places.service';
import { useLocationStore } from '@/stores/locationStore';
import { PlacePoint } from '@/types';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  }
}

interface Props {
  onPlaceSelect: (place: PlacePoint) => void;
  placeholder?: string
}

const PlacesAutocomplete: React.FC<Props> = ({ onPlaceSelect, placeholder }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [regionPredictions, setRegionPredictions] = useState<PlacePrediction[]>([])
  const locationData = useLocationStore(state => state.location)
  const { regionData } = useRegionData()
  const [loading, setLoading] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<PlacePrediction | null>(null)

  useEffect(() => {
    if (placeSelected) return
    if (!locationData?.coords.latitude || !locationData?.coords.longitude) return
    const getPredictions = async () => {
      setLoading(true)
      const predictions = await fetchAutocompletePredictions(query, locationData);
      setPredictions(predictions)
      setLoading(false)
    }
    getPredictions()
  }, [locationData, query])

  useEffect(() => {
    if (!predictions.length) return

    setRegionPredictions(predictions.filter(prediction => prediction.description.includes(regionData?.region || '')))
  }, [predictions])

  const handleSelect = async (place: PlacePrediction) => {
    setLoading(true)

    const placeCoords = await getPlaceCoordinates(place.place_id)

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
      {regionPredictions.length > 0 && (
        <FlatList
          data={regionPredictions}
          keyExtractor={(item) => `${item.place_id}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.predictionItem}>
              <Text>{item.description}</Text>
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
    paddingHorizontal: 15,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#000',
    width: '100%',
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
  predictionItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});

export default PlacesAutocomplete;
