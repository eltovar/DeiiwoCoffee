# Guía de Pruebas - Sistema de Pagos Bold.co

## 🎯 OBJETIVO

Esta guía te ayudará a verificar que todo el sistema de pagos funcione correctamente antes de lanzar en producción.

---

## 📋 PRE-REQUISITOS

### 1. Servidor Webhook Activo
- [ ] Webhook desplegado en Railway: `https://deiiwocoffee-production.up.railway.app`
- [ ] Variables de entorno configuradas en Railway
- [ ] Servidor respondiendo (prueba con `curl https://deiiwocoffee-production.up.railway.app/webhook-bold`)

### 2. Webhook Configurado en Bold Dashboard
- [ ] URL del webhook agregada en Bold.co
- [ ] Eventos configurados: `payment.approved` o `payment.success`
- [ ] Secret Key correcta: `-8f9lINMfG3QSvcl_hSRhHw`

### 3. Sitio Web Desplegado
- [ ] Sitio accesible en tu dominio o servidor
- [ ] HTTPS activo (obligatorio para Bold)
- [ ] Archivos actualizados con última versión del código

---

## 🧪 PRUEBAS PASO A PASO

### PRUEBA 1: Interfaz del Carrito ✅

**Objetivo:** Verificar que los botones se muestren correctamente.

**Pasos:**
1. Abre el sitio web en tu navegador
2. Ve a la [tienda](tienda.html)
3. Agrega al menos 1 producto al carrito
4. Abre el carrito (clic en el icono del carrito)

**Verificar:**
- [ ] El carrito se abre correctamente
- [ ] Se muestran los productos agregados
- [ ] Se muestra el total correcto
- [ ] Hay 2 botones visibles:
  - [ ] "Pedir por WhatsApp" (verde)
  - [ ] "Proceder al Pago" (negro)

**Resultado Esperado:**
```
┌─────────────────────────┐
│ Carrito (2)             │
├─────────────────────────┤
│ Café 500g x1    $60,000 │
│ Alfajor x2      $20,000 │
├─────────────────────────┤
│ Total:          $80,000 │
├─────────────────────────┤
│ [Pedir por WhatsApp]    │ ← Verde
│ [Proceder al Pago]      │ ← Negro
└─────────────────────────┘
```

**Si falla:**
- Verifica que los archivos HTML estén actualizados
- Limpia caché del navegador (Ctrl+Shift+R)
- Revisa la consola de DevTools (F12) por errores

---

### PRUEBA 2: Botón de WhatsApp ✅

**Objetivo:** Verificar que el botón de WhatsApp funcione.

**Pasos:**
1. Con productos en el carrito, clic en "Pedir por WhatsApp"

**Verificar:**
- [ ] Se abre WhatsApp Web en nueva pestaña
- [ ] El mensaje pre-llenado contiene:
  - [ ] Lista de productos con cantidades
  - [ ] Precios individuales
  - [ ] Total del pedido
  - [ ] Pregunta sobre costo de envío

**Mensaje Esperado:**
```
¡Hola! Quiero hacer el siguiente pedido:

• Café de Especialidad 500g (Molido) x1 - $60,000
• Alfajor de Café x2 - $20,000

*Total: $80,000 COP*

¿Cuál sería el costo de envío?
```

**Si falla:**
- Verifica que `script.js` esté actualizado
- Revisa que el número de WhatsApp sea correcto: `573022199112`

---

### PRUEBA 3: Modal de Checkout - Paso 1 ✅

**Objetivo:** Verificar que el modal de checkout se abra correctamente.

**Pasos:**
1. Con productos en el carrito, clic en "Proceder al Pago"

**Verificar:**
- [ ] Se abre el modal de checkout
- [ ] El fondo se oscurece (overlay)
- [ ] Se muestra el título "Finalizar Compra"
- [ ] Hay un botón X para cerrar
- [ ] Se muestra "Resumen del Pedido"
- [ ] Lista de productos correcta
- [ ] Subtotal correcto
- [ ] Hay un botón "Continuar"

