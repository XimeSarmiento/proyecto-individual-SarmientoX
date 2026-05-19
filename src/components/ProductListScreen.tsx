import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Product } from '@/src/data/catalog';
import { fichaShowRoute, ROUTES } from '@/src/navigation/routes';
import AppHeader from './AppHeader';

type ProductListScreenProps = {
  title: string;
  countLabel: string;
  placeholder: string;
  products: Product[];
  originType: 'categoria' | 'marca';
  originId: string;
};

export default function ProductListScreen({
  title,
  countLabel,
  placeholder,
  products,
  originType,
  originId,
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
      <AppHeader onLeftPress={() => router.replace(ROUTES.HOME)} />

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

        {filteredProducts.length ? (
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

        <View style={styles.skeleton}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <View style={styles.skeletonLineLarge} />
            <View style={styles.skeletonLineMedium} />
            <View style={styles.skeletonBottomRow}>
              <View style={styles.skeletonLineSmall} />
              <View style={styles.skeletonLineSmall} />
            </View>
          </View>
        </View>
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
        <View style={styles.imagePlaceholder}>
          <FontAwesome name="cutlery" size={28} color="#c7c9cf" />
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 108,
  },
  title: {
    color: '#121318',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
  },
  count: {
    color: '#71727c',
    fontSize: 17,
    letterSpacing: 3,
    marginTop: 8,
  },
  searchBox: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f1f3',
    marginTop: 24,
    marginBottom: 44,
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#9c9fa9',
    fontSize: 19,
    fontWeight: '600',
    marginLeft: 14,
    paddingVertical: 0,
  },
  productStack: {
    rowGap: 16,
  },
  card: {
    minHeight: 176,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  imagePlaceholder: {
    width: 94,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#eef0f2',
    marginRight: 16,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    color: '#050505',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  maker: {
    color: '#6d6e75',
    fontSize: 13,
    marginTop: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
    marginTop: 14,
  },
  nutriBadge: {
    minWidth: 92,
    minHeight: 46,
    justifyContent: 'center',
    borderRadius: 2,
    paddingHorizontal: 10,
  },
  nutriText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 17,
  },
  ecoBadge: {
    minWidth: 92,
    minHeight: 46,
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: '#c9efc4',
    paddingHorizontal: 10,
  },
  ecoText: {
    color: '#4f6a52',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
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
