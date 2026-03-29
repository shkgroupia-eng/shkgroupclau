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

// ═══ NEWSLETTER — SHARKNEWS INTEGRATION ═══
const NL_API = 'https://sharknews-sub.com.br/api/subscribe';

// Animated counter on scroll
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = '+' + target.toLocaleString('pt-BR');
  }
  requestAnimationFrame(tick);
}
const nlCounter = document.querySelector('.nl-counter');
if (nlCounter) {
  let counterFired = false;
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterFired) {
        counterFired = true;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 }).observe(nlCounter);
}

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Real-time email validation UI
const nlEmailInput = document.getElementById('newsletterEmail');
const nlEmailStatus = document.getElementById('nlEmailStatus');
const nlEmailError = document.getElementById('nlEmailError');
if (nlEmailInput) {
  nlEmailInput.addEventListener('input', function() {
    const val = this.value.trim();
    if (!val) {
      this.classList.remove('nl-valid', 'nl-invalid');
      nlEmailStatus.classList.remove('nl-show');
      nlEmailStatus.innerHTML = '';
      nlEmailError.textContent = '';
      return;
    }
    if (isValidEmail(val)) {
      this.classList.remove('nl-invalid');
      this.classList.add('nl-valid');
      nlEmailStatus.classList.add('nl-show');
      nlEmailStatus.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      nlEmailError.textContent = '';
    } else {
      this.classList.remove('nl-valid');
      this.classList.add('nl-invalid');
      nlEmailStatus.classList.add('nl-show');
      nlEmailStatus.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }
  });
  nlEmailInput.addEventListener('blur', function() {
    const val = this.value.trim();
    if (val && !isValidEmail(val)) {
      nlEmailError.textContent = 'Insira um e-mail válido';
    }
  });
}

// Form submission
const nlForm = document.getElementById('newsletterForm');
if (nlForm) {
  nlForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nameEl = document.getElementById('nlName');
    const emailEl = document.getElementById('newsletterEmail');
    const consentEl = document.getElementById('nlConsent');
    const btn = document.getElementById('nlSubmitBtn');
    const consentError = document.getElementById('nlConsentError');
    const formCard = document.getElementById('nlFormCard');
    const successEl = document.getElementById('newsletterSuccess');
    const errorEl = document.getElementById('newsletterError');
    const errorMsg = document.getElementById('nlErrorMsg');

    // Reset errors
    if (consentError) consentError.textContent = '';
    if (nlEmailError) nlEmailError.textContent = '';

    // Validate email
    const email = emailEl.value.trim();
    if (!email || !isValidEmail(email)) {
      emailEl.classList.add('nl-invalid');
      if (nlEmailError) nlEmailError.textContent = 'Insira um e-mail válido';
      emailEl.focus();
      return;
    }

    // Validate consent
    if (!consentEl.checked) {
      if (consentError) consentError.textContent = 'Você precisa aceitar para se inscrever';
      return;
    }

    // Loading state
    btn.classList.add('nl-loading');
    btn.disabled = true;

    // Meta Pixel — Lead event
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: 'SharkNews Newsletter' });
    }

    const payload = {
      email: email,
      name: nameEl ? nameEl.value.trim() || null : null,
      consentAccepted: true,
      consentVersion: '1.0',
      consentSource: 'shkgroup-landing-page'
    };

    try {
      const res = await fetch(NL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        nlForm.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
        successEl.style.display = 'block';
      } else {
        const data = await res.json().catch(() => null);
        let msg = 'Ocorreu um erro. Tente novamente.';
        if (res.status === 409) {
          msg = 'Este e-mail já está inscrito na SharkNews!';
        } else if (res.status === 400 && data) {
          msg = data.message || data.error || 'Verifique os dados e tente novamente.';
        } else if (res.status >= 500) {
          msg = 'Servidor temporariamente indisponível. Tente em alguns minutos.';
        }
        nlForm.style.display = 'none';
        if (errorMsg) errorMsg.textContent = msg;
        if (errorEl) errorEl.style.display = 'block';
      }
    } catch (err) {
      nlForm.style.display = 'none';
      if (errorMsg) errorMsg.textContent = 'Sem conexão. Verifique sua internet e tente novamente.';
      if (errorEl) errorEl.style.display = 'block';
    } finally {
      btn.classList.remove('nl-loading');
      btn.disabled = false;
    }
  });
}

// Retry button
const nlRetryBtn = document.getElementById('nlRetryBtn');
if (nlRetryBtn) {
  nlRetryBtn.addEventListener('click', function() {
    const errorEl = document.getElementById('newsletterError');
    const form = document.getElementById('newsletterForm');
    if (errorEl) errorEl.style.display = 'none';
    if (form) form.style.display = 'block';
  });
}

// ═══ NEWSLETTER — UNSUBSCRIBE ═══
const nlUnsubToggle = document.getElementById('nlUnsubToggle');
const nlUnsubForm = document.getElementById('nlUnsubForm');
if (nlUnsubToggle && nlUnsubForm) {
  nlUnsubToggle.addEventListener('click', function() {
    nlUnsubForm.classList.toggle('nl-show');
    this.textContent = nlUnsubForm.classList.contains('nl-show')
      ? 'Fechar'
      : 'Já é inscrito? Cancelar inscrição';
  });
}

const nlUnsubBtn = document.getElementById('nlUnsubBtn');
if (nlUnsubBtn) {
  nlUnsubBtn.addEventListener('click', async function() {
    const emailEl = document.getElementById('nlUnsubEmail');
    const msgEl = document.getElementById('nlUnsubMsg');
    const email = emailEl.value.trim();

    msgEl.textContent = '';
    msgEl.className = 'nl-unsub-msg';

    if (!email || !isValidEmail(email)) {
      msgEl.textContent = 'Insira um e-mail válido';
      msgEl.classList.add('nl-msg-error');
      emailEl.focus();
      return;
    }

    nlUnsubBtn.classList.add('nl-loading');
    nlUnsubBtn.disabled = true;

    try {
      const res = await fetch(NL_API + '/' + encodeURIComponent(email), {
        method: 'DELETE'
      });

      if (res.ok) {
        msgEl.textContent = 'Inscrição cancelada com sucesso. Sentiremos sua falta!';
        msgEl.classList.add('nl-msg-success');
        emailEl.value = '';
      } else if (res.status === 404) {
        msgEl.textContent = 'Este e-mail não está inscrito na SharkNews.';
        msgEl.classList.add('nl-msg-error');
      } else {
        msgEl.textContent = 'Erro ao cancelar. Tente novamente.';
        msgEl.classList.add('nl-msg-error');
      }
    } catch (err) {
      msgEl.textContent = 'Sem conexão. Verifique sua internet e tente novamente.';
      msgEl.classList.add('nl-msg-error');
    } finally {
      nlUnsubBtn.classList.remove('nl-loading');
      nlUnsubBtn.disabled = false;
    }
  });
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

// Lead — tracking agora integrado diretamente no form handler acima

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
