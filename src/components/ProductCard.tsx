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
      <Pressable style={[styles.card, compact && styles.compactCard]}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            resizeMode="contain"
            style={[styles.image, compact && styles.compactImage]}
          />
        ) : (
          <View style={[styles.image, compact && styles.compactImage]}>
            <FontAwesome name="cutlery" size={compact ? 24 : 28} color="#c7c9cf" />
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
            {!compact ? (
              <View style={[styles.badge, { backgroundColor: ECO_SCORE_COLORS[product.ecoScore] }]}>
                <Text style={[styles.badgeText, product.ecoScore === 'C' && styles.darkText]}>
                  ECO-SCORE {product.ecoScore}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <FontAwesome name="chevron-right" size={compact ? 18 : 22} color="#d1d3d8" />
      </Pressable>
    </Link>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: { minHeight: 128, flexDirection: 'row', alignItems: 'center', borderRadius: 12, backgroundColor: '#ffffff', padding: 12, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  compactCard: { minHeight: 116 },
  image: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#eef0f2', marginRight: 12 },
  compactImage: { width: 76, height: 88 },
  body: { flex: 1, minWidth: 0, paddingRight: 8 },
  name: { color: '#050505', fontSize: 16, fontWeight: '800', lineHeight: 20 },
  maker: { color: '#6d6e75', fontSize: 10, marginTop: 4 },
  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 9 },
  badge: { minHeight: 26, justifyContent: 'center', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: '900' },
  darkText: { color: '#1e1e1e' },
});
