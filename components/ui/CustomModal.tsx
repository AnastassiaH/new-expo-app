import React from 'react'
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  testID?: string
}

export default function CustomModal({ visible, onClose, children, testID }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {children}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 40,
    paddingBottom: 35,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeText: {
    color: 'blue',
  },
})