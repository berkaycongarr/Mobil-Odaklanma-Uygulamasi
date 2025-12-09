import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // YENİ EKLENDİ
import { useEffect, useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategorySelector from '../components/CategorySelector';
import { COLORS, SHADOWS } from '../constants/theme';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { focusStorage } from '../utils/storage';

const HomeScreen = () => {
  const { 
    timeLeft, isActive, distractionCount, 
    startTimer, pauseTimer, resetTimer, formatTime 
  } = useFocusTimer();

  const [category, setCategory] = useState('Kodlama');

  const handleSessionComplete = async () => {
    const sessionData = {
      id: Date.now().toString(),
      category: category,
      startTime: Date.now(),
      duration: 25 * 60,
      distractionCount: distractionCount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    await focusStorage.saveSession(sessionData);
    Alert.alert("Harika İş! 🎉", `${category} seansını tamamladın.`);
  };

  useEffect(() => {
    if (timeLeft === 0) handleSessionComplete();
  }, [timeLeft]);

  const handleStart = () => {
    if (!category) return Alert.alert('Hata', 'Kategori seçiniz.');
    startTimer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Üst Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.headerTitle}>Bugün Odaklanalım</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <CategorySelector 
        selectedCategory={category} 
        onSelect={setCategory} 
        disabled={isActive}
      />

      {/* Zamanlayıcı Dairesi */}
      <View style={styles.timerWrapper}>
        <View style={[styles.outerCircle, SHADOWS.medium]}>
            <View style={styles.innerCircle}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={[styles.statusText, { color: isActive ? COLORS.success : COLORS.textLight }]}>
                    {isActive ? 'ODAKLANILIYOR' : 'HAZIR MISIN?'}
                </Text>
            </View>
        </View>
      </View>

      {/* İstatistik Kartı (Dikkat Dağınıklığı) */}
      <View style={[styles.statCard, SHADOWS.small]}>
        <View style={styles.statInfo}>
            <Text style={styles.statLabel}>Dikkat Dağınıklığı</Text>
            <Text style={styles.statSub}>Bu seansta</Text>
        </View>
        <View style={styles.statValueContainer}>
            <Text style={[styles.statValue, { color: distractionCount > 0 ? COLORS.secondary : COLORS.success }]}>
                {distractionCount}
            </Text>
            <Ionicons name={distractionCount > 0 ? "alert-circle" : "checkmark-circle"} size={24} color={distractionCount > 0 ? COLORS.secondary : COLORS.success} />
        </View>
      </View>

      {/* Kontrol Butonları */}
      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity onPress={handleStart} style={styles.mainBtnWrapper}>
            <LinearGradient
                colors={['#6C63FF', '#5A52E0']}
                style={styles.mainBtn}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
                <Text style={styles.mainBtnText}>Odaklanmayı Başlat</Text>
                <Ionicons name="play" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pauseTimer} style={styles.mainBtnWrapper}>
             <LinearGradient
                colors={[COLORS.accent, '#FFA502']}
                style={styles.mainBtn}
            >
                <Text style={styles.mainBtnText}>Duraklat</Text>
                <Ionicons name="pause" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.resetBtn} onPress={resetTimer}>
            <Text style={styles.resetText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 24 },
  
  header: { 
      marginTop: 20, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
  },
  greeting: { fontSize: 16, color: COLORS.textLight, fontWeight: '500' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  profileButton: {
      padding: 10,
      backgroundColor: '#EBEBF5',
      borderRadius: 12
  },

  timerWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
  outerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  innerCircle: {
      width: 250,
      height: 250,
      borderRadius: 125,
      borderWidth: 10,
      borderColor: '#F4F4F8',
      justifyContent: 'center',
      alignItems: 'center'
  },
  timerText: { 
      fontSize: 68, 
      fontWeight: '700', 
      color: COLORS.text, 
      fontVariant: ['tabular-nums'],
      letterSpacing: -2
  },
  statusText: { fontSize: 14, fontWeight: '600', marginTop: 10, letterSpacing: 1.5 },

  statCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30
  },
  statLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  statSub: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  statValueContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statValue: { fontSize: 24, fontWeight: '800' },

  controls: { alignItems: 'center', gap: 15 },
  mainBtnWrapper: { width: '100%', ...SHADOWS.medium },
  mainBtn: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 18,
      borderRadius: 25,
      gap: 10
  },
  mainBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  resetBtn: { padding: 10 },
  resetText: { color: COLORS.textLight, fontWeight: '600' }
});

export default HomeScreen;