# Guía de Deployment - Deiiwo Coffee

## Estado Actual ✅

Tu proyecto está **listo para deployment**. La estructura de archivos está organizada correctamente:

```
DeiiwoCoffee/
├── public/              # ✅ Archivos web estáticos
│   ├── index.html
│   ├── tienda.html
│   ├── styles.css
│   ├── script.js
│   ├── translations.js
│   ├── robots.txt
│   ├── sitemap.xml
│   └── img/             # Todas las imágenes
├── webhook-bold.js      # ✅ Servidor Node.js
├── package.json         # ✅ Configuración Node.js
├── .env                 # ⚠️ Local, NO subir a Git
└── .gitignore           # ✅ Protege archivos sensibles
```

---

## Paso 1: Instalar Dependencias (Opcional - para testing local)

Si quieres probar el servidor localmente antes de subir a Railway:

```bash
npm install
```

Luego inicia el servidor:

```bash
npm start
```

Deberías ver:
```
🚀 Servidor Deiiwo Coffee activo en puerto 3000
📱 Página web: http://localhost:3000
📨 Webhook: http://localhost:3000/webhook-bold
```

Abre [http://localhost:3000](http://localhost:3000) para ver tu sitio web.

---

## Paso 2: Deployment a Railway.app

### 2.1 Conectar Repositorio (si no está conectado)

1. Ve a [Railway.app](https://railway.app)
2. Selecciona tu proyecto "deiiwocoffee-production"
3. Si no está conectado a GitHub:
   - Click en "Deploy from GitHub repo"
   - Autoriza Railway a acceder a tu GitHub
   - Selecciona el repositorio

### 2.2 Configurar Variables de Entorno

**MUY IMPORTANTE:** Railway necesita las credenciales para funcionar.

En el dashboard de Railway:

1. Click en tu servicio
2. Ve a **"Variables"**
3. Agrega estas variables:

| Variable | Valor |
|----------|-------|
| `BOLD_SECRET_KEY` | `-8f9lINMfG3QSvcl_hSRhHw` |
| `EMAIL_PASS` | `mhmn ojso ifan hahq` |

**Nota:** NO agregues `PORT`, Railway lo configura automáticamente.

### 2.3 Verificar Build Settings

Railway debería detectar automáticamente que es un proyecto Node.js.

Verifica en **"Settings" → "Build Command"**:
- **Build Command:** (vacío, no necesitas)
- **Start Command:** `npm start`

### 2.4 Deploy

1. Haz commit de todos los cambios:
   ```bash
   git add .
   git commit -m "Configurar servidor completo con webhook y página web"
   git push origin main
   ```

2. Railway detectará el push y desplegará automáticamente.

3. Espera 2-3 minutos mientras Railway:
   - Instala dependencias (`npm install`)
   - Inicia el servidor (`npm start`)

### 2.5 Verificar Deployment

1. Railway te dará una URL como:
   ```
   https://deiiwocoffee-production.up.railway.app
   ```

2. **Prueba la página web:**
   - Abre: `https://deiiwocoffee-production.up.railway.app`
   - Deberías ver tu página principal con todos los estilos e imágenes

3. **Prueba la tienda:**
   - Abre: `https://deiiwocoffee-production.up.railway.app/tienda.html`
   - Verifica que los productos se muestran correctamente

4. **Prueba el health check:**
   - Abre: `https://deiiwocoffee-production.up.railway.app/health`
   - Deberías ver:
     ```json
     {
       "status": "ok",
       "message": "🚀 Servidor Deiiwo Coffee activo",
       "timestamp": "2025-02-10T..."
     }
     ```

---

## Paso 3: Configurar Webhook en Bold.co

1. Inicia sesión en [Bold.co Dashboard](https://dashboard.bold.co)
2. Ve a **Configuración → Webhooks**
3. Agrega un nuevo webhook:

   - **URL:** `https://deiiwocoffee-production.up.railway.app/webhook-bold`
   - **Eventos:** Selecciona `payment.approved` o `transaction.updated`
   - **Estado:** Activo

4. Guarda la configuración

---

## Paso 4: Probar el Flujo Completo

### Test de Pago (Modo Prueba)

1. Ve a `https://deiiwocoffee-production.up.railway.app/tienda.html`
2. Agrega productos al carrito
3. Click en "Proceder al Pago"
4. Completa el formulario de checkout
5. Click en "Pagar con Bold"

**Tarjeta de prueba Bold:**
- Número: `4111 1111 1111 1111`
- Fecha: Cualquier fecha futura (ej: 12/25)
- CVV: `123`

### Verificar Emails

Después de un pago exitoso, deberías recibir:

1. **Email al cliente** (al email que usaste en el formulario)
   - Asunto: "¡Pedido confirmado! #DC-..."
   - Contenido: Resumen del pedido, productos, envío

2. **Email interno** a `atencionalcliente@deiwocoffee.com`
   - Asunto: "🛒 Nuevo Pedido #DC-... - $XX,XXX"
   - Contenido: Datos del cliente, productos, botón de WhatsApp

### Ver Logs en Railway

Para debugging:

1. En Railway, click en tu servicio
2. Ve a **"Deployments"**
3. Click en el deployment activo
4. Ve a **"View Logs"**

Deberías ver logs como:
```
🚀 Servidor Deiiwo Coffee activo en puerto 3000
📱 Página web: http://localhost:3000
📨 Webhook: http://localhost:3000/webhook-bold
📨 Webhook recibido: 2025-02-10T...
✅ Firma validada correctamente
📦 Orden DC-1707... - Estado: APPROVED
👤 Cliente: Juan Pérez (juan@example.com)
✅ Email enviado al cliente: juan@example.com
✅ Email de notificación enviado a: atencionalcliente@deiwocoffee.com
```

---

## Troubleshooting

### ❌ Error: "Cannot GET /"

**Problema:** Railway no encuentra `index.html`

**Solución:**
- Verifica que la carpeta `public/` existe en tu repo
- Verifica que `webhook-bold.js` tiene la línea:
  ```javascript
  app.use(express.static(path.join(__dirname, 'public')));
  ```

### ❌ Error: "Missing signature"

**Problema:** Webhook recibe request sin firma

**Solución:**
- Verifica que configuraste el webhook en Bold.co Dashboard
- Asegúrate de que la URL es correcta

### ❌ Error: "Invalid signature"

**Problema:** La firma del webhook no coincide

**Solución:**
- Verifica que la variable `BOLD_SECRET_KEY` en Railway es exactamente:
  ```
  -8f9lINMfG3QSvcl_hSRhHw
  ```
- **SIN espacios, SIN comillas**

### ❌ Error: "Error sending email"

**Problema:** Nodemailer no puede enviar emails

**Solución:**
- Verifica que la variable `EMAIL_PASS` en Railway es:
  ```
  mhmn ojso ifan hahq
  ```
- Verifica que la autenticación de 2 pasos está activa en Gmail
- Verifica que el App Password es válido

### ❌ Página carga pero sin estilos/imágenes

**Problema:** CSS o imágenes no se cargan

**Solución:**
- Abre DevTools (F12) → Console
- Busca errores 404
- Verifica que todos los archivos están en `public/`
- Verifica que las rutas en HTML son relativas (ej: `styles.css`, no `/styles.css`)

---

## Próximos Pasos (Opcional)

### Cambiar a Modo Producción en Bold

Actualmente estás en modo **sandbox** (pruebas).

Para activar pagos reales:

1. Completa el proceso de verificación en Bold.co
2. Activa tu cuenta en modo producción
3. Bold te dará nuevas credenciales (API Key y Secret Key para producción)
4. Actualiza las variables de entorno en Railway con las credenciales de producción

### Configurar Dominio Personalizado

Si compras un dominio (ej: `deiiwocoffee.com`):

1. En Railway, ve a **"Settings" → "Domains"**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

---

## Soporte

Si tienes problemas:

1. Revisa los logs de Railway
2. Verifica el archivo [SEGURIDAD-BOLD.md](SEGURIDAD-BOLD.md) para más detalles
3. Contacta a soporte de Bold: https://bold.co/soporte

---

**¡Listo para deployment!** 🚀

Todo está configurado. Solo necesitas:
1. Hacer `git push`
2. Configurar variables en Railway
3. Configurar webhook en Bold.co
4. Probar con tarjeta de prueba
