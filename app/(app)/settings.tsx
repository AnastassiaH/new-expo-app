import CityToggle from '@/components/feature/CityToggle';
import LanguageToggle from '@/components/feature/LanguageToggle';
import ScreenWrapper from '@/components/ui/ScreenWrapper';
import { View } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScreenWrapper>
      <View style={{ gap: 24 }}>
        <CityToggle />
        <LanguageToggle />
      </View>
    </ScreenWrapper>
  );
}