**Resultado Esperado:**
```
┌──────────────────────────────────┐
│ Finalizar Compra             [X] │
├──────────────────────────────────┤
│ Resumen del Pedido               │
│                                  │
│ Café 500g x1         $60,000     │
│ Alfajor x2           $20,000     │
│                                  │
│ Subtotal:            $80,000     │
│                                  │
│                    [Continuar]   │
└──────────────────────────────────┘
```

**Si falla:**
- Abre DevTools (F12) → Console
- Busca errores de JavaScript
- Verifica que `styles.css` tenga los estilos del modal
- Verifica que el script de Bold.co esté cargando

---

### PRUEBA 4: Modal de Checkout - Paso 2 ✅

**Objetivo:** Verificar el formulario de datos de envío.

**Pasos:**
1. En el modal, clic en "Continuar"

**Verificar:**
- [ ] Cambia a "Datos de Envío"
- [ ] Se muestra el formulario con campos:
  - [ ] Nombre completo *
  - [ ] Email *
  - [ ] Teléfono *
  - [ ] Método de entrega (radio buttons)
  - [ ] Departamento (selector)
  - [ ] Ciudad (selector)
  - [ ] Dirección completa *
  - [ ] Indicaciones adicionales (textarea)
- [ ] Se muestra resumen de costos
- [ ] Checkbox de términos y condiciones
- [ ] Botón "Volver"
- [ ] Botón "Continuar"

**Si falla:**
- Verifica que todos los elementos HTML estén presentes
- Revisa estilos de formulario en CSS

---

### PRUEBA 5: Cálculo de Envío ✅

**Objetivo:** Verificar que el costo de envío se calcule correctamente.

**Pasos:**
1. En el formulario de datos de envío:
   - Nombre: "Juan Pérez"
   - Email: "test@example.com"
   - Teléfono: "+573001234567"
   - Método: "Envío a domicilio"
   - Departamento: "Antioquia"
   - Ciudad: "Medellín"
   - Dirección: "Calle 50 # 45-123"

**Verificar:**
- [ ] El costo de envío se actualiza automáticamente
- [ ] Para Medellín: $15,000 COP
- [ ] Total = Subtotal + Envío

**Casos de Prueba:**

| Ciudad | Subtotal | Envío Esperado | Total Esperado |
|--------|----------|----------------|----------------|
| Envigado | $50,000 | $0 (GRATIS) | $50,000 |
| Sabaneta | $50,000 | $7,500 | $57,500 |
| Medellín | $50,000 | $15,000 | $65,000 |
| Medellín | $120,000 | $0 (GRATIS*) | $120,000 |
| Bogotá | $50,000 | $30,000 | $80,000 |

*Envío gratis por pedido ≥ $100,000 (solo Valle de Aburrá)

**Si falla:**
- Revisa la función `calcularEnvio()` en CheckoutManager
- Verifica las distancias en la tabla predefinida
- Abre Console y busca errores

---

### PRUEBA 6: Retiro en Tienda ✅

**Objetivo:** Verificar que "Retiro en tienda" funcione.

**Pasos:**
1. En el formulario:
   - Método: "Retiro en tienda"

**Verificar:**
- [ ] Los campos de dirección se ocultan
- [ ] Costo de envío: GRATIS
- [ ] Total = Subtotal (sin envío)

---

### PRUEBA 7: Validación de Formulario ✅

**Objetivo:** Verificar que las validaciones funcionen.

**Caso 1: Campos vacíos**
1. Deja campos requeridos vacíos
2. Clic en "Continuar"

**Verificar:**
- [ ] Aparece alerta: "Por favor completa todos los campos requeridos"
- [ ] No avanza al siguiente paso

**Caso 2: Sin aceptar términos**
1. Completa todos los campos
2. NO marques "Acepto términos y condiciones"
3. Clic en "Continuar"

**Verificar:**
- [ ] Aparece alerta: "Debes aceptar los términos y condiciones"

**Caso 3: Todo correcto**
1. Completa todos los campos
2. Marca términos y condiciones
3. Clic en "Continuar"

**Verificar:**
- [ ] Aparece botón "Pagar con Bold"
- [ ] Se oculta botón "Continuar"

---

### PRUEBA 8: Integración Bold.co - Sandbox ✅

**Objetivo:** Verificar que Bold se integre correctamente.

**Pasos:**
1. Completa el formulario correctamente
2. Clic en "Pagar con Bold"

