# Quick Start - Deiiwo Coffee 🚀

## TL;DR - Lo que tienes que hacer AHORA

### 1. Subir a Git (2 minutos)

```bash
cd c:\Users\Salo\Desktop\DeiiwoCoffee
git add .
git commit -m "Servidor completo con webhook y página web"
git push origin main
```

### 2. Configurar Railway (3 minutos)

1. Ve a https://railway.app
2. Selecciona proyecto "deiiwocoffee-production"
3. Click en **"Variables"**
4. Agrega:
   - `BOLD_SECRET_KEY` = `-8f9lINMfG3QSvcl_hSRhHw`
   - `EMAIL_PASS` = `mhmn ojso ifan hahq`
5. Railway desplegará automáticamente

### 3. Configurar Bold (2 minutos)

1. Ve a https://dashboard.bold.co
2. Ir a **Configuración → Webhooks**
3. Agregar webhook:
   - **URL:** `https://deiiwocoffee-production.up.railway.app/webhook-bold`
   - **Eventos:** `payment.approved`
   - **Estado:** Activo
4. Guardar

### 4. Probar (5 minutos)

1. Abre `https://deiiwocoffee-production.up.railway.app/tienda.html`
2. Agrega productos al carrito
3. Proceder al pago
4. Completa formulario
5. Pagar con Bold (tarjeta: `4111 1111 1111 1111`, CVV: `123`)
6. Revisa tu email (confirmación del pedido)
7. Revisa `atencionalcliente@deiwocoffee.com` (notificación interna)

---

## ✅ Verificación Rápida

- [ ] `git push` completado
- [ ] Variables configuradas en Railway
- [ ] Webhook configurado en Bold
- [ ] Prueba de pago exitosa
- [ ] Emails recibidos

**Total:** ~12 minutos

---

## Si algo falla:

**Ver logs de Railway:**
Dashboard → Deployments → View Logs

**Problemas comunes:**
- **404 en página:** Verifica que `public/` existe en el repo
- **Webhook falla:** Revisa `BOLD_SECRET_KEY` en Railway
- **Emails no llegan:** Revisa `EMAIL_PASS` en Railway

---

## Documentación Completa

Para detalles paso a paso, ver:
- [README-DEPLOY.md](README-DEPLOY.md) - Guía completa
- [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Checklist detallado
- [RESUMEN-PROYECTO.md](RESUMEN-PROYECTO.md) - Visión general

---

**¡Listo en 12 minutos!** ⏱️
