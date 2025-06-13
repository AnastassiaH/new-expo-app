import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Button } from 'react-native-paper';

export default function DrawerButton() {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu" size={24} color="black" />
    </Button>
  );
}