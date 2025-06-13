import { PartnerData } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PartnerItemProps {
  item: PartnerData;
  isExpanded: boolean;
  onPress: () => void;
}

const PartnerItem: React.FC<PartnerItemProps> = ({ item, isExpanded, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.placeName}>{item.placeFrom.name}</Text>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>{item.user?.firstName}</Text>
          <Text style={styles.distanceText}>{item.placeFrom.distance}</Text>
        </View>
        {isExpanded && (
          <Text style={styles.phoneText}>{item?.user?.phoneNumber}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#000',
    flex: 1,
    padding: 15,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  phoneText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default PartnerItem;
