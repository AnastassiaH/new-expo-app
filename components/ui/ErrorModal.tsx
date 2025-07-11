import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import CustomModal from './CustomModal';

interface ErrorModalProps {
  visible: boolean;
  message: string | null;
  onClose: () => void;
  tryAgain?: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ visible, message, onClose, tryAgain }) => {
  const theme = useTheme();

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: 'bold', marginBottom: 40 }}>{message}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
        <Button
          mode="contained"
          onPress={onClose}
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          style={styles.button}
        >
          Close
        </Button>
        {tryAgain && (
          <Button
            mode="contained"
            onPress={tryAgain}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            style={styles.button}
          >
            Try Again
          </Button>
        )}
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  button: {
    alignSelf: 'flex-end',
    minWidth: 120,
  },
});

export default ErrorModal;