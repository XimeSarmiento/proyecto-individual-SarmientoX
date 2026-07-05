import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQueryClient } from '@tanstack/react-query';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fichaShowRoute } from '@/src/navigation/routes';
import { productQueryOptions } from '@/src/hooks/useProductQueries';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] as const;

export default function ScannerScreen() {
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Ubicá el código de barras dentro del recuadro.');

  const handleBarcode = ({ data }: BarcodeScanningResult) => {
    if (code || loading) return;
    setCode(data.trim());
    setMessage(`Código detectado: ${data.trim()}`);
  };

  const viewProduct = async () => {
    if (!code || loading) return;
    setLoading(true);
    setMessage('Buscando producto…');

    try {
      const product = await queryClient.fetchQuery(productQueryOptions(code));
      if (!product) {
        setMessage('No se encontró el producto en Open Food Facts.');
        return;
      }
      router.replace(fichaShowRoute(product.id));
    } catch {
      setMessage('No se pudo consultar la API. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const scanAgain = () => {
    setCode(null);
    setMessage('Ubicá el código de barras dentro del recuadro.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.cameraArea}>
        {permission?.granted ? (
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
            facing="back"
            onBarcodeScanned={code ? undefined : handleBarcode}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={styles.permissionState}>
            <FontAwesome name="camera" size={38} color="#087f23" />
            <Text style={styles.permissionText}>Se necesita permiso para usar la cámara.</Text>
            {permission ? (
              <Pressable onPress={requestPermission} style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>Permitir cámara</Text>
              </Pressable>
            ) : (
              <ActivityIndicator color="#087f23" />
            )}
          </View>
        )}

        <Pressable accessibilityLabel="Volver" hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#ffffff" />
        </Pressable>
        {permission?.granted ? <View pointerEvents="none" style={styles.scanFrame} /> : null}
      </View>

      <View style={styles.controls}>
        <Text numberOfLines={2} style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          {code ? (
            <Pressable disabled={loading} onPress={scanAgain} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Escanear otra vez</Text>
            </Pressable>
          ) : null}
          <Pressable
            disabled={!code || loading}
            onPress={viewProduct}
            style={[styles.productButton, (!code || loading) && styles.disabledButton]}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.productButtonText}>Ver producto</Text>}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  cameraArea: { flex: 4, overflow: 'hidden', backgroundColor: '#111111' },
  controls: { flex: 1, minHeight: 130, justifyContent: 'center', backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 14 },
  backButton: { position: 'absolute', top: 16, left: 16, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)' },
  scanFrame: { position: 'absolute', left: '10%', right: '10%', top: '38%', height: 150, borderWidth: 3, borderColor: '#ffffff', borderRadius: 14, backgroundColor: 'transparent' },
  permissionState: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f2', paddingHorizontal: 30 },
  permissionText: { color: '#33363a', fontSize: 15, lineHeight: 22, marginVertical: 16, textAlign: 'center' },
  permissionButton: { borderRadius: 10, backgroundColor: '#087f23', paddingHorizontal: 22, paddingVertical: 13 },
  permissionButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  message: { color: '#555960', fontSize: 12, lineHeight: 17, marginBottom: 10, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', columnGap: 10 },
  productButton: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#087f23', paddingHorizontal: 18 },
  disabledButton: { backgroundColor: '#aeb7b0' },
  productButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  secondaryButton: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#087f23', borderRadius: 10, paddingHorizontal: 12 },
  secondaryButtonText: { color: '#087f23', fontSize: 12, fontWeight: '800', textAlign: 'center' },
});
