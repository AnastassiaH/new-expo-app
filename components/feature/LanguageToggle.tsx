import { LANGUAGES, useLanguageStore } from '@/stores/languageStore';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import LanguageSelector from './LanguageSelector';

export default function LanguageToggle() {
  const { selectorVisible, setSelectorVisible, language } = useLanguageStore();
  const theme = useTheme();
  const { t } = useTranslation();

  const currentLanguage = LANGUAGES.find(lang => lang.code === language)?.nativeName || language;

  return (
    <>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.primary }]}
        onPress={() => setSelectorVisible(true)}
      >
        <Card.Title
          title={t('settings.language')}
          subtitle={currentLanguage}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
          right={() => (
            <>
              <Button
                mode="contained"
                onPress={() => setSelectorVisible(true)}
                compact
                style={styles.editBtn}
              >
                {t('common.buttons.edit')}
              </Button>
            </>
          )}
        />
      </Card>
      <LanguageSelector />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
  },
  editBtn: { marginRight: 8 },
});
