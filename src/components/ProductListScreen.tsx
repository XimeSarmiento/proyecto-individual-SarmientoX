import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Product } from '@/src/data/catalog';
import { fichaShowRoute } from '@/src/navigation/routes';
import AppHeader from './AppHeader';

type ProductListScreenProps = {
  title: string;
  countLabel: string;
  placeholder: string;
  products: Product[];
  originType: 'categoria' | 'marca';
  originId: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
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
}: ProductListScreenProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = `${product.name} ${product.maker}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery, products]);
  const resultLabel = normalizedQuery
    ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'RESULT' : 'RESULTS'}`
    : countLabel;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
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

        {loading ? (
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
        ) : filteredProducts.length ? (
          <View style={styles.productStack}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                originType={originType}
                originId={originId}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="search" size={22} color="#a9adb5" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>Try another name or maker.</Text>
          </View>
        )}

        {!loading && !error ? <View style={styles.skeleton}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <View style={styles.skeletonLineLarge} />
            <View style={styles.skeletonLineMedium} />
            <View style={styles.skeletonBottomRow}>
              <View style={styles.skeletonLineSmall} />
              <View style={styles.skeletonLineSmall} />
            </View>
          </View>
        </View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductCard({
  product,
  originType,
  originId,
}: {
  product: Product;
  originType: 'categoria' | 'marca';
  originId: string;
}) {
  const nutriColor = product.nutriScore === 'C' ? '#f1b600' : product.nutriScore === 'B' ? '#22c765' : '#08a347';

  return (
    <Link href={fichaShowRoute(product.id, originType, originId)} asChild>
      <Pressable style={styles.card}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} resizeMode="contain" style={styles.imagePlaceholder} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <FontAwesome name="cutlery" size={28} color="#c7c9cf" />
          </View>
        )}
        <View style={styles.cardBody}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.maker}>{product.maker.toUpperCase()}</Text>
          <View style={styles.scoreRow}>
            <View style={{ ...styles.nutriBadge, backgroundColor: nutriColor }}>
              <Text style={styles.nutriText}>NUTRI-{'\n'}SCORE {product.nutriScore}</Text>
            </View>
            <View style={styles.ecoBadge}>
              <Text style={styles.ecoText}>ECO-SCORE{'\n'}{product.ecoScore}</Text>
            </View>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={22} color="#d1d3d8" />
      </Pressable>
    </Link>
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
  card: {
    minHeight: 128,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  imagePlaceholder: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#eef0f2',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  maker: {
    color: '#6d6e75',
    fontSize: 10,
    marginTop: 3,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 6,
    rowGap: 6,
    marginTop: 9,
  },
  nutriBadge: {
    minWidth: 72,
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: 2,
    paddingHorizontal: 8,
  },
  nutriText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    lineHeight: 12,
  },
  ecoBadge: {
    minWidth: 72,
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: '#c9efc4',
    paddingHorizontal: 8,
  },
  ecoText: {
    color: '#4f6a52',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 12,
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
