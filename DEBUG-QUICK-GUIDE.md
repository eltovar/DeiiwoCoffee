# 🚀 Debug Quick Guide - Deiiwo Coffee

## El "Método Fácil" - Auto-Toast Notifications

**No necesitas abrir la consola para saber que algo falló.**

Cada vez que ocurre un **ERROR** o **WARNING importante**, aparecerá automáticamente una notificación visual en la esquina inferior derecha de la pantalla por 5 segundos.

### Ejemplo:
```
❌ Error en Pago:
BoldCheckout SDK no está cargado
```

Esto significa que puedes hacer pruebas sin tener que estar mirando la consola constantemente. Si ves una notificación roja, sabrás que algo falló.

---

## 📊 Comandos de Consola (English)

Abre la consola del navegador (F12) y usa estos comandos:

### Comando Principal: `showLogs()`

**La forma más fácil de ver logs:**
```javascript
showLogs()
```

**¿Por qué es el método fácil?**
- Usa `console.table()` en lugar de `console.log()`
- Te muestra una **tabla organizada** con columnas:
  - **timestamp** - Hora exacta
  - **level** - INFO, ERROR, WARN, etc.
  - **message** - Descripción del evento
  - **data** - Información adicional

**Filtrar por nivel:**
```javascript
showLogs("ERROR")    // Solo errores
showLogs("WARN")     // Solo advertencias
showLogs("SUCCESS")  // Solo éxitos
```

### Ver Últimos N Logs

```javascript
getLastLogs(10)   // Últimos 10 logs
getLastLogs(5)    // Últimos 5 logs
```

**Útil cuando:** Solo quieres ver qué pasó en los últimos segundos sin revisar todo el historial.

### Exportar para Soporte

```javascript
exportLogs()
```

Descarga un archivo JSON con **todos** los logs. Envíalo cuando reportes un problema.

### Limpiar Logs

```javascript
clearLogs()
```

Borra todos los logs almacenados. **Úsalo antes de reproducir un error** para tener logs limpios.

---

## 🎯 Flujo de Debugging Recomendado

### Cuando algo falla:

**Paso 1: ¿Viste una notificación roja?**
- ✅ **SÍ** → Ya sabes que hubo un error
- ❌ **NO** → Puede ser un warning o problema silencioso

**Paso 2: Abre la consola (F12)**
```javascript
showLogs("ERROR")
```

**Paso 3: Ver el error detallado**
La tabla te mostrará:
- **Cuándo** ocurrió (timestamp)
- **Qué** falló (message)
- **Información adicional** (data)

**Paso 4: Si necesitas más contexto**
```javascript
getLastLogs(20)
```
Ver los últimos 20 logs te ayuda a entender qué pasó **antes** del error.

**Paso 5: Exportar para soporte**
```javascript
exportLogs()
```

---

## 🔍 Ejemplos Reales

### Ejemplo 1: Error de Bold.co

**Notificación visual automática:**
```
❌ Error en Pago:
BoldCheckout SDK no está cargado
```

**En consola:**
```javascript
showLogs("ERROR")
```

**Resultado:**
| timestamp | level | message | data |
|-----------|-------|---------|------|
| 2026-02-10T15:30:45.123Z | ERROR | BoldCheckout SDK no está cargado | { razon: "Script no cargado", solucion: "Verificar HTML" } |

**Solución:** Revisar que el script de Bold esté incluido en el HTML.

---

### Ejemplo 2: Problema con cálculo de envío

**Notificación visual:**
```
⚠️ WARN:
API falló, usando tabla predefinida como fallback
```

**En consola:**
```javascript
showLogs("WARN")
```

**Resultado:**
| timestamp | level | message | data |
|-----------|-------|---------|------|
| 2026-02-10T15:31:12.456Z | WARN | API falló, usando tabla predefinida | null |

**Interpretación:** La API de OpenRouteService no respondió, pero el sistema usó la tabla predefinida automáticamente. **No es un error crítico**, el checkout sigue funcionando.

---

