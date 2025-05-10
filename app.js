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
let currentData = null;
const itemsPerPage = 50;
let currentPage = 1;

const formatearTimestamp = (() => {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (firebaseKey) => {
    try {
      const [datePart, timePart] = firebaseKey.includes('_') 
        ? firebaseKey.split('_') 
        : [firebaseKey.slice(0, 8), firebaseKey.slice(8)];
      
      const [year, month, day] = [
        datePart.slice(0, 4),
        datePart.slice(4, 6),
        datePart.slice(6, 8)
      ];
      
      const [hours = '00', minutes = '00', seconds = '00'] = timePart?.match(/.{1,2}/g) || [];
      
      return formatter.format(new Date(
        `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      ));
    } catch (error) {
      console.error('Error formateando timestamp:', error);
      return firebaseKey;
    }
  };
})();

const chart = new Chart(document.getElementById('myChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Irradiación (W/m²)',
      data: [],
      borderColor: '#FF6B35',
      tension: 0.1,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    datasets: { line: { spanGaps: true } },
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: { size: 10 },
          callback: value => value.split(' ')[1].substring(0, 5)
        }
      },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: false } }
  }
});

const calcularEstadisticas = (data) => {
  const entries = Object.values(data);
  if (entries.length === 0) return null;

  let sumADC = 0, sumVolt = 0, sumPct = 0, sumIrr = 0;
  let maxADC = -Infinity, minADC = Infinity;

  entries.forEach(entry => {
    sumADC += entry.adc;
    sumVolt += entry.voltaje;
    sumPct += entry.porcentaje;
    const irr = entry.voltaje * 10000;
    sumIrr += irr;
    
    if (entry.adc > maxADC) maxADC = entry.adc;
    if (entry.adc < minADC) minADC = entry.adc;
  });

  return {
    promedioADC: sumADC / entries.length,
    promedioVolt: sumVolt / entries.length,
    promedioPct: sumPct / entries.length,
    promedioIrr: sumIrr / entries.length,
    maxADC,
    minADC,
    ultimoValor: entries[entries.length - 1]
  };
};

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

const exportarACSV = async () => {
  if (!currentData) {
    alert('No hay datos para exportar');
    return;
  }

  try {
    const keys = Object.keys(currentData).sort((a, b) => a.localeCompare(b));
    const chunkSize = 5000;
    const chunks = Math.ceil(keys.length / chunkSize);
    const dateStamp = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < chunks; i++) {
      const chunkKeys = keys.slice(i * chunkSize, (i + 1) * chunkSize);
      const csvContent = [
        ['Fecha y Hora', 'ADC', 'Voltaje (V)', 'Porcentaje (%)', 'Irradiación (W/m²)'],
        ...chunkKeys.map(key => [
          formatearTimestamp(key),
          currentData[key].adc,
          currentData[key].voltaje.toFixed(2),
          currentData[key].porcentaje,
          (currentData[key].voltaje * 1000 / 0.1).toFixed(2)
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `datos_piranometro_${dateStamp}_parte${i + 1}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error en exportación:', error);
    alert('Error al generar archivos');
  }
};

const setupData = (snapshot) => {
  currentData = snapshot.val() || {};
  const allKeys = Object.keys(currentData).sort((a, b) => a.localeCompare(b));
  
  const limitedData = allKeys.slice(-1000).reduce((acc, key) => {
    acc[key] = currentData[key];
    return acc;
  }, {});

  actualizarTabla(currentPage);
  updateChart(limitedData);
  updateStats(limitedData);
};

const updateChart = (data) => {
  const keys = Object.keys(data).sort((a, b) => a.localeCompare(b));
  const chartData = keys.slice(-30);

  chart.data.labels = chartData.map(key => formatearTimestamp(key));
  chart.data.datasets[0].data = chartData.map(key => 
    data[key].voltaje * 1000 / 0.1
  );
  chart.update('none');
};

const updateStats = (data) => {
  const stats = calcularEstadisticas(data);
  if (!stats) return;

  document.getElementById('stats').innerHTML = `
    <h3>Estadísticas (últimos 1000 registros):</h3>
    ${Object.entries(stats).map(([key, value]) => {
      if (key === 'ultimoValor') return `
        <p>• Última lectura: ${value.porcentaje}% 
        (${value.voltaje.toFixed(2)} V, 
        ${(value.voltaje * 1000 / 0.1).toFixed(2)} W/m²)</p>`;
        
      return `<p>• ${key.replace(/([A-Z])/g, ' $1')}: ${
        typeof value === 'number' ? value.toFixed(2) : value
      }</p>`;
    }).join('')}
  `;
};

// Event listeners
document.getElementById('exportarBtn').addEventListener('click', exportarACSV);
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) actualizarTabla(--currentPage);
});
document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(Object.keys(currentData).length / itemsPerPage);
  if (currentPage < totalPages) actualizarTabla(++currentPage);
});

onValue(query(potRef, limitToLast(5000)), setupData);
