import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import { useAuth } from '@/src/providers/AuthProvider';
import { signInWithEmail, signOut, signUpWithEmail } from '@/src/services/auth.service';

export default function AuthScreen() {
  const { initialized, isConfigured, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [loading, setLoading] = useState(false);

  const submitLabel = mode === 'signIn' ? 'Log in' : 'Create account';

  async function handleSubmit() {
    if (!email.trim() || !password) {
      Alert.alert('Missing data', 'Enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signIn') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        Alert.alert('Account created', 'Check your email if Supabase asks for confirmation.');
      }
    } catch (error) {
      Alert.alert('Authentication error', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Sign out error', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!initialized) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader leftIcon="arrow-left" onLeftPress={() => router.back()} title="Account" />
        <View style={styles.centerState}>
          <ActivityIndicator color="#087f23" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader leftIcon="arrow-left" onLeftPress={() => router.back()} title="Account" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.keyboard}>
        <View style={styles.content}>
          {!isConfigured ? (
            <View style={styles.stateCard}>
              <FontAwesome name="exclamation-circle" size={30} color="#bd2432" />
              <Text style={styles.stateTitle}>Supabase is not configured</Text>
              <Text style={styles.stateText}>
                Complete EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env, then restart Expo.
              </Text>
            </View>
          ) : user ? (
            <View style={styles.stateCard}>
              <FontAwesome name="user-circle-o" size={38} color="#087f23" />
              <Text style={styles.stateTitle}>Logged in</Text>
              <Text numberOfLines={2} style={styles.stateText}>{user.email}</Text>
              <Pressable disabled={loading} onPress={handleSignOut} style={styles.secondaryButton}>
                {loading ? <ActivityIndicator color="#087f23" /> : <Text style={styles.secondaryButtonText}>Log out</Text>}
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.segment}>
                <Pressable
                  onPress={() => setMode('signIn')}
                  style={[styles.segmentButton, mode === 'signIn' && styles.segmentButtonActive]}>
                  <Text style={[styles.segmentText, mode === 'signIn' && styles.segmentTextActive]}>Log in</Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode('signUp')}
                  style={[styles.segmentButton, mode === 'signUp' && styles.segmentButtonActive]}>
                  <Text style={[styles.segmentText, mode === 'signUp' && styles.segmentTextActive]}>Register</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#969aa3"
                style={styles.input}
                value={email}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor="#969aa3"
                secureTextEntry
                style={styles.input}
                value={password}
              />

              <Pressable disabled={loading} onPress={handleSubmit} style={styles.primaryButton}>
                {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>{submitLabel}</Text>}
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  keyboard: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 40 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  form: { width: '100%' },
  segment: { height: 44, flexDirection: 'row', borderRadius: 8, backgroundColor: '#e7e9ec', marginBottom: 28, padding: 4 },
  segmentButton: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  segmentButtonActive: { backgroundColor: '#ffffff' },
  segmentText: { color: '#686c74', fontSize: 13, fontWeight: '800' },
  segmentTextActive: { color: '#087f23' },
  label: { color: '#3a3d43', fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 14 },
  input: { height: 52, borderRadius: 8, backgroundColor: '#ffffff', color: '#202226', fontSize: 15, paddingHorizontal: 14 },
  primaryButton: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#087f23', marginTop: 24 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  secondaryButton: { height: 48, minWidth: 144, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#087f23', marginTop: 24, paddingHorizontal: 18 },
  secondaryButtonText: { color: '#087f23', fontSize: 13, fontWeight: '900' },
  stateCard: { alignItems: 'center', borderRadius: 8, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 28 },
  stateTitle: { color: '#26282d', fontSize: 18, fontWeight: '900', marginTop: 12, textAlign: 'center' },
  stateText: { color: '#747881', fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: 'center' },
});
