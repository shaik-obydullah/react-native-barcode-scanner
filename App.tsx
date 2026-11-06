import { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { colors } from './src/theme';
import type { Scan } from './src/types/scan';

function App() {
  const [screen, setScreen] = useState<'scanner' | 'history'>('scanner');
  const [scans, setScans] = useState<Scan[]>([]);

  const handleScan = useCallback((scan: Scan) => {
    setScans(prev => [scan, ...prev]);
  }, []);

  const handleClear = useCallback(() => setScans([]), []);
  const handleDelete = useCallback((id: string) => {
    setScans(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AppContent
        screen={screen}
        scans={scans}
        onScan={handleScan}
        onClear={handleClear}
        onDelete={handleDelete}
        onOpenHistory={() => setScreen('history')}
        onOpenScanner={() => setScreen('scanner')}
      />
    </SafeAreaProvider>
  );
}

interface AppContentProps {
  screen: 'scanner' | 'history';
  scans: Scan[];
  onScan: (scan: Scan) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  onOpenHistory: () => void;
  onOpenScanner: () => void;
}

function AppContent({
  screen,
  scans,
  onScan,
  onClear,
  onDelete,
  onOpenHistory,
  onOpenScanner,
}: AppContentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {screen === 'scanner' ? (
        <ScannerScreen
          onScan={onScan}
          onOpenHistory={onOpenHistory}
          historyCount={scans.length}
        />
      ) : (
        <HistoryScreen
          scans={scans}
          onBack={onOpenScanner}
          onClear={onClear}
          onDelete={onDelete}
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
});

export default App;