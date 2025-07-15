import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

interface ChatMessageProps {
  senderId: string
  currentUserId: string
  content: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({ senderId, currentUserId, content }) => {
  const theme = useTheme()
  const isOwn = senderId === currentUserId

  return (
    <View
      style={[
        styles.messageWrapper,
        isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <Text style={{ color: isOwn ? 'white' : theme.colors.onSurface }}>
        {content}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  messageWrapper: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
    maxWidth: '75%',
  },
  ownMessage: {
    backgroundColor: '#1976D2',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
})

export default ChatMessage
