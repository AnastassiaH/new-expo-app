import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import CustomModal from './CustomModal';
import Loader from './Loader';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export default function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}: ConfirmationModalProps) {
  const theme = useTheme();

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View style={{ position: 'relative' }}>
        {loading &&
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(225, 255, 255, 0.22)',
              zIndex: 10,
            }}>
            <Loader />
          </View>
        }
        <>
          <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.colors.primary }]}>{message}</Text>
          <View style={[styles.buttonContainer, { pointerEvents: loading ? 'none' : 'auto' }]}>
            <Button
              style={{ backgroundColor: theme.colors.error, flex: 1 }}
              onPress={onClose}
              disabled={loading}
              textColor={theme.colors.onSurface}
            >
              Скасувати
            </Button>
            <Button
              style={{ backgroundColor: theme.colors.primary, flex: 1 }}
              onPress={onConfirm}
              disabled={loading}
              textColor={theme.colors.onPrimary}
            >
              Підтвердити
            </Button>
          </View>
        </>
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
