import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import type { Product } from '@/src/data/catalog';
import { fichaShowRoute, ROUTES } from '@/src/navigation/routes';
import { getRandomProducts, searchProducts } from '@/src/services/openFoodFacts';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [retryRequest, setRetryRequest] = useState(0);
  const loadingMoreRef = useRef(false);
  const loadMoreFailedRef = useRef(false);
  const paginationControllerRef = useRef<AbortController | null>(null);
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (normalizedQuery.length === 1) {
      setProducts([]);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
      setLoadMoreError(false);
      loadMoreFailedRef.current = false;
      setPage(0);
      setHasMore(false);
      return;
    }

    const controller = new AbortController();
    paginationControllerRef.current?.abort();
    loadingMoreRef.current = false;
    setProducts([]);
    setPage(0);
    setHasMore(false);
    setLoading(true);
    setLoadingMore(false);
    setError(null);
    setLoadMoreError(false);
    loadMoreFailedRef.current = false;
    const loadProducts = async () => {
      try {
        const result = normalizedQuery
          ? await searchProducts(normalizedQuery, 1, controller.signal)
          : await getRandomProducts(1, controller.signal);
        setProducts(result.products);
        setPage(result.page);
        setHasMore(result.hasMore);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setProducts([]);
          setError(requestError instanceof Error ? requestError.message : 'No se pudo realizar la búsqueda.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    const timeout = setTimeout(loadProducts, normalizedQuery ? 450 : 0);

    return () => {
      clearTimeout(timeout);
      controller.abort();
      paginationControllerRef.current?.abort();
      loadingMoreRef.current = false;
    };
  }, [normalizedQuery, retryRequest]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMoreRef.current || loadMoreFailedRef.current || normalizedQuery.length === 1) return;

    const controller = new AbortController();
    paginationControllerRef.current?.abort();
    paginationControllerRef.current = controller;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError(false);

    try {
      const result = normalizedQuery
        ? await searchProducts(normalizedQuery, page + 1, controller.signal)
        : await getRandomProducts(page + 1, controller.signal);
      setProducts((current) => {
        const existingIds = new Set(current.map((product) => product.id));
        return [...current, ...result.products.filter((product) => !existingIds.has(product.id))];
      });
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch {
      if (!controller.signal.aborted) {
        loadMoreFailedRef.current = true;
        setLoadMoreError(true);
      }
    } finally {
      if (!controller.signal.aborted) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [hasMore, loading, normalizedQuery, page]);

  const retryLoadMore = useCallback(() => {
    loadMoreFailedRef.current = false;
    void loadMore();
  }, [loadMore]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader leftIcon={null} />
      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => <ProductResult product={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
          <View style={styles.stateBox}>
            <ActivityIndicator color="#087f23" size="large" />
            <Text style={styles.stateText}>Buscando productos…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <FontAwesome name="exclamation-circle" size={28} color="#bd2432" />
            <Text style={styles.stateTitle}>No se pudo consultar el catálogo</Text>
            <Text style={styles.stateText}>{error}</Text>
            <Pressable onPress={() => setRetryRequest((current) => current + 1)} style={styles.stateRetryButton}>
              <Text style={styles.stateRetryText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : normalizedQuery.length === 1 ? (
          <View style={styles.stateBox}>
            <FontAwesome name="barcode" size={34} color="#98a09a" />
            <Text style={styles.stateText}>Ingresá al menos 2 caracteres para buscar.</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.stateBox}>
            <FontAwesome name="search" size={28} color="#98a09a" />
            <Text style={styles.stateTitle}>Sin resultados</Text>
            <Text style={styles.stateText}>Probá con otro nombre, marca o código.</Text>
          </View>
        ) : null}
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

function ProductResult({ product }: { product: Product }) {
  return (
    <Link href={fichaShowRoute(product.id)} asChild>
      <Pressable style={styles.card}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} resizeMode="contain" style={styles.productImage} />
        ) : (
          <View style={styles.imageFallback}>
            <FontAwesome name="cutlery" size={24} color="#bec2c8" />
          </View>
        )}
        <View style={styles.cardBody}>
          <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
          <Text numberOfLines={1} style={styles.maker}>{product.maker.toUpperCase()}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NUTRI-SCORE {product.nutriScore}</Text>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={18} color="#c7cad0" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 90 },
  title: { color: '#121318', fontSize: 30, fontWeight: '900' },
  subtitle: { color: '#70737b', fontSize: 12, marginTop: 5 },
  searchBox: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 20 },
  scannerButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#087f23',
  },
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
  card: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 12,
  },
  productImage: { width: 76, height: 88, borderRadius: 8, backgroundColor: '#f2f3f4', marginRight: 13 },
  imageFallback: { width: 76, height: 88, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#eef0f2', marginRight: 13 },
  cardBody: { flex: 1, minWidth: 0, paddingRight: 8 },
  productName: { color: '#111216', fontSize: 16, fontWeight: '800', lineHeight: 20 },
  maker: { color: '#6d7078', fontSize: 10, marginTop: 5 },
  badge: { alignSelf: 'flex-start', borderRadius: 4, backgroundColor: '#087f23', marginTop: 10, paddingHorizontal: 8, paddingVertical: 5 },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: '900' },
});
