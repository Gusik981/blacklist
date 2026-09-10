/**
 * GUS DLC OFFICIAL WEBSITE — INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTabs();
  initFaq();
  initMobileMenu();
  fetchLiveStatus();
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

console.log('%c GUS DLC 1.12.2 %c Official Website Loaded ', 'background:#8b5cf6;color:#fff;font-weight:bold;padding:4px;', 'background:#0d0f18;color:#00d2ff;padding:4px;');
