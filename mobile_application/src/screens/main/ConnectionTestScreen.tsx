import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { checkApiConnection, checkEndpoints, getStoredAuth } from '../../services/diagnostics.service';

export default function ConnectionTestScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [fullResult, setFullResult] = useState<any[] | null>(null);
  const [authInfo, setAuthInfo] = useState<any | null>(null);

  const runCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await checkApiConnection();
      setResult(res);
    } catch (error) {
      setResult({ ok: false, message: (error as any)?.message || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  const runFullDiagnostics = async () => {
    setLoading(true);
    setFullResult(null);
    try {
      // gather auth info
      const auth = await getStoredAuth();
      setAuthInfo(auth);

      const endpoints = ['/users', '/tasks', '/channels'];
      const res = await checkEndpoints(endpoints);
      setFullResult(res);
    } catch (error) {
      setFullResult([{ endpoint: 'diag', ok: false, message: (error as any)?.message }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.default,
    },
    content: {
      padding: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 16,
    },
    resultBox: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: theme.background.paper,
      borderWidth: 1,
      borderColor: theme.border.light,
      marginBottom: 24,
    },
    statusText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 4,
    },
    detailText: {
      fontSize: 14,
      color: theme.text.secondary,
      marginTop: 4,
    },
    button: {
      backgroundColor: theme.primary[500],
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.primary[200] || theme.primary[500],
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
        <Text style={styles.title}>Backend Connection Test</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary[500]} />
        ) : (
          <View style={styles.resultBox}>
            {result ? (
              <>
                <Text style={styles.statusText}>
                  {result.ok ? 'Connected ✅' : 'Disconnected ❌'}
                </Text>
                {result.status !== undefined && (
                  <Text style={styles.detailText}>Status: {String(result.status)}</Text>
                )}
                {result.message && (
                  <Text style={styles.detailText}>{String(result.message)}</Text>
                )}
                {result.data && (
                  <Text style={styles.detailText}>Response: {JSON.stringify(result.data).slice(0, 200)}</Text>
                )}
              </>
            ) : (
              <Text style={styles.detailText}>No result yet. Tap "Retry" to test.</Text>
            )}
          </View>
        )}
        <TouchableOpacity style={[styles.button, { marginBottom: 8 }]} onPress={runCheck} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Checking...' : 'Retry'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={runFullDiagnostics} disabled={loading}>
          <Text style={[styles.buttonText, { color: theme.primary[600] }]}>{loading ? 'Running...' : 'Full Diagnostics'}</Text>
        </TouchableOpacity>

        {authInfo && (
          <View style={[styles.resultBox, { marginTop: 16 }]}> 
            <Text style={styles.statusText}>Auth Info</Text>
            <Text style={styles.detailText}>Token (SecureStore): {authInfo.tokenStored ? 'Present' : 'Not present'}</Text>
            <Text style={styles.detailText}>Token (AsyncStorage): {(authInfo as any).tokenAsync ? 'Present' : 'Not present'}</Text>
            <Text style={styles.detailText}>Token (Memory): {authInfo.tokenMemory ? 'Present' : 'Not present'}</Text>
            <Text style={styles.detailText}>Axios Authorization header: {(authInfo as any).axiosHeader ? 'Present' : 'Not present'}</Text>
            {authInfo.userStored && <Text style={styles.detailText}>User (stored): {authInfo.userStored?.email || authInfo.userStored?.name || '—'}</Text>}
            {authInfo.userMemory && <Text style={styles.detailText}>User (memory): {authInfo.userMemory?.email || authInfo.userMemory?.name || '—'}</Text>}
          </View>
        )}

        {fullResult && (
          <View style={[styles.resultBox, { marginTop: 16 }]}> 
            <Text style={styles.statusText}>Endpoint Results</Text>
            {fullResult.map((r, idx) => (
              <View key={idx} style={{ marginTop: 4 }}>
                <Text style={styles.detailText}>{r.endpoint}: {r.ok ? 'OK' : 'FAIL'} {r.status ? `(${r.status})` : ''}</Text>
                {r.message && <Text style={styles.detailText}>{r.message}</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
