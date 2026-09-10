/**
 * GUS DLC OFFICIAL WEBSITE — INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTabs();
  initFaq();
  initMobileMenu();
  fetchLiveStatus();
  initBuyModal();
});

/* ==========================================================
   1. Dynamic Background Particles
   ========================================================== */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 45 : 20, 60);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#a855f7' : '#00d2ff'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw and move particles
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================
   2. Module Tabs Switcher
   ========================================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.module-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================
   3. FAQ Accordion
   ========================================================== */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => other.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================
   4. Mobile Menu
   ========================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-link');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

/* ==========================================================
   5. Dynamic Live Status from GitHub
   ========================================================== */
async function fetchLiveStatus() {
  const versionUrl = 'https://raw.githubusercontent.com/Gusik981/blacklist/main/version.txt';
  const statusUrl = 'https://raw.githubusercontent.com/Gusik981/blacklist/main/blacklist.txt';

  try {
    const verRes = await fetch(versionUrl + '?t=' + Date.now());
    if (verRes.ok) {
      const verText = (await verRes.text()).trim();
      if (verText) {
        const headerVer = document.getElementById('header-version');
        const statusVer = document.getElementById('status-version');
        if (headerVer) headerVer.textContent = `v${verText} LIVE`;
        if (statusVer) statusVer.textContent = `v${verText}`;
      }
    }
  } catch (e) {
    // Keep defaults
  }

  try {
    const statRes = await fetch(statusUrl + '?t=' + Date.now());
    if (statRes.ok) {
      const statText = (await statRes.text()).toUpperCase();
      const statusElement = document.getElementById('status-text');
      if (statText.includes('OFF') || statText.includes('MAINTENANCE') || statText.includes('ТЕХРАБОТЫ')) {
        if (statusElement) {
          statusElement.textContent = 'ТЕХРАБОТЫ';
          statusElement.style.color = '#f59e0b';
        }
      } else {
        if (statusElement) {
          statusElement.textContent = 'ONLINE / АКТИВЕН';
          statusElement.style.color = '#10b981';
        }
      }
    }
  } catch (e) {
    // Keep defaults
  }
}

/* ==========================================================
   6. Buy Modal & Promo Code System
   ========================================================== */
function initBuyModal() {
  const modal = document.getElementById('buy-modal');
  const openButtons = document.querySelectorAll('.open-buy-modal');
  const closeBtn = document.getElementById('modal-close');
  const promoInput = document.getElementById('promo-input');
  const promoBtn = document.getElementById('promo-btn');
  const promoFeedback = document.getElementById('promo-feedback');
  const basePriceEl = document.getElementById('modal-base-price');
  const discountRow = document.getElementById('discount-row');
  const discountValEl = document.getElementById('modal-discount-val');
  const totalPriceEl = document.getElementById('modal-total-price');
  const btnPriceText = document.getElementById('btn-price-text');
  const modalFunpayBtn = document.getElementById('modal-funpay-btn');

  if (!modal) return;

  const BASE_PRICE = 150;
  const DEFAULT_FUNPAY_URL = 'https://funpay.com/lots/offer?id=76067849';
  const PROMO_FUNPAY_URL = 'https://funpay.com/lots/offer?id=76930937';

  let activePromo = null;
  let appliedPromoCode = '';

  // Configured promo codes
  const PROMO_CODES = {
    'SCARLAYT': { price: 130, label: '-20 ₽', url: PROMO_FUNPAY_URL }, // Sets final price to 130 ₽ & redirects to discounted lot
    'GUSDLC': { percent: 25, label: '-25%', url: PROMO_FUNPAY_URL },   // 25% off -> 112 ₽
    'WILD': { percent: 15, label: '-15%', url: PROMO_FUNPAY_URL },     // 15% off -> 127 ₽
    'SALE': { percent: 20, label: '-20%', url: PROMO_FUNPAY_URL },     // 20% off -> 120 ₽
    'FREE': { percent: 100, label: '-100%', url: PROMO_FUNPAY_URL },   // 100% off -> 0 ₽
    'VIP': { percent: 50, label: '-50%', url: PROMO_FUNPAY_URL }       // 50% off -> 75 ₽
  };

  function updatePrices() {
    if (activePromo) {
      let discountedPrice;
      let discountLabel;
      let targetUrl = PROMO_FUNPAY_URL;

      if (typeof activePromo === 'number') {
        discountedPrice = Math.max(0, Math.round(BASE_PRICE * (1 - activePromo / 100)));
        discountLabel = `-${activePromo}%`;
      } else if (activePromo.price !== undefined) {
        discountedPrice = activePromo.price;
        discountLabel = activePromo.label || `-${BASE_PRICE - discountedPrice} ₽`;
        if (activePromo.url) targetUrl = activePromo.url;
      } else {
        const pct = activePromo.percent || 0;
        discountedPrice = Math.max(0, Math.round(BASE_PRICE * (1 - pct / 100)));
        discountLabel = activePromo.label || `-${pct}%`;
        if (activePromo.url) targetUrl = activePromo.url;
      }

      if (basePriceEl) basePriceEl.classList.add('has-discount');
      if (discountRow) discountRow.style.display = 'flex';
      if (discountValEl) discountValEl.textContent = discountLabel;
      if (totalPriceEl) totalPriceEl.textContent = `${discountedPrice} ₽`;
      if (btnPriceText) btnPriceText.textContent = `${discountedPrice} ₽`;
      if (modalFunpayBtn) modalFunpayBtn.href = targetUrl;
    } else {
      if (basePriceEl) basePriceEl.classList.remove('has-discount');
      if (discountRow) discountRow.style.display = 'none';
      if (totalPriceEl) totalPriceEl.textContent = `${BASE_PRICE} ₽`;
      if (btnPriceText) btnPriceText.textContent = `${BASE_PRICE} ₽`;
      if (modalFunpayBtn) modalFunpayBtn.href = DEFAULT_FUNPAY_URL;
    }
  }

  function applyPromo() {
    if (!promoInput) return;
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
      promoFeedback.textContent = 'Пожалуйста, введите промокод';
      promoFeedback.className = 'promo-feedback error';
      return;
    }

    if (PROMO_CODES.hasOwnProperty(code)) {
      activePromo = PROMO_CODES[code];
      appliedPromoCode = code;
      const discountText = typeof activePromo === 'number' 
        ? `${activePromo}%` 
        : (activePromo.label ? activePromo.label.replace('-', '') : `${BASE_PRICE - activePromo.price} ₽`);
      promoFeedback.textContent = `✓ Промокод «${code}» успешно применен! Скидка ${discountText}`;
      promoFeedback.className = 'promo-feedback success';
      updatePrices();
    } else {
      promoFeedback.textContent = `✕ Промокод «${code}» не найден или истек`;
      promoFeedback.className = 'promo-feedback error';
    }
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (promoInput) promoInput.focus();
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (promoBtn) promoBtn.addEventListener('click', applyPromo);
  if (promoInput) {
    promoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromo();
      }
    });
  }

  updatePrices();
}

console.log('%c GUS DLC 1.12.2 %c Official Website Loaded ', 'background:#8b5cf6;color:#fff;font-weight:bold;padding:4px;', 'background:#0d0f18;color:#00d2ff;padding:4px;');

