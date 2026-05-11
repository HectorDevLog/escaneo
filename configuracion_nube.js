// =========================================================
// CONFIGURACIÓN DE LA CONEXIÓN A GOOGLE SHEETS
// =========================================================

// TU ENLACE ACTUALIZADO
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