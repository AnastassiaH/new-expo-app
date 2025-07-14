import { DEFAULT_ERROR_MESSAGE } from '@/constants';
import { fetchAutocompletePredictions, getPlaceData } from '@/services/places.service';
import { LocationPoint, PlaceCoords, PlacePrediction } from '@/types';
import { useFocusEffect } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  onPlaceSelect: (place: LocationPoint | null) => void;
  searchCoords: PlaceCoords,
  predictedAddresses?: PlacePrediction[],
  city: string,
  placeholder?: string
  minCharsToFetch?: number
  onFocus?: () => void
  onError: (msg: string) => void,
  testID?: string
  active?: boolean
  isValidationError?: boolean
  clearValidationErrors?: () => void
}

interface TextInputRef {
  focus: () => void;
  clear: () => void;
}

const PlacesAutocomplete = React.forwardRef<TextInputRef, Props>(
  (
    {
      onPlaceSelect,
      searchCoords,
      predictedAddresses,
      city,
      placeholder,
      onError,
      minCharsToFetch = 2,
      onFocus,
      testID,
      active,
      isValidationError,
      clearValidationErrors
    },
    ref
  ) => {
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const theme = useTheme()
    const [value, setValue] = useState('')

    const inputRef = useRef<TextInput>(null);

    useFocusEffect(
      useCallback(() => {
        return () => {
          setValue('')
          setPredictions([])
        }
      }, [])
    )

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      clear: () => inputRef.current?.clear(),
    }));

    const handleSearch = async (query: string, city: string, searchCoords: PlaceCoords, predictedAddresses?: PlacePrediction[]) => {
      if (query?.length < minCharsToFetch || !city) return
      if (error) return

      setLoading(true)

      try {
        const predictions = await fetchAutocompletePredictions(query, searchCoords);
        const filteredPredictions = predictions.filter(prediction => prediction.description?.includes(city))

        if (predictions.length === 1) {

          handleSelect(predictions[0])
          return
        }

        if (predictedAddresses?.[0]?.formatted_address?.includes(query)) {
          setPredictions([...predictedAddresses, ...filteredPredictions])
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
      if (!value) {
        setError(false)
        return
      }

      if (predictions?.length > 0) {
        setError(false)
      }
      // else if (!placeSelected) {
      //   setError(true)
      // }
    }

    const handleChange = (value: string) => {
      clearValidationErrors?.()
      setValue(value);
      debouncedSearch(value, city, searchCoords, predictedAddresses);
    }

    const handleSelect = async (place: PlacePrediction) => {
      if (!place) return
      setLoading(true)
      setError(false)
      setPredictions([])

      try {
        const placeData = await getPlaceData(place.place_id)
        onPlaceSelect(placeData)
        setValue(place?.description || place?.formatted_address)
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Error selecting place')
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    const handleClear = () => {
      setValue('')
      setPredictions([])
      setError(false)
      clearValidationErrors?.()
      onPlaceSelect(null)
    }

    const handleFocus = () => {
      onFocus?.()
      setError(false)
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={placeholder || 'Search for a place'}
            placeholderTextColor="#000"
            value={value}
            onChangeText={handleChange}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
            style={[styles.input, (isValidationError) && { borderColor: theme.colors.error }]}
            numberOfLines={1}
            multiline={false}
            ref={inputRef}
            testID={testID}
          />
          {value && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        {!loading && value?.length > minCharsToFetch && predictions?.length > 0 && active && (
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
    borderWidth: 1,
    borderColor: 'transparent',
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
