import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import ProductCard from '@/src/components/ProductCard';
import { useFavorites } from '@/src/hooks/useFavorites';
import { buildRoute, ROUTES } from '@/src/navigation/routes';
import { useAuth } from '@/src/providers/AuthProvider';

export default function FavoritesScreen() {
  const { initialized, user } = useAuth();
  const { data: favorites = [], isPending, isError } = useFavorites();

  if (!initialized) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader leftIcon={null} />
        <ActivityIndicator color="#087f23" style={styles.state} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href={buildRoute(ROUTES.AUTH, { reason: 'favorites', returnTo: ROUTES.TABS_FAVORITES })} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader leftIcon={null} />
      <FlatList
        data={favorites}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => <ProductCard compact product={item} />}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={(
          <>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.count}>{favorites.length} PRODUCTS</Text>
          </>
        )}
        ListEmptyComponent={isPending ? (
          <ActivityIndicator color="#087f23" style={styles.state} />
        ) : (
          <View style={styles.state}>
            <FontAwesome name={isError ? 'exclamation-circle' : 'heart-o'} size={30} color="#98a09a" />
            <Text style={styles.stateTitle}>{isError ? 'Favorites could not be loaded' : 'No favorites yet'}</Text>
            <Text style={styles.stateText}>Mark products as favorites from their details to see them here.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 90 },
  title: { color: '#121318', fontSize: 30, fontWeight: '900' },
  count: { color: '#71727c', fontSize: 12, letterSpacing: 2, marginTop: 5, marginBottom: 24 },
  separator: { height: 10 },
  state: { minHeight: 240, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  stateTitle: { color: '#26282d', fontSize: 17, fontWeight: '800', marginTop: 12 },
  stateText: { color: '#747881', fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: 'center' },
});
