import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // Sayfa her odaklandığında veriyi yenile
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  if (loading || !stats) {
    return (
      <View style={styles.center}>
        <Text>Veriler yükleniyor...</Text>
      </View>
    );
  }

  // Grafik Ayarları
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.7,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Raporlar</Text>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
      >
        
        {/* Özet Kartları */}
        <View style={styles.statsRow}>
          <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.cardValue}>{stats.todayDuration} dk</Text>
            <Text style={styles.cardLabel}>Bugün</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.cardValue}>{stats.totalDuration} dk</Text>
            <Text style={styles.cardLabel}>Toplam</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.cardValue}>{stats.totalDistractions}</Text>
            <Text style={styles.cardLabel}>Dağılma</Text>
          </View>
        </View>

        {/* Pasta Grafik (Kategori Dağılımı) */}
        {stats.pieData.length > 0 ? (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Kategori Dağılımı</Text>
            <PieChart
              data={stats.pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>
        ) : (
          <Text style={styles.noDataText}>Henüz veri yok.</Text>
        )}

        {/* Çubuk Grafik (Haftalık Analiz) */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Son 7 Gün (Dakika)</Text>
          <BarChart
            data={stats.barData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix="dk"
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    margin: 20, 
    color: '#333' 
  },
  scrollContent: { paddingBottom: 40 },
  
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    marginBottom: 30
  },
  card: {
    width: '30%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2
  },
  cardValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardLabel: { fontSize: 12, color: '#555' },

  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20
  }
});

export default ReportsScreen;