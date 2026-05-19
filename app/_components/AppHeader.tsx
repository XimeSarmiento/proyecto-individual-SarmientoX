import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  leftIcon?: 'bars' | 'arrow-left';
  rightIcon?: 'profile' | 'share';
  onLeftPress?: () => void;
  title?: string;
};

export default function AppHeader({
  leftIcon = 'bars',
  rightIcon = 'profile',
  onLeftPress,
  title = 'Digital Epicurean',
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.sideButton} onPress={onLeftPress} hitSlop={10}>
        <FontAwesome name={leftIcon} size={20} color="#00591c" />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon === 'share' ? (
        <Pressable style={styles.sideButton} hitSlop={10}>
          <FontAwesome name="share-alt" size={18} color="#00591c" />
        </Pressable>
      ) : (
        <View style={styles.sideButton}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={14} color="#ffffff" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
  },
  sideButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    minWidth: 0,
    color: '#00591c',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#0d8a80',
    borderWidth: 2,
    borderColor: '#d7efea',
  },
});
