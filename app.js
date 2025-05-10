import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, query, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxesgrk_NpKb93tbxSZUK42LOGGyTfyxg",
  databaseURL: "https://fireesp32-b6a1e-default-rtdb.firebaseio.com",
  projectId: "fireesp32-b6a1e"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const potRef = ref(db, 'potenciometro');

// Elementos del DOM
const ctx = document.getElementById('myChart').getContext('2d');

// Configuración básica del gráfico
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Irradiación (W/m²)',
      data: [],
      borderColor: '#FF6B35',
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Hora'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'W/m²'
        },
        beginAtZero: true
      }
    }
  }
});

// Función para actualizar el gráfico
const updateChart = (data) => {
  const keys = Object.keys(data).sort();
  const lastEntries = keys.slice(-30); // Últimos 30 registros

  // Actualizar datos del gráfico
  chart.data.labels = lastEntries.map(key => {
    const timePart = key.split('_')[1] || '';
    return timePart.substring(0, 4) + ':' + timePart.substring(4, 6);
  });
  
  chart.data.datasets[0].data = lastEntries.map(key => {
    return (data[key].voltaje * 1000) / 0.1;
  });

  chart.update();
};

// Manejo de datos de Firebase
onValue(potRef, (snapshot) => {
  const data = snapshot.val() || {};
  console.log('Datos recibidos:', data);
  
  if (Object.keys(data).length === 0) {
    console.warn('No hay datos en Firebase');
    return;
  }
  
  updateChart(data);
});

// Función temporal para prueba de datos
const testData = {
  "20231001_120000": { voltaje: 0.5, adc: 512, porcentaje: 50 },
  "20231001_120100": { voltaje: 0.6, adc: 614, porcentaje: 60 },
  "20231001_120200": { voltaje: 0.7, adc: 717, porcentaje: 70 }
};
// Descomenta para probar con datos estáticos
// updateChart(testData);
