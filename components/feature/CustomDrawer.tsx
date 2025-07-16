import { useAuthStore } from '@/stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AvatarBlock } from '../ui/AvatarBlock';
import DrawerButton from './DrawerButton';

const iconsMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  partners: 'people-outline',
  profile: 'person-outline',
  settings: 'settings-outline',
  ride: 'car-outline',
  history: 'list-outline',
};

const CustomDrawer = () => {
  const theme = useTheme()
  const { signOut } = useAuthStore()
  return (
    <Drawer
      screenOptions={{
        headerTitle: '',
        headerLeft: () => <DrawerButton />,
        headerTransparent: true,
        headerTintColor: theme.colors.onSurface,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurface,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        overlayColor: 'transparent',
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <AvatarBlock onPress={() => router.replace('/(app)/profile' as never)} />
          {props.state.routes
            .filter((route) => route.name !== 'profile')
            .map((route) => {
              const focused = props.state.routes[props.state.index].key === route.key
              const label = route.name;

              return (
                <DrawerItem
                  key={route.key}
                  label={label.charAt(0).toUpperCase() + label.slice(1)}
                  focused={focused}
                  onPress={() => props.navigation.navigate(route.name)}
                  labelStyle={{ color: focused ? theme.colors.primary : theme.colors.onSurface }}
                  icon={({ size }) => (
                    <Ionicons name={iconsMap[route.name.toLowerCase() as keyof typeof iconsMap]} color={theme.colors.onSurface} size={size} />
                  )}
                  style={{
                    backgroundColor: focused ? theme.colors.surface : 'transparent',
                    marginHorizontal: 10,
                    borderRadius: 12,
                  }}
                />
              );
            })}
          <View style={{ borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10, marginTop: 10 }}>
            <DrawerItem
              label="Log Out"
              onPress={signOut}
              icon={({ size }) => (
                <Ionicons name="log-out-outline" color={theme.colors.onSurface} size={size} />
              )}
              labelStyle={{ color: theme.colors.onSurface }}
              style={{
                marginHorizontal: 10,
                borderRadius: 12,
              }}
            />
          </View>
        </DrawerContentScrollView>
      )}
    />
  )
}

export default CustomDrawer