import { StyleSheet, Text, View } from 'react-native';

import type { Product } from '@/src/data/catalog';
import { ECO_SCORE_COLORS, NOVA_COLORS, NUTRI_SCORE_COLORS } from '@/src/theme/scoreColors';

type GradeBadgeProps =
  | { kind: 'nutri'; value: Product['nutriScore'] }
  | { kind: 'eco'; value: Product['ecoScore'] };

export function GradeBadge({ kind, value }: GradeBadgeProps) {
  const color = kind === 'nutri'
    ? NUTRI_SCORE_COLORS[value as Product['nutriScore']]
    : ECO_SCORE_COLORS[value as Product['ecoScore']];

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.value, value === 'C' && styles.darkValue]}>{value}</Text>
    </View>
  );
}

export function NovaBadge({ value }: { value: Product['novaGroup'] }) {
  return (
    <View style={[styles.badge, { backgroundColor: NOVA_COLORS[value] }]}>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { minWidth: 28, height: 25, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: 5, paddingHorizontal: 6 },
  value: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  darkValue: { color: '#1e1e1e' },
});
