import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useFocusTimer } from '../hooks/useFocusTimer';
import CategorySelector from '../components/CategorySelector';
import { focusStorage } from '../utils/storage';
import { COLORS, SHADOWS } from '../constants/theme';

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

      
        if (Platform.OS === 'web') {
            window.alert(`Harika İş! 🎉\n${category} seansını başarıyla tamamladın.`);
            resetTimer();
        } else {
            Alert.alert(
                "Harika İş! 🎉",
                `${category} seansını başarıyla tamamladın.`,
                [
                    { text: "Yeni Seans Başlat", onPress: () => resetTimer() }
                ]
            );
        }
    };

    useEffect(() => {
        if (timeLeft === 0) {
            handleSessionComplete();
        }
    }, [timeLeft]);

    const handleStart = () => {
        if (!category) {
            if (Platform.OS === 'web') window.alert('Lütfen bir kategori seçin.');
            else Alert.alert('Hata', 'Lütfen bir kategori seçin.');
            return;
        }
        if (timeLeft === 0) {
            resetTimer();
            return;
        }
        startTimer();
    };

   
    const handleResetWithAlert = () => {
        if (!isActive) {
            resetTimer();
            return;
        }

        if (Platform.OS === 'web') {
           
            const confirmed = window.confirm("Seansı iptal etmek istiyor musun? Mevcut ilerlemen silinecek.");
            if (confirmed) {
                resetTimer();
            }
        } else {
            
            Alert.alert(
                "Seansı İptal Et",
                "Mevcut ilerlemen silinecek. Emin misin?",
                [
                    { text: "Vazgeç", style: "cancel" },
                    { text: "Bitir ve Sıfırla", onPress: resetTimer, style: "destructive" }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Merhaba,</Text>
                        <Text style={styles.headerTitle}>Bugün Odaklanalım</Text>
                    </View>
                </View>

                <CategorySelector
                    selectedCategory={category}
                    onSelect={setCategory}
                    disabled={isActive}
                />

                <View style={styles.timerWrapper}>
                    <View style={[styles.outerCircle, SHADOWS.medium]}>
                        <View style={styles.innerCircle}>
                            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                            <Text style={[styles.statusText, { color: isActive ? COLORS.success : COLORS.textLight }]}>
                                {isActive ? 'ODAKLANILIYOR' : (timeLeft < 25 * 60 ? 'DURAKLATILDI' : 'HAZIR MISIN?')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.statCard, SHADOWS.small]}>
                    <View style={styles.statInfo}>
                        <Text style={styles.statLabel}>Dikkat Dağınıklığı</Text>
                        <Text style={styles.statSub}>Bu seansta</Text>
                    </View>
                    <View style={styles.statValueContainer}>
                        <Text style={[styles.statValue, { color: distractionCount > 0 ? COLORS.secondary : COLORS.success }]}>
                            {distractionCount}
                        </Text>
                        <Ionicons
                            name={distractionCount > 0 ? "alert-circle" : "checkmark-circle"}
                            size={24}
                            color={distractionCount > 0 ? COLORS.secondary : COLORS.success}
                        />
                    </View>
                </View>

                <View style={styles.controls}>
                    {!isActive ? (
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity onPress={handleStart} style={styles.mainBtnWrapper}>
                                <LinearGradient
                                    colors={['#6C63FF', '#5A52E0']}
                                    style={styles.mainBtn}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.mainBtnText}>
                                        {timeLeft === 0 ? 'Tekrar Başlat' : (timeLeft < 25 * 60 ? 'Devam Et' : 'Odaklanmayı Başlat')}
                                    </Text>
                                    <Ionicons name="play" size={24} color="#FFF" />
                                </LinearGradient>
                            </TouchableOpacity>

                            {timeLeft < 25 * 60 && timeLeft !== 0 && (
                                <TouchableOpacity style={styles.resetBtnTextOnly} onPress={resetTimer}>
                                    <Text style={styles.resetText}>Sayacı Sıfırla ve Başa Dön</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={styles.activeButtonRow}>

                            <TouchableOpacity onPress={pauseTimer} style={styles.halfBtnWrapper}>
                                <LinearGradient
                                    colors={[COLORS.accent, '#FFA502']}
                                    style={styles.gradientBtn}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                >
                                    <Ionicons name="pause" size={24} color="#FFF" />
                                    <Text style={styles.btnTextSmall}>Duraklat</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleResetWithAlert} style={styles.halfBtnWrapper}>
                                <LinearGradient
                                    colors={['#FF6B6B', '#EE5253']}
                                    style={styles.gradientBtn}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                >
                                    <Ionicons name="close" size={24} color="#FFF" />
                                    <Text style={styles.btnTextSmall}>Bitir</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40
    },

    header: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    greeting: { fontSize: 16, color: COLORS.textLight, fontWeight: '500' },
    headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },

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
    statInfo: { flexDirection: 'column' },
    statLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    statSub: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    statValueContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    statValue: { fontSize: 24, fontWeight: '800' },

    controls: {
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 20
    },

    mainBtnWrapper: {
        width: '100%',
        ...SHADOWS.medium
    },
    mainBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 25,
        gap: 10,
        backgroundColor: COLORS.primary
    },
    mainBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },

    activeButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15
    },
    halfBtnWrapper: {
        flex: 1,
        ...SHADOWS.small
    },
    gradientBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 20,
        gap: 8,
        backgroundColor: COLORS.accent
    },
    btnTextSmall: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700'
    },

    resetBtnTextOnly: { padding: 15, marginTop: 5 },
    resetText: { color: COLORS.textLight, fontWeight: '600' }
});

export default HomeScreen;