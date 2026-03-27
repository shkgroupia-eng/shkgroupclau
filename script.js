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
  const email = document.getElementById('newsletterEmail').value;
  const form = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');
  if (email && form && success) {
    form.style.display = 'none';
    success.style.display = 'block';
    // Integre aqui: Mailchimp, RD Station, ConvertKit, etc.
    console.log('Newsletter signup:', email);
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
