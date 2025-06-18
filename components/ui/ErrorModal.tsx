import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';

interface ErrorModalProps {
  visible: boolean;
  message: string | null;
  onDismiss: () => void;
  tryAgain?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ visible, message, onDismiss, tryAgain }) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <View style={[styles.card, { backgroundColor: theme.colors.elevation.level2 }]}>
          <Text style={{ color: theme.colors.onSurface }}>{message}</Text>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={styles.button}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
          >
            Close
          </Button>
          {tryAgain && (
            <Button
              mode="contained"
              onPress={tryAgain}
              style={styles.button}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
            >
              Try Again
            </Button>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
});

export default ErrorModal;