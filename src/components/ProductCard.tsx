import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/src/types/product';
import { fichaShowRoute } from '@/src/navigation/routes';
import { ECO_SCORE_COLORS, NUTRI_SCORE_COLORS } from '@/src/theme/scoreColors';

type ProductCardProps = {
  product: Product;
  originType?: 'categoria' | 'marca' | 'taste';
  originId?: string;
  compact?: boolean;
};

function ProductCard({ product, originType, originId, compact = false }: ProductCardProps) {
  return (
    <Link href={fichaShowRoute(product.id, originType, originId)} asChild>
      <Pressable style={styles.pressable}>
        <View style={[styles.card, compact && styles.compactCard]}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              resizeMode="contain"
              style={[styles.image, compact && styles.compactImage]}
            />
          ) : (
            <View style={[styles.image, compact && styles.compactImage]}>
              <FontAwesome name="cutlery" size={22} color="#c7c9cf" />
            </View>
          )}
          <View style={styles.body}>
            <Text numberOfLines={2} style={styles.name}>{product.name}</Text>
            <Text numberOfLines={1} style={styles.maker}>{product.maker.toUpperCase()}</Text>
            <View style={styles.scoreRow}>
              <View style={[styles.badge, { backgroundColor: NUTRI_SCORE_COLORS[product.nutriScore] }]}>
                <Text style={[styles.badgeText, product.nutriScore === 'C' && styles.darkText]}>
                  NUTRI-SCORE {product.nutriScore}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: ECO_SCORE_COLORS[product.ecoScore] }]}>
                <Text style={[styles.badgeText, product.ecoScore === 'C' && styles.darkText]}>
                  ECO-SCORE {product.ecoScore}
                </Text>
              </View>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color="#d1d3d8" />
        </View>
      </Pressable>
    </Link>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  pressable: { width: '100%', borderRadius: 10 },
  card: { width: '100%', height: 104, flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#ffffff', padding: 10, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  compactCard: { height: 104 },
  image: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: 7, backgroundColor: '#eef0f2', marginRight: 10 },
  compactImage: { width: 72, height: 72 },
  body: { flex: 1, minWidth: 0, paddingRight: 6 },
  name: { color: '#202126', fontSize: 13, fontWeight: '700', lineHeight: 16 },
  maker: { color: '#6d6e75', fontSize: 8, marginTop: 2 },
  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 6 },
  badge: { minHeight: 19, justifyContent: 'center', borderRadius: 2, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: '#ffffff', fontSize: 7, fontWeight: '800' },
  darkText: { color: '#1e1e1e' },
});
