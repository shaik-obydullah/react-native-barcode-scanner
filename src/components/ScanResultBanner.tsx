import { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../theme';
import type { Scan } from '../types/scan';
import {
  isBarcode1D,
  isOpenable,
  isUrl,
  typeLabel,
} from '../utils/scans';

interface Props {
  scan: Scan;
  onDismiss: () => void;
}

export function ScanResultBanner({ scan, onDismiss }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [scan.id]);

  const openable = isOpenable(scan.value);
  const url = isUrl(scan.value);

  const copy = () => {
    if (scan.value) {
      Clipboard.setString(scan.value);
    }
    setCopied(true);
  };

  const open = () => {
    Linking.openURL(scan.value).catch(() => {});
  };

  return (
    <View style={styles.banner} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {isBarcode1D(scan.type) ? '1D' : '2D'} · {typeLabel(scan.type)}
              </Text>
            </View>
            <Text style={styles.time}>{new Date(scan.timestamp).toLocaleTimeString()}</Text>
          </View>
          <TouchableOpacity onPress={onDismiss} hitSlop={12}>
            <Text style={styles.dismiss}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.value} numberOfLines={2}>
          {scan.value}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={copy}>
            <Text style={styles.buttonPrimaryText}>{copied ? 'Copied' : 'Copy'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !openable && styles.buttonDisabled]}
            onPress={open}
            disabled={!openable}
          >
            <Text style={styles.buttonText}>{url ? 'Open Link' : 'Open'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 34,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: colors.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
  },
  dismiss: {
    color: colors.textMuted,
    fontSize: 16,
    paddingHorizontal: 4,
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontFamily:
      Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 24,
  },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  buttonPrimaryText: {
    color: '#052E1C',
    fontWeight: '700',
  },
  buttonText: {
    color: colors.text,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});