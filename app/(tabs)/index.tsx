import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import { brands, categories, tastes } from '@/src/data/filters';
import { buildRoute, ROUTES } from '@/src/navigation/routes';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader leftIcon={null} onRightPress={() => router.push(buildRoute(ROUTES.AUTH))} rightIcon="profile" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          The art of <Text style={styles.titleAccent}>conscious</Text> discovery.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              key={category.label}
              href={buildRoute(ROUTES.CATEGORIA, { nombre: category.id })}
              asChild>
              <Pressable style={{ ...styles.categoryCard, backgroundColor: category.color }}>
                {category.icon ? (
                  <FontAwesome
                    name={category.icon}
                    size={34}
                    color="rgba(255,255,255,0.28)"
                    style={styles.categoryIcon}
                  />
                ) : null}
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text style={styles.tasteTitle}>Refine by Taste</Text>
        <View style={styles.chipWrap}>
          {tastes.map((taste) => (
            <Link key={taste.id} href={buildRoute(ROUTES.TASTE, { nombre: taste.id })} asChild>
              <Pressable style={styles.chip}>
                <Text style={styles.chipText}>{taste.id}</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <View style={styles.brandSection}>
          <Text style={styles.sectionTitle}>Global Brands</Text>
          <Text style={styles.caption}>Explored through the lens of quality.</Text>
          <View style={styles.brandGrid}>
            {brands.map((item) => (
              <Link key={item.name} href={buildRoute(ROUTES.MARCA, { nombre: item.id })} asChild>
                <Pressable style={styles.brandCard}>
                  {item.mark ? (
                    <View style={{ ...styles.brandMark, backgroundColor: item.color }}>
                      <Text style={{ ...styles.brandMarkText, color: item.text }}>{item.mark}</Text>
                    </View>
                  ) : (
                    <View style={styles.brandSpacer} />
                  )}
                  <Text style={styles.brandName}>{item.name}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 104,
  },
  title: {
    color: '#050505',
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    marginBottom: 40,
  },
  titleAccent: {
    color: '#007a22',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#050505',
    fontSize: 19,
    fontWeight: '500',
  },
  sectionLink: {
    color: '#006b22',
    fontSize: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  categoryCard: {
    width: '47.5%',
    aspectRatio: 0.86,
    borderRadius: 8,
    justifyContent: 'flex-end',
    padding: 12,
    overflow: 'hidden',
  },
  categoryIcon: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
  },
  categoryLabel: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.24)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tasteTitle: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 48,
    marginBottom: 16,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    minHeight: 29,
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#c9edc2',
    paddingHorizontal: 17,
  },
  chipText: {
    color: '#638466',
    fontSize: 11,
    fontWeight: '500',
  },
  brandSection: {
    marginTop: 54,
  },
  caption: {
    color: '#777777',
    fontSize: 10,
    marginTop: 6,
    marginBottom: 26,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  brandCard: {
    width: '46%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  brandMark: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    marginBottom: 18,
  },
  brandMarkText: {
    fontSize: 8,
    fontWeight: '700',
  },
  brandSpacer: {
    height: 70,
  },
  brandName: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  }
});
