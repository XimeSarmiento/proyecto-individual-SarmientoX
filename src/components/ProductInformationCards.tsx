import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/src/data/catalog';
import MissingInformation from './MissingInformation';

export default function ProductInformationCards({ product }: { product: Product }) {
  return (
    <>
      <View style={styles.ingredientsCard}>
        <View style={styles.blockTitleRow}>
          <FontAwesome name="sliders" size={18} color="#087f23" style={styles.blockTitleIcon} />
          <Text style={styles.blockTitle}>Ingredients</Text>
        </View>
        {product.hasIngredients ? <Text style={styles.ingredientsText}>{product.ingredients}</Text> : <MissingInformation />}
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
        {product.hasNutritionInfo ? product.nutrition.map((item) => (
          <View key={`${item.label}-${item.value}`} style={styles.nutritionRow}>
            <Text style={item.detail ? styles.nutritionDetailLabel : styles.nutritionLabel}>{item.label}</Text>
            <Text style={styles.nutritionValue}>{item.value}</Text>
          </View>
        )) : <MissingInformation />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ingredientsCard: { borderRadius: 16, backgroundColor: '#f0f1f3', marginHorizontal: 16, marginTop: 18, padding: 18 },
  blockTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  blockTitleIcon: { marginRight: 12 },
  blockTitle: { color: '#111111', fontSize: 16, fontWeight: '800' },
  ingredientsText: { color: '#222222', fontSize: 12, lineHeight: 18 },
  allergenBox: { flexDirection: 'row', borderRadius: 10, backgroundColor: '#fff0ef', marginTop: 16, padding: 12 },
  allergenTextBlock: { flex: 1, marginLeft: 12 },
  allergenTitle: { color: '#c70018', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  allergenText: { color: '#c70018', fontSize: 11, lineHeight: 16, marginTop: 4 },
  nutritionCard: { borderRadius: 16, backgroundColor: '#ffffff', marginHorizontal: 16, marginTop: 16, padding: 18 },
  nutritionTitle: { color: '#111111', fontSize: 16, fontWeight: '800', marginBottom: 12 },
  nutritionRow: { minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 12, borderBottomWidth: 1, borderBottomColor: '#eeeeee' },
  nutritionLabel: { flex: 1, minWidth: 0, color: '#333333', fontSize: 12 },
  nutritionDetailLabel: { flex: 1, minWidth: 0, color: '#4d4d4d', fontSize: 10, fontStyle: 'italic', marginLeft: 12 },
  nutritionValue: { color: '#111111', fontSize: 12, fontWeight: '800', textAlign: 'right' },
});
