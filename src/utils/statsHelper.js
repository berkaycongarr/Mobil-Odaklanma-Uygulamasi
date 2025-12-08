// Renk paleti (Pasta grafiği için)
const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export const calculateStats = (history) => {
  const today = new Date().toISOString().split('T')[0];
  
  // 1. Genel İstatistikler
  let totalDuration = 0;
  let todayDuration = 0;
  let totalDistractions = 0;
  const categoryMap = {};
  const last7DaysMap = {};

  // Son 7 günün tarihlerini hazırla (Boş günleri de göstermek için)
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last7DaysMap[dateStr] = 0;
  }

  // Veriyi döngüye al ve hesapla
  history.forEach(session => {
    // Toplam süre ve dikkat dağınıklığı
    totalDuration += session.duration;
    totalDistractions += session.distractionCount;

    // Bugünün süresi
    if (session.date === today) {
      todayDuration += session.duration;
    }

    // Kategori Dağılımı (Pasta Grafik için)
    if (categoryMap[session.category]) {
      categoryMap[session.category] += session.duration;
    } else {
      categoryMap[session.category] = session.duration;
    }

    // Günlük Dağılım (Çubuk Grafik için)
    // Eğer seans tarihi son 7 gün içindeyse ekle
    if (last7DaysMap.hasOwnProperty(session.date)) {
      last7DaysMap[session.date] += session.duration;
    }
  });

  // 2. Pasta Grafik Verisini Hazırla
  const pieData = Object.keys(categoryMap).map((cat, index) => ({
    name: cat,
    population: Math.round(categoryMap[cat] / 60), // Dakikaya çevir
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  }));

  // 3. Çubuk Grafik Verisini Hazırla
  const barData = {
    labels: Object.keys(last7DaysMap).map(date => date.substring(5)), // Sadece AA-GG kısmını al
    datasets: [{
      data: Object.values(last7DaysMap).map(dur => Math.round(dur / 60)) // Dakikaya çevir
    }]
  };

  return {
    totalDuration: Math.round(totalDuration / 60), // Toplam dakika
    todayDuration: Math.round(todayDuration / 60), // Bugün dakika
    totalDistractions,
    pieData,
    barData
  };
};