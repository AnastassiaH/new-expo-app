import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import CustomModal from './CustomModal';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmationModalProps) {
  const theme = useTheme();

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.primary }]}>{message}</Text>
      <View style={styles.buttonContainer}>
        <Button
          style={{ backgroundColor: theme.colors.error, flexGrow: 1, minWidth: '50%' }}
          onPress={onClose}
          textColor={theme.colors.onSurface}
        >
          Скасувати
        </Button>
        <Button
          style={{ backgroundColor: theme.colors.primary, flexGrow: 1, minWidth: '50%' }}
          onPress={onConfirm}
          textColor={theme.colors.onPrimary}
        >
          Підтвердити
        </Button>
      </View>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
