import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES = [
  { id: 1, label: 'Kodlama' },
  { id: 2, label: 'Ders Çalışma' },
  { id: 3, label: 'Kitap Okuma' },
  { id: 4, label: 'Spor' },
  { id: 5, label: 'Meditasyon' },
];

const CategorySelector = ({ selectedCategory, onSelect, disabled }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Kategori Seçimi</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            disabled={disabled} // Sayaç çalışırken değiştirmeyi engelle
            style={[
              styles.item,
              selectedCategory === cat.label && styles.selectedItem,
              disabled && styles.disabledItem
            ]}
            onPress={() => onSelect(cat.label)}
          >
            <Text 
              style={[
                styles.itemText, 
                selectedCategory === cat.label && styles.selectedItemText
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginVertical: 20 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333', paddingLeft: 5 },
  container: { paddingHorizontal: 5 },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  selectedItem: {
    backgroundColor: '#4a90e2', // Seçili renk (Mavi)
    borderColor: '#4a90e2',
  },
  disabledItem: {
    opacity: 0.5
  },
  itemText: {
    color: '#333',
    fontWeight: '500'
  },
  selectedItemText: {
    color: '#fff'
  }
});

export default CategorySelector;