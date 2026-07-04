import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  leftIcon?: 'bars' | 'arrow-left' | null;
  rightIcon?: 'profile';
  onLeftPress?: () => void;
  title?: string;
};

export default function AppHeader({
  leftIcon = 'bars',
  rightIcon,
  onLeftPress,
  title = 'Digital Epicurean',
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {leftIcon ? (
        <Pressable style={styles.sideButton} onPress={onLeftPress} hitSlop={10}>
          <FontAwesome name={leftIcon} size={20} color="#00591c" />
        </Pressable>
      ) : (
        <View style={styles.sideButton} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon === 'profile' ? (
        <View style={styles.sideButton}>
          <FontAwesome name="user-circle-o" size={18} color="#00591c" />
        </View>
      ) : (
        <View style={styles.sideButton} />
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
