// ===================================
// SISTEMA DE IDIOMAS (i18n)
// ===================================
class LanguageManager {
    constructor() {
        this.currentLang = this.loadLanguage();
        this.init();
    }

    init() {
        this.langToggle = document.getElementById('langToggle');
        this.langCurrent = document.querySelector('.lang-current');

        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Aplicar idioma guardado
        this.applyLanguage(this.currentLang);
    }

    loadLanguage() {
        return localStorage.getItem('deiiwo_lang') || 'es';
    }

    saveLanguage(lang) {
        localStorage.setItem('deiiwo_lang', lang);
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
        this.saveLanguage(this.currentLang);
        this.applyLanguage(this.currentLang);
    }

    applyLanguage(lang) {
        // Actualizar botón
        if (this.langCurrent) {
            this.langCurrent.textContent = lang.toUpperCase();
        }

        // Actualizar atributo html lang
        document.documentElement.lang = lang;

        // Traducir todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Actualizar mensaje del carrito si existe
        if (window.cart) {
            window.cart.updateLanguage(lang);
        }
    }

    getCurrentLang() {
        return this.currentLang;
    }

    translate(key) {
        return translations[this.currentLang]?.[key] || key;
    }
}

// Inicializar sistema de idiomas
const langManager = new LanguageManager();

// ===================================
// CURSOR PERSONALIZADO
// ===================================
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mx = 0, my = 0;
let dx = 0, dy = 0;
let rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.classList.add('visible');
    ring.classList.add('visible');
});

