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

// Configuración del gráfico (mantener tu versión funcional)
const chart = new Chart(document.getElementById('myChart').getContext('2d'), {
  // ... (tu configuración actual del gráfico que funciona)
});

// Función para actualizar la tabla
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

  // Actualizar paginación
  document.getElementById('paginaActual').textContent = page;
  document.getElementById('totalPaginas').textContent = 
    Math.ceil(keys.length / itemsPerPage);
};

// Función de formato de timestamp (asegúrate de incluirla)
const formatearTimestamp = (firebaseKey) => {
  // ... (tu implementación actual que funciona)
};

// Función principal que maneja los datos de Firebase
const setupData = (snapshot) => {
  currentData = snapshot.val() || {};
  console.log('Datos recibidos:', currentData);
  
  // Actualizar ambos componentes
  actualizarTabla(currentPage);
  updateChart(currentData); // Asegúrate de tener esta función
  updateStats(currentData); // Asegúrate de tener esta función
};

// Event listeners para paginación
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) actualizarTabla(--currentPage);
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(Object.keys(currentData).length / itemsPerPage);
  if (currentPage < totalPages) actualizarTabla(++currentPage);
});

// Inicializar
onValue(query(potRef, limitToLast(5000)), setupData);
