import { StyleSheet, View } from 'react-native';

export default function ProductCardSkeleton() {
  return (
    <View accessibilityLabel="Loading product" style={styles.card}>
      <View style={styles.image} />
      <View style={styles.body}>
        <View style={styles.title} />
        <View style={styles.titleShort} />
        <View style={styles.maker} />
        <View style={styles.badges}>
          <View style={styles.badge} />
          <View style={styles.badge} />
        </View>
      </View>
      <View style={styles.chevron} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 104,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  image: { width: 72, height: 72, borderRadius: 7, backgroundColor: '#e4e6e9', marginRight: 10 },
  body: { flex: 1, rowGap: 5, paddingRight: 12 },
  title: { width: '88%', height: 10, borderRadius: 5, backgroundColor: '#e4e6e9' },
  titleShort: { width: '62%', height: 10, borderRadius: 5, backgroundColor: '#e4e6e9' },
  maker: { width: '35%', height: 7, borderRadius: 4, backgroundColor: '#eceef0' },
  badges: { flexDirection: 'row', columnGap: 5, marginTop: 2 },
  badge: { width: 58, height: 19, borderRadius: 2, backgroundColor: '#dde0e3' },
  chevron: { width: 7, height: 14, borderRadius: 4, backgroundColor: '#e4e6e9' },
});
