import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, query, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

// 1. Configuración de Firebase (Verifica que sean correctas)
const firebaseConfig = {
  apiKey: "AIzaSyDxesgrk_NpKb93tbxSZUK42LOGGyTfyxg",
  databaseURL: "https://fireesp32-b6a1e-default-rtdb.firebaseio.com",
  projectId: "fireesp32-b6a1e"
};

// 2. Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const potRef = ref(db, 'potenciometro');

// 3. Variables globales
let currentData = {};
const itemsPerPage = 15;
let currentPage = 1;

// 4. Configuración del gráfico (versión simplificada)
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

// 5. Función de formato de fecha (mejorada con validación)
const formatearTimestamp = (firebaseKey) => {
  try {
    const [datePart, timePart] = firebaseKey.split('_');
    
    // Formatear fecha: DD/MM/YYYY
    const dia = datePart.slice(6, 8);
    const mes = datePart.slice(4, 6);
    const año = datePart.slice(0, 4);
    
    // Formatear hora: HH:MM:SS
    const hora = timePart.slice(0, 2) || '00';
    const minutos = timePart.slice(2, 4) || '00';
    const segundos = timePart.slice(4, 6) || '00';
    
    return `${dia}/${mes}/${año} ${hora}:${minutos}:${segundos}`;
  } catch (error) {
    console.error('Error formateando timestamp:', firebaseKey, error);
    return 'Fecha inválida';
  }
};

// 6. Función para actualizar tabla (con debug)
const actualizarTabla = (page) => {
  try {
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
          <td>${((entry.voltaje || 0) * 1000 / 0.1).toFixed(2)}</td>
        </tr>`;
    }).join('');

    document.getElementById('paginaActual').textContent = page;
    document.getElementById('totalPaginas').textContent = Math.ceil(keys.length / itemsPerPage);
    
    console.log('Tabla actualizada con', pageData.length, 'registros');
  } catch (error) {
    console.error('Error actualizando tabla:', error);
  }
};

// 7. Función para actualizar gráfico (con validación de datos)
const updateChart = (data) => {
  try {
    // Ordenar las claves de más reciente a más antiguo
    const keys = Object.keys(data).sort((a, b) => b.localeCompare(a));
    // Tomar los primeros 30 registros (los más recientes)
    const latest30 = keys.slice(0, 30);
    
    chart.data.labels = latest30.map(key => formatearTimestamp(key));
    chart.data.datasets[0].data = latest30.map(key => 
      (data[key].voltaje * 1000 / 0.1) || 0
    );
    
    chart.update();
    console.log('Gráfico actualizado con', latest30.length, 'puntos');
  } catch (error) {
    console.error('Error actualizando gráfico:', error);
  }
};

// 8. Conexión a Firebase con monitorización
onValue(potRef, (snapshot) => {
  try {
    currentData = snapshot.val() || {};
    console.log('Datos recibidos de Firebase:', Object.keys(currentData).length, 'registros');
    
    if (!Object.keys(currentData).length) {
      console.warn('¡Base de datos vacía!');
      return;
    }
    
    actualizarTabla(currentPage);
    updateChart(currentData);
  } catch (error) {
    console.error('Error en conexión Firebase:', error);
  }
});

// 9. Eventos de paginación (con validación)
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) actualizarTabla(--currentPage);
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(Object.keys(currentData).length / itemsPerPage);
  if (currentPage < totalPages) actualizarTabla(++currentPage);
});

// 10. Prueba con datos locales (descomentar para probar)
/*
currentData = {
  "20240320_120000": { voltaje: 0.5, adc: 512, porcentaje: 50 },
  "20240320_120100": { voltaje: 0.6, adc: 614, porcentaje: 60 },
  "20240320_120200": { voltaje: 0.7, adc: 717, porcentaje: 70 }
};
actualizarTabla(1);
updateChart(currentData);
*/
