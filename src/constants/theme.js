export const COLORS = {
  primary: '#6C63FF',    // Modern İndigo Moru (Odaklanma rengi)
  secondary: '#FF6584',  // Yumuşak Kırmızı/Pembe (Durdurma/Hata)
  success: '#00B894',    // Nane Yeşili
  background: '#F8F9FE', // Saf beyaz yerine çok açık gri-mavi (Göz yormaz)
  surface: '#FFFFFF',    // Kartlar için beyaz
  text: '#2D3436',       // Tam siyah yerine koyu gri (Daha yumuşak)
  textLight: '#A0A0A0',  // Yardımcı metinler
  accent: '#FDCB6E'      // Sarı vurgular
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5, // Android için
  }
};