function animateCursor() {
    dx += (mx - dx) * 0.8;
    dy += (my - dy) * 0.8;
    dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`;

    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover en elementos interactivos
document.querySelectorAll('a, button, .card, .exp-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

// ===================================
// HEADER SCROLL
// ===================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
});

// ===================================
// MENÚ MÓVIL
// ===================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
});

// Cerrar menú al hacer clic en link
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
    });
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
    }
});

// ===================================
// FUNCIÓN DE SEGURIDAD - ESCAPAR HTML
// ===================================
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = header.offsetHeight + 20;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// ACTIVE NAV LINK
// ===================================
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===================================
// SCROLL REVEAL
// ===================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===================================
// CONTADOR DE ESTADÍSTICAS
// ===================================
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNums.forEach(num => statsObserver.observe(num));

// ===================================
// PARALLAX HERO
// ===================================
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight && heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
});

// ===================================
// CARD TILT
// ===================================
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===================================
// 3D TILT - IMAGEN ORIGEN
// ===================================
const tilt3d = document.getElementById('tilt3d');

if (tilt3d) {
    const maxRotation = 15;

    tilt3d.addEventListener('mousemove', (e) => {
        const rect = tilt3d.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * maxRotation * 2;
        const rotateX = (0.5 - y) * maxRotation * 2;

        tilt3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        tilt3d.style.setProperty('--mouse-x', `${x * 100}%`);
        tilt3d.style.setProperty('--mouse-y', `${y * 100}%`);
    });

    tilt3d.addEventListener('mouseleave', () => {
        tilt3d.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        tilt3d.style.transition = 'transform 0.5s var(--ease), box-shadow 0.5s var(--ease)';
    });

    tilt3d.addEventListener('mouseenter', () => {
        tilt3d.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    });
}

// ===================================
// ACCESIBILIDAD: REDUCE MOTION
// ===================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
    });
    document.querySelectorAll('[style*="animation"]').forEach(el => {
        el.style.animation = 'none';
    });
}

// ===================================
// CAFÉ ESPECIALIDAD - SELECTOR DINÁMICO
// ===================================
const cafeTamano = document.getElementById('cafeTamano');
const cafePrice = document.getElementById('cafePrice');
const addCafeBtn = document.getElementById('addCafeToCart');

if (cafeTamano && cafePrice) {
    // Actualizar precio cuando cambia el tamaño
    cafeTamano.addEventListener('change', () => {
        const selectedOption = cafeTamano.options[cafeTamano.selectedIndex];
        const price = parseInt(selectedOption.dataset.price);
        cafePrice.textContent = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    });
}

// ===================================
// CARRITO DE COMPRAS
// ===================================
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.cartBtn = document.getElementById('cartBtn');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.cartClose = document.getElementById('cartClose');
        this.cartItems = document.getElementById('cartItems');
        this.cartEmpty = document.getElementById('cartEmpty');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.getElementById('cartCount');
        this.clearCartBtn = document.getElementById('clearCart');
        this.checkoutWhatsApp = document.getElementById('checkoutWhatsApp');

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Abrir/Cerrar carrito
        this.cartBtn?.addEventListener('click', () => this.openCart());
        this.cartClose?.addEventListener('click', () => this.closeCart());
        this.cartOverlay?.addEventListener('click', () => this.closeCart());

        // Vaciar carrito
        this.clearCartBtn?.addEventListener('click', () => {
            if (confirm('¿Estás seguro de vaciar el carrito?')) {
                this.clearCart();
            }
        });

        // Botones agregar al carrito (productos sin selector)
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const price = parseInt(e.target.dataset.price);
                this.addItem({ name, price });
                this.showFeedback(e.target);
            });
        });

        // Botón café de especialidad (con selectores de tamaño y presentación)
        const addCafeBtn = document.getElementById('addCafeToCart');
        if (addCafeBtn) {
            addCafeBtn.addEventListener('click', (e) => {
                const tamanoSelect = document.getElementById('cafeTamano');
                const presentacionSelect = document.getElementById('cafePresentacion');

                const tamanoOption = tamanoSelect.options[tamanoSelect.selectedIndex];
                const tamano = tamanoSelect.value;
                const price = parseInt(tamanoOption.dataset.price);

                const presentacion = presentacionSelect.value;
                const presentacionText = presentacion === 'molido'
                    ? langManager.translate('tienda.molido')
                    : langManager.translate('tienda.grano');

                const tamanoText = tamano === '2500' ? '2.5kg' : `${tamano}g`;
                const name = `Café de Especialidad ${tamanoText} (${presentacionText})`;

                this.addItem({ name, price });
                this.showFeedback(e.target);
            });
        }

        // WhatsApp checkout button
        this.checkoutWhatsApp?.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            const message = this.items.map(item =>
                `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}`
            ).join('\n');

            const total = this.getTotal();
            const whatsappMessage = encodeURIComponent(
                `¡Hola! Quiero hacer el siguiente pedido:\n\n${message}\n\n*Total: $${total.toLocaleString()} COP*\n\n¿Cuál sería el costo de envío?`
            );

            window.open(`https://wa.me/573022199112?text=${whatsappMessage}`, '_blank');
        });

        // Bold checkout button
        const checkoutBold = document.getElementById('checkoutBold');
        checkoutBold?.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.items.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            checkout.open();
        });
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.render();
    }

    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.saveCart();
        this.render();
    }

    updateQuantity(productName, delta) {
        const item = this.items.find(item => item.name === productName);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(productName);
            } else {
                this.saveCart();
                this.render();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.render();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    }

    render() {
        // Actualizar contador
        const totalItems = this.getTotalItems();
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
            this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Actualizar total
        if (this.cartTotal) {
            this.cartTotal.textContent = this.formatPrice(this.getTotal());
        }

        // Mostrar vacío o items
        if (this.items.length === 0) {
            if (this.cartEmpty) this.cartEmpty.style.display = 'flex';
            if (this.cartItems) this.cartItems.style.display = 'none';
            if (this.clearCartBtn) this.clearCartBtn.disabled = true;
            if (this.checkoutWhatsApp) this.checkoutWhatsApp.style.display = 'none';
        } else {
            if (this.cartEmpty) this.cartEmpty.style.display = 'none';
            if (this.cartItems) this.cartItems.style.display = 'flex';
            if (this.clearCartBtn) this.clearCartBtn.disabled = false;
            if (this.checkoutWhatsApp) this.checkoutWhatsApp.style.display = 'flex';
            this.renderItems();
        }
    }

    renderItems() {
        if (!this.cartItems) return;

        const unitText = langManager.translate('cart.unit');
        this.cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${escapeHTML(item.name)}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} ${unitText}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="cart.updateQuantity('${escapeHTML(item.name)}', -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="cart.updateQuantity('${escapeHTML(item.name)}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="cart.removeItem('${escapeHTML(item.name)}')" aria-label="Eliminar producto">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    openCart() {
        this.cartSidebar?.classList.add('active');
        this.cartOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.cartSidebar?.classList.remove('active');
        this.cartOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    showFeedback(button) {
        const originalText = button.textContent;
        button.textContent = langManager.translate('cart.added');
        button.style.background = 'var(--white)';
        button.style.color = 'var(--black)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 1000);
    }

    generateWhatsAppMessage() {
        const greeting = langManager.translate('cart.whatsapp.greeting');
        const deliveryNote = langManager.translate('cart.delivery.note');

        let message = greeting;

        this.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - ${this.formatPrice(item.price * item.quantity)}\n`;
        });

        message += `\n${deliveryNote}`;

        const encodedMessage = encodeURIComponent(message);
        this.checkoutWhatsApp.href = `https://wa.me/573022199112?text=${encodedMessage}`;
    }

    updateLanguage() {
        // Re-renderizar items si hay productos
        if (this.items.length > 0) {
            this.renderItems();
        }
    }

    saveCart() {
        localStorage.setItem('deiiwo_cart', JSON.stringify(this.items));
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('deiiwo_cart');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(item =>
                typeof item.name === 'string' &&
                typeof item.price === 'number' &&
                typeof item.quantity === 'number' &&
                item.quantity > 0
            );
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    }
}

