import { PartnerData } from '@/types';
import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import SocialBlock from './feature/SocialBlock';

interface PartnerItemProps {
  item: PartnerData;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PartnerItem: React.FC<PartnerItemProps> = ({ item }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpanded(!expanded);

    Animated.timing(fadeAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.9}>
      <Card
        mode="elevated"
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <Card.Title title={item.placeFrom.name} subtitle={`${item.user?.firstName} within ${item.placeFrom.distance} m`} subtitleVariant='bodyMedium' />

        {expanded && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <Card.Actions>
              <SocialBlock phone={item.user?.phoneNumber || ''} />
            </Card.Actions>
          </Animated.View>
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
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});

export default PartnerItem;
