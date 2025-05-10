import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";
import { Chart, registerables } from "https://cdn.jsdelivr.net/npm/chart.js";
Chart.register(...registerables);

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxesgrk_NpKb93tbxSZUK42LOGGyTfyxg",
  databaseURL: "https://fireesp32-b6a1e-default-rtdb.firebaseio.com",
  projectId: "fireesp32-b6a1e"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const potRef = ref(db, 'potenciometro');

// Variables globales
let currentData = {};
const itemsPerPage = 50;
let currentPage = 1;

// Inicializa el gráfico
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Irradiación (W/m²)',
      data: [],
      borderColor: '#FF6B35',
      borderWidth: 2,
      fill: false,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Hora' },
        ticks: {
          callback: (tickValue, index) => {
            const label = chart.data.labels[index] || '';
            return label.split(' ')[1]?.slice(0,5) || '';
          }
        }
      },
      y: {
        title: { display: true, text: 'W/m²' },
        beginAtZero: true,
        grace: '15%'
      }
    }
  }
});

// Formatea la clave Firebase a fecha legible
function formatearTimestamp(key) {
  const [datePart, timePart = "000000"] = key.split('_');
  return `${datePart.slice(6,8)}/${datePart.slice(4,6)}/${datePart.slice(0,4)} ` +
         `${timePart.slice(0,2)}:${timePart.slice(2,4)}:${timePart.slice(4,6)}`;
}

// Actualiza la tabla HTML
function actualizarTabla(page) {
  const keys = Object.keys(currentData).sort((a,b) => b.localeCompare(a));
  const start = (page - 1) * itemsPerPage;
  const slice = keys.slice(start, start + itemsPerPage);
  const tbody = document.getElementById('datos-body');
  tbody.innerHTML = '';
  
  slice.forEach(key => {
    const { adc, voltaje } = currentData[key];
    const irradiacion = (voltaje * 1000 / 0.1);
    tbody.innerHTML += `
      <tr>
        <td>${formatearTimestamp(key)}</td>
        <td>${adc}</td>
        <td>${voltaje.toFixed(2)}</td>
        <td>${irradiacion.toFixed(2)}</td>
      </tr>`;
  });
  
  document.getElementById('paginaActual').textContent = page;
  document.getElementById('totalPaginas').textContent = 
    Math.ceil(keys.length / itemsPerPage);
}

// Actualiza el gráfico con los últimos 30 puntos
function updateChart(data) {
  const keys = Object.keys(data).sort();
  const lastKeys = keys.slice(-30);
  
  chart.data.labels = lastKeys.map(k => formatearTimestamp(k));
  chart.data.datasets[0].data = lastKeys.map(k => {
    const val = (data[k].voltaje * 1000 / 0.1);
    return parseFloat(val.toFixed(2));
  });
  chart.update();
}

// Escucha cambios en Firebase
onValue(potRef, snapshot => {
  currentData = snapshot.val() || {};
  if (Object.keys(currentData).length) {
    actualizarTabla(currentPage);
    updateChart(currentData);
  }
});

// Control de paginación
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    actualizarTabla(currentPage);
  }
});
document.getElementById('nextPage').addEventListener('click', () => {
  const total = Math.ceil(Object.keys(currentData).length / itemsPerPage);
  if (currentPage < total) {
    currentPage++;
    actualizarTabla(currentPage);
  }
});
