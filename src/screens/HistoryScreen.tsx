import Clipboard from '@react-native-clipboard/clipboard';
import { useState } from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme';
import type { Scan } from '../types/scan';
import {
  formatTimestamp,
  isOpenable,
  isUrl,
  typeLabel,
} from '../utils/scans';

interface Props {
  scans: Scan[];
  onBack: () => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

function HistorySeparator() {
  return <View style={styles.separator} />;
}

interface HistoryItemProps {
  scan: Scan;
  copied: boolean;
  onCopy: (scan: Scan) => void;
  onOpen: (scan: Scan) => void;
  onDelete: (id: string) => void;
}

function HistoryItem({
  scan,
  copied,
  onCopy,
  onOpen,
  onDelete,
}: HistoryItemProps) {
  const openable = isOpenable(scan.value);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{typeLabel(scan.type)}</Text>
        </View>
        <Text style={styles.time}>{formatTimestamp(scan.timestamp)}</Text>
        <TouchableOpacity onPress={() => onDelete(scan.id)} hitSlop={10}>
          <Text style={styles.delete}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.value} numberOfLines={3}>
        {scan.value}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => onCopy(scan)}
        >
          <Text style={styles.buttonPrimaryText}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !openable && styles.buttonDisabled]}
          onPress={() => onOpen(scan)}
          disabled={!openable}
        >
          <Text style={styles.buttonText}>
            {isUrl(scan.value) ? 'Open Link' : 'Open'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function HistoryScreen({ scans, onBack, onClear, onDelete }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (scan: Scan) => {
    if (scan.value) {
      Clipboard.setString(scan.value);
    }
    setCopiedId(scan.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const open = (scan: Scan) => {
    Linking.openURL(scan.value).catch(() => {});
  };

  const renderItem = ({ item }: { item: Scan }) => (
    <HistoryItem
      scan={item}
      copied={copiedId === item.id}
      onCopy={copy}
      onOpen={open}
      onDelete={onDelete}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity
          onPress={onClear}
          hitSlop={12}
          disabled={scans.length === 0}
          style={scans.length === 0 && styles.clearDisabled}
        >
          <Text style={styles.clear}>Clear</Text>
        </TouchableOpacity>
      </View>

      {scans.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptyBody}>
            Scan a barcode or QR code to see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={HistorySeparator}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    color: colors.text,
    fontSize: 22,
    paddingHorizontal: 4,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  clear: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  clearDisabled: {
    opacity: 0.4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  delete: {
    color: colors.textMuted,
    fontSize: 14,
    paddingHorizontal: 4,
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontFamily: 'monospace',
    lineHeight: 21,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
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
    fontSize: 13,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});