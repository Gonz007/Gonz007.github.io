import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, query, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

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

// Configuración del gráfico
const chart = new Chart(document.getElementById('myChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Irradiación (W/m²)',
      data: [],
      borderColor: '#FF6B35',
      tension: 0.1,
      fill: false,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          callback: value => {
            const rawValue = this.data.labels[value];
            return rawValue.split(' ')[1].substring(0,5);
          }
        }
      },
      y: {
        beginAtZero: true,
        grace: '10%'
      }
    }
  }
});

// Función para actualizar gráfico
const updateChart = (data) => {
  const keys = Object.keys(data).sort();
  const lastKeys = keys.slice(-30);
  
  chart.data.labels = lastKeys.map(key => formatearTimestamp(key));
  chart.data.datasets[0].data = lastKeys.map(key => 
    (data[key].voltaje * 1000 / 0.1).toFixed(2)
  );
  
  chart.update();
};

// Función para actualizar tabla
const actualizarTabla = (page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const keys = Object.keys(currentData).sort((a, b) => a.localeCompare(b));
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

  document.getElementById('paginaActual').textContent = page;
  document.getElementById('totalPaginas').textContent = 
    Math.ceil(keys.length / itemsPerPage);
};

// Formateo de timestamp
const formatearTimestamp = (firebaseKey) => {
  try {
    const [datePart, timePart] = firebaseKey.split('_');
    return `${datePart.slice(6,8)}/${datePart.slice(4,6)}/${datePart.slice(0,4)} ` +
           `${timePart.slice(0,2)}:${timePart.slice(2,4)}:${timePart.slice(4,6)}`;
  } catch (error) {
    return firebaseKey;
  }
};

// Manejo de datos de Firebase
onValue(query(potRef, limitToLast(5000)), (snapshot) => {
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
