import { CustomModal } from '@/components/ui';
import { LANGUAGES, useLanguageStore, type LanguageOption } from '@/stores/languageStore';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { Button, RadioButton, Text, useTheme } from 'react-native-paper';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const { selectorVisible, setSelectorVisible, setLanguage } = useLanguageStore();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const currentLang = LANGUAGES.find(lang => lang.code === i18n.language);
    if (currentLang) {
      setSelectedLanguage(currentLang);
    }

    return () => {
      setSelectedLanguage(null);
    };
  }, []);

  const handleConfirmLanguage = async () => {
    if (selectedLanguage) {
      await i18n.changeLanguage(selectedLanguage.code);
      setLanguage(selectedLanguage.code);
      setSelectorVisible(false);
    }
  };

  return (
    <CustomModal
      visible={selectorVisible}
      onClose={() => setSelectorVisible(false)}
      testID="language-modal"
    >
      <Text style={{ marginBottom: 16, textAlign: 'center', color: '#000', fontSize: 16, fontWeight: '500' }}>
        {t('settings.selectLanguage')}
      </Text>

      <RadioButton.Group
        onValueChange={(newValue) => {
          const lang = LANGUAGES.find(lang => lang.code === newValue);
          if (lang) setSelectedLanguage(lang);
        }}
        value={selectedLanguage?.code || ''}
      >
        <ScrollView style={{ maxHeight: 200 }}>
          {LANGUAGES.map((lang) => (
            <RadioButton.Item
              key={lang.code}
              label={lang.name}
              value={lang.code}
              labelStyle={{
                fontSize: 16,
                fontWeight: '500',
                color: selectedLanguage?.code === lang.code ? theme.colors.primary : '#333',
              }}
            />
          ))}
        </ScrollView>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleConfirmLanguage}
        disabled={!selectedLanguage}
        style={[
          { marginTop: 16 },
          !selectedLanguage && { backgroundColor: theme.colors.primary, opacity: 0.5 }
        ]}
        labelStyle={!selectedLanguage && { color: theme.colors.onPrimary, opacity: 0.5 }}
      >
        {t('common.buttons.save')}
      </Button>
    </CustomModal>
  );
};

export default LanguageSelector;
