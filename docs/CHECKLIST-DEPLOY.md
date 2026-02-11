# Checklist de Deployment - Deiiwo Coffee ✅

## Pre-Deployment (Ya Completado ✅)

- [x] Estructura de carpetas creada (`public/` folder)
- [x] Archivos web movidos a `public/`
- [x] Servidor Node.js configurado (`webhook-bold.js`)
- [x] `package.json` creado con dependencias
- [x] `.gitignore` configurado para proteger `.env`
- [x] `.env.example` creado como plantilla
- [x] Imágenes copiadas a `public/img/`
- [x] Sistema de emails configurado
- [x] Validación de webhooks implementada (HMAC SHA256)
- [x] Plantillas de email creadas (cliente + interno)

---

## Deployment a Railway (Tu Trabajo)

### 1. Testing Local (Opcional pero Recomendado)

- [ ] Ejecutar `npm install` en la carpeta del proyecto
- [ ] Ejecutar `npm start`
- [ ] Abrir `http://localhost:3000` y verificar que carga la página web
- [ ] Abrir `http://localhost:3000/tienda.html` y verificar la tienda
- [ ] Abrir `http://localhost:3000/health` y verificar el status

### 2. Subir Código a Git/GitHub

- [ ] Verificar que `.env` NO está incluido (debe estar en `.gitignore`)
- [ ] Hacer commit de todos los cambios:
  ```bash
  git add .
  git commit -m "Servidor completo con webhook y página web"
  git push origin main
  ```

### 3. Configurar Railway

