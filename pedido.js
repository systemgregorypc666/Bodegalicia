/**
 * Motor de Bodegalicia - System Gregory PC
 * Conexión con DB_Bodegalicia_Principal
 */

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKmBLmpMK79baNFgQ3DqYnnWnQwOtW9IXnHdxDVAeohbx_zCE440RUVv7Ep5_2Sd1vHmpjgicXQATw/pub?output=csv';

async function cargarInventario() {
    const container = document.getElementById('productos-container');
    const loading = document.getElementById('loading');

    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // Convertimos el CSV en un array de filas
        const filas = data.split('\n').slice(1); 
        
        loading.style.display = 'none';
        container.innerHTML = '';

        filas.forEach(fila => {
            // Dividir por comas pero respetando las que están dentro de comillas
            const columnas = fila.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            
            if (columnas && columnas.length >= 6) {
                const [id, nombre, categoria, origen, precio, moneda] = columnas;
                const desc = columnas[8] || "Calidad garantizada.";

                const cardHTML = `
                    <div class="card">
                        <div>
                            <span class="categoria">${categoria.replace(/"/g, '')}</span>
                            <h3>${nombre.replace(/"/g, '')}</h3>
                            <span class="origen">📍 ${origen.replace(/"/g, '')}</span>
                            <p>${desc.replace(/"/g, '')}</p>
                        </div>
                        <div class="precio-box">
                            <div class="precio-valor">${precio} ${moneda}</div>
                            <button class="btn-pedido" onclick="enviarWhatsApp('${nombre}', '${precio}', '${moneda}')">
                                🛒 Hacer Pedido
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHTML;
            }
        });

    } catch (error) {
        console.error('Error:', error);
        loading.innerText = '⚠️ Error al conectar con la base de datos de Bodegalicia.';
    }
}

function enviarWhatsApp(producto, precio, moneda) {
    const miTelefono = "584161177334";
    const limpioNombre = producto.replace(/"/g, '');
    
    const texto = `*BODEGALICIA - NUEVO PEDIDO*\n` +
                  `----------------------------\n` +
                  `*Producto:* ${limpioNombre}\n` +
                  `*Precio:* ${precio} ${moneda}\n` +
                  `*Estado:* Protocolo Anti-Mafia Activo\n` +
                  `----------------------------\n` +
                  `Por favor, indíqueme los pasos para el pago.`;

    const url = `https://wa.me/${miTelefono}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Iniciar carga al abrir la página
document.addEventListener('DOMContentLoaded', cargarInventario);
