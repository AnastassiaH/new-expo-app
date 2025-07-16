import { RideData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';

type Props = {
  ride: RideData;
};

const RideItem: React.FC<Props> = ({ ride }) => {
  const { colors } = useTheme();
  const isActive = ride.isActive;
  const date = ride.date.split(' ')[0];
  const time = ride.date.split(' ')[1];

  return (
    <Card mode="contained" style={[styles.card, { backgroundColor: colors.surface }]}>
      <Card.Content>
        <View style={[styles.row, { marginBottom: 8 }]}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {ride.placeFrom?.name?.split(',').slice(0, 3).join(', ')}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="flag-outline" size={20} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {ride.placeTo?.name?.split(',').slice(0, 3).join(', ')}
          </Text>
        </View>

        <Divider style={{ marginVertical: 8 }} />

        <View style={styles.infoRow}>
          <View style={styles.infoSubRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} style={styles.iconSmall} />
            <Text style={styles.value}>{date}</Text>
          </View>
          <View style={styles.infoSubRow}>
            <Ionicons name="time-outline" size={16} color={colors.primary} style={styles.iconSmall} />
            <Text style={styles.value}>{time}</Text>
          </View>
        </View>

        <View style={[styles.statusRow]}>
          <Ionicons
            name={isActive ? 'ellipse' : 'ellipse-outline'}
            size={12}
            color={isActive ? colors.tertiary : colors.onSurface}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.statusText, { color: isActive ? colors.tertiary : colors.onSurface }]}>
            {isActive ? 'Активна поїздка' : 'Завершена поїздка'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    marginLeft: 8,
    marginRight: 16,
    fontSize: 16,
    color: 'black',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmall: {
    marginRight: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  statusRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RideItem;
