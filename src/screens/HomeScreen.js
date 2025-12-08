import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategorySelector from '../components/CategorySelector';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { focusStorage } from '../utils/storage';

const HomeScreen = () => {
  const { 
    timeLeft, 
    isActive, 
    distractionCount, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    formatTime 
  } = useFocusTimer();

  const [category, setCategory] = useState('Kodlama');

  // DEBUG: Her saniye ekrana kalan süreyi yazdıralım
  // console.log(`Render - Süre: ${timeLeft}, Aktif: ${isActive}`);

  // SÜRE BİTTİĞİNDE ÇALIŞACAK FONKSİYON
  const handleSessionComplete = async () => {
    console.log("🏁 handleSessionComplete FONKSİYONU TETİKLENDİ!");

    const sessionData = {
      id: Date.now().toString(),
      category: category,
      startTime: Date.now(),
      duration: 25 * 60, // Normalde dinamik olmalı ama şimdilik sabit
      distractionCount: distractionCount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    console.log("💾 Kaydedilecek Veri Hazırlandı:", sessionData);

    try {
      const result = await focusStorage.saveSession(sessionData);
      console.log("✅ Kayıt Sonucu:", result);
      
      if (result) {
        Alert.alert(
          "Tebrikler! 🎉",
          `${category} seansını başarıyla tamamladın.`,
          [{ text: "Tamam", onPress: () => resetTimer() }]
        );
      }
    } catch (err) {
      console.error("❌ Kayıt sırasında hata:", err);
    }
  };

  // SÜRE TAKİBİ İÇİN EFFECT
  useEffect(() => {
    // Sadece süre tam 0 olduğunda çalışır
    if (timeLeft === 0) {
      console.log("⏰ SÜRE 0 OLDU! İşlem başlatılıyor...");
      handleSessionComplete();
    }
  }, [timeLeft]);

  const handleStart = () => {
    if (!category) {
      Alert.alert('Hata', 'Lütfen başlamadan önce bir kategori seçin.');
      return;
    }
    console.log("▶️ Sayaç Başlatıldı");
    startTimer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Odaklan</Text>
      </View>

      <View style={styles.categorySection}>
        <CategorySelector 
          selectedCategory={category} 
          onSelect={setCategory} 
          disabled={isActive}
        />
      </View>

      <View style={styles.timerContainer}>
        <View style={[styles.circle, isActive ? styles.circleActive : styles.circleInactive]}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'ODAKLANILIYOR' : (timeLeft === 0 ? 'BİTTİ' : 'HAZIR')}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="eye-off-outline" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{distractionCount}</Text>
          <Text style={styles.statLabel}>Dikkat Dağınıklığı</Text>
        </View>
      </View>

      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity style={styles.btnStart} onPress={handleStart}>
            <Text style={styles.btnText}>BAŞLAT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPause} onPress={pauseTimer}>
            <Text style={styles.btnText}>DURAKLAT</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnReset} onPress={resetTimer}>
          <Ionicons name="refresh" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  categorySection: { marginBottom: 30 },
  timerContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  circleActive: { borderColor: '#4a90e2' },
  circleInactive: { borderColor: '#e0e0e0' },
  timerText: { fontSize: 60, fontWeight: '200', color: '#333', fontVariant: ['tabular-nums'] },
  statusText: { fontSize: 14, letterSpacing: 2, marginTop: 10, color: '#888' },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginVertical: 5 },
  statLabel: { color: '#888', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  btnStart: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5
  },
  btnPause: {
    backgroundColor: '#FFAB00',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5
  },
  btnReset: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 30,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default HomeScreen;