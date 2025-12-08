import AsyncStorage from '@react-native-async-storage/async-storage';

// Veritabanı anahtarı (Key)
const STORAGE_KEY = '@focus_sessions_v1';

export const focusStorage = {
  /**
   * Yeni bir odaklanma seansını kaydeder.
   * @param {Object} session - { id, category, duration, date, distractionCount, status }
   */
  saveSession: async (session) => {
    try {
      // 1. Mevcut veriyi oku
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const history = existingData ? JSON.parse(existingData) : [];

      // 2. Yeni seansı listenin başına ekle (En yeni en üstte)
      const updatedHistory = [session, ...history];

      // 3. Güncellenmiş listeyi kaydet
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      
      console.log('Seans başarıyla kaydedildi:', session);
      return true;
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      return false;
    }
  },

  /**
   * Tüm geçmiş seansları getirir.
   */
  getHistory: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Veri okuma hatası:', error);
      return [];
    }
  },

  /**
   * Tüm verileri siler (Debug için).
   */
  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  }
};