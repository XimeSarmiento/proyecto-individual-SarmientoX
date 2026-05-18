import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../../_components/AppHeader';
import { products } from '../../../data/catalog';

export default function ProductDetailScreen() {
  const { id, originType, originId } = useLocalSearchParams<{
    id: string;
    originType?: 'category' | 'brand';
    originId?: string;
  }>();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        leftIcon="arrow-left"
        rightIcon="share"
        onLeftPress={() => goBackToOrigin(originType, originId)}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero} />

        <View style={styles.summaryCard}>
          <Pressable style={styles.favoriteButton}>
            <FontAwesome name="heart" size={18} color="#087f23" />
          </Pressable>
          <Text style={styles.maker}>{product.maker.toUpperCase()}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.scoreCards}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>NUTRI-{'\n'}SCORE</Text>
              <View style={styles.greenScore}>
                <Text style={styles.scoreValue}>{product.nutriScore}</Text>
              </View>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>NOVA{'\n'}GROUP</Text>
              <View style={styles.yellowScore}>
                <Text style={styles.scoreValueDark}>{product.novaGroup}</Text>
              </View>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>ECO-{'\n'}SCORE</Text>
              <View style={styles.greenScore}>
                <Text style={styles.scoreValue}>{product.ecoScore}</Text>
              </View>
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

function goBackToOrigin(originType?: 'category' | 'brand', originId?: string) {
  if (originType === 'category' && originId) {
    router.replace({ pathname: '/category/[id]', params: { id: originId } });
    return;
  }

  if (originType === 'brand' && originId) {
    router.replace({ pathname: '/brand/[id]', params: { id: originId } });
    return;
  }

  router.back();
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
    paddingBottom: 34,
  },
  hero: {
    height: 360,
    backgroundColor: '#ff6259',
  },
  summaryCard: {
    minHeight: 328,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -40,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 34,
  },
  favoriteButton: {
    position: 'absolute',
    right: 0,
    top: -32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#ffffff',
  },
  maker: {
    color: '#087f23',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  productName: {
    color: '#121318',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
  },
  scoreCards: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 24,
  },
  scoreCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#f0f1f3',
  },
  scoreLabel: {
    color: '#575961',
    fontSize: 9,
    lineHeight: 13,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  greenScore: {
    minWidth: 34,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#08a347',
    marginTop: 8,
    paddingHorizontal: 7,
  },
  yellowScore: {
    minWidth: 34,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#f1c400',
    marginTop: 8,
    paddingHorizontal: 7,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  scoreValueDark: {
    color: '#1e1e1e',
    fontSize: 18,
    fontWeight: '900',
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 10,
    marginTop: 28,
  },
  metric: {
    flexGrow: 1,
    minWidth: 76,
    alignItems: 'center',
    backgroundColor: '#c9efc4',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricLabel: {
    color: '#4f6a52',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#294b30',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  ingredientsCard: {
    borderRadius: 22,
    backgroundColor: '#f0f1f3',
    marginHorizontal: 20,
    marginTop: 28,
    padding: 24,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  blockTitleIcon: {
    marginRight: 12,
  },
  blockTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
  },
  ingredientsText: {
    color: '#222222',
    fontSize: 14,
    lineHeight: 23,
  },
  allergenBox: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#fff0ef',
    marginTop: 24,
    padding: 16,
  },
  allergenTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  allergenTitle: {
    color: '#c70018',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  allergenText: {
    color: '#c70018',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  nutritionCard: {
    borderRadius: 22,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 22,
    padding: 24,
  },
  nutritionTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 22,
  },
  nutritionRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  nutritionLabel: {
    flex: 1,
    minWidth: 0,
    color: '#333333',
    fontSize: 14,
  },
  nutritionDetailLabel: {
    flex: 1,
    minWidth: 0,
    color: '#4d4d4d',
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 16,
  },
  nutritionValue: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },
});
