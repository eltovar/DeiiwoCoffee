# Logging & Debug System - Deiiwo Coffee

## 🔍 Description

The logging system is implemented in `public/script.js` and automatically records all important events in the purchase flow, from when the user adds products to the cart until they complete payment with Bold.co.

**Console Commands (English):**
- `showLogs()` - Display all logs
- `showLogs("ERROR")` - Filter by level
- `getLastLogs(10)` - Show last N logs
- `exportLogs()` - Download logs as JSON
- `clearLogs()` - Clear all logs

## 📊 Niveles de Log

- **INFO** ℹ️ - Información general sobre el flujo (ej: "Abriendo modal de checkout")
- **DEBUG** 🔍 - Información detallada para debugging (ej: "Datos del formulario", "Respuesta de API")
- **WARN** ⚠️ - Advertencias que no impiden el funcionamiento (ej: "API falló, usando fallback")
- **ERROR** ❌ - Errores que impiden una operación (ej: "BoldCheckout SDK no cargado")
- **SUCCESS** ✅ - Confirmación de operaciones exitosas (ej: "Modal abierto correctamente")

## 🛠️ Available Console Commands

Open the browser console (F12 or Ctrl+Shift+I) and use these commands:

### 1. Show all logs
```javascript
showLogs()
```
Displays all logs in table format.

### 2. Show logs by level
```javascript
showLogs("ERROR")    // Errors only
showLogs("WARN")     // Warnings only
showLogs("INFO")     // Info only
showLogs("DEBUG")    // Debug only
showLogs("SUCCESS")  // Success only
```

### 3. Get last N logs
```javascript
getLastLogs(10)   // Show last 10 logs
getLastLogs(5)    // Show last 5 logs
```

### 4. Export logs to JSON file
```javascript
exportLogs()
```
Downloads a JSON file with all logs. Useful to send to developer when there's an issue.

### 5. Clear logs
```javascript
clearLogs()
```
Clears all logs stored in memory.

### 6. Programmatic access
```javascript
logger.getLogs()      // Returns array of logs
logger.exportLogs()   // Returns JSON string
```

## 🚨 Qué Hacer Cuando Algo Falla

### Step 1: Reproduce the error
1. Open browser console (F12)
2. Clear logs: `clearLogs()`
3. Reproduce the error (e.g., try to make a payment)

### Step 2: Export logs
```javascript
exportLogs()
```
This will download a file `deiiwo-logs-YYYY-MM-DD-HH-MM-SS.json`

### Step 3: Review errors in console
```javascript
showLogs("ERROR")
```
Errors will show:
- **timestamp**: Exact time of the error
- **message**: Error description
- **data**: Additional information (stack trace, relevant data)

### Step 4: Review complete flow
```javascript
showLogs()
```
Viewing all logs helps understand what happened before the error.

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

To test the logging system:

```javascript
// 1. Clear logs
clearLogs()

// 2. Add a product to cart
// (from the UI)

// 3. Go to checkout
// (from the UI)

// 4. View generated logs
showLogs()

// 5. View last 10 logs
getLastLogs(10)

// 6. Export logs
exportLogs()
```

## 📞 Soporte

Si tienes problemas con el sistema de logs o necesitas ayuda para interpretarlos, contacta al equipo de desarrollo.
