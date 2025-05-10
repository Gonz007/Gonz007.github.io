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

// Función para formatear timestamp
const formatearTimestamp = (firebaseKey) => {
  try {
    const [datePart, timePart] = firebaseKey.split('_');
    return `${datePart.slice(6,8)}/${datePart.slice(4,6)}/${datePart.slice(0,4)} ` +
           `${timePart?.slice(0,2) || '00'}:${timePart?.slice(2,4) || '00'}:${timePart?.slice(4,6) || '00'}`;
  } catch (error) {
    return firebaseKey;
  }
};

// Función para actualizar tabla
const actualizarTabla = (page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const keys = Object.keys(currentData).sort((a, b) => b.localeCompare(a)); // Orden descendente
  const pageData = keys.slice(start, end);

  const tbody = document.getElementById('datos-body');
  tbody.innerHTML = '';
  
  pageData.forEach(key => {
    const entry = currentData[key];
    tbody.innerHTML += `
      <tr>
        <td>${formatearTimestamp(key)}</td>
        <td>${entry.adc}</td>
        <td>${entry.voltaje.toFixed(2)}</td>
        <td>${(entry.voltaje * 1000 / 0.1).toFixed(2)}</td>
      </tr>`;
  });

  // Actualizar paginación
  document.getElementById('paginaActual').textContent = page;
  document.getElementById('totalPaginas').textContent = 
    Math.ceil(keys.length / itemsPerPage);
};
// Manejo de datos de Firebase
onValue(potRef, (snapshot) => {
  currentData = snapshot.val() || {};
  console.log('Datos recibidos:', currentData);
  
  if (Object.keys(currentData).length > 0) {
    actualizarTabla(currentPage);
    updateChart(currentData);
  }
});

// Eventos de paginación
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) actualizarTabla(--currentPage);
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(Object.keys(currentData).length / itemsPerPage);
  if (currentPage < totalPages) actualizarTabla(++currentPage);
});


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
