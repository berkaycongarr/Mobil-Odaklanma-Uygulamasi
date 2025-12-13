
const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export const calculateStats = (history) => {
  const today = new Date().toISOString().split('T')[0];
  

  let totalDuration = 0;
  let todayDuration = 0;
  let totalDistractions = 0;
  const categoryMap = {};
  const last7DaysMap = {};

  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last7DaysMap[dateStr] = 0;
  }


  history.forEach(session => {
   
    totalDuration += session.duration;
    totalDistractions += session.distractionCount;

  
    if (session.date === today) {
      todayDuration += session.duration;
    }

    
    if (categoryMap[session.category]) {
      categoryMap[session.category] += session.duration;
    } else {
      categoryMap[session.category] = session.duration;
    }

  
    if (last7DaysMap.hasOwnProperty(session.date)) {
      last7DaysMap[session.date] += session.duration;
    }
  });


  const pieData = Object.keys(categoryMap).map((cat, index) => ({
    name: cat,
    population: Math.round(categoryMap[cat] / 60), 
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  }));


  const barData = {
    labels: Object.keys(last7DaysMap).map(date => date.substring(5)), 
    datasets: [{
      data: Object.values(last7DaysMap).map(dur => Math.round(dur / 60)) 
    }]
  };

  return {
    totalDuration: Math.round(totalDuration / 60), 
    todayDuration: Math.round(todayDuration / 60), 
    totalDistractions,
    pieData,
    barData
  };
};