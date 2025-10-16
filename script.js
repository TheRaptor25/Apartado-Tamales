// Variable global para almacenar el resumen del pedido temporalmente
let pedidoResumenTemporal = ""; 
// **IMPORTANTE**: Define aquí tu número de WhatsApp
const NUMERO_WHATSAPP = "523339994805"; // Reemplaza con tu número (código de país + número, sin +, espacios ni guiones)

// Función para calcular el total del pedido (SIN CAMBIOS)
function calcularTotal() {
    let total = 0;
    
    const camposCantidad = document.querySelectorAll('.cantidad');
    
    camposCantidad.forEach(campo => {
        const precio = parseFloat(campo.getAttribute('data-precio'));
        const cantidad = parseInt(campo.value) || 0; 
        total += precio * cantidad;
    });
    
    document.getElementById('total-pedido').textContent = `$${total.toFixed(2)}`;
}

// Función para generar el resumen del pedido (CAMBIOS AQUÍ)
function generarResumen() {
    // 1. Recoger datos del cliente
    const nombre = document.getElementById('nombre-cliente').value;
    const hora = document.getElementById('hora-recoleccion').value;
    
    if (!nombre || !hora) {
        alert('Por favor, completa tu Nombre y la Hora de Recolección para apartar.');
        return;
    }

    // 2. Recoger el detalle del pedido
    let detallesPedido = 'Detalle del Pedido:\n';
    let total = 0;
    const camposCantidad = document.querySelectorAll('.cantidad');

    camposCantidad.forEach(campo => {
        const cantidad = parseInt(campo.value) || 0;
        const precio = parseFloat(campo.getAttribute('data-precio'));
        
        if (cantidad > 0) {
            const label = document.querySelector(`label[for="${campo.id}"]`).textContent.trim();
            detallesPedido += `- ${cantidad}x ${label.replace(':', '')} ($${(cantidad * precio).toFixed(2)})\n`;
            total += precio * cantidad;
        }
    });

    if (total === 0) {
        alert('Por favor, selecciona al menos un producto para realizar tu apartado.');
        return;
    }
    
    // 3. Crear el texto final del resumen (se guarda en la variable global)
    const textoFinal = `
*RESUMEN DE APARTADO*
Nombre: ${nombre}
Hora de Recolección: ${hora}
Punto: [Esquina del Jardin de villi izcalli, camioneta cafe]

${detallesPedido}
-------------------------
*TOTAL A PAGAR: $${total.toFixed(2)}*
-------------------------
**¡Muchas gracias por tu preferencia!** Esperamos verte a la hora indicada. 🥳
    `.trim(); // El .trim() elimina espacios innecesarios al inicio y final.

    // Guardar el resumen en la variable global
    pedidoResumenTemporal = textoFinal;
    
    // 4. Mostrar el área de resumen (sin el textarea)
    document.getElementById('resumen-final').style.display = 'block';
    document.getElementById('formulario-pedido').style.display = 'none';
}

// **NUEVA FUNCIÓN PARA ENVIAR POR WHATSAPP**
function enviarWhatsApp() {
    if (pedidoResumenTemporal === "") {
        alert("Parece que hubo un error. Intenta hacer el pedido de nuevo.");
        return;
    }
    
    // Codifica el texto para que sea seguro en una URL
    const mensajeCodificado = encodeURIComponent(pedidoResumenTemporal);
    
    // Crea el enlace de WhatsApp
    const enlaceWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
    
    // Abre el enlace en una nueva ventana/pestaña
    window.open(enlaceWhatsApp, '_blank');
}


// Función para reiniciar el formulario y regresar al apartado (CON CAMBIOS DE ALERTA)
function nuevoPedido() {
    document.getElementById('resumen-final').style.display = 'none';
    document.getElementById('formulario-pedido').style.display = 'block';
    document.getElementById('formulario-pedido').reset();
    calcularTotal();
    window.scrollTo(0, 0); 
    // Limpiar el resumen temporal al iniciar un nuevo pedido
    pedidoResumenTemporal = ""; 
    alert('Formulario de pedido reiniciado.');
}

// Asignar eventos (SIN CAMBIOS)
const cantidades = document.querySelectorAll('.cantidad');
cantidades.forEach(campo => {
    campo.addEventListener('input', calcularTotal);
});

document.getElementById('boton-apartado').addEventListener('click', generarResumen);

calcularTotal();
