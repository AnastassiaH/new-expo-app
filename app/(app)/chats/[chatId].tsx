import { ChatMessage } from '@/components/ui'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, View } from 'react-native'
import { Button, TextInput, useTheme } from 'react-native-paper'

interface Message {
  senderId: string
  content: string
  timestamp: string
}

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const userId = useUserStore((state) => state.user?.id)
  const token = useAuthStore((state) => state.session)
  const theme = useTheme()

  // useEffect(() => {
  //   if (chatId) {
  //     axios.get(`/api/chats/${chatId}/messages`) // ⬅️ твій бекенд
  //       .then(res => setMessages(res.data))
  //       .catch(err => console.error('Message load error:', err))
  //   }
  // }, [chatId])

  const { sendMessage, connected } = useWebSocket({
    url: `wss://your-api.com/ws/chat/${chatId}`,
    userToken: token || '',
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
  })

  const handleSend = () => {
    if (text.trim()) {
      sendMessage({ senderId: userId!, content: text })
      setMessages((prev) => [
        ...prev,
        { senderId: userId!, content: text, timestamp: new Date().toISOString() },
      ])
      setText('')
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.colors.secondaryContainer }}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <ChatMessage
            senderId={item.senderId}
            currentUserId={userId!}
            content={item.content}
          />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Напишіть повідомлення..."
          mode="outlined"
        />
        <Button
          mode="contained"
          onPress={handleSend}
          disabled={!connected || !text.trim()}
          style={{ marginTop: 8 }}
        >
          Надіслати
        </Button>
      </View>
    </View>
  )
}