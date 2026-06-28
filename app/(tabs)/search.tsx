import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import type { Product } from '@/src/data/catalog';
import { fichaShowRoute } from '@/src/navigation/routes';
import { searchProducts } from '@/src/services/openFoodFacts';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        setProducts(await searchProducts(normalizedQuery, controller.signal));
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setProducts([]);
          setError(requestError instanceof Error ? requestError.message : 'No se pudo realizar la búsqueda.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 450);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [normalizedQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Buscar productos</Text>
        <Text style={styles.subtitle}>Datos provistos por Open Food Facts</Text>

        <View style={styles.searchBox}>
          <FontAwesome name="search" size={21} color="#777b84" />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            onChangeText={setQuery}
            placeholder="Nombre, marca o código de barras"
            placeholderTextColor="#969aa3"
            returnKeyType="search"
            style={styles.input}
            value={query}
          />
          {query ? (
            <Pressable hitSlop={10} onPress={() => setQuery('')}>
              <FontAwesome name="times-circle" size={19} color="#a9adb5" />
            </Pressable>
          ) : null}
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color="#087f23" size="large" />
            <Text style={styles.stateText}>Buscando productos…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <FontAwesome name="exclamation-circle" size={28} color="#bd2432" />
            <Text style={styles.stateTitle}>No se pudo consultar el catálogo</Text>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        ) : normalizedQuery.length < 2 ? (
          <View style={styles.stateBox}>
            <FontAwesome name="barcode" size={34} color="#98a09a" />
            <Text style={styles.stateText}>Ingresá al menos 2 caracteres para buscar.</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.stateBox}>
            <FontAwesome name="search" size={28} color="#98a09a" />
            <Text style={styles.stateTitle}>Sin resultados</Text>
            <Text style={styles.stateText}>Probá con otro nombre, marca o código.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultCount}>{products.length} RESULTADOS</Text>
            <View style={styles.productList}>
              {products.map((product) => (
                <ProductResult key={product.id} product={product} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductResult({ product }: { product: Product }) {
  return (
    <Link href={fichaShowRoute(product.id)} asChild>
      <Pressable style={styles.card}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} resizeMode="contain" style={styles.productImage} />
        ) : (
          <View style={styles.imageFallback}>
            <FontAwesome name="cutlery" size={24} color="#bec2c8" />
          </View>
        )}
        <View style={styles.cardBody}>
          <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
          <Text numberOfLines={1} style={styles.maker}>{product.maker.toUpperCase()}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NUTRI-SCORE {product.nutriScore}</Text>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={18} color="#c7cad0" />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 90 },
  title: { color: '#121318', fontSize: 30, fontWeight: '900' },
  subtitle: { color: '#70737b', fontSize: 12, marginTop: 5 },
  searchBox: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  input: { flex: 1, color: '#202226', fontSize: 15, marginLeft: 10, paddingVertical: 0 },
  stateBox: { minHeight: 230, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  stateTitle: { color: '#26282d', fontSize: 17, fontWeight: '800', marginTop: 12, textAlign: 'center' },
  stateText: { color: '#747881', fontSize: 13, lineHeight: 19, marginTop: 9, textAlign: 'center' },
  resultCount: { color: '#71727c', fontSize: 11, letterSpacing: 1.5, marginVertical: 18 },
  productList: { rowGap: 10 },
  card: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 12,
  },
  productImage: { width: 76, height: 88, borderRadius: 8, backgroundColor: '#f2f3f4', marginRight: 13 },
  imageFallback: { width: 76, height: 88, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#eef0f2', marginRight: 13 },
  cardBody: { flex: 1, minWidth: 0, paddingRight: 8 },
  productName: { color: '#111216', fontSize: 16, fontWeight: '800', lineHeight: 20 },
  maker: { color: '#6d7078', fontSize: 10, marginTop: 5 },
  badge: { alignSelf: 'flex-start', borderRadius: 4, backgroundColor: '#087f23', marginTop: 10, paddingHorizontal: 8, paddingVertical: 5 },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: '900' },
});
