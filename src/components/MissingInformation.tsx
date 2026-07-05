import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

export default function MissingInformation() {
  return (
    <View style={styles.container}>
      <FontAwesome name="info-circle" size={22} color="#8b9098" />
      <Text style={styles.text}>Information unavailable</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#e5e7e9', padding: 14 },
  text: { color: '#747981', fontSize: 12, fontWeight: '700', marginTop: 7 },
});
