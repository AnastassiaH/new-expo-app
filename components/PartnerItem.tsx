import { PartnerData } from '@/types';
import React, { useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import PartnerActions from './feature/PartnerActions';

interface PartnerItemProps {
  item: PartnerData;
}


const PartnerItem: React.FC<PartnerItemProps> = ({ item }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = React.useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1
    setExpanded(!expanded)
    Animated.timing(fadeAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start()
  }

  return (
    <TouchableOpacity onPress={toggleExpanded}>
      <Card mode='elevated' style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title={item.placeFrom.name} />
        <Card.Content>
          <Text style={[styles.distanceText, { color: theme.colors.onSurfaceVariant }]}>{item.user?.firstName} within {item.placeFrom.distance} m</Text>
        </Card.Content>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            }],
          }}
        >
          <Card.Actions>
            <PartnerActions item={item} />
          </Card.Actions>
        </Animated.View>
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
    paddingHorizontal: 15,
    paddingVertical: 5,
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
