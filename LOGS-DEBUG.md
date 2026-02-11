# Sistema de Logs y Debug - Deiiwo Coffee

## 🔍 Descripción

El sistema de logs está implementado en `public/script.js` y registra automáticamente todos los eventos importantes del flujo de compra, desde que el usuario agrega productos al carrito hasta que completa el pago con Bold.co.

## 📊 Niveles de Log

- **INFO** ℹ️ - Información general sobre el flujo (ej: "Abriendo modal de checkout")
- **DEBUG** 🔍 - Información detallada para debugging (ej: "Datos del formulario", "Respuesta de API")
- **WARN** ⚠️ - Advertencias que no impiden el funcionamiento (ej: "API falló, usando fallback")
- **ERROR** ❌ - Errores que impiden una operación (ej: "BoldCheckout SDK no cargado")
- **SUCCESS** ✅ - Confirmación de operaciones exitosas (ej: "Modal abierto correctamente")

## 🛠️ Funciones Disponibles en Consola

Abre la consola del navegador (F12 o Ctrl+Shift+I) y usa estas funciones:

### 1. Ver todos los logs
```javascript
verLogs()
```
Muestra todos los logs en formato tabla.

### 2. Ver logs por nivel
```javascript
verLogs("ERROR")    // Solo errores
verLogs("WARN")     // Solo advertencias
verLogs("INFO")     // Solo info
verLogs("DEBUG")    // Solo debug
verLogs("SUCCESS")  // Solo éxitos
```

### 3. Exportar logs a archivo JSON
```javascript
exportarLogs()
```
Descarga un archivo JSON con todos los logs. Útil para enviar al desarrollador cuando hay un problema.

### 4. Limpiar logs
```javascript
limpiarLogs()
```
Borra todos los logs almacenados en memoria.

### 5. Acceso programático
```javascript
logger.getLogs()      // Retorna array de logs
logger.exportLogs()   // Retorna JSON string
```

## 🚨 Qué Hacer Cuando Algo Falla

### Paso 1: Reproducir el error
1. Abre la consola del navegador (F12)
2. Limpia los logs: `limpiarLogs()`
3. Reproduce el error (ej: intenta hacer un pago)

### Paso 2: Exportar logs
```javascript
exportarLogs()
```
Esto descargará un archivo `deiiwo-logs-YYYY-MM-DD-HH-MM-SS.json`

### Paso 3: Revisar errores en consola
```javascript
verLogs("ERROR")
```
Los errores aparecerán con:
- **timestamp**: Hora exacta del error
- **message**: Descripción del error
- **data**: Información adicional (stack trace, datos relevantes)

### Paso 4: Revisar flujo completo
```javascript
verLogs()
```
Ver todos los logs ayuda a entender qué pasó antes del error.

## 📝 Eventos Registrados

### Inicialización
- ✅ CheckoutManager inicializado
- 🔍 Elementos del DOM encontrados/no encontrados
- ℹ️ Carrito cargado desde localStorage

### Flujo de Checkout
- ℹ️ Abriendo modal de checkout
- 🔍 Datos del formulario
- ⚠️ Validación fallida (campos vacíos, etc.)
- ✅ Formulario validado correctamente

### Cálculo de Envío
- ℹ️ Calculando costo de envío
- 🔍 Verificación de zona (Valle de Aburrá, nacional, etc.)
- ✅ Envío GRATIS aplicado
- ℹ️ Aplicando tarifa nacional
- ℹ️ Intentando cálculo con API de OpenRouteService
- 🔍 Llamando API de Geocodificación
- ✅ Dirección geocodificada
- 🔍 Llamando API de Matrix (distancias)
- ✅ Distancia calculada exitosamente
- ⚠️ API falló, usando tabla predefinida como fallback
- ℹ️ Costo de envío calculado

### Proceso de Pago con Bold.co
- ℹ️ Iniciando proceso de pago con Bold.co
- 🔍 Datos de la orden generados (orderId, amount, customer, shipping)
- ❌ BoldCheckout SDK no está cargado (ERROR CRÍTICO)
- ✅ BoldCheckout SDK detectado correctamente
- 🔍 Configuración de Bold preparada
- ✅ Instancia de BoldCheckout creada
- 🔍 Proceso de pago marcado como EN CURSO
- ℹ️ Abriendo modal de pago de Bold.co
- ✅ Modal de Bold.co abierto exitosamente
- ❌ Error al inicializar Bold.co (ERROR CRÍTICO)

### Errores Globales
- ❌ Error no controlado detectado (errores de JavaScript)
- ❌ Promesa rechazada no manejada (errores de fetch, async/await)
- ⚠️ Usuario intentó cerrar página durante proceso de pago

## 🔧 Errores Comunes y Soluciones

### Error: "BoldCheckout SDK no está cargado"
**Causa**: El script de Bold.co no se cargó correctamente
**Solución**:
1. Verificar que `<script src="https://checkout.bold.co/library/boldPaymentButton.js"></script>` esté en el HTML
2. Verificar conexión a internet
3. Verificar que no haya bloqueadores de scripts

### Error: "No se pudo geocodificar la dirección"
**Causa**: OpenRouteService API no pudo encontrar la dirección
**Solución**:
1. El sistema usa automáticamente la tabla predefinida como fallback
2. Verificar que la dirección esté escrita correctamente
3. Revisar logs con `verLogs("WARN")` para ver detalles

### Error: "Error en respuesta de geocodificación"
**Causa**: API de OpenRouteService rechazó la petición
**Solución**:
1. Verificar API Key en `script.js` (CONFIG.openRouteServiceKey)
2. Verificar límites de uso de la API (2,500 requests/mes)
3. El sistema usa fallback automáticamente

### Error: "Monto de orden inválido (<=0)"
**Causa**: El carrito está vacío o hay un error en cálculo de totales
**Solución**:
1. Verificar que hay productos en el carrito con `cart.items`
2. Verificar precios con `cart.getTotal()`
3. Revisar logs con `verLogs("DEBUG")` para ver montos calculados

## 📤 Enviar Logs al Desarrollador

Cuando reportes un error, incluye:

1. **Archivo de logs**: Generado con `exportarLogs()`
2. **Descripción del error**: Qué estabas haciendo cuando ocurrió
3. **Navegador y versión**: Chrome 120, Firefox 115, etc.
4. **Captura de pantalla**: De la consola si hay errores visibles
5. **Logs de ERROR**: Output de `verLogs("ERROR")`

## 🔒 Privacidad

Los logs solo se almacenan en memoria (máximo 100 logs) y nunca se envían automáticamente a ningún servidor. Solo puedes exportarlos manualmente con `exportarLogs()`.

Los logs contienen:
- Nombres de productos
- Montos
- Ciudades/direcciones (primeros 30 caracteres)
- Emails/teléfonos (para debugging)

**NO** se registran:
- API Keys completas (se ocultan en logs)
- Datos de tarjetas de crédito
- Contraseñas

## 🧪 Testing

Para probar el sistema de logs:

```javascript
// 1. Limpiar logs
limpiarLogs()

// 2. Agregar un producto al carrito
// (desde la UI)

// 3. Ir a checkout
// (desde la UI)

// 4. Ver logs generados
verLogs()

// 5. Exportar logs
exportarLogs()
```

## 📞 Soporte

Si tienes problemas con el sistema de logs o necesitas ayuda para interpretarlos, contacta al equipo de desarrollo.