// Inicializar carrito
const cart = new ShoppingCart();

// ===================================
// CHECKOUT MANAGER
// ===================================
class CheckoutManager {
    constructor(cart) {
        this.cart = cart;
        this.currentStep = 1;
        this.envioCalculado = 0;
        this.metodoEntrega = 'envio';

        // Configuración de envío
        this.CONFIG = {
            direccion_origen: "Cl. 35 Sur #41-51, Zona 9, Envigado, Antioquia, Colombia",
            precio_por_km: 1500,
            tarifa_nacional: 30000,
            minimo_envio_gratis: 100000,
            ciudades_valle_aburra: [
                'medellin', 'envigado', 'sabaneta', 'itagui', 'bello',
                'copacabana', 'girardota', 'barbosa', 'caldas', 'la_estrella'
            ],
            openRouteServiceKey: 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImE1N2JjYTdjYjRlMjRlODI5YzIwNWYyMGViYmNjMzQzIiwiaCI6Im11cm11cjY0In0=',
            coordenadas_origen: [-75.5906, 6.1684] // [lng, lat] para Envigado
        };

        this.init();
    }

    init() {
        this.modal = document.getElementById('checkoutModal');
        this.overlay = document.getElementById('checkoutOverlay');
        this.closeBtn = document.getElementById('checkoutClose');
        this.btnBack = document.getElementById('btnBack');
        this.btnContinue = document.getElementById('btnContinue');
        this.btnPagar = document.getElementById('btnPagar');

        if (!this.modal) return;

        this.bindEvents();
    }

    bindEvents() {
        // Cerrar modal
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', () => this.close());

        // Navegación
        this.btnBack?.addEventListener('click', () => this.prevStep());
        this.btnContinue?.addEventListener('click', () => this.nextStep());

        // Método de entrega
        document.querySelectorAll('input[name="metodoEntrega"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.onMetodoEntregaChange(e));
        });

        // Departamento/Ciudad
        document.getElementById('departamento')?.addEventListener('change', (e) => {
            this.onDepartamentoChange(e);
        });

        document.getElementById('ciudad')?.addEventListener('change', () => {
            this.calcularEnvio();
        });

        // Toggle tabla de tarifas
        const ratesToggle = document.getElementById('ratesToggle');
        const ratesContainer = document.getElementById('ratesTableContainer');
        ratesToggle?.addEventListener('click', () => {
            ratesToggle.classList.toggle('active');
            ratesContainer.classList.toggle('active');
        });