**Verificar:**
- [ ] Se abre modal de Bold.co
- [ ] Se muestra el monto correcto
- [ ] Se muestran opciones de pago:
  - [ ] Tarjeta de crédito/débito
  - [ ] PSE
  - [ ] Nequi
  - [ ] Daviplata
  - [ ] Etc.

**Tarjetas de Prueba Bold:**

| Tarjeta | Número | CVV | Fecha | Resultado |
|---------|--------|-----|-------|-----------|
| Visa Aprobada | 4111 1111 1111 1111 | 123 | 12/25 | ✅ Aprobada |
| Mastercard Rechazada | 5555 5555 5555 4444 | 123 | 12/25 | ❌ Rechazada |
| Visa con 3DS | 4000 0000 0000 0002 | 123 | 12/25 | 🔐 Requiere 3DS |

**Datos de prueba:**
- Titular: "Juan Pérez"
- Email: "test@example.com"
- Teléfono: "3001234567"

**Si falla:**
- Verifica que la API Key pública sea correcta
- Abre Console → Network → Busca errores de carga del SDK
- Verifica que el sitio esté en HTTPS

---

### PRUEBA 9: Pago de Prueba Completo 💳

**Objetivo:** Completar un pago de prueba exitoso.

**Pasos:**
1. Agrega productos al carrito
2. Procede al pago con Bold
3. En el modal de Bold, selecciona "Tarjeta de crédito"
4. Ingresa tarjeta de prueba:
   - Número: `4111 1111 1111 1111`
   - CVV: `123`
   - Fecha: `12/25`
   - Titular: "Juan Pérez"
5. Completa el pago

**Verificar:**
- [ ] Bold muestra "Pago Aprobado"
- [ ] Redirige a página de confirmación (o cierra modal)
- [ ] Carrito se vacía automáticamente

**Tiempo esperado:** 5-10 segundos

**Si falla:**
- Verifica que estés usando tarjeta de prueba correcta
- Bold rechaza pagos si detecta problemas con el merchant

---

### PRUEBA 10: Webhook - Email al Cliente 📧

**Objetivo:** Verificar que el cliente reciba email de confirmación.

**Pasos:**
1. Después del pago de prueba exitoso
2. Espera 30-60 segundos

**Verificar en bandeja de entrada del email de prueba:**
- [ ] Llega email de "Atención al Cliente Deiiwo"
- [ ] Asunto: "¡Pedido confirmado! #DC-[timestamp]"
- [ ] Contenido del email:
  - [ ] Saludo con nombre del cliente
  - [ ] Número de pedido
  - [ ] Tabla con productos y precios
  - [ ] Costo de envío (o "GRATIS")
  - [ ] Total destacado
  - [ ] Datos de envío (dirección, ciudad)
  - [ ] Indicaciones adicionales (si las hubo)
  - [ ] Link a WhatsApp para consultas
  - [ ] Footer con dirección de la tienda

**Ejemplo de Email:**
```
De: Atención al Cliente Deiiwo <atencionalcliente@deiwocoffee.com>
Para: test@example.com
Asunto: ¡Pedido confirmado! #DC-1707321234567

¡Gracias por tu compra!
Hola Juan Pérez, tu pedido ha sido confirmado.

Número de pedido: #DC-1707321234567

┌─────────────────────────────────────┐
│ Producto           │ Cant. │ Precio │
├─────────────────────────────────────┤
│ Café 500g          │   1   │ $60,000│
│ Alfajor de Café    │   2   │ $20,000│
├─────────────────────────────────────┤
│ Envío (Medellín)               $15,000│
│ TOTAL                          $95,000│
└─────────────────────────────────────┘

📍 Datos de envío:
Dirección: Calle 50 # 45-123
Ciudad: Medellín

¿Tienes preguntas? Escríbenos por WhatsApp
```

**Si falla:**
- Verifica que el webhook esté activo en Railway
- Revisa logs del servidor webhook
- Confirma que el webhook esté configurado en Bold Dashboard
- Verifica credenciales de Gmail en variables de entorno

---

### PRUEBA 11: Webhook - Email Interno 📧

**Objetivo:** Verificar que Deiiwo reciba notificación del pedido.

