import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function DrawerButton() {
  const navigation = useNavigation();
  const theme = useTheme()

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: theme.colors.primary,
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="menu" size={24} color="white" />
    </TouchableOpacity>
  );
}