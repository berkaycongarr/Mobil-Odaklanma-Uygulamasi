import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = '@focus_sessions_v1';

export const focusStorage = {
  /**
   * Yeni bir odaklanma seansını kaydeder.
   * @param {Object} session - { id, category, duration, date, distractionCount, status }
   */
  saveSession: async (session) => {
    try {
      
      const existingData = await AsyncStorage.getItem(STORAGE_KEY);
      const history = existingData ? JSON.parse(existingData) : [];

      
      const updatedHistory = [session, ...history];

     
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      
      console.log('Seans başarıyla kaydedildi:', session);
      return true;
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      return false;
    }
  },

 
  getHistory: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Veri okuma hatası:', error);
      return [];
    }
  },


  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Silme hatası:', e);
    }
  }
};