import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import ProductCard from '@/src/components/ProductCard';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { useProducts } from '@/src/hooks/useProducts';
import { ROUTES } from '@/src/navigation/routes';
import { getRandomProducts, searchProducts } from '@/src/services/openFoodFacts';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(normalizedQuery, 450);
  const enabled = debouncedQuery.length !== 1;
  const loader = useCallback(
    (page: number, signal: AbortSignal) => debouncedQuery
      ? searchProducts(debouncedQuery, page, signal)
      : getRandomProducts(page, signal),
    [debouncedQuery],
  );
  const {
    products,
    loading,
    loadingMore,
    error,
    loadMoreError,
    retry,
    loadMore,
    retryLoadMore,
  } = useProducts(loader, enabled);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader leftIcon={null} />
      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => <ProductCard compact product={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={(
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <FontAwesome name="search" size={21} color="#777b84" />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setQuery}
                  placeholder="Categories, brands, taste, barcode ..."
                  placeholderTextColor="#969aa3"
                  returnKeyType="search"
                  style={styles.input}
                  value={query}
                />
                {query ? (
                  <Pressable hitSlop={10} onPress={() => setQuery('')}>
                    <FontAwesome name="times-circle" size={19} color="#a9adb5" />
                  </Pressable>
                ) : null}
              </View>
              <Link href={ROUTES.SCANNER} asChild>
                <Pressable accessibilityLabel="Escanear código de barras" style={styles.scannerButton}>
                  <FontAwesome name="barcode" size={24} color="#ffffff" />
                </Pressable>
              </Link>
            </View>
            {!loading && !error && products.length > 0 ? (
              <Text style={styles.resultCount}>{products.length} RESULTADOS CARGADOS</Text>
            ) : null}
          </>
        )}
        ListEmptyComponent={loading ? (
          <StateBox icon={<ActivityIndicator color="#087f23" size="large" />} text="Buscando productos…" />
        ) : error ? (
          <StateBox
            icon={<FontAwesome name="exclamation-circle" size={28} color="#bd2432" />}
            title="No se pudo consultar el catálogo"
            text={error}
            action={<Pressable onPress={retry} style={styles.stateRetryButton}><Text style={styles.stateRetryText}>Reintentar</Text></Pressable>}
          />
        ) : normalizedQuery.length === 1 ? (
          <StateBox icon={<FontAwesome name="barcode" size={34} color="#98a09a" />} text="Ingresá al menos 2 caracteres para buscar." />
        ) : (
          <StateBox icon={<FontAwesome name="search" size={28} color="#98a09a" />} title="Sin resultados" text="Probá con otro nombre, marca o código." />
        )}
        ListFooterComponent={loadingMore ? (
          <ActivityIndicator color="#087f23" style={styles.footer} />
        ) : loadMoreError ? (
          <Pressable onPress={retryLoadMore} style={styles.retryButton}>
            <Text style={styles.retryText}>No se pudo cargar más. Reintentar</Text>
          </Pressable>
        ) : null}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function StateBox({ icon, title, text, action }: { icon: React.ReactNode; title?: string; text: string; action?: React.ReactNode }) {
  return (
    <View style={styles.stateBox}>
      {icon}
      {title ? <Text style={styles.stateTitle}>{title}</Text> : null}
      <Text style={styles.stateText}>{text}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 90 },
  searchBox: { flex: 1, height: 56, flexDirection: 'row', alignItems: 'center', borderRadius: 12, backgroundColor: '#ffffff', paddingHorizontal: 15 },
  searchRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 20 },
  scannerButton: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#087f23' },
  input: { flex: 1, color: '#202226', fontSize: 15, marginLeft: 10, paddingVertical: 0 },
  stateBox: { minHeight: 230, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  stateTitle: { color: '#26282d', fontSize: 17, fontWeight: '800', marginTop: 12, textAlign: 'center' },
  stateText: { color: '#747881', fontSize: 13, lineHeight: 19, marginTop: 9, textAlign: 'center' },
  resultCount: { color: '#71727c', fontSize: 11, letterSpacing: 1.5, marginVertical: 18 },
  separator: { height: 10 },
  footer: { marginVertical: 22 },
  retryButton: { alignItems: 'center', marginVertical: 18, paddingVertical: 10 },
  retryText: { color: '#087f23', fontSize: 12, fontWeight: '800' },
  stateRetryButton: { borderRadius: 9, backgroundColor: '#087f23', marginTop: 18, paddingHorizontal: 24, paddingVertical: 12 },
  stateRetryText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
});
