const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===================================
// CONFIGURACIÓN (desde .env)
// IMPORTANTE: .trim() elimina espacios/caracteres invisibles de Windows
// ===================================
const BOLD_IDENTITY_KEY = process.env.BOLD_IDENTITY_KEY?.trim(); // Para crear links de pago (API)
const BOLD_SECRET_KEY = process.env.BOLD_SECRET_KEY?.trim();     // Para verificar webhooks
const EMAIL_USER = (process.env.EMAIL_USER || 'deiwocoffee@gmail.com').trim();
const EMAIL_PASS = process.env.EMAIL_PASS?.trim();
const EMAIL_ALIAS = (process.env.EMAIL_ALIAS || 'atencionalcliente@deiwocoffee.com').trim();
const APP_URL = (process.env.APP_URL || 'http://localhost:3000').trim();

// Verificar llaves al iniciar (sin mostrar valores por seguridad)

// Verificar que tenemos las API keys
if (!BOLD_IDENTITY_KEY) {
    console.error('⚠️ ADVERTENCIA: BOLD_IDENTITY_KEY no está definida en .env (necesaria para crear links)');
}
if (!BOLD_SECRET_KEY) {
    console.error('⚠️ ADVERTENCIA: BOLD_SECRET_KEY no está definida en .env (necesaria para webhooks)');
}

// Configurar transporter de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// ===================================
// RUTAS DE PÁGINA WEB
// ===================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tienda.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tienda.html'));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor Deiiwo Coffee activo',
        boldIdentityKey: !!BOLD_IDENTITY_KEY,
        boldSecretKey: !!BOLD_SECRET_KEY,
        timestamp: new Date().toISOString()
    });
});

// ===================================
// CREAR LINK DE PAGO (BOLD API)
// Documentación: https://developers.bold.co/pagos-en-linea/api-link-de-pagos
// ===================================
app.post('/api/v1/payments/create-link', async (req, res) => {
    try {
        console.log('🔗 Creando link de pago en Bold...');
        console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));

        const { amount, description, orderId, customer_email, metadata } = req.body;

        // Validación CRÍTICA: Bold solo acepta números enteros sin decimales
        const cleanAmount = Math.floor(Number(amount));

        if (!cleanAmount || cleanAmount <= 0) {
            console.error('❌ Monto inválido:', amount);
            return res.status(400).json({
                success: false,
                error: 'Monto inválido. Debe ser un número entero mayor a 0.'
            });
        }

        if (!customer_email) {
            console.error('❌ Email no proporcionado');
            return res.status(400).json({
                success: false,
                error: 'Email del cliente requerido'
            });
        }

        // Preparar payload según API Bold
        // Solo campos que Bold acepta
        const payload = {
            amount_type: 'CLOSE',
            amount: {
                currency: 'COP',
                total_amount: cleanAmount
            },
            description: description || 'Compra en Deiiwo Coffee'
        };

        console.log('📤 Enviando a Bold API:', {
            amount_type: payload.amount_type,
            total_amount: payload.amount.total_amount,
            description: payload.description
        });

        // Llamar a la API de Bold
        // URL: https://integrations.api.bold.co/online/link/v1
        // Auth: x-api-key
        const response = await axios.post(
            'https://integrations.api.bold.co/online/link/v1',
            payload,
            {
                headers: {
                    'Authorization': `x-api-key ${BOLD_IDENTITY_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Respuesta de Bold:', JSON.stringify(response.data, null, 2));

        // Bold retorna la URL en response.data.payload.url
        const paymentUrl = response.data.payload?.url;
        const paymentLinkId = response.data.payload?.payment_link;

        if (!paymentUrl) {
            console.error('❌ Bold no retornó URL de pago');
            return res.status(500).json({
                success: false,
                error: 'Bold no retornó URL de pago',
                details: response.data
            });
        }

        console.log(`✅ Link creado: ${paymentLinkId}`);
        console.log('🔗 URL:', paymentUrl);

        res.status(201).json({
            success: true,
            url: paymentUrl,
            paymentLinkId: paymentLinkId,
            orderId: orderId || paymentLinkId
        });

    } catch (error) {
        // Log detallado para DEPURACIÓN
        console.error('❌ Error Bold API:');

        if (error.response) {
            // El servidor de Bold respondió con un error (ej: 400, 401, 404)
            console.error('   Tipo: Respuesta de Bold con error');
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));

            res.status(error.response.status).json({
                success: false,
                error: 'Bold rechazó la petición',
                details: error.response.data?.message || error.response.data?.error || JSON.stringify(error.response.data)
            });
        } else if (error.request) {
            // La petición se hizo pero no hubo respuesta (Error de red/DNS)
            console.error('   Tipo: Error de Red/DNS');
            console.error('   Message:', error.message);
            console.error('   Code:', error.code);

            res.status(503).json({
                success: false,
                error: 'No hay conexión con Bold',
                details: `Error de red: ${error.message}. Verifica tu conexión a internet.`
            });
        } else {
            // Error al configurar la petición
            console.error('   Tipo: Error interno');
            console.error('   Message:', error.message);

            res.status(500).json({
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    }
});

// Mantener compatibilidad con ruta anterior
app.post('/create-payment-link', async (req, res) => {
    // Redirigir a la nueva ruta
    req.url = '/api/v1/payments/create-link';
    app.handle(req, res);
});

// ===================================
// WEBHOOK DE BOLD (Notificación de Pago)
// ===================================
app.post('/api/v1/payments/webhook', async (req, res) => {
    try {
        console.log('📨 Webhook recibido:', new Date().toISOString());
        console.log('📥 Body:', JSON.stringify(req.body, null, 2));

        const { event, data, status, order_id, amount, currency, metadata } = req.body;

        // Bold v2 usa 'event' para indicar el tipo de notificación
        const isSuccess = event === 'payment.success' || status === 'APPROVED';

        if (!isSuccess) {
            console.log(`⏭️ Evento no procesable: ${event || status}`);
            return res.status(200).json({ received: true });
        }

        // Extraer datos (compatibilidad con ambos formatos)
        const paymentData = data || req.body;
        const orderId = paymentData.order_id || order_id;
        const paymentAmount = paymentData.amount || amount;
        const customerEmail = paymentData.customer_email || metadata?.cliente_email;
        const paymentMetadata = paymentData.metadata || metadata || {};

        console.log(`✅ Pago exitoso para orden: ${orderId}`);
        console.log(`💰 Monto: $${paymentAmount} COP`);

        // Parsear datos del pedido
        let items = [];
        try {
            items = JSON.parse(paymentMetadata.items || '[]');
        } catch (e) {
            items = [];
        }

        const cliente = {
            nombre: paymentMetadata.cliente_nombre || 'Cliente',
            email: customerEmail || paymentMetadata.cliente_email,
            telefono: paymentMetadata.cliente_telefono || ''
        };

        const envio = {
            direccion: paymentMetadata.direccion || paymentMetadata.direccion_entrega || 'No especificada',
            ciudad: paymentMetadata.ciudad || 'No especificada',
            costo: Number(paymentMetadata.envio || paymentMetadata.valor_domicilio || 0),
            indicaciones: paymentMetadata.indicaciones || ''
        };

        console.log(`👤 Cliente: ${cliente.nombre} (${cliente.email})`);
        console.log(`📍 Envío a: ${envio.direccion}`);

        // ENVIAR EMAIL AL CLIENTE
        if (cliente.email) {
            try {
                await transporter.sendMail({
                    from: `"Atención al Cliente Deiiwo" <${EMAIL_ALIAS}>`,
                    to: cliente.email,
                    subject: `¡Pedido confirmado! #${orderId}`,
                    html: emailCliente(orderId, items, paymentAmount, envio, cliente)
                });
                console.log(`✅ Email enviado al cliente: ${cliente.email}`);
            } catch (emailError) {
                console.error('❌ Error enviando email al cliente:', emailError.message);
            }
        }

        // ENVIAR EMAIL INTERNO A DEIIWO
        try {
            await transporter.sendMail({
                from: `"Sistema Deiiwo" <${EMAIL_ALIAS}>`,
                to: EMAIL_ALIAS,
                subject: `🚨 Pedido Pagado: ${orderId} - $${Number(paymentAmount).toLocaleString()}`,
                html: emailInterno(orderId, items, paymentAmount, envio, cliente)
            });
            console.log(`✅ Email de notificación enviado a: ${EMAIL_ALIAS}`);
        } catch (emailError) {
            console.error('❌ Error enviando email interno:', emailError.message);
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('❌ Error procesando webhook:', error.message);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Mantener compatibilidad con ruta anterior
app.post('/webhook-bold', async (req, res) => {
    req.url = '/api/v1/payments/webhook';
    app.handle(req, res);
});

// ===================================
// PLANTILLAS DE EMAIL
// ===================================

function emailCliente(orderId, items, total, envio, cliente) {
    const itemsHtml = items.map(i =>
        `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(i.price * i.quantity).toLocaleString()}</td>
        </tr>`
    ).join('');

    return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h1 style="color:#1a1a1a;margin-bottom:5px">¡Gracias por tu compra!</h1>
        <p style="color:#666;margin-top:0">Hola ${cliente.nombre}, tu pedido ha sido confirmado.</p>

        <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:20px 0">
            <p style="margin:0;color:#666">Número de pedido:</p>
            <p style="margin:5px 0 0;font-size:24px;font-weight:bold">#${orderId}</p>
        </div>

        ${items.length > 0 ? `
        <table style="width:100%;border-collapse:collapse">
            <thead>
                <tr style="background:#1a1a1a;color:white">
                    <th style="padding:12px;text-align:left">Producto</th>
                    <th style="padding:12px;text-align:center">Cant.</th>
                    <th style="padding:12px;text-align:right">Precio</th>
                </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="padding:8px">Envío (${envio.ciudad})</td>
                    <td style="padding:8px;text-align:right">${envio.costo === 0 ? '<span style="color:#22c55e">GRATIS</span>' : '$' + envio.costo.toLocaleString()}</td>
                </tr>
                <tr style="background:#1a1a1a;color:white">
                    <td colspan="2" style="padding:12px"><strong>TOTAL</strong></td>
                    <td style="padding:12px;text-align:right"><strong>$${Number(total).toLocaleString()}</strong></td>
                </tr>
            </tfoot>
        </table>
        ` : `<p><strong>Total:</strong> $${Number(total).toLocaleString()} COP</p>`}

        <div style="margin-top:20px;padding:15px;background:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e">
            <h3 style="margin:0 0 10px;color:#166534">Datos de envío</h3>
            <p style="margin:0;color:#333"><strong>Dirección:</strong> ${envio.direccion}</p>
            <p style="margin:5px 0 0;color:#333"><strong>Ciudad:</strong> ${envio.ciudad}</p>
            ${envio.indicaciones ? `<p style="margin:5px 0 0;color:#333"><strong>Indicaciones:</strong> ${envio.indicaciones}</p>` : ''}
        </div>

        <p style="margin-top:30px;color:#666;font-size:14px">
            ¿Tienes preguntas? Escríbenos por <a href="https://wa.me/573022199112" style="color:#25D366;text-decoration:none">WhatsApp</a>
        </p>

        <hr style="border:none;border-top:1px solid #eee;margin:30px 0">
        <p style="color:#999;font-size:12px;text-align:center">
            Deiiwo Coffee - Café de Especialidad Colombiano<br>
            Cl. 35 Sur #41-51, Envigado, Antioquia
        </p>
    </div>`;
}

function emailInterno(orderId, items, total, envio, cliente) {
    const itemsList = items.length > 0
        ? items.map(i => `• ${i.name} x${i.quantity} - $${(i.price * i.quantity).toLocaleString()}`).join('<br>')
        : 'Sin detalles de productos';

    return `
    <div style="font-family:Arial,sans-serif;padding:20px">
        <h2 style="color:#1a1a1a;border-bottom:2px solid #1a1a1a;padding-bottom:10px">
            🛒 Nuevo Pedido #${orderId}
        </h2>

        <table style="width:100%;margin:20px 0">
            <tr>
                <td style="padding:10px;background:#f5f5f5;width:120px"><strong>Cliente</strong></td>
                <td style="padding:10px">${cliente.nombre}</td>
            </tr>
            <tr>
                <td style="padding:10px;background:#f5f5f5"><strong>Email</strong></td>
                <td style="padding:10px"><a href="mailto:${cliente.email}">${cliente.email}</a></td>
            </tr>
            ${cliente.telefono ? `<tr>
                <td style="padding:10px;background:#f5f5f5"><strong>Teléfono</strong></td>
                <td style="padding:10px"><a href="https://wa.me/57${cliente.telefono.replace(/\D/g, '')}">${cliente.telefono}</a></td>
            </tr>` : ''}
        </table>

        <h3>Productos:</h3>
        <p style="background:#f9f9f9;padding:15px;border-radius:8px">${itemsList}</p>

        <h3>Envío:</h3>
        <table style="width:100%">
            <tr>
                <td style="padding:8px;background:#f5f5f5;width:120px"><strong>Método</strong></td>
                <td style="padding:8px">${envio.direccion === 'Retiro en tienda' ? '🏪 RETIRO EN TIENDA' : '🚚 Domicilio'}</td>
            </tr>
            <tr>
                <td style="padding:8px;background:#f5f5f5"><strong>Dirección</strong></td>
                <td style="padding:8px">${envio.direccion}</td>
            </tr>
            <tr>
                <td style="padding:8px;background:#f5f5f5"><strong>Ciudad</strong></td>
                <td style="padding:8px">${envio.ciudad}</td>
            </tr>
            <tr>
                <td style="padding:8px;background:#f5f5f5"><strong>Costo envío</strong></td>
                <td style="padding:8px">$${envio.costo.toLocaleString()}</td>
            </tr>
            ${envio.indicaciones ? `<tr>
                <td style="padding:8px;background:#f5f5f5"><strong>Indicaciones</strong></td>
                <td style="padding:8px">${envio.indicaciones}</td>
            </tr>` : ''}
        </table>

        <div style="background:#22c55e;color:white;padding:20px;text-align:center;margin-top:20px;border-radius:8px">
            <p style="margin:0;font-size:14px">TOTAL DEL PEDIDO</p>
            <p style="margin:5px 0 0;font-size:32px;font-weight:bold">$${Number(total).toLocaleString()} COP</p>
        </div>

        ${cliente.telefono ? `
        <p style="margin-top:20px;text-align:center">
            <a href="https://wa.me/57${cliente.telefono.replace(/\D/g, '')}"
               style="display:inline-block;background:#25D366;color:white;padding:12px 24px;
                      border-radius:8px;text-decoration:none;font-weight:bold">
                📱 Contactar Cliente por WhatsApp
            </a>
        </p>` : ''}
    </div>`;
}

// ===================================
// INICIAR SERVIDOR
// ===================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Deiiwo Coffee activo en puerto ${PORT}`);
    console.log(`📱 Página web: http://localhost:${PORT}`);
    console.log(`🔗 API Pagos: http://localhost:${PORT}/api/v1/payments/create-link`);
    console.log(`📨 Webhook: http://localhost:${PORT}/api/v1/payments/webhook`);
    console.log(`🔑 Bold Identity Key: ${BOLD_IDENTITY_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA'}`);
    console.log(`🔐 Bold Secret Key: ${BOLD_SECRET_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA'}`);
});
