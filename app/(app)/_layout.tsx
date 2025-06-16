import { AutoLogoutTimer } from "@/components/feature/AutoLogoutTimer";
import DrawerButton from "@/components/feature/DrawerButton";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";


const iconsMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  Partners: 'people-outline',
  Profile: 'person-outline',
  Settings: 'settings-outline',
  Ride: 'car-outline',
};

export default function RootLayout() {
  const { session, isReady, signOut } = useAuthStore();
  const { requestLocation, location } = useLocationStore();
  const user = useUserStore((state) => state.user);
  const theme = useTheme()

  useEffect(() => {
    if (!location) {
      requestLocation()
    }
  }, [location]);

  if (!isReady) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  return (
    <>
      <AutoLogoutTimer />
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
            <View style={{
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.primary,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
              marginBottom: 16,
              borderRadius: 8,
            }}>
              <Avatar.Text
                size={48}
                label={user?.firstName?.charAt(0).toUpperCase() || 'U'}
                style={{ marginRight: 12, backgroundColor: theme.colors.onSurface }}
              />
              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.onSurface }}>
                  {user?.firstName || 'User Name'}
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.onSurface }}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
            {props.state.routes.map((route, index) => {
              const focused = props.state.index === index;
              const label = props.descriptors[route.key].options.title || route.name;

              return (
                <DrawerItem
                  key={route.key}
                  label={label}
                  focused={focused}
                  onPress={() => props.navigation.navigate(route.name)}
                  labelStyle={{ color: focused ? theme.colors.primary : theme.colors.onSurface }}
                  icon={({ size }) => (
                    <Ionicons name={iconsMap[route.name as keyof typeof iconsMap]} color={theme.colors.onSurface} size={size} />
                  )}
                  style={{
                    backgroundColor: focused ? theme.colors.surface : 'transparent',
                    marginHorizontal: 10,
                    borderRadius: 12,
                  }}
                />
              );
            })}
            <View style={{ borderTopWidth: 1, borderTopColor: '#ccc', paddingTop: 10 }}>
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

    </>
  )
}