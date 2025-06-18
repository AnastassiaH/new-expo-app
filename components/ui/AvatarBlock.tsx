import { useUserStore } from "@/stores/userStore"
import { TouchableOpacity, View } from "react-native"
import { Avatar, Text, useTheme } from "react-native-paper"

export const AvatarBlock = ({ onPress }: { onPress?: () => void }) => {
  const theme = useTheme()
  const user = useUserStore((state) => state.user)

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 16,
        borderRadius: 8,
      }}>
        <Avatar.Text
          size={48}
          label={user?.firstName?.charAt(0).toUpperCase() || 'U'}
          style={{ marginRight: 12, backgroundColor: theme.colors.onSurface }}
        />
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.onSurface }}>
            {user?.firstName || 'User Name'}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.onSurface }}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}