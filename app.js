// Elimina temporalmente todo el código y prueba con datos estáticos
const testData = {
  "20231001_120000": { voltaje: 0.5, adc: 512, porcentaje: 50 },
  "20231001_120100": { voltaje: 0.6, adc: 614, porcentaje: 60 },
  "20231001_120200": { voltaje: 0.7, adc: 717, porcentaje: 70 }
};

const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: Object.keys(testData),
    datasets: [{
      label: 'Test',
      data: Object.values(testData).map(v => v.voltaje),
      borderColor: 'red'
    }]
  }
});
