#  Odaklanma Takibi ve Raporlama Uygulaması 

GitHub Linki: https://github.com/berkaycongarr/Mobil-Odaklanma-Uygulamasi

Bu proje, React Native ve Expo kullanılarak geliştirilmiş, dijital dikkat dağınıklığıyla mücadele etmeyi amaçlayan bir mobil uygulamadır. Kullanıcıların odaklanma seanslarını takip eder, arka plana atıldığında dikkat dağınıklığını tespit eder ve gelişmiş grafiklerle raporlar sunar.

## Özellikler

 Özelleştirilebilir Zamanlayıcı: 25 dakikalık  odaklanma sayacı.
 Akıllı Dikkat Takibi: Uygulama `Active` durumundan `Background` durumuna geçtiğinde sayacı otomatik duraklatır ve dikkat dağınıklığı sayısını artırır.
 Raporlama:
    * Günlük ve Toplam Odaklanma Süresi.
    * Kategori Bazlı Pasta Grafik (Kodlama, Ders, Kitap vb.).
    * Son 7 Günün Performansını Gösteren Çubuk Grafik.


##  Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  Repoyu Klonlayın:

2.  Paketleri Yükleyin:
   

3.  Uygulamayı Başlatın:
  
    npx expo start
 



##  Proje Mimarisi 

Proje, sürdürülebilirlik ve okunabilirlik için modüler bir yapıda geliştirilmiştir:

* `src/components`: Tekrar kullanılabilir UI parçaları (CategorySelector).
* `src/screens`: Ana ekranlar (HomeScreen, ReportsScreen).
* `src/hooks`: İş mantığını (Logic) arayüzden ayıran özel kancalar (`useFocusTimer`).
* `src/utils`: Veritabanı ve hesaplama yardımcıları (`storage.js`, `statsHelper.js`).
* `src/constants`: Renk paleti ve tema ayarları (`theme.js`).

---
Hazırlayan: Berkay Çongar