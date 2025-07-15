import { PartnerData } from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import SocialBlock from '../feature/SocialBlock';


interface PartnerItemProps {
  item: PartnerData;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLLAPSED_HEIGHT = 0
const EXPANDED_HEIGHT = 60

const PartnerItem: React.FC<PartnerItemProps> = ({ item }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    const isExpanding = !expanded
    setExpanded(isExpanding)

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanding ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        duration: 400,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(opacityAnim, {
        toValue: isExpanding ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanding ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      })
    ]).start()
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.9}>
      <Card
        mode="elevated"
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <Card.Title
          title={item.placeFrom.name}
          subtitle={`${item.user?.firstName} within ${item.placeFrom.distance} m`} subtitleVariant='bodyMedium' />


        <Animated.View
          style={{
            height: heightAnim,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [
                {
                  translateY: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
              paddingHorizontal: 16,
              paddingTop: 10,
            }}
          >
            <Card.Actions>
              <SocialBlock phone={item.user?.phoneNumber || ''} />
              <Button
                mode="contained"
                onPress={() => { router.push(`/chats/${item.id}` as never) }}
                style={{
                  backgroundColor: theme.colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 30,
                  padding: 0,
                }}
              >Chat</Button>
            </Card.Actions>
          </Animated.View>
        </Animated.View>
        {!expanded && (
          <TouchableOpacity
            onPress={toggleExpanded}
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              zIndex: 10,
              backgroundColor: theme.colors.elevation.level2,
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: '0deg',
                  },
                ],
              }}
            >
              <Ionicons name="chevron-down" size={18} color={theme.colors.onSurface} backgroundColor={theme.colors.primary} />
            </Animated.View>
          </TouchableOpacity>
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
