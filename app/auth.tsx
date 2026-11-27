import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '@/src/components/AppHeader';
import { buildRoute, ROUTES } from '@/src/navigation/routes';
import { useAuth } from '@/src/providers/AuthProvider';
import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '@/src/services/auth.service';

export default function AuthScreen() {
  const { reason, returnTo } = useLocalSearchParams<{
    reason?: 'favorites' | 'save-favorite';
    returnTo?: string;
  }>();
  const { initialized, isConfigured, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lastCharacter, setLastCharacter] = useState('');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!lastCharacter) return;
    const timeout = setTimeout(() => setLastCharacter(''), 2200);
    return () => clearTimeout(timeout);
  }, [lastCharacter, password]);

  function handlePasswordChange(nextPassword: string) {
    setLastCharacter(nextPassword.length === password.length + 1 ? nextPassword.slice(-1) : '');
    setPassword(nextPassword);
  }

  const submitLabel = mode === 'signIn' ? 'Log in' : 'Create account';
  const authReasonText = getAuthReasonText(reason);

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
      }
      navigateAfterAuth(returnTo, reason);
    } catch (error) {
      Alert.alert('Authentication error', getAuthErrorMessage(error));
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
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          {!isConfigured ? (
            <View style={styles.stateCard}>
              <FontAwesome name="exclamation-circle" size={30} color="#bd2432" />
              <Text style={styles.stateTitle}>Firebase is not configured</Text>
              <Text style={styles.stateText}>
                Complete the EXPO_PUBLIC_FIREBASE_* values in .env, then restart Expo.
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
              {authReasonText ? (
                <View style={styles.notice}>
                  <FontAwesome name="lock" size={18} color="#087f23" />
                  <Text style={styles.noticeText}>{authReasonText}</Text>
                </View>
              ) : null}

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
              <View style={styles.passwordField}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
                  onBlur={() => setLastCharacter('')}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250)}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#969aa3"
                  secureTextEntry={!showPassword}
                  caretHidden={Boolean(lastCharacter && !showPassword)}
                  style={[styles.passwordInput, lastCharacter && !showPassword && styles.passwordInputPreview]}
                  value={password}
                />
                {!showPassword && lastCharacter ? (
                  <Text pointerEvents="none" numberOfLines={1} style={styles.passwordPreview}>
                    {'•'.repeat(password.length - 1)}{lastCharacter}
                  </Text>
                ) : null}
                <Pressable
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  onPress={() => {
                    setShowPassword((visible) => !visible);
                    setLastCharacter('');
                  }}
                  style={styles.visibilityButton}>
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#6f727a" />
                </Pressable>
              </View>

              <Pressable disabled={loading} onPress={handleSubmit} style={styles.primaryButton}>
                {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>{submitLabel}</Text>}
              </Pressable>

            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getAuthErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  switch (code) {
    case 'auth/email-already-in-use': return 'This email already has an account. Log in instead.';
    case 'auth/invalid-email': return 'Enter a valid email address.';
    case 'auth/weak-password': return 'Choose a stronger password.';
    case 'auth/invalid-credential': return 'The email or password is incorrect.';
    case 'auth/network-request-failed': return 'Check your internet connection and try again.';
    default: return error instanceof Error ? error.message : 'Try again.';
  }
}

function getAuthReasonText(reason?: 'favorites' | 'save-favorite') {
  if (reason === 'favorites') {
    return 'You need to log in or register to view and sync your favorites.';
  }

  if (reason === 'save-favorite') {
    return 'You need to log in or register before saving this product as a favorite.';
  }

  return null;
}

function navigateAfterAuth(returnTo?: string, reason?: 'favorites' | 'save-favorite') {
  if (returnTo === ROUTES.TABS_FAVORITES) {
    router.replace(buildRoute(ROUTES.TABS_FAVORITES));
    return;
  }

  if (reason && router.canGoBack()) {
    router.back();
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f8' },
  keyboard: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 24 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  form: { width: '100%' },
  notice: { minHeight: 58, flexDirection: 'row', alignItems: 'center', columnGap: 12, borderRadius: 8, backgroundColor: '#e9f6e7', marginBottom: 22, paddingHorizontal: 14, paddingVertical: 12 },
  noticeText: { flex: 1, color: '#315f38', fontSize: 13, fontWeight: '700', lineHeight: 18 },
  segment: { height: 44, flexDirection: 'row', borderRadius: 8, backgroundColor: '#e7e9ec', marginBottom: 28, padding: 4 },
  segmentButton: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  segmentButtonActive: { backgroundColor: '#ffffff' },
  segmentText: { color: '#686c74', fontSize: 13, fontWeight: '800' },
  segmentTextActive: { color: '#087f23' },
  label: { color: '#3a3d43', fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 14 },
  input: { height: 52, borderRadius: 8, backgroundColor: '#ffffff', color: '#202226', fontSize: 15, paddingHorizontal: 14 },
  passwordField: { height: 52, flexDirection: 'row', alignItems: 'center', borderRadius: 8, backgroundColor: '#ffffff' },
  passwordInput: { flex: 1, height: 52, color: '#202226', fontSize: 15, paddingLeft: 14 },
  passwordInputPreview: { color: 'transparent' },
  passwordPreview: { position: 'absolute', left: 14, right: 52, height: 52, lineHeight: 52, color: '#202226', fontSize: 15 },
  visibilityButton: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#087f23', marginTop: 24 },
  primaryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  secondaryButton: { height: 48, minWidth: 144, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#087f23', marginTop: 24, paddingHorizontal: 18 },
  secondaryButtonText: { color: '#087f23', fontSize: 13, fontWeight: '900' },
  stateCard: { alignItems: 'center', borderRadius: 8, backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 28 },
  stateTitle: { color: '#26282d', fontSize: 18, fontWeight: '900', marginTop: 12, textAlign: 'center' },
  stateText: { color: '#747881', fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: 'center' },
});
