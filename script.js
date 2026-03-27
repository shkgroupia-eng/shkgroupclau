/* SHK GROUP.IA — Final Script + Hero Animations */

document.addEventListener('DOMContentLoaded', () => {

    // Custom Cursor
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    if (window.innerWidth > 768 && dot && ring) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = (mx - 3) + 'px';
            dot.style.top = (my - 3) + 'px';
        });
        (function loop() {
            rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
            ring.style.left = (rx - 18) + 'px'; ring.style.top = (ry - 18) + 'px';
            requestAnimationFrame(loop);
        })();
        document.querySelectorAll('a,button,.btn,.stab,.faq-question,.benefit-card,.proof-card,.proof-card--sm,.practice-item,.agent-feature,.step-card,.integration-card,.diff-card,.hero-phone').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    // ═══ HERO ANIMATIONS ═══
    document.querySelectorAll('.hero-anim').forEach(el => {
        const d = parseInt(el.dataset.delay) || 0;
        setTimeout(() => el.classList.add('visible'), d);
    });

    const chatMsgs = document.querySelectorAll('.hero-msg-anim');
    function playChat() {
        chatMsgs.forEach(el => {
            setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.msgDelay) || 0);
        });
    }
    playChat();
    if (chatMsgs.length) setInterval(() => {
        chatMsgs.forEach(el => el.classList.remove('visible'));
        setTimeout(playChat, 500);
    }, 14000);

    // ═══ NAVBAR ═══
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.pageYOffset > 50));
    navToggle.addEventListener('click', () => { navToggle.classList.toggle('open'); navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { navToggle.classList.remove('open'); navLinks.classList.remove('open'); }));

    // ═══ REVEAL ON SCROLL ═══
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), parseInt(entry.target.dataset.delay) || 0);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ═══ COUNTERS ═══
    function animateCounter(el) {
        const target = parseInt(el.dataset.target), dur = 2200, start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 4)));
            if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }
    const cObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } }), { threshold: 0.3 });
    document.querySelectorAll('.counter').forEach(el => cObs.observe(el));

    // Proof Bars
    document.querySelectorAll('.proof-bar').forEach(bar => {
        new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { setTimeout(() => bar.style.width = bar.dataset.width + '%', 400); o.unobserve(bar); } }, { threshold: 0.3 }).observe(bar);
    });

    // AVC Bars
    document.querySelectorAll('.avc-bar-fill').forEach(bar => {
        const w = bar.dataset.width; bar.style.width = '0';
        new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { setTimeout(() => bar.style.width = w + '%', 300); o.unobserve(bar); } }, { threshold: 0.3 }).observe(bar);
    });

    // ═══ FAQ ═══
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const open = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-answer').style.maxHeight = '0'; });
            if (!open) { item.classList.add('open'); item.querySelector('.faq-answer').style.maxHeight = item.querySelector('.faq-answer').scrollHeight + 'px'; }
        });
    });

    // ═══ TABS ═══
    document.querySelectorAll('.stab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.stab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        });
    });

    // ═══ SMOOTH SCROLL ═══
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
    });

    // ═══ ACTIVE NAV ═══
    const secs = document.querySelectorAll('section[id]'), navAll = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        const sy = window.pageYOffset + 120;
        secs.forEach(s => { if (sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight) navAll.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + s.id)); });
    });

    // ═══ PARALLAX & 3D ═══
    if (window.innerWidth > 768) {
        const orbs = document.querySelectorAll('.hero-orb');
        window.addEventListener('scroll', () => { const y = window.pageYOffset; orbs.forEach((o, i) => o.style.transform = `translateY(${y * (i + 1) * 0.04}px)`); });

        const oc = document.querySelector('.offer-wrapper');
        if (oc) {
            oc.addEventListener('mousemove', e => {
                const r = oc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
                oc.style.transform = `translateY(-4px) perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
            });
            oc.addEventListener('mouseleave', () => oc.style.transform = '');
        }
    }
});



// ═══ READ PROGRESS BAR ═══
const rp = document.getElementById('readProgress');
if(rp){
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if(h > 0) rp.style.width = (window.scrollY / h * 100) + '%';
  });
}

// ═══ VIDEO LAZY LOAD ═══
function loadVideo() {
  const placeholder = document.getElementById('videoPlaceholder');
  const frame = document.getElementById('videoFrame');
  if (placeholder && frame) {
    placeholder.style.display = 'none';
    frame.src = frame.dataset.src;
    frame.style.display = 'block';
  }
}

// ═══ NEWSLETTER SUBMIT ═══
function submitNewsletter(e) {
  e.preventDefault();
  const name  = document.getElementById('nlName') ? document.getElementById('nlName').value : '';
  const email = document.getElementById('newsletterEmail').value;
  const form  = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');
  if (email && form && success) {
    // Animate button
    const btn = form.querySelector('.nl-submit-btn');
    if(btn){ btn.textContent = 'Enviando...'; btn.style.opacity='.7'; }
    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
      // Integre aqui: Mailchimp, RD Station, ConvertKit, etc.
      console.log('Newsletter signup:', name, email);
    }, 800);
  }
}

// ═══ 3D TILT NOS PRICING CARDS ═══
if (window.innerWidth > 1024) {
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(700px) rotateY(${x*7}deg) rotateX(${-y*6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}


// ═══ HERO LIVE COUNTER (simulates live active agents) ═══
const liveCount = document.querySelector('.hero-live-count');
if(liveCount){
  let base = 247;
  setInterval(() => {
    const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    base = Math.max(230, Math.min(280, base + delta));
    liveCount.textContent = base;
  }, 3000);
}


// ══════════════════════════════════════════
// META PIXEL EVENTS — Rastreamento completo
// ══════════════════════════════════════════
function trackEvent(event, params) {
  if (typeof fbq !== 'undefined') {
    fbq('track', event, params || {});
  }
}

// ViewContent — quando visualiza seção de planos
const ofertaSection = document.getElementById('oferta');
if (ofertaSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        trackEvent('ViewContent', { content_name: 'Planos Agente IA', content_category: 'pricing' });
      }
    });
  }, { threshold: 0.3 }).observe(ofertaSection);
}

// Lead — quando submete newsletter
// (já integrado na função submitNewsletter, adicionando trackEvent abaixo)
const origSubmit = window.submitNewsletter;
window.submitNewsletter = function(e) {
  trackEvent('Lead', { content_name: 'Newsletter SHKGROUP.IA' });
  if (origSubmit) origSubmit(e); else {
    e.preventDefault();
    const name = document.getElementById('nlName')?.value || '';
    const email = document.getElementById('newsletterEmail')?.value || '';
    const form = document.getElementById('newsletterForm');
    const success = document.getElementById('newsletterSuccess');
    if (form && success) {
      const btn = form.querySelector('.nl-submit-btn');
      if(btn){ btn.textContent = 'Enviando...'; btn.style.opacity='.7'; }
      setTimeout(() => { form.style.display='none'; success.style.display='block'; }, 800);
    }
  }
};

// Contact — clique em qualquer botão WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('Contact', { content_name: 'WhatsApp CTA' });
  });
});

// InitiateCheckout — clique nos botões de plano
document.querySelectorAll('.pricing-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const planName = btn.closest('.pricing-card')?.querySelector('.pricing-plan-name')?.textContent || 'Plano';
    trackEvent('InitiateCheckout', { content_name: 'Plano ' + planName });
  });
});

// ScheduledDelivery — scroll até 75% da página
let scrollTracked75 = false;
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (!scrollTracked75 && pct >= 75) {
    scrollTracked75 = true;
    trackEvent('Search', { content_name: 'Deep Scroll 75%' }); // usando Search como proxy de engajamento
  }
});

// ══════════════════════════════════════════
// EXIT INTENT POPUP
// ══════════════════════════════════════════
let exitShown = false;
const exitPopup    = document.getElementById('exitPopup');
const exitOverlay  = document.getElementById('exitOverlay');
const exitClose    = document.getElementById('exitClose');

function showExit() {
  if (exitShown || !exitPopup) return;
  exitShown = true;
  exitPopup.classList.add('active');
  exitOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  trackEvent('ViewContent', { content_name: 'Exit Intent Popup' });
}

function closeExit() {
  if (!exitPopup) return;
  exitPopup.classList.remove('active');
  exitOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Trigger: mouse leaves viewport top
if (window.innerWidth > 768) {
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 10) showExit();
  });
}

// Trigger: mobile — scroll up rapidly after 30s
let lastScrollY = 0, exitTimer = null;
if (window.innerWidth <= 768) {
  exitTimer = setTimeout(() => {
    window.addEventListener('scroll', function mobileExitScroll() {
      if (window.scrollY < lastScrollY - 100) { showExit(); window.removeEventListener('scroll', mobileExitScroll); }
      lastScrollY = window.scrollY;
    });
  }, 30000);
}

if (exitClose)   exitClose.addEventListener('click', closeExit);
if (exitOverlay) exitOverlay.addEventListener('click', closeExit);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeExit(); });

// ══════════════════════════════════════════
// COOKIE / LGPD BANNER
// ══════════════════════════════════════════
function acceptCookies() {
  localStorage.setItem('shk_cookies', 'accepted');
  document.getElementById('cookieBanner')?.classList.add('hidden');
  trackEvent('CustomizeProduct', { content_name: 'Cookies Accepted' });
}
function rejectCookies() {
  localStorage.setItem('shk_cookies', 'rejected');
  document.getElementById('cookieBanner')?.classList.add('hidden');
}
// Show only if not decided
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('shk_cookies')) {
    setTimeout(() => document.getElementById('cookieBanner')?.classList.remove('hidden'), 2000);
  } else {
    document.getElementById('cookieBanner')?.classList.add('hidden');
  }
});

// ══════════════════════════════════════════
// MOBILE STICKY CTA — hide when hero visible
// ══════════════════════════════════════════
const mobileCta = document.getElementById('mobileCta');
const heroSection = document.getElementById('hero');
if (mobileCta && heroSection) {
  new IntersectionObserver(entries => {
    mobileCta.style.display = entries[0].isIntersecting ? 'none' : 'block';
  }, { threshold: 0.1 }).observe(heroSection);
}

// ══════════════════════════════════════════
// SMOOTH COUNTER NUMBERS IN PROOF SECTION
// ══════════════════════════════════════════
// Already handled by existing counter code

// ══════════════════════════════════════════
// RIPPLE EFFECT ON ALL BUTTONS
// ══════════════════════════════════════════
document.querySelectorAll('.btn, .pricing-btn, .nl-submit-btn, .exit-cta').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,.25);transform:scale(0);animation:rippleAnim .5s linear;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;pointer-events:none`;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
