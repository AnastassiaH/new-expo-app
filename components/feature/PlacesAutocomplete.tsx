import { DEFAULT_ERROR_MESSAGE } from '@/constants';
import { fetchAutocompletePredictions, getPlaceData } from '@/services/places.service';
import { LocationPoint, PlaceCoords, PlacePrediction, UserLocationData } from '@/types';
import { debounce } from 'lodash';
import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  onPlaceSelect: (place: LocationPoint | null) => void;
  currentCoords?: PlaceCoords,
  currentLocationData?: UserLocationData,
  placeholder?: string
  minCharsToFetch?: number
  currentEnabled?: boolean
  onError: (msg: string) => void
}

interface TextInputRef {
  focus: () => void;
  clear: () => void;
}

const PlacesAutocomplete = React.forwardRef<TextInputRef, Props>(
  (
    {
      onPlaceSelect,
      currentCoords,
      currentLocationData,
      placeholder,
      onError,
      currentEnabled = false,
      minCharsToFetch = 2,
    },
    ref
  ) => {
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [placeSelected, setPlaceSelected] = useState<PlacePrediction | null>(null)
    const [error, setError] = useState(false)

    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => inputRef.current?.clear(),
    }));


    const handleSearch = async (query: string, city?: string) => {
      if (query?.length < minCharsToFetch || !city) return
      if (error) return

      setLoading(true)

      try {
        const predictions = await fetchAutocompletePredictions(query, currentCoords);
        const filteredPredictions = predictions.filter(prediction => prediction.description?.includes(city))
        const currentAdresses = currentLocationData?.addresses;

        if (predictions.length === 1) {
          handleSelect(predictions[0])
          return
        }

        if (currentAdresses?.[0].formatted_address?.includes(query) && currentEnabled) {
          setPredictions([...currentAdresses, ...filteredPredictions])
        } else {
          setPredictions([...filteredPredictions])
        }
      } catch (err: any) {
        onError(err?.message || DEFAULT_ERROR_MESSAGE)
        setPredictions([]);
      } finally {
        setLoading(false)
      }
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

    const handleOnBlur = () => {
      if (!query) {
        setError(false)
        return
      }

      if (predictions?.length > 0) {
        setError(false)
      } else if (!placeSelected) {
        setError(true)
      }
    }

    const handleChange = (value: string) => {
      setPlaceSelected(null)
      setQuery(value);
      debouncedSearch(value, currentLocationData?.city);
    }

    const handleSelect = async (place: PlacePrediction) => {
      setLoading(true)
      setError(false)
      setPredictions([])

      const placeData = await getPlaceData(place.place_id)
      if (!placeData) {
        setError(true)
        return
      } else {
        onPlaceSelect(placeData)
      }

      setPlaceSelected(place)
      setQuery(place?.description || place?.formatted_address)
      setLoading(false)
    }

    const handleClear = () => {
      setQuery('')
      setPredictions([])
      setError(false)
      setPlaceSelected(null)
      onPlaceSelect(null)
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={placeholder || 'Search for a place'}
            placeholderTextColor="#000"
            value={query}
            onChangeText={handleChange}
            onBlur={handleOnBlur}
            onFocus={() => setError(false)}
            style={[styles.input, error && styles.errorInput]}
            numberOfLines={1}
            multiline={false}
            ref={inputRef}
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
        {!loading && query?.length > minCharsToFetch && predictions?.length > 0 && (
          <FlatList
            style={styles.predictionsContainer}
            data={predictions}
            keyExtractor={(item) => `${item.place_id}`}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={styles.predictionItem}>
                <Text style={styles.predictionText}>{item.formatted_address || item.description || 'No address'}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
)

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
    borderRadius: 4,
    paddingHorizontal: 40,
    color: '#000',
    width: '100%',
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#ff0000',
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