### Ejemplo 3: Ver flujo completo de un pago

```javascript
clearLogs()  // Limpiar logs anteriores
```

*Usuario hace el proceso de pago...*

```javascript
showLogs()   // Ver todos los logs en tabla
```

**Resultado:**
| timestamp | level | message |
|-----------|-------|---------|
| ...45.001Z | INFO | Abriendo modal de checkout |
| ...45.123Z | DEBUG | Datos del formulario |
| ...45.234Z | INFO | Calculando costo de envío |
| ...45.456Z | SUCCESS | Formulario validado correctamente |
| ...45.678Z | INFO | Iniciando proceso de pago con Bold.co |
| ...45.789Z | SUCCESS | BoldCheckout SDK detectado correctamente |
| ...45.890Z | SUCCESS | Modal de Bold.co abierto exitosamente |

**Interpretación:** Todo funcionó correctamente. Puedes ver el **flujo completo** paso a paso.

---

## ⚡ Pro Tips

### 1. Usa `console.table()` - El Método Fácil

A diferencia de `console.log()` que muestra una lista larga y difícil de leer, `showLogs()` usa `console.table()` para mostrarte una **cuadrícula organizada** con columnas.

**Ventajas:**
- ✅ Más fácil de leer
- ✅ Puedes ordenar por columnas
- ✅ Identificas patrones de errores en segundos

### 2. Filtra por nivel para encontrar problemas rápido

```javascript
// Solo errores críticos
showLogs("ERROR")

// Ver advertencias que pueden ser problemas
showLogs("WARN")

// Ver confirmaciones de que todo funcionó
showLogs("SUCCESS")
```

### 3. Combina clearLogs() + Reproducir + showLogs()

```javascript
clearLogs()              // 1. Limpiar
// 2. Reproducir el error en la UI
showLogs("ERROR")        // 3. Ver solo el error nuevo
```

### 4. Exporta antes de cerrar la pestaña

Si estás reportando un bug:
```javascript
exportLogs()  // Descarga JSON
```

El archivo `deiiwo-logs-[timestamp].json` contiene **toda la información** que necesita el desarrollador.

---

## 🎨 Colores en Consola

Los logs usan colores para facilitar la lectura:

- 🔵 **INFO** - Azul (eventos normales)
- 🟣 **DEBUG** - Morado (detalles técnicos)
- 🟡 **WARN** - Amarillo (advertencias)
- 🔴 **ERROR** - Rojo (errores críticos)
- 🟢 **SUCCESS** - Verde (operaciones exitosas)

---

## 📱 Notificaciones Visuales

Las notificaciones aparecen automáticamente para:

✅ **Todos los ERRORES**
✅ **Warnings importantes:**
  - "API falló"
  - "Validación fallida"

**Duración:** 5 segundos

**Ubicación:** Esquina inferior derecha

**Animación:** Slide-in desde la derecha

---

## 🆘 Reportar un Bug

Cuando reportes un problema, incluye:

1. **Archivo de logs**: `exportLogs()` → adjuntar el JSON descargado
2. **Captura de pantalla**: Si viste notificación visual
3. **Pasos para reproducir**: Qué hiciste antes del error
4. **Navegador**: Chrome 120, Firefox 115, etc.

---

## 🔐 Privacidad

Los logs **NO** se envían automáticamente. Solo se almacenan en tu navegador.

**Se registra:**
- Eventos del flujo de pago
- Montos y ciudades
- Errores de APIs
- Datos del formulario (para debugging)

**NO se registra:**
- API Keys completas (se ocultan)
- Datos de tarjetas de crédito
- Contraseñas

---

## ✨ Comandos Rápidos

```javascript
// Ver todo en tabla organizada
showLogs()

// Solo errores
showLogs("ERROR")

// Últimos 5 logs
getLastLogs(5)

// Exportar para soporte
exportLogs()

// Limpiar y empezar de nuevo
clearLogs()
```

**Recuerda:** No necesitas la consola abierta para saber que algo falló. Las notificaciones visuales te avisarán automáticamente. 🎉
