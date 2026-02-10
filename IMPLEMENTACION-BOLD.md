# Implementación Sistema de Pagos Bold.co - Deiiwo Coffee

## ✅ IMPLEMENTACIÓN COMPLETADA

### Archivos Modificados/Creados

#### Frontend (Sitio Web)
- ✅ [index.html](index.html) - Modal de checkout + SDK Bold.co
- ✅ [tienda.html](tienda.html) - Modal de checkout + SDK Bold.co
- ✅ [script.js](script.js) - CheckoutManager + Correcciones seguridad
- ✅ [styles.css](styles.css) - Estilos completos del checkout

#### Backend (Webhook)
- ✅ [webhook-bold.js](webhook-bold.js) - Servidor Node.js para notificaciones
- ✅ [.env](.env) - Variables de entorno con credenciales
- ✅ [package.json](package.json) - Dependencias del proyecto

---

## 🚀 PASOS PARA DESPLEGAR

### 1. Subir Frontend (Ya está listo en el sitio actual)
Los archivos HTML, CSS y JS ya están actualizados y listos para funcionar.

### 2. Configurar Servidor Webhook en Railway.app

Ya tienes el servidor en: `https://deiiwocoffee-production.up.railway.app`

**Pasos para desplegar el webhook:**

1. **Subir archivos a Railway:**
   - `webhook-bold.js`
   - `package.json`
   - `.env` (o configurar variables de entorno en Railway Dashboard)

2. **Configurar variables de entorno en Railway:**
   - Ve a tu proyecto en Railway
   - Settings → Variables
   - Agregar las siguientes variables:
     ```
     BOLD_SECRET_KEY=-8f9lINMfG3QSvcl_hSRhHw
     EMAIL_USER=deiwocoffee@gmail.com
     EMAIL_PASS=mhmn ojso ifan hahq
     PORT=3000
     ```

3. **Comando de inicio:**
   - Railway debería detectar automáticamente el `package.json`
   - Comando start: `node webhook-bold.js`

### 3. Configurar Webhook en Bold Dashboard

1. Inicia sesión en tu cuenta de Bold.co
2. Ve a **Configuración** → **Webhooks**
3. Agregar nuevo webhook:
   - **URL:** `https://deiiwocoffee-production.up.railway.app/webhook-bold`
   - **Eventos a escuchar:** `payment.approved` o `payment.success`
   - **Secret Key:** `-8f9lINMfG3QSvcl_hSRhHw`
4. Guardar y activar webhook

---

## 📋 FUNCIONALIDADES IMPLEMENTADAS

### 1. Correcciones de Seguridad ✅
- **XSS Protection:** Función `escapeHTML()` para sanitizar nombres de productos
- **localStorage Validación:** Try/catch + validación de tipos de datos
- **Webhook Signature Validation:** HMAC SHA256 para validar webhooks de Bold
- **Event Listeners Seguros:** Eliminación de onclick inline, uso de addEventListener
- **Validación de Formularios:** Validación de campos requeridos y formatos
- **Sanitización de Datos:** Escape de HTML antes de renderizar contenido del usuario

### 2. Modal de Checkout ✅
- **Paso 1:** Resumen del pedido con lista de productos
- **Paso 2:** Formulario completo con:
  - Datos personales (nombre, email, teléfono)
  - Método de entrega (envío a domicilio o retiro en tienda)
  - Selector de departamento y ciudad
  - Campo de dirección completa
  - Indicaciones adicionales para el domiciliario
  - Tabla desplegable con tarifas de envío
  - Checkbox de términos y condiciones

### 3. Cálculo Automático de Envío ✅
- **Envigado:** GRATIS
- **Valle de Aburrá:** $1,500 COP/km
  - Sabaneta: $7,500
  - Itagüí: $9,000
  - La Estrella: $12,000
  - Medellín: $15,000
  - Caldas: $18,000
  - Bello: $22,500
  - Copacabana: $30,000
- **Envío Gratis:** Pedidos ≥ $100,000 COP (solo Valle de Aburrá)
- **Nacional:** $30,000 COP (resto de Colombia)

### 4. Integración Bold.co ✅
- SDK oficial de Bold.co cargado
- API Key pública configurada
- Metadata completa enviada:
  - Productos (nombre, cantidad, precio)
  - Datos del cliente
  - Información de envío
  - Indicaciones especiales

