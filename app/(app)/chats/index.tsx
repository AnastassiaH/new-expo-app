import { ScreenWrapper } from '@/components/ui'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { FlatList, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'

const mockChats = [
  { id: '123', name: 'Петро' },
  { id: '456', name: 'Іванна' },
]

export default function ChatsList() {
  // const [chats, setChats] = useState<{ id: string; name: string }[]>([])
  const theme = useTheme()

  // useEffect(() => {
  //   axios.get('/api/chats')
  //     .then(res => setChats(res.data))
  //     .catch(err => console.error('Chat list error:', err))
  // }, [])

  return (
    <ScreenWrapper>
      <Text style={{ marginBottom: 20, fontSize: 21, fontWeight: 'bold', textAlign: 'center' }}>
        Мої чати
      </Text>

      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ width: '100%', padding: 0, margin: 0 }}
        renderItem={({ item }) => (
          <Link href={`/chats/${item.id}` as never} style={{ width: '100%', marginBottom: 15 }}>
            <View style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 10,
              padding: 15,
              width: '100%',
              gap: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
              <Ionicons name="person" color={theme.colors.onSurface} size={24} />
              <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', flex: 1 }}>{item.name}</Text>
              <Ionicons name="chevron-forward-outline" color={theme.colors.onSurface} size={24} />
            </View>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 0, marginBottom: 0 }} />}
        onRefresh={() => { }}
        refreshing={false}
      />
    </ScreenWrapper>
  )
}
