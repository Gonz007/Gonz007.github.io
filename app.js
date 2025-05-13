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
let nodosVisibles = 30;
let currentData = {};
const itemsPerPage = 15;
let currentPage = 1;

const chart = new Chart(document.getElementById('myChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Irradiancia VS Tiempo',
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
        ticks: {
          callback: value => {
            const rawValue = chart.data.labels[value];
            if (!rawValue) return '';
            const [fecha, hora] = rawValue.split(' ');
            return `${fecha.substring(0,5)} ${hora.substring(0,5)}`;
          }
        }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'W/m²' },
        grace: '15%'
      }
    }
  }
});

const formatearTimestamp = (firebaseKey) => {
  const [datePart, timePart] = firebaseKey.split('_');
  const dia = datePart.slice(6, 8);
  const mes = datePart.slice(4, 6);
  const año = datePart.slice(0, 4);
  const hora = timePart.slice(0, 2) || '00';
  const minutos = timePart.slice(2, 4) || '00';
  const segundos = timePart.slice(4, 6) || '00';
  return `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;
};

const actualizarTabla = (page) => {
  const keys = Object.keys(currentData).sort((a, b) => b.localeCompare(a));
  const start = (page - 1) * itemsPerPage;
  const pageData = keys.slice(start, start + itemsPerPage);
  
  const tbody = document.getElementById('datos-body');
  tbody.innerHTML = pageData.map(key => {
    const entry = currentData[key];
    return `
      <tr>
        <td>${formatearTimestamp(key)}</td>
        <td>${entry.adc}</td>
        <td>${entry.voltaje?.toFixed(2) || 'N/D'}</td>
        <td>${((entry.voltaje || 0) / 0.1).toFixed(2)}</td>
      </tr>`;
  }).join('');

  document.getElementById('paginaActual').textContent = page;
  document.getElementById('totalPaginas').textContent = Math.ceil(keys.length / itemsPerPage);
};

const updateChart = (data) => {
  const keys = Object.keys(data).sort((a, b) => b.localeCompare(a));
  const nodosMostrar = keys.slice(0, nodosVisibles);
  
  chart.data.labels = nodosMostrar.map(key => formatearTimestamp(key));
  chart.data.datasets[0].data = nodosMostrar.map(key => 
    (data[key].voltaje / 0.1) || 0
  );
  
  chart.update();
};

document.getElementById('rangoNodos').addEventListener('input', function(e) {
  const valor = parseInt(e.target.value);
  nodosVisibles = valor;
  document.getElementById('numeroNodos').value = valor;
  updateChart(currentData);
});

document.getElementById('numeroNodos').addEventListener('change', function(e) {
  let valor = parseInt(e.target.value);
  if (isNaN(valor)) valor = 30;
  if (valor < 10) valor = 10;
  if (valor > 500) valor = 500;
  
  nodosVisibles = valor;
  document.getElementById('rangoNodos').value = valor;
  updateChart(currentData);
});

document.getElementById('resetearNodos').addEventListener('click', () => {
  nodosVisibles = 30;
  document.getElementById('rangoNodos').value = 30;
  document.getElementById('numeroNodos').value = 30;
  updateChart(currentData);
});

onValue(potRef, (snapshot) => {
  currentData = snapshot.val() || {};
  actualizarTabla(currentPage);
  updateChart(currentData);
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) actualizarTabla(--currentPage);
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(Object.keys(currentData).length / itemsPerPage);
  if (currentPage < totalPages) actualizarTabla(++currentPage);
});

const convertDateToKey = (date, type = 'start') => {
  const pad = n => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const time = type === 'start' ? '000000' : '235959';
  return `${year}${month}${day}_${time}`;
};

const exportToExcel = () => {
  const startDateInput = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;
  const incluirGrafica = document.getElementById('incluirGrafica').checked;

  if (!startDateInput || !endDateInput) {
    alert('Por favor selecciona ambas fechas');
    return;
  }

  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);
  
  if (startDate > endDate) {
    alert('La fecha de inicio no puede ser mayor a la fecha final');
    return;
  }

  const startKey = convertDateToKey(startDate, 'start');
  const endKey = convertDateToKey(endDate, 'end');

  const filteredData = Object.keys(currentData)
    .filter(key => key >= startKey && key <= endKey)
    .sort((a, b) => a.localeCompare(b))
    .map(key => {
      const entry = currentData[key];
      return {
        Fecha: formatearTimestamp(key),
        ADC: entry.adc,
        Voltaje: entry.voltaje?.toFixed(2) || 'N/D',
        Irradiancia: ((entry.voltaje || 0) / 0.1).toFixed(2)
      };
    });

  if (filteredData.length === 0) {
    alert('No hay datos en el rango seleccionado');
    return;
  }

  const workbook = XLSX.utils.book_new();
  let worksheet;
  let chartImageAdded = false;

  if (incluirGrafica) {
    try {
      const canvas = document.getElementById('myChart');
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      tempCanvas.width = 1200;
      tempCanvas.height = 600;
      tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
      const dataURL = tempCanvas.toDataURL('image/png');

      const html = `
        <table>
          <tr>
            <td colspan="4">
              <img src="${dataURL}" width="800" height="400">
              <div style="font-size: 12px; margin-top: 10px">
                Gráfico: ${startDateInput} - ${endDateInput}<br>
                Registros: ${filteredData.length}<br>
                Generado: ${new Date().toLocaleString()}
              </div>
            </td>
          </tr>
          ${createTableHeader()}
          ${createTableBody(filteredData)}
        </table>
      `;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      worksheet = XLSX.utils.table_to_sheet(doc.querySelector('table'));
      chartImageAdded = true;
    } catch (error) {
      alert('Error al incluir el gráfico. Exportando solo datos...');
    }
  }

  if (!chartImageAdded) {
    worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["Fecha", "ADC", "Voltaje (V)", "Irradiancia (W/m²)"]
    ], { origin: "A1" });
  }

  const colWidths = [
    { wch: 25 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 }
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

  const startStr = startDateInput.replace(/-/g, '');
  const endStr = endDateInput.replace(/-/g, '');
  XLSX.writeFile(workbook, `Reporte_${startStr}_a_${endStr}.xlsx`);
};

const createTableHeader = () => `
  <tr>
    <th>Fecha</th>
    <th>ADC</th>
    <th>Voltaje</th>
    <th>Irradiancia</th>
  </tr>
`;

const createTableBody = (data) => data.map(entry => `
  <tr>
    <td>${entry.Fecha}</td>
    <td>${entry.ADC}</td>
    <td>${entry.Voltaje}</td>
    <td>${entry.Irradiancia}</td>
  </tr>
`).join('');

document.getElementById('exportExcel').addEventListener('click', exportToExcel);
