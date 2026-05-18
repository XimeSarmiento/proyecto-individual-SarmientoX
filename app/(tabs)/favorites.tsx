import { StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  text: {
    color: '#a5a5a5',
    fontSize: 14,
  },
});
