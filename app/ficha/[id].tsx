import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import { products, type Product } from '@/src/data/catalog';
import { buildRoute, ROUTES } from '@/src/navigation/routes';
import { getProduct } from '@/src/services/openFoodFacts';

export default function ProductDetailScreen() {
  const { id, originType, originId } = useLocalSearchParams<{
    id: string;
    originType?: 'categoria' | 'marca' | 'taste';
    originId?: string;
  }>();
  const localProduct = products.find((item) => item.id === id);
  const [product, setProduct] = useState<Product | null>(localProduct ?? null);
  const [loading, setLoading] = useState(!localProduct);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (localProduct || !id) return;

    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    getProduct(id, controller.signal)
      .then((remoteProduct) => {
        setProduct(remoteProduct);
        setFailed(!remoteProduct);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, localProduct]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader leftIcon="arrow-left" onLeftPress={() => router.back()} />
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#087f23" />
          <Text style={styles.loadingText}>Cargando producto…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product && failed) {
    return <Redirect href={ROUTES.HOME} />;
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        leftIcon="arrow-left"
        rightIcon="share"
        onLeftPress={() => goBackToOrigin(originType, originId)}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} resizeMode="contain" style={styles.heroImage} />
          ) : null}
        </View>

        <View style={styles.summaryCard}>
          <Pressable style={styles.favoriteButton}>
            <FontAwesome name="heart" size={18} color="#087f23" />
          </Pressable>
          <Text style={styles.maker}>{product.maker.toUpperCase()}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.scoreCards}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>NUTRI-{'\n'}SCORE</Text>
              <ScoreBadge kind="nutri" value={product.nutriScore} />
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>NOVA{'\n'}GROUP</Text>
              <NovaBadge value={product.novaGroup} />
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>ECO-{'\n'}SCORE</Text>
              <ScoreBadge kind="eco" value={product.ecoScore} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <Metric label="Energy" value={product.energy} />
            <Metric label="Fat" value={product.fat} />
            <Metric label="Protein" value={product.protein} />
          </View>
        </View>

        <View style={styles.ingredientsCard}>
          <View style={styles.blockTitleRow}>
            <FontAwesome name="sliders" size={18} color="#087f23" style={styles.blockTitleIcon} />
            <Text style={styles.blockTitle}>Ingredients</Text>
          </View>
          <Text style={styles.ingredientsText}>{product.ingredients}</Text>
          <View style={styles.allergenBox}>
            <FontAwesome name="warning" size={18} color="#c70018" />
            <View style={styles.allergenTextBlock}>
              <Text style={styles.allergenTitle}>ALLERGEN INFORMATION</Text>
              <Text style={styles.allergenText}>{product.allergens}</Text>
            </View>
          </View>
        </View>

        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Nutritional Values (per 100ml)</Text>
          {product.nutrition.map((item) => (
            <View key={`${item.label}-${item.value}`} style={styles.nutritionRow}>
              <Text style={item.detail ? styles.nutritionDetailLabel : styles.nutritionLabel}>{item.label}</Text>
              <Text style={styles.nutritionValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function goBackToOrigin(originType?: 'categoria' | 'marca' | 'taste', originId?: string) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  if (originType === 'categoria' && originId) {
    router.replace(buildRoute(ROUTES.CATEGORIA, { nombre: originId }));
    return;
  }

  if (originType === 'marca' && originId) {
    router.replace(buildRoute(ROUTES.MARCA, { nombre: originId }));
    return;
  }

  if (originType === 'taste' && originId) {
    router.replace(buildRoute(ROUTES.TASTE, { nombre: originId }));
    return;
  }

  router.replace(ROUTES.HOME);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const SCORE_COLORS = {
  nutri: {
    A: '#038141',
    B: '#85bb2f',
    C: '#fecb02',
    D: '#ee8100',
    E: '#e63e11',
    '-': '#9b9b9b',
  },
  eco: {
    'A+': '#047d3f',
    A: '#1e9b50',
    'B+': '#69ad45',
    B: '#85bb2f',
    C: '#f5b921',
    D: '#ef7d20',
    E: '#df292f',
    '-': '#9b9b9b',
  },
} as const;

function ScoreBadge({
  kind,
  value,
}: {
  kind: 'nutri' | 'eco';
  value: Product['nutriScore'] | Product['ecoScore'];
}) {
  const colors = SCORE_COLORS[kind] as Record<string, string>;
  const darkText = value === 'C';

  return (
    <View style={[styles.gradeScore, { backgroundColor: colors[value] ?? colors['-'] }]}>
      <Text style={[styles.scoreValue, darkText && styles.scoreValueDark]}>{value}</Text>
    </View>
  );
}

const NOVA_COLORS: Record<Product['novaGroup'], string> = {
  1: '#a9ca45',
  2: '#f5a33a',
  3: '#ff7133',
  4: '#08b9dd',
  '?': '#9b9b9b',
};

function NovaBadge({ value }: { value: Product['novaGroup'] }) {
  return (
    <View style={[styles.gradeScore, { backgroundColor: NOVA_COLORS[value] }]}>
      <Text style={styles.scoreValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  hero: {
    height: 220,
    backgroundColor: '#ff6259',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f2',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6f727a',
    fontSize: 13,
    marginTop: 12,
  },
  summaryCard: {
    minHeight: 244,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -28,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 22,
  },
  favoriteButton: {
    position: 'absolute',
    right: 0,
    top: -24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#ffffff',
  },
  maker: {
    color: '#087f23',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  productName: {
    color: '#121318',
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 28,
  },
  scoreCards: {
    flexDirection: 'row',
    columnGap: 8,
    marginTop: 16,
  },
  scoreCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#f0f1f3',
  },
  scoreLabel: {
    color: '#575961',
    fontSize: 8,
    lineHeight: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  gradeScore: {
    minWidth: 28,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 6,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  scoreValueDark: {
    color: '#1e1e1e',
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 8,
    marginTop: 18,
  },
  metric: {
    flexGrow: 1,
    minWidth: 76,
    alignItems: 'center',
    backgroundColor: '#c9efc4',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  metricLabel: {
    color: '#4f6a52',
    fontSize: 8,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#294b30',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  ingredientsCard: {
    borderRadius: 16,
    backgroundColor: '#f0f1f3',
    marginHorizontal: 16,
    marginTop: 18,
    padding: 18,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  blockTitleIcon: {
    marginRight: 12,
  },
  blockTitle: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },
  ingredientsText: {
    color: '#222222',
    fontSize: 12,
    lineHeight: 18,
  },
  allergenBox: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#fff0ef',
    marginTop: 16,
    padding: 12,
  },
  allergenTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  allergenTitle: {
    color: '#c70018',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  allergenText: {
    color: '#c70018',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  nutritionCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
  },
  nutritionTitle: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  nutritionRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  nutritionLabel: {
    flex: 1,
    minWidth: 0,
    color: '#333333',
    fontSize: 12,
  },
  nutritionDetailLabel: {
    flex: 1,
    minWidth: 0,
    color: '#4d4d4d',
    fontSize: 10,
    fontStyle: 'italic',
    marginLeft: 12,
  },
  nutritionValue: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
  },
});
