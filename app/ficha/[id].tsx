import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import ProductInformationCards from '@/src/components/ProductInformationCards';
import { GradeBadge, NovaBadge } from '@/src/components/ScoreBadge';
import { useFavorites, useToggleFavorite } from '@/src/hooks/useFavorites';
import { useProduct } from '@/src/hooks/useProductQueries';
import { buildRoute, ROUTES } from '@/src/navigation/routes';

export default function ProductDetailScreen() {
  const { id, originType, originId } = useLocalSearchParams<{
    id: string;
    originType?: 'categoria' | 'marca' | 'taste';
    originId?: string;
  }>();
  const { data: product, isPending: loading, isError } = useProduct(id);
  const { data: favorites = [] } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = favorites.some((favorite) => favorite.id === id);

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

  if (!product && isError) {
    return <Redirect href={ROUTES.HOME} />;
  }

  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        leftIcon="arrow-left"
        onLeftPress={() => goBackToOrigin(originType, originId)}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} resizeMode="contain" style={styles.heroImage} />
          ) : null}
        </View>

        <View style={styles.summaryCard}>
          <Pressable
            accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            disabled={toggleFavorite.isPending}
            onPress={() => toggleFavorite.mutate({ product, isFavorite })}
            style={styles.favoriteButton}>
            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={18} color="#087f23" />
          </Pressable>
          <Text style={styles.maker}>{product.maker.toUpperCase()}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.scoreCards}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>NUTRI-{'\n'}SCORE</Text>
              <GradeBadge kind="nutri" value={product.nutriScore} />
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>NOVA{'\n'}GROUP</Text>
              <NovaBadge value={product.novaGroup} />
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>ECO-{'\n'}SCORE</Text>
              <GradeBadge kind="eco" value={product.ecoScore} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <Metric label="Energy" value={product.energy} />
            <Metric label="Fat" value={product.fat} />
            <Metric label="Protein" value={product.protein} />
          </View>
        </View>

        <ProductInformationCards product={product} />
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
});
