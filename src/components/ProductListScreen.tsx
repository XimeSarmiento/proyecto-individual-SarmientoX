import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Product } from '@/src/types/product';
import { ROUTES } from '@/src/navigation/routes';
import AppHeader from './AppHeader';
import ProductCard from './ProductCard';

type ProductListScreenProps = {
  title: string;
  countLabel: string;
  placeholder: string;
  products: Product[];
  originType: 'categoria' | 'marca' | 'taste';
  originId: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingMore?: boolean;
  loadMoreError?: boolean;
  onLoadMore?: () => void;
  onRetryLoadMore?: () => void;
  onSearchChange?: (query: string) => void;
};

export default function ProductListScreen({
  title,
  countLabel,
  placeholder,
  products,
  originType,
  originId,
  loading = false,
  error,
  onRetry,
  loadingMore = false,
  loadMoreError = false,
  onLoadMore,
  onRetryLoadMore,
  onSearchChange,
}: ProductListScreenProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim();

  useEffect(() => {
    const timeout = setTimeout(() => onSearchChange?.(normalizedQuery), 500);
    return () => clearTimeout(timeout);
  }, [normalizedQuery, onSearchChange]);

  const resultLabel = normalizedQuery
    ? `${products.length} ${products.length === 1 ? 'RESULT' : 'RESULTS'}`
    : countLabel;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        leftIcon="arrow-left"
        onLeftPress={() => router.replace(ROUTES.HOME)}
      />

      <FlatList
        data={loading || error ? [] : products}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => (
          <ProductCard product={item} originType={originType} originId={originId} />
        )}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
        ListHeaderComponent={(
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.count}>{resultLabel}</Text>
            <View style={styles.searchBox}>
              <FontAwesome name="search" size={24} color="#9c9fa9" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={placeholder}
                placeholderTextColor="#9c9fa9"
                returnKeyType="search"
                autoCorrect={false}
                style={styles.searchInput}
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={8}>
                  <FontAwesome name="times-circle" size={18} color="#b6bac3" />
                </Pressable>
              ) : null}
            </View>
          </>
        )}
        ListEmptyComponent={loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#087f23" />
            <Text style={styles.emptyText}>Cargando productos…</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <FontAwesome name="exclamation-circle" size={24} color="#bd2432" />
            <Text style={styles.emptyTitle}>No se pudo cargar el catálogo</Text>
            <Text style={styles.emptyText}>{error}</Text>
            {onRetry ? (
              <Pressable onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.retryText}>Reintentar</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="search" size={22} color="#a9adb5" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>Try another name or maker.</Text>
          </View>
        )}
        ListFooterComponent={loadingMore ? (
          <ActivityIndicator color="#087f23" style={styles.listFooter} />
        ) : loadMoreError && onRetryLoadMore ? (
          <Pressable onPress={onRetryLoadMore} style={styles.loadMoreRetry}>
            <Text style={styles.loadMoreRetryText}>No se pudo cargar más. Reintentar</Text>
          </Pressable>
        ) : null}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 86,
  },
  title: {
    color: '#121318',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 35,
  },
  count: {
    color: '#71727c',
    fontSize: 13,
    letterSpacing: 2,
    marginTop: 5,
  },
  searchBox: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f0f1f3',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#9c9fa9',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
    paddingVertical: 0,
  },
  productStack: {
    rowGap: 10,
  },
  productSeparator: {
    height: 10,
  },
  listFooter: {
    marginVertical: 22,
  },
  loadMoreRetry: {
    alignItems: 'center',
    marginVertical: 18,
    paddingVertical: 10,
  },
  loadMoreRetryText: {
    color: '#087f23',
    fontSize: 12,
    fontWeight: '800',
  },
  skeleton: {
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f5f6f7',
    marginTop: 18,
    padding: 16,
  },
  emptyState: {
    minHeight: 170,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#24262c',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  emptyText: {
    color: '#7c808a',
    fontSize: 13,
    marginTop: 6,
  },
  retryButton: {
    borderRadius: 8,
    backgroundColor: '#087f23',
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  skeletonImage: {
    width: 94,
    height: 94,
    borderRadius: 10,
    backgroundColor: '#e9eaec',
  },
  skeletonBody: {
    flex: 1,
    marginLeft: 16,
    rowGap: 14,
  },
  skeletonLineLarge: {
    height: 22,
    borderRadius: 5,
    backgroundColor: '#e9eaec',
  },
  skeletonLineMedium: {
    width: '34%',
    height: 18,
    borderRadius: 5,
    backgroundColor: '#e9eaec',
  },
  skeletonBottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonLineSmall: {
    width: 66,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#e9eaec',
  },
});