        // Botón pagar
        this.btnPagar?.addEventListener('click', () => this.initBoldPayment());
    }

    open() {
        console.log('🚀 Checkout modal opening...');
        console.log('🛒 Cart at open:', this.cart);
        console.log('📦 Items in cart:', this.cart.items);

        this.currentStep = 1;
        this.renderStep();
        this.modal?.classList.add('active');
        this.overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal?.classList.remove('active');
        this.overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep();
        }
    }

    nextStep() {
        if (this.currentStep === 1) {
            this.currentStep = 2;
            this.renderStep();
        } else if (this.currentStep === 2) {
            if (this.validateForm()) {
                this.showPayButton();
            }
        }
    }

    renderStep() {
        console.log('📄 renderStep called, currentStep:', this.currentStep);

        const step1 = document.getElementById('checkoutStep1');
        const step2 = document.getElementById('checkoutStep2');

        console.log('📍 Step1 found:', !!step1);
        console.log('📍 Step2 found:', !!step2);

        if (this.currentStep === 1) {
            console.log('✅ Rendering Step 1 (Order Summary)');
            step1.style.display = 'block';
            step2.style.display = 'none';
            this.btnBack.style.display = 'none';
            this.btnContinue.style.display = 'block';
            this.btnPagar.style.display = 'none';
            this.renderItems();
        } else {
            console.log('✅ Rendering Step 2 (Shipping Form)');
            step1.style.display = 'none';
            step2.style.display = 'block';
            this.btnBack.style.display = 'block';
            this.btnContinue.style.display = 'block';
            this.btnPagar.style.display = 'none';
            this.updateCosts();
        }
    }

    renderItems() {
        console.log('🔍 renderItems called');
        console.log('📦 Cart items:', this.cart.items);
        console.log('💰 Cart total:', this.cart.getTotal());

        const container = document.getElementById('checkoutItems');
        const subtotalEl = document.getElementById('checkoutSubtotal');

        console.log('📍 Container found:', !!container);
        console.log('📍 SubtotalEl found:', !!subtotalEl);

        if (!container) {
            console.error('❌ Container #checkoutItems not found!');
            return;
        }

        container.innerHTML = this.cart.items.map(item => `
            <div class="checkout-item">
                <span>${escapeHTML(item.name)} x${item.quantity}</span>
                <span>${this.cart.formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');

        console.log('✅ Container innerHTML set:', container.innerHTML.length, 'characters');

        if (subtotalEl) {
            subtotalEl.textContent = this.cart.formatPrice(this.cart.getTotal());
            console.log('✅ Subtotal set to:', subtotalEl.textContent);
        }
    }

    onMetodoEntregaChange(e) {
        this.metodoEntrega = e.target.value;
        const direccionFields = document.getElementById('direccionFields');

        if (this.metodoEntrega === 'retiro') {
            direccionFields.style.display = 'none';
            this.envioCalculado = 0;
        } else {
            direccionFields.style.display = 'block';
            this.calcularEnvio();
        }

        this.updateCosts();
    }

    onDepartamentoChange(e) {
        const ciudadSelect = document.getElementById('ciudad');
        const valor = e.target.value;

        ciudadSelect.innerHTML = '<option value="">Seleccionar...</option>';

        if (valor === 'antioquia') {
            const ciudades = [
                { value: 'medellin', label: 'Medellín' },
                { value: 'envigado', label: 'Envigado' },
                { value: 'sabaneta', label: 'Sabaneta' },
                { value: 'itagui', label: 'Itagüí' },
                { value: 'bello', label: 'Bello' },
                { value: 'copacabana', label: 'Copacabana' },
                { value: 'la_estrella', label: 'La Estrella' },
                { value: 'caldas', label: 'Caldas' },
                { value: 'otro_antioquia', label: 'Otra ciudad de Antioquia' }
            ];

            ciudades.forEach(c => {
                const option = document.createElement('option');
                option.value = c.value;
                option.textContent = c.label;
                ciudadSelect.appendChild(option);
            });
        } else if (valor === 'otro') {
            const option = document.createElement('option');
            option.value = 'nacional';
            option.textContent = 'Envío Nacional';
            ciudadSelect.appendChild(option);
        }

        this.calcularEnvio();
    }

    calcularEnvio() {
        const ciudad = document.getElementById('ciudad')?.value;
        const subtotal = this.cart.getTotal();

        if (!ciudad || this.metodoEntrega === 'retiro') {
            this.envioCalculado = 0;
            this.updateCosts();
            return;
        }

        const esValleAburra = this.CONFIG.ciudades_valle_aburra.includes(ciudad);

        // Envío gratis si supera mínimo y es Valle de Aburrá
        if (subtotal >= this.CONFIG.minimo_envio_gratis && esValleAburra) {
            this.envioCalculado = 0;
        }
        // Tarifa nacional
        else if (!esValleAburra || ciudad === 'nacional' || ciudad === 'otro_antioquia') {
            this.envioCalculado = this.CONFIG.tarifa_nacional;
        }
        // Cálculo por kilómetro (tabla predefinida)
        else {
            const distancias = {
                'envigado': 0,
                'sabaneta': 5,
                'itagui': 6,
                'la_estrella': 8,
                'medellin': 10,
                'caldas': 12,
                'bello': 15,
                'copacabana': 20
            };

            const km = distancias[ciudad] || 15;
            this.envioCalculado = Math.ceil(km) * this.CONFIG.precio_por_km;
        }

        this.updateCosts();
    }

    updateCosts() {
        const subtotalEl = document.getElementById('costSubtotal');
        const envioEl = document.getElementById('costEnvio');
        const totalEl = document.getElementById('costTotal');

        const subtotal = this.cart.getTotal();
        const total = subtotal + this.envioCalculado;

        if (subtotalEl) subtotalEl.textContent = this.cart.formatPrice(subtotal);

        if (envioEl) {
            if (this.metodoEntrega === 'retiro') {
                envioEl.innerHTML = '<span class="free-shipping-badge">GRATIS</span>';
            } else if (this.envioCalculado === 0) {
                envioEl.innerHTML = '<span class="free-shipping-badge">ENVÍO GRATIS</span>';
            } else {
                envioEl.textContent = this.cart.formatPrice(this.envioCalculado);
            }
        }

        if (totalEl) totalEl.textContent = this.cart.formatPrice(total);
    }

    validateForm() {
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();
        const acepta = document.getElementById('aceptaTerminos')?.checked;

        if (!nombre || !email || !telefono) {
            alert('Por favor completa todos los campos requeridos.');
            return false;
        }

        if (!acepta) {
            alert('Debes aceptar los términos y condiciones.');
            return false;
        }

        if (this.metodoEntrega === 'envio') {
            const direccion = document.getElementById('direccion')?.value.trim();
            const ciudad = document.getElementById('ciudad')?.value;

            if (!direccion || !ciudad) {
                alert('Por favor completa la dirección de envío.');
                return false;
            }
        }

        return true;
    }

    showPayButton() {
        this.btnContinue.style.display = 'none';
        this.btnPagar.style.display = 'block';
    }

    getOrderData() {
        return {
            orderId: 'DC-' + Date.now(),
            amount: this.cart.getTotal() + this.envioCalculado,
            currency: 'COP',
            description: `Pedido Deiiwo Coffee - ${this.cart.getTotalItems()} productos`,
            customer: {
                nombre: document.getElementById('nombre')?.value,
                email: document.getElementById('email')?.value,
                telefono: document.getElementById('telefono')?.value
            },
            shipping: {
                metodo: this.metodoEntrega,
                direccion: document.getElementById('direccion')?.value || 'Retiro en tienda',
                ciudad: document.getElementById('ciudad')?.value || 'Envigado',
                indicaciones: document.getElementById('indicaciones')?.value || '',
                costo: this.envioCalculado
            },
            items: this.cart.items,
            subtotal: this.cart.getTotal()
        };
    }

    initBoldPayment() {
        const orderData = this.getOrderData();

        // Verificar que BoldCheckout esté disponible
        if (typeof BoldCheckout === 'undefined') {
            alert('Error al cargar el sistema de pagos. Por favor recarga la página.');
            return;
        }

        // Inicializar Bold con API Key pública
        const checkout = new BoldCheckout({
            orderId: orderData.orderId,
            currency: orderData.currency,
            amount: orderData.amount,
            apiKey: '-OA3_-SARWimpjOAZqugRvhY2W_d3YhNsT0YF8m1uI1U',
            description: orderData.description,
            tax: 0,
            redirectionUrl: window.location.origin + '/confirmacion.html',

            // Metadatos del pedido
            metadata: {
                items: JSON.stringify(orderData.items),
                subtotal: orderData.subtotal,
                envio: orderData.shipping.costo,
                cliente_nombre: orderData.customer.nombre,
                cliente_email: orderData.customer.email,
                cliente_telefono: orderData.customer.telefono,
                direccion: orderData.shipping.direccion,
                ciudad: orderData.shipping.ciudad,
                indicaciones: orderData.shipping.indicaciones
            }
        });

        checkout.open();
    }
}

// Inicializar checkout manager
const checkout = new CheckoutManager(cart);

// ===================================
// EXPERIENCIAS - IMAGEN DE FONDO HOVER
// ===================================
function initExpCards() {
    const expCards = document.querySelectorAll('.exp-card[data-bg]');

    expCards.forEach(card => {
        const bgElement = card.querySelector('.exp-bg');
        const bgImage = card.getAttribute('data-bg');

        if (bgElement && bgImage) {
            // Establecer la imagen de fondo
            bgElement.style.backgroundImage = `url('${bgImage}')`;

            // Para dispositivos móviles: toggle con tap
            card.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    // Remover clase active de otras tarjetas
                    expCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('active');
                        }
                    });
                    // Toggle en la tarjeta actual
                    card.classList.toggle('active');
                }
            });
        }
    });

    // Cerrar tarjetas al hacer click fuera (móvil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const clickedCard = e.target.closest('.exp-card');
            if (!clickedCard) {
                expCards.forEach(card => card.classList.remove('active'));
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpCards);
} else {
    initExpCards();
}