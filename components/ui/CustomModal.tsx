import { Modal, Portal } from "react-native-paper";

type CustomModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
  children: React.ReactNode
}

export default function CustomModal({ modalVisible, setModalVisible, children }: CustomModalProps) {
  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 24,
          margin: 20,
          borderRadius: 12,
        }}
      >
        {children}
      </Modal>
    </Portal>
  )
}