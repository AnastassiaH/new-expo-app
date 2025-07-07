import { View } from "react-native";
import { Modal, Portal } from "react-native-paper";

type CustomModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void,
  children: React.ReactNode
  testID?: string
}

export default function CustomModal({ modalVisible, setModalVisible, children, testID }: CustomModalProps) {
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
        <View testID={testID}>
          {children}
        </View>
      </Modal>
    </Portal>
  )
}