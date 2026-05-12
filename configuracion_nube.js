const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxDAOGJQBMkWcn9n9zB5Y7r4blD_9-eKkqDLPz5sawe-Laa9uU-OPQY48A2yI-dOBVk/exec"; 

function enviarAGoogleSheets(pedido, operadorActual, fechaLarga) {
    const payload = {
        fecha: fechaLarga,
        usuario: operadorActual,
        idpedido: pedido.idpedido,
        referencia: pedido.Nro_Referencia || '',
        estado: pedido.Estado || '',
        ciudad: pedido.Localidad || ''
    };

    // Usamos el método de envío "limpio" sin headers restrictivos (Bypass de CORS)
    fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if(datos.status === "success") {
            console.log("✅ Pedido " + payload.idpedido + " guardado en el Excel de la Nube.");
        } else {
            console.error("⚠️ El código llegó, pero hubo un error en Google:", datos.message);
        }
    })
    .catch(err => {
        console.error("❌ Error de comunicación:", err);
    });
}

// =========================================================
// 🛡️ PROTECCIÓN DE CÓDIGO (BLOQUEO DE INSPECCIÓN)
// =========================================================

// 1. Bloquear el clic derecho (Menú contextual)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 2. Bloquear atajos de teclado de herramientas de desarrollador
document.addEventListener('keydown', function(e) {
    // Bloquear F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    // Bloquear Ctrl + Shift + I / J / C (Inspeccionar y Consola)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
    // Bloquear Ctrl + U (Ver código fuente)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});


// =========================================================
// 🔒 SISTEMA DE AUTO-CIERRE DE SESIÓN (15 MINUTOS)
// =========================================================
const TIEMPO_MAXIMO_INACTIVIDAD = 15 * 60 * 1000; // 15 minutos en milisegundos

function reiniciarTemporizador() {
    // Solo inicia el temporizador si estamos en una página dentro del sistema (que tenga operador)
    if (localStorage.getItem('operador_actual')) {
        localStorage.setItem('ultima_actividad_flexnet', Date.now());
    }
}

function comprobarInactividad() {
    const ultimaActividad = localStorage.getItem('ultima_actividad_flexnet');
    // Solo comprobamos si hay alguien logueado
    if (ultimaActividad && localStorage.getItem('operador_actual')) {
        const tiempoPasado = Date.now() - parseInt(ultimaActividad);
        if (tiempoPasado > TIEMPO_MAXIMO_INACTIVIDAD) {
            alert("⏳ Tu sesión ha sido cerrada por seguridad (15 minutos de inactividad).");
            
            // Forzamos el cierre de sesión globalmente
            localStorage.removeItem('operador_actual');
            localStorage.removeItem('ultima_actividad_flexnet');
            if (typeof localforage !== 'undefined') {
                localforage.clear();
            }
            window.location.href = 'index.html';
        }
    }
}

// Detectar movimiento en cualquier archivo HTML que cargue este JS
window.addEventListener('mousemove', reiniciarTemporizador);
window.addEventListener('keydown', reiniciarTemporizador);
window.addEventListener('click', reiniciarTemporizador);
window.addEventListener('scroll', reiniciarTemporizador);

// Revisar cada 10 segundos
setInterval(comprobarInactividad, 10000);
reiniciarTemporizador();


// =========================================================
// ✍️ MARCA DE AGUA (DERECHOS DE AUTOR DEL SISTEMA)
// =========================================================
function agregarFirmaAutor() {
    // Evitamos duplicados
    if (document.getElementById('firma-hector-torres')) return;

    const firma = document.createElement('div');
    firma.id = 'firma-hector-torres';
    
    // El texto de tu autoría
    firma.innerHTML = "Elaborado por: Hector Torres &copy; " + new Date().getFullYear();
    
    // Estilos para que quede fijo, sutil y profesional
    firma.style.position = 'fixed';
    firma.style.bottom = '8px';
    firma.style.right = '15px';
    firma.style.fontSize = '11px';
    firma.style.fontWeight = '600';
    firma.style.color = '#64748b'; 
    firma.style.opacity = '0.5'; 
    firma.style.zIndex = '99999'; 
    firma.style.pointerEvents = 'none'; 
    firma.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
    
    document.body.appendChild(firma);
}

// Inyectar la firma apenas cargue el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', agregarFirmaAutor);
} else {
    agregarFirmaAutor();
}