**Pasos:**
1. Después del pago de prueba
2. Revisa inbox de `atencionalcliente@deiwocoffee.com`

**Verificar:**
- [ ] Llega email de "Sistema Deiiwo"
- [ ] Asunto: "🛒 Nuevo Pedido #DC-[timestamp] - $[total]"
- [ ] Contenido:
  - [ ] Título con número de pedido
  - [ ] Tabla con datos del cliente:
    - [ ] Nombre
    - [ ] Email (con link mailto)
    - [ ] Teléfono (con link WhatsApp)
  - [ ] Lista de productos con cantidades y precios
  - [ ] Información de envío:
    - [ ] Método (Domicilio o Retiro)
    - [ ] Dirección completa
    - [ ] Ciudad
    - [ ] Costo de envío
    - [ ] Indicaciones especiales
  - [ ] Total destacado en verde
  - [ ] Botón grande "Contactar Cliente por WhatsApp"

**Si falla:**
- Mismo diagnóstico que Prueba 10
- Verifica que el alias `atencionalcliente@deiwocoffee.com` esté bien configurado

---

### PRUEBA 12: Validación de Firma (Seguridad) 🔐

**Objetivo:** Verificar que el webhook rechace peticiones sin firma válida.

**Pasos (requiere herramienta como Postman o curl):**

```bash
# Intento SIN firma (debe fallar)
curl -X POST https://deiiwocoffee-production.up.railway.app/webhook-bold \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED","order_id":"TEST-123","amount":50000}'

# Respuesta esperada: 401 Unauthorized
```

**Verificar:**
- [ ] Respuesta: `{"error":"Unauthorized"}`
- [ ] Status Code: 401
- [ ] NO se envían emails

**Si falla:**
- El webhook tiene un problema de seguridad crítico
- Revisa la función de validación de firma en `webhook-bold.js`

---

### PRUEBA 13: Pago Rechazado ❌

**Objetivo:** Verificar comportamiento cuando el pago es rechazado.

**Pasos:**
1. Procede al pago
2. Usa tarjeta de prueba rechazada: `5555 5555 5555 4444`

**Verificar:**
- [ ] Bold muestra mensaje "Pago Rechazado"
- [ ] NO se envían emails
- [ ] El carrito NO se vacía
- [ ] El usuario puede reintentar el pago

---

### PRUEBA 14: XSS Protection (Seguridad) 🛡️

**Objetivo:** Verificar que la protección XSS funcione.

**Pasos:**
1. Abre DevTools Console (F12)
2. Ejecuta:
```javascript
cart.addItem({
    name: '<img src=x onerror=alert("XSS")>',
    price: 10000,
    quantity: 1
});
```

**Verificar:**
- [ ] El producto se agrega al carrito
- [ ] NO aparece ningún alert
- [ ] En el carrito, el nombre se muestra como texto plano (no se ejecuta el script)
- [ ] HTML escapado correctamente

**Resultado Esperado:**
El nombre se muestra literalmente como:
```
<img src=x onerror=alert("XSS")>
```

**Si falla:**
- La función `escapeHTML()` no está funcionando
- Revisa su implementación en `script.js`

---

### PRUEBA 15: localStorage Corruption (Seguridad) 🛡️

**Objetivo:** Verificar que el sistema maneje datos corruptos.

**Pasos:**
1. Abre DevTools Console
2. Ejecuta:
```javascript
localStorage.setItem('deiiwo_cart', '{invalid json}');
location.reload();
```

**Verificar:**
- [ ] La página NO crashea
- [ ] El carrito aparece vacío
- [ ] Console muestra: "Error loading cart: ..."
- [ ] El sitio sigue funcionando normalmente

**Si falla:**
- El try/catch en `loadCart()` no está funcionando
- Revisa la implementación

---

## 📊 CHECKLIST FINAL PRE-PRODUCCIÓN

### Frontend
- [ ] Botón "Nuestra Historia" visible y con buen contraste
- [ ] Carrito muestra 2 botones (WhatsApp + Bold)
- [ ] Modal de checkout se abre correctamente
- [ ] Formulario completo se muestra
- [ ] Cálculo de envío funciona para todas las ciudades
- [ ] Validaciones de formulario funcionan
- [ ] Tarjeta de prueba procesa pago exitoso
- [ ] Protección XSS activa
- [ ] Manejo de localStorage corrupto

