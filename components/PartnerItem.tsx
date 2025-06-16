import { PartnerData } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import PartnerActions from './feature/PartnerActions';

interface PartnerItemProps {
  item: PartnerData;
  isExpanded: boolean;
  onPress: () => void;
}


const PartnerItem: React.FC<PartnerItemProps> = ({ item, isExpanded, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card mode='contained' style={styles.container}>
        <Card.Title title={item.placeFrom.name} />
        <Card.Content>
          <Text style={styles.distanceText}>{item.user?.firstName} within {item.placeFrom.distance} m</Text>
        </Card.Content>
        {isExpanded && (
          <Card.Actions>
            <PartnerActions item={item} />
          </Card.Actions>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
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
