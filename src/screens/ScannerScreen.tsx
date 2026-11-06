import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  type Code,
  type CodeScanner,
} from 'react-native-vision-camera';
import { ScanFrame } from '../components/ScanFrame';
import { ScanResultBanner } from '../components/ScanResultBanner';
import { colors } from '../theme';
import type { Scan } from '../types/scan';
import { CODE_TYPES } from '../utils/scans';

interface Props {
  onScan: (scan: Scan) => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export function ScannerScreen({ onScan, onOpenHistory, historyCount }: Props) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionRequested, setPermissionRequested] = useState(false);
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1280, height: 720 } },
  ]);
  const [torchOn, setTorchOn] = useState(false);
  const [currentScan, setCurrentScan] = useState<Scan | null>(null);
  const lastScanRef = useRef<{ value: string; time: number } | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!hasPermission) {
      setPermissionRequested(true);
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  const codeScanner = useMemo<CodeScanner>(
    () => ({
      codeTypes: CODE_TYPES,
      onCodeScanned: (codes: Code[]) => {
        const code = codes[0];
        if (!code?.value) {
          return;
        }
        const now = Date.now();
        const last = lastScanRef.current;
        if (
          last &&
          last.value === code.value &&
          now - last.time < 2500
        ) {
          return;
        }
        lastScanRef.current = { value: code.value, time: now };

        Vibration.vibrate(80);
        const scan: Scan = {
          id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
          type: code.type,
          value: code.value,
          timestamp: now,
        };
        setCurrentScan(scan);
        onScan(scan);
      },
    }),
    [onScan],
  );

  const isActive = hasPermission && appState.current === 'active';

  const requestPermissionView = useCallback(
    () => (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>Camera permission needed</Text>
        <Text style={styles.centerBody}>
          {permissionRequested
            ? 'Permission was denied. Enable camera access in your device settings to scan barcodes.'
            : 'Grant camera access to scan 1D barcodes and QR codes.'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setPermissionRequested(true);
            requestPermission();
          }}
        >
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    ),
    [permissionRequested, requestPermission],
  );

  return (
    <View style={styles.container}>
      {device != null && hasPermission ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torchOn ? 'on' : 'off'}
          format={format}
        />
      ) : (
        <View style={styles.container}>
          {device == null ? (
            <View style={styles.center}>
              <Text style={styles.centerTitle}>No camera found</Text>
              <Text style={styles.centerBody}>
                This device has no rear camera available.
              </Text>
            </View>
          ) : (
            requestPermissionView()
          )}
        </View>
      )}

      {hasPermission && (
        <View style={styles.overlay}>
          <ScanFrame />

          <View style={styles.topBar}>
            <Text style={styles.title}>Barcode Scanner</Text>
            <TouchableOpacity style={styles.historyButton} onPress={onOpenHistory}>
              <Text style={styles.historyButtonText}>History</Text>
              {historyCount > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{historyCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.bottomRow,
              currentScan != null && styles.bottomRowRaised,
            ]}
          >
            <TouchableOpacity
              style={[styles.control, !device?.hasTorch && styles.controlDisabled]}
              onPress={() => setTorchOn(v => !v)}
              disabled={!device?.hasTorch}
            >
              <Text style={styles.controlText}>Flash</Text>
              <Text style={[styles.controlState, torchOn && styles.controlStateOn]}>
                {torchOn ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>

          {currentScan && (
            <ScanResultBanner
              scan={currentScan}
              onDismiss={() => setCurrentScan(null)}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  centerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  centerBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#052E1C',
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: colors.overlay,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  historyButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  countBadge: {
    marginLeft: 8,
    backgroundColor: colors.accent,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countBadgeText: {
    color: '#052E1C',
    fontSize: 11,
    fontWeight: '800',
  },
  bottomRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 34,
    alignItems: 'center',
  },
  bottomRowRaised: {
    bottom: 220,
  },
  control: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 96,
  },
  controlDisabled: {
    opacity: 0.4,
  },
  controlText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  controlState: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  controlStateOn: {
    color: colors.accent,
  },
});