### 5. Sistema de Notificaciones (Webhook) ✅
- Validación de firma HMAC SHA256 para seguridad
- Email automático al cliente con:
  - Confirmación de pedido
  - Detalle de productos y precios
  - Información de envío
  - Link a WhatsApp para consultas
- Email automático a Deiiwo con:
  - Alerta de nuevo pedido
  - Datos completos del cliente
  - Lista de productos
  - Total destacado
  - Botón directo a WhatsApp del cliente

---

## 🧪 CÓMO PROBAR

### Prueba Local del Frontend
1. Abre [tienda.html](tienda.html) en tu navegador
2. Agrega productos al carrito
3. Click en "Proceder al Pago"
4. Completa el formulario:
   - Nombre: "Juan Pérez"
   - Email: "test@example.com"
   - Teléfono: "+573001234567"
   - Método: "Envío a domicilio"
   - Departamento: "Antioquia"
   - Ciudad: "Medellín"
   - Dirección: "Calle 50 # 45-123"
5. Verifica que el cálculo de envío funcione:
   - Subtotal: precio de productos
   - Envío: $15,000 (Medellín)
   - Total: suma correcta
6. Click en "Pagar con Bold"
7. Debería abrirse el modal de Bold.co

### Prueba del Webhook
Para probar el webhook, necesitas hacer un pago real o usar el entorno de pruebas de Bold:

1. Usa tarjetas de prueba de Bold.co
2. Completa el pago
3. Verifica que lleguen los emails:
   - Al cliente (email ingresado en el formulario)
   - A `atencionalcliente@deiwocoffee.com`

---

## 🔐 CREDENCIALES CONFIGURADAS

### Bold.co
- **API Key pública:** `-OA3_-SARWimpjOAZqugRvhY2W_d3YhNsT0YF8m1uI1U`
- **Secret Key:** `-8f9lINMfG3QSvcl_hSRhHw`
- **Webhook URL:** `https://deiiwocoffee-production.up.railway.app/webhook-bold`

### OpenRouteService (Para cálculo de distancia - opcional)
- **API Key:** `eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImE1N2JjYTdjYjRlMjRlODI5YzIwNWYyMGViYmNjMzQzIiwiaCI6Im11cm11cjY0In0=`
- **Nota:** Actualmente usa tabla predefinida de distancias

### Email
- **Cuenta:** `deiwocoffee@gmail.com`
- **Alias:** `atencionalcliente@deiwocoffee.com`
- **App Password:** `mhmn ojso ifan hahq`

---

## ⚠️ NOTAS IMPORTANTES

### Seguridad
1. **No subir .env a Git:**
   - Agregar `.env` al `.gitignore`
   - Configurar variables directamente en Railway

2. **HTTPS Obligatorio:**
   - El sitio DEBE estar en HTTPS para que Bold funcione
   - Railway ya proporciona HTTPS automáticamente

3. **Validación de Precios:**
   - Actualmente los precios se calculan en el frontend
   - Para mayor seguridad, considera implementar un backend que valide los precios
   - Bold cobra el `amount` que le envías, así que es importante proteger este valor

### Próximos Pasos (Opcionales)
1. **Página de Confirmación:**
   - Crear `confirmacion.html` para después del pago
   - Mostrar estado del pedido
   - Número de seguimiento

2. **Panel de Administración:**
   - Dashboard para ver pedidos
   - Estado de envíos
   - Estadísticas de ventas

3. **OpenRouteService:**
   - Si quieres cálculo de distancia real por dirección
   - Descomentar código en CheckoutManager
   - Usar API Key configurada

---

## 📞 SOPORTE

Si necesitas ayuda:
- Documentación Bold.co: https://bold.co/developers
- Soporte Bold: Desde tu dashboard de Bold
- Email: atencionalcliente@deiwocoffee.com

---

## ✅ CHECKLIST FINAL

Antes de lanzar en producción:

- [ ] Verificar que el sitio esté en HTTPS
- [ ] Subir webhook a Railway con variables de entorno
- [ ] Configurar webhook en Bold Dashboard
- [ ] Probar un pago de prueba completo
- [ ] Verificar que lleguen los emails
- [ ] Crear página de confirmación (confirmacion.html)
- [ ] Agregar .env al .gitignore
- [ ] Probar en móvil (responsive)
- [ ] Verificar que el botón "Proceder al Pago" funcione
- [ ] Revisar cálculo de envío en todas las ciudades

---

**¡Sistema listo para producción!** 🎉