### Backend (Webhook)
- [ ] Webhook responde en Railway
- [ ] Validación de firma funciona
- [ ] Email al cliente se envía
- [ ] Email a Deiiwo se envía
- [ ] Solo pagos aprobados generan emails
- [ ] Rechaza webhooks sin firma válida

### Configuración Bold
- [ ] Webhook URL configurada en Bold Dashboard
- [ ] Secret Key correcta
- [ ] Eventos configurados correctamente

### General
- [ ] Sitio en HTTPS
- [ ] .env NO está en Git
- [ ] Variables de entorno en Railway
- [ ] Pruebas en móvil (responsive)

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### 1. Modal no se abre
**Síntomas:** Clic en "Proceder al Pago" no hace nada.

**Diagnóstico:**
- Abre Console (F12)
- Busca error: `checkout is not defined`

**Solución:**
- Verifica que `CheckoutManager` esté inicializado
- Busca al final de `script.js`: `const checkout = new CheckoutManager(cart);`

---

### 2. Costo de envío siempre $0
**Síntomas:** Todas las ciudades muestran envío gratis.

**Diagnóstico:**
- Abre Console → Sources → script.js
- Busca función `calcularEnvio()`
- Pon breakpoint y ejecuta paso a paso

**Solución:**
- Verifica que el evento `change` del selector de ciudad esté funcionando
- Confirma que `this.metodoEntrega` tenga el valor correcto

---

### 3. Bold muestra "Merchant not found"
**Síntomas:** Al abrir checkout de Bold, error de merchant.

**Solución:**
- Verifica que la API Key pública sea correcta
- Confirma que tu cuenta de Bold esté activa
- Contacta soporte de Bold si persiste

---

### 4. Emails no llegan
**Síntomas:** Pago exitoso pero sin emails.

**Diagnóstico:**
```bash
# Ver logs del webhook en Railway
railway logs -f
```

**Soluciones:**
1. **Error de autenticación Gmail:**
   - Verifica Gmail App Password en variables de entorno
   - Confirma que la cuenta no esté bloqueada

2. **Webhook no recibe notificación:**
   - Verifica URL en Bold Dashboard
   - Confirma que Secret Key sea correcta
   - Revisa logs para ver si llegó la petición

3. **Firma inválida:**
   - Actualiza Secret Key en variables de entorno
   - Reinicia el servidor en Railway

---

### 5. "Carrito vacío" después de pago
**Síntomas:** El carrito se vacía pero no llegan emails.

**Diagnóstico:**
- El pago se procesó en Bold
- El webhook no recibió notificación o falló

**Solución:**
- Revisa logs del webhook
- Verifica que el webhook esté configurado en Bold
- Usa herramientas de Bold Dashboard para reenviar webhook

---

## 📞 CONTACTO DE SOPORTE

### Bold.co
- Dashboard: https://dashboard.bold.co
- Documentación: https://bold.co/developers
- Soporte: Desde dashboard de Bold

### Railway
- Dashboard: https://railway.app
- Documentación: https://docs.railway.app
- Soporte: https://railway.app/help

### Deiiwo Coffee
- Email: atencionalcliente@deiwocoffee.com
- WhatsApp: +57 302 219 9112

---

## 📝 REGISTRO DE PRUEBAS

Usa esta tabla para documentar tus pruebas:

| Prueba | Fecha | Resultado | Notas |
|--------|-------|-----------|-------|
| 1. Interfaz del Carrito | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 2. Botón WhatsApp | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 3. Modal - Paso 1 | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 4. Modal - Paso 2 | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 5. Cálculo de Envío | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 6. Retiro en Tienda | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 7. Validación Formulario | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 8. Integración Bold | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 9. Pago de Prueba | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 10. Email Cliente | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 11. Email Interno | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 12. Validación Firma | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 13. Pago Rechazado | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 14. XSS Protection | ___/___/___ | ☐ ✅ ☐ ❌ | |
| 15. localStorage | ___/___/___ | ☐ ✅ ☐ ❌ | |

---

**Última actualización:** 2026-02-09
**Versión:** 1.0

¡Éxito con las pruebas! 🚀
