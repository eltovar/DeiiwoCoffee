# Estructura del Proyecto - Deiiwo Coffee

## 📂 Estructura Limpia y Organizada

```
DeiiwoCoffee/
│
├── 🚀 SERVIDOR (Archivos Node.js)
│   ├── app.js          # Servidor Express (sirve web + webhook)
│   ├── package.json             # Configuración Node.js y dependencias
│   ├── .env                     # Credenciales (NO subir a Git)
│   └── .env.example             # Plantilla de variables
│
├── 🌐 WEB (Carpeta Public - servida públicamente)
│   └── public/
│       ├── index.html           # Página principal
│       ├── tienda.html          # Página de tienda
│       ├── styles.css           # Estilos CSS
│       ├── script.js            # JavaScript (carrito + checkout)
│       ├── translations.js      # Traducciones ES/EN
│       ├── robots.txt           # SEO
│       ├── sitemap.xml          # SEO
│       └── img/                 # Imágenes
│           ├── Logo.png
│           ├── Productos.jpg
│           ├── Cafes.png
│           ├── Eventos/
│           │   ├── MercadoCampesino.jpeg
│           │   ├── MesaDeCafe.jpeg
│           │   └── MesadeCafe2.jpeg
│           └── imgProductos/
│               ├── Cafe de Especialidad.jpg
│               ├── AlfajorCafe.png
│               ├── DulceCafe.png
│               ├── CoffeeCherries.png
│               └── panchitos.png
│
├── 📚 DOCUMENTACIÓN
│   ├── README-DEPLOY.md         # Guía completa de deployment
│   ├── QUICK-START.md           # Guía rápida (12 minutos)
│   ├── CHECKLIST-DEPLOY.md      # Checklist paso a paso
│   ├── RESUMEN-PROYECTO.md      # Visión general del proyecto
│   ├── SEGURIDAD-BOLD.md        # Análisis de seguridad
│   ├── GUIA-PRUEBAS-PAGOS.md    # Cómo probar pagos
│   ├── IMPLEMENTACION-BOLD.md   # Detalles de integración Bold
│   └── ESTRUCTURA.md            # Este archivo
│
└── 🔒 CONFIGURACIÓN
    ├── .gitignore               # Protege archivos sensibles
    └── .git/                    # Control de versiones Git
```

---

## ✅ Archivos Eliminados (Duplicados)

Los siguientes archivos fueron eliminados de la raíz porque están duplicados en `public/`:

- ❌ ~~index.html~~ → ✅ `public/index.html`
- ❌ ~~tienda.html~~ → ✅ `public/tienda.html`
- ❌ ~~styles.css~~ → ✅ `public/styles.css`
- ❌ ~~script.js~~ → ✅ `public/script.js`
- ❌ ~~translations.js~~ → ✅ `public/translations.js`
- ❌ ~~robots.txt~~ → ✅ `public/robots.txt`
- ❌ ~~sitemap.xml~~ → ✅ `public/sitemap.xml`
- ❌ ~~img/~~ → ✅ `public/img/`

---

## 🎯 ¿Qué hace cada carpeta?

### Raíz del Proyecto
**Propósito:** Configuración del servidor y documentación

**Archivos clave:**
- `app.js`: El servidor que ejecuta Railway
- `package.json`: Define las dependencias (express, nodemailer)
- `.env`: Credenciales (SOLO local, no se sube a Git)

### public/
**Propósito:** Archivos web servidos públicamente por Express

**Cómo funciona:**
```javascript
// En app.js:
app.use(express.static(path.join(__dirname, 'public')));
```

Esto significa:
- `public/index.html` → `https://tu-url.railway.app/`
- `public/tienda.html` → `https://tu-url.railway.app/tienda.html`
- `public/img/Logo.png` → `https://tu-url.railway.app/img/Logo.png`

---

## 📊 Tamaño de Archivos

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| `webhook-bold.js` | 12 KB | Servidor Node.js |
| `public/styles.css` | 45 KB | Estilos completos |
| `public/script.js` | 36 KB | JavaScript (checkout + carrito) |
| `public/index.html` | 35 KB | Página principal |
| `public/tienda.html` | 32 KB | Página de tienda |
| `public/translations.js` | 14 KB | Traducciones |
| `public/img/` | ~1.1 MB | Todas las imágenes |

**Total del proyecto:** ~1.3 MB

---

## 🚀 Flujo de Deployment

1. **Git Push** → Railway detecta cambios
2. **Railway** ejecuta `npm install` (instala express y nodemailer)
3. **Railway** ejecuta `npm start` (inicia `webhook-bold.js`)
4. **Express** sirve archivos desde `public/`
5. **URL funcional:** `https://deiiwocoffee-production.up.railway.app`

---

## ✅ Verificación de Estructura

Para verificar que todo está correcto:

```bash
# Ver archivos en raíz (solo servidor y docs)
ls -1

# Ver archivos en public (solo web)
ls -1 public/

# Ver imágenes
ls -1 public/img/
```

**Debe mostrar:**
- Raíz: `webhook-bold.js`, `package.json`, documentación
- Public: `index.html`, `tienda.html`, CSS, JS, imágenes
- NO debe haber duplicados

---

## 🔒 Archivos Protegidos (.gitignore)

Estos archivos NO se suben a Git:

- `.env` (credenciales)
- `node_modules/` (dependencias instaladas)
- Logs
- Archivos del sistema

**Nota:** `.env.example` SÍ se sube como referencia.

---

## 📝 Notas Importantes

1. **Solo modifica archivos en `public/`** para cambios en la web
2. **Solo modifica `webhook-bold.js`** para cambios en el servidor
3. **Nunca edites `.env` directamente en producción** (usa Railway Variables)
4. **Las imágenes deben estar en `public/img/`** para que se sirvan correctamente

---

**Estructura limpia y lista para deployment** ✅
