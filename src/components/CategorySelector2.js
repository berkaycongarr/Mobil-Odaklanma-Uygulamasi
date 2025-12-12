import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';

const CATEGORIES = [
  { id: 1, label: 'Kodlama', icon: '💻' },
  { id: 2, label: 'Ders', icon: '📚' },
  { id: 3, label: 'Kitap', icon: '📖' },
  { id: 4, label: 'Spor', icon: '💪' },
  { id: 5, label: 'Meditasyon', icon: '🧘' },
];

const CategorySelector = ({ selectedCategory, onSelect, disabled }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Kategori Seç</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <TouchableOpacity
              key={cat.id}
              disabled={disabled}
              activeOpacity={0.8}
              style={[
                styles.item,
                isSelected && styles.selectedItem,
                disabled && styles.disabledItem,
                isSelected ? SHADOWS.medium : SHADOWS.small
              ]}
              onPress={() => onSelect(cat.label)}
            >
              <Text style={[styles.itemText, isSelected && styles.selectedText]}>
                {cat.icon} {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginVertical: 25 },
  title: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: COLORS.textLight, 
    marginBottom: 15, 
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  container: { paddingHorizontal: 5, paddingBottom: 10 }, // Gölge kesilmesin diye padding
  item: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 30, // Tam yuvarlak köşeler
    marginRight: 12,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.05 }] // Seçilince hafif büyüsün
  },
  disabledItem: { opacity: 0.6 },
  itemText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15
  },
  selectedText: { color: '#FFF' }
});

export default CategorySelector;