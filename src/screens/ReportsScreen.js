import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, SHADOWS } from '../constants/theme';
import { calculateStats } from '../utils/statsHelper';
import { focusStorage } from '../utils/storage';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const history = await focusStorage.getHistory();
    const processedStats = calculateStats(history);
    setStats(processedStats);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }


  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`, 
    labelColor: (opacity = 1) => COLORS.textLight,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0, 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Haftalık Analiz</Text>
        <Text style={styles.headerSubtitle}>Performans Raporların</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadData} 
            tintColor={COLORS.primary} 
          />
        }
        showsVerticalScrollIndicator={false}
      >
        
        {}
        <View style={styles.statsRow}>
          {}
          <View style={[styles.card, SHADOWS.small]}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="today" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.cardValue}>{stats?.todayDuration || 0}</Text>
            <Text style={styles.cardLabel}>Bugün (dk)</Text>
          </View>

          {}
          <View style={[styles.card, SHADOWS.small]}>
             <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="time" size={18} color={COLORS.success} />
            </View>
            <Text style={[styles.cardValue, { color: COLORS.success }]}>{stats?.totalDuration || 0}</Text>
            <Text style={styles.cardLabel}>Toplam (dk)</Text>
          </View>

          {}
          <View style={[styles.card, SHADOWS.small]}>
            <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="alert-circle" size={18} color={COLORS.secondary} />
            </View>
            <Text style={[styles.cardValue, { color: COLORS.secondary }]}>{stats?.totalDistractions || 0}</Text>
            <Text style={styles.cardLabel}>Odak Kaybı</Text>
          </View>
        </View>

        {}
        <View style={[styles.chartCard, SHADOWS.medium]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
            <Ionicons name="pie-chart" size={20} color={COLORS.textLight} />
          </View>
          
          {stats?.pieData?.length > 0 ? (
            <PieChart
              data={stats.pieData}
              width={screenWidth - 60} 
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"0"}
              center={[10, 0]}
              absolute
            />
          ) : (
            <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>Henüz veri yok 📉</Text>
            </View>
          )}
        </View>

        {}
        <View style={[styles.chartCard, SHADOWS.medium]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Son 7 Gün (Dakika)</Text>
            <Ionicons name="bar-chart" size={20} color={COLORS.textLight} />
          </View>

          <BarChart
            data={stats?.barData || { labels: [], datasets: [{ data: [] }] }}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            fromZero
            showBarTops={false}
            showValuesOnTopOfBars
            style={{ borderRadius: 16, marginTop: 10 }}
          />
        </View>
        
        {}
        <View style={{ height: 20 }} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: COLORS.text 
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
    marginTop: 4
  },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  
 
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25
  },
  card: {
    width: '31%',
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8
  },
  cardValue: { 
      fontSize: 20, 
      fontWeight: '800', 
      marginBottom: 2, 
      color: COLORS.primary 
  },
  cardLabel: { 
      fontSize: 11, 
      color: COLORS.textLight, 
      fontWeight: '600' 
  },

  
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
  },
  chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text
  },
  noDataContainer: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center'
  },
  noDataText: {
      color: COLORS.textLight,
      fontSize: 16
  }
});

export default ReportsScreen;