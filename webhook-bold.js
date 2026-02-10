const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// SERVIR ARCHIVOS ESTÁTICOS (la página web completa)
app.use(express.static(path.join(__dirname, 'public')));

// ===================================
// CONFIGURACIÓN
// ===================================
const BOLD_SECRET_KEY = process.env.BOLD_SECRET_KEY || '-8f9lINMfG3QSvcl_hSRhHw';
const CUENTA_MAESTRA = 'deiwocoffee@gmail.com';
const ALIAS_ATENCION = 'atencionalcliente@deiwocoffee.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'mhmn ojso ifan hahq';

// Configurar transporter de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: CUENTA_MAESTRA, // Siempre autenticar con la cuenta maestra
        pass: EMAIL_PASS
    }
});

// ===================================
// RUTA PRINCIPAL (Página Web)
// ===================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para tienda.html
app.get('/tienda.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tienda.html'));
});

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: '🚀 Servidor Deiiwo Coffee activo',
        timestamp: new Date().toISOString()
    });
});

// ===================================
// WEBHOOK DE BOLD
// ===================================
app.post('/webhook-bold', async (req, res) => {
    try {
        console.log('📨 Webhook recibido:', new Date().toISOString());

        // Validar firma de Bold
        const signature = req.headers['bold-signature'];
        const payload = JSON.stringify(req.body);

        if (!signature) {
            console.error('❌ Falta la firma de seguridad');
            return res.status(400).json({ error: 'Missing signature' });
        }

        const expectedSignature = crypto
            .createHmac('sha256', BOLD_SECRET_KEY)
            .update(payload)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Firma inválida');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        console.log('✅ Firma validada correctamente');

        // Extraer datos del webhook
        const { status, order_id, amount, currency, metadata } = req.body;

        console.log(`📦 Orden ${order_id} - Estado: ${status}`);

        // Solo procesar pagos exitosos
        if (status !== 'APPROVED') {
            console.log(`⏭️ Pago no aprobado (${status}), omitiendo...`);
            return res.status(200).json({ received: true });
        }

        // Parsear datos del pedido
        const items = JSON.parse(metadata.items || '[]');
        const cliente = {
            nombre: metadata.cliente_nombre,
            email: metadata.cliente_email,
            telefono: metadata.cliente_telefono
        };
        const envio = {
            direccion: metadata.direccion,
            ciudad: metadata.ciudad,
            costo: Number(metadata.envio || 0),
            indicaciones: metadata.indicaciones || ''
        };
        const subtotal = Number(metadata.subtotal || 0);

        console.log(`👤 Cliente: ${cliente.nombre} (${cliente.email})`);
        console.log(`📍 Envío a: ${envio.ciudad}`);
        console.log(`💰 Total: $${amount.toLocaleString()} ${currency}`);

        // ENVIAR EMAIL AL CLIENTE
        try {
            await transporter.sendMail({
                from: `"Atención al Cliente Deiiwo" <${ALIAS_ATENCION}>`,
                to: cliente.email,
                subject: `¡Pedido confirmado! #${order_id}`,
                html: emailCliente(order_id, items, amount, envio, cliente)
            });
            console.log(`✅ Email enviado al cliente: ${cliente.email}`);
        } catch (emailError) {
            console.error('❌ Error enviando email al cliente:', emailError);
        }

        // ENVIAR EMAIL INTERNO A DEIIWO
        try {
            await transporter.sendMail({
                from: `"Sistema Deiiwo" <${ALIAS_ATENCION}>`,
                to: ALIAS_ATENCION,
                subject: `🛒 Nuevo Pedido #${order_id} - $${amount.toLocaleString()}`,
                html: emailInterno(order_id, items, amount, envio, cliente)
            });
            console.log(`✅ Email de notificación enviado a: ${ALIAS_ATENCION}`);
        } catch (emailError) {
            console.error('❌ Error enviando email interno:', emailError);
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('❌ Error procesando webhook:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

// ===================================
// PLANTILLAS DE EMAIL
// ===================================

// Email para el cliente
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
                    <td style="padding:12px;text-align:right"><strong>$${total.toLocaleString()}</strong></td>
                </tr>
            </tfoot>
        </table>

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

// Email interno para Deiiwo
function emailInterno(orderId, items, total, envio, cliente) {
    const itemsList = items.map(i => `• ${i.name} x${i.quantity} - $${(i.price * i.quantity).toLocaleString()}`).join('<br>');

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
            <tr>
                <td style="padding:10px;background:#f5f5f5"><strong>Teléfono</strong></td>
                <td style="padding:10px"><a href="https://wa.me/57${cliente.telefono.replace(/\D/g, '')}">${cliente.telefono}</a></td>
            </tr>
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
            <p style="margin:5px 0 0;font-size:32px;font-weight:bold">$${total.toLocaleString()} COP</p>
        </div>

        <p style="margin-top:20px;text-align:center">
            <a href="https://wa.me/57${cliente.telefono.replace(/\D/g, '')}"
               style="display:inline-block;background:#25D366;color:white;padding:12px 24px;
                      border-radius:8px;text-decoration:none;font-weight:bold">
                📱 Contactar Cliente por WhatsApp
            </a>
        </p>
    </div>`;
}

// ===================================
// INICIAR SERVIDOR
// ===================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Deiiwo Coffee activo en puerto ${PORT}`);
    console.log(`📱 Página web: http://localhost:${PORT}`);
    console.log(`📨 Webhook: http://localhost:${PORT}/webhook-bold`);
});
