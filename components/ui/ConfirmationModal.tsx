import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

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
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.colors.onSurface }]}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Button
              style={{ backgroundColor: theme.colors.error, flexGrow: 1, minWidth: '50%' }}
              onPress={onClose}
            >
              Скасувати
            </Button>
            <Button
              style={{ backgroundColor: theme.colors.onPrimary, flexGrow: 1, minWidth: '50%' }}
              onPress={onConfirm}
            >
              Підтвердити
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
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