- [ ] Entrar a [Railway.app](https://railway.app)
- [ ] Ir al proyecto "deiiwocoffee-production"
- [ ] Click en **"Variables"**
- [ ] Agregar variables de entorno:
  - [ ] `BOLD_SECRET_KEY` = `-8f9lINMfG3QSvcl_hSRhHw`
  - [ ] `EMAIL_PASS` = `mhmn ojso ifan hahq`

### 4. Verificar Settings de Railway

- [ ] Ir a **"Settings"**
- [ ] Verificar **"Start Command"**: debe ser `npm start`
- [ ] **NO** configurar build command (no es necesario)

### 5. Deploy

- [ ] Railway detectará el push automáticamente
- [ ] Esperar 2-3 minutos mientras despliega
- [ ] Ver logs en tiempo real en Railway dashboard

---

## Post-Deployment (Verificación)

### 6. Verificar que la Página Web Funciona

- [ ] Abrir la URL de Railway (ej: `https://deiiwocoffee-production.up.railway.app`)
- [ ] Verificar que carga la página principal con todos los estilos
- [ ] Verificar que las imágenes se muestran correctamente
- [ ] Click en "Tienda" y verificar que carga
- [ ] Agregar productos al carrito y verificar que funciona
- [ ] Abrir modal de checkout y verificar formulario

### 7. Verificar Health Check

- [ ] Abrir `https://deiiwocoffee-production.up.railway.app/health`
- [ ] Debe mostrar JSON:
  ```json
  {
    "status": "ok",
    "message": "🚀 Servidor Deiiwo Coffee activo",
    "timestamp": "..."
  }
  ```

---

## Configuración Bold.co

### 8. Configurar Webhook en Bold Dashboard

- [ ] Entrar a [Bold.co Dashboard](https://dashboard.bold.co)
- [ ] Ir a **Configuración → Webhooks**
- [ ] Click en **"Agregar Webhook"**
- [ ] Configurar:
  - **URL:** `https://deiiwocoffee-production.up.railway.app/webhook-bold`
  - **Eventos:** Marcar `payment.approved` o `transaction.updated`
  - **Estado:** Activo ✅
- [ ] Guardar configuración

---

## Testing del Flujo Completo

### 9. Prueba de Pago (Modo Sandbox)

- [ ] Ir a `https://deiiwocoffee-production.up.railway.app/tienda.html`
- [ ] Agregar productos al carrito (ej: 2x Café de Especialidad)
- [ ] Click en "Proceder al Pago"
- [ ] Completar formulario:
  - [ ] Nombre: `Test Usuario`
  - [ ] Email: Tu email real (para recibir confirmación)
  - [ ] Teléfono: `3001234567`
  - [ ] Ciudad: Seleccionar ciudad
  - [ ] Dirección: `Calle 123 #45-67`
  - [ ] Marcar "Acepto términos"
- [ ] Click en "Pagar con Bold"
- [ ] En el modal de Bold, usar **tarjeta de prueba**:
  - Número: `4111 1111 1111 1111`
  - Fecha: `12/25`
  - CVV: `123`
- [ ] Completar pago

### 10. Verificar Emails

**Email al Cliente:**
- [ ] Revisar inbox del email que usaste
- [ ] Verificar que llegó email de "Atención al Cliente Deiiwo"
- [ ] Verificar asunto: "¡Pedido confirmado! #DC-..."
- [ ] Verificar que muestra:
  - [ ] Resumen de productos
  - [ ] Dirección de envío
  - [ ] Total con envío
  - [ ] Link de WhatsApp

**Email Interno:**
- [ ] Revisar inbox de `atencionalcliente@deiwocoffee.com`
- [ ] Verificar que llegó email de "Sistema Deiiwo"
- [ ] Verificar asunto: "🛒 Nuevo Pedido #DC-... - $XX,XXX"
- [ ] Verificar que muestra:
  - [ ] Datos del cliente con links de contacto
  - [ ] Lista de productos
  - [ ] Información de envío
  - [ ] Total destacado
  - [ ] Botón de WhatsApp para contactar cliente

### 11. Verificar Logs en Railway

- [ ] En Railway, click en tu servicio
- [ ] Ir a **"Deployments"**
- [ ] Click en el deployment activo
- [ ] Ver **"Logs"**
- [ ] Verificar logs similares a:
  ```
  📨 Webhook recibido: 2025-02-10T...
  ✅ Firma validada correctamente
  📦 Orden DC-... - Estado: APPROVED
  👤 Cliente: Test Usuario (tu-email@example.com)
  ✅ Email enviado al cliente
  ✅ Email de notificación enviado a: atencionalcliente@deiwocoffee.com
  ```

---

## Troubleshooting Común

### Si la página NO carga:
- [ ] Verificar que la carpeta `public/` existe en el repositorio
- [ ] Verificar logs de Railway para errores
- [ ] Verificar que `webhook-bold.js` tiene `app.use(express.static(...))`

### Si webhooks fallan:
- [ ] Verificar que `BOLD_SECRET_KEY` está configurada en Railway
- [ ] Verificar que la URL del webhook en Bold es correcta
- [ ] Ver logs de Railway para ver el error exacto

### Si emails NO llegan:
- [ ] Verificar que `EMAIL_PASS` está configurada en Railway
- [ ] Verificar que el App Password de Gmail es válido
- [ ] Revisar carpeta de SPAM
- [ ] Ver logs de Railway para errores de nodemailer

---

## Modo Producción (Después de Aprobar Pruebas)

### 12. Activar Bold en Producción

- [ ] Completar verificación de cuenta en Bold.co
- [ ] Solicitar credenciales de producción
- [ ] Actualizar variables en Railway:
  - [ ] Nueva `BOLD_SECRET_KEY` de producción
  - [ ] Nueva API Key pública en `script.js`
- [ ] Hacer commit y push
- [ ] Volver a probar flujo completo

---

## Checklist Final

- [ ] ✅ Página web carga correctamente
- [ ] ✅ Tienda funciona (productos, carrito, checkout)
- [ ] ✅ Health check responde
- [ ] ✅ Webhook configurado en Bold
- [ ] ✅ Prueba de pago exitosa
- [ ] ✅ Email al cliente recibido
- [ ] ✅ Email interno recibido
- [ ] ✅ Logs de Railway muestran proceso correcto

**Cuando todos los checkboxes estén ✅, tu sistema está LISTO para recibir pedidos reales.** 🎉

---

## Contacto de Soporte

- **Bold.co:** https://bold.co/soporte
- **Railway.app:** https://railway.app/help
- **Documentación Bold:** https://bold.co/docs

---

**Última actualización:** 2025-02-10
