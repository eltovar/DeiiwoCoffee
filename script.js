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

        // Checkout WhatsApp
        this.checkoutWhatsApp?.addEventListener('click', () => {
            this.generateWhatsAppMessage();
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
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)} ${unitText}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="cart.updateQuantity('${item.name}', -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="cart.updateQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="cart.removeItem('${item.name}')" aria-label="Eliminar producto">
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
        const saved = localStorage.getItem('deiiwo_cart');
        return saved ? JSON.parse(saved) : [];
    }
}

// Inicializar carrito
const cart = new ShoppingCart();