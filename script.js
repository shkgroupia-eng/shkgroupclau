/* SHK GROUP.IA — Final Script + Hero Animations */

document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    if (window.innerWidth > 768 && dot && ring) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = (mx - 3) + 'px';
            dot.style.top = (my - 3) + 'px';
        });

        (function loop() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = (rx - 18) + 'px';
            ring.style.top = (ry - 18) + 'px';
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('a,button,.btn,.stab,.faq-question,.benefit-card,.proof-card,.proof-card--sm,.practice-item,.agent-feature,.step-card,.integration-card,.diff-card,.hero-phone').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

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

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navbar) {
        window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.pageYOffset > 50));
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        }));
    }

    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), parseInt(entry.target.dataset.delay) || 0);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const dur = 2200;
        const start = performance.now();

        function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 4)));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }

        requestAnimationFrame(tick);
    }

    const cObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                cObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(el => cObs.observe(el));

    document.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-question');
        const a = item.querySelector('.faq-answer');
        if (!q || !a) return;

        q.addEventListener('click', () => {
            const open = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = '0';
            });
            if (!open) {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });

    document.querySelectorAll('.stab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.stab-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById('tab-' + tab.dataset.tab);
            if (panel) panel.classList.add('active');
        });
    });

    function generateEventId(prefix = 'shk') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    function trackEvent(event, params, eventID) {
        if (typeof fbq !== 'undefined') {
            if (eventID) fbq('track', event, params || {}, { eventID });
            else fbq('track', event, params || {});
        }
    }

    const ofertaSection = document.getElementById('oferta');
    if (ofertaSection) {
        new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    trackEvent('ViewContent', {
                        content_name: 'Planos Agente IA',
                        content_category: 'pricing'
                    }, generateEventId('viewcontent'));
                }
            });
        }, { threshold: 0.3 }).observe(ofertaSection);
    }

    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Contact', { content_name: 'WhatsApp CTA' }, generateEventId('contact'));
        });
    });

    document.querySelectorAll('.pricing-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.closest('.pricing-card')?.querySelector('.pricing-plan-name')?.textContent || 'Plano';
            trackEvent('InitiateCheckout', {
                content_name: 'Plano ' + planName
            }, generateEventId('checkout'));
        });
    });

    let scrollTracked75 = false;
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        if (!scrollTracked75 && pct >= 75) {
            scrollTracked75 = true;
            trackEvent('ViewContent', {
                content_name: 'Deep Scroll 75%'
            }, generateEventId('scroll75'));
        }
    });

    const mobileCta = document.getElementById('mobileCta');
    const heroSection = document.getElementById('hero');
    if (mobileCta && heroSection) {
        new IntersectionObserver(entries => {
            mobileCta.style.display = entries[0].isIntersecting ? 'none' : 'block';
        }, { threshold: 0.1 }).observe(heroSection);
    }
});

const rp = document.getElementById('readProgress');
if (rp) {
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 0) rp.style.width = (window.scrollY / h * 100) + '%';
    });
}

function loadVideo() {
    const placeholder = document.getElementById('videoPlaceholder');
    const frame = document.getElementById('videoFrame');
    if (placeholder && frame) {
        placeholder.style.display = 'none';
        frame.src = frame.dataset.src;
        frame.style.display = 'block';
    }
}

const NL_API = 'https://sharknews-sub.com.br/api/subscribe';

function generateEventId(prefix = 'shk') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const nlEmailInput = document.getElementById('newsletterEmail');
const nlEmailStatus = document.getElementById('nlEmailStatus');
const nlEmailError = document.getElementById('nlEmailError');

if (nlEmailInput) {
    nlEmailInput.addEventListener('input', function() {
        const val = this.value.trim();
        if (!val) {
            this.classList.remove('nl-valid', 'nl-invalid');
            if (nlEmailStatus) {
                nlEmailStatus.classList.remove('nl-show');
                nlEmailStatus.innerHTML = '';
            }
            if (nlEmailError) nlEmailError.textContent = '';
            return;
        }

        if (isValidEmail(val)) {
            this.classList.remove('nl-invalid');
            this.classList.add('nl-valid');
            if (nlEmailStatus) {
                nlEmailStatus.classList.add('nl-show');
                nlEmailStatus.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
            }
            if (nlEmailError) nlEmailError.textContent = '';
        } else {
            this.classList.remove('nl-valid');
            this.classList.add('nl-invalid');
            if (nlEmailStatus) {
                nlEmailStatus.classList.add('nl-show');
                nlEmailStatus.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
            }
        }
    });

    nlEmailInput.addEventListener('blur', function() {
        const val = this.value.trim();
        if (val && !isValidEmail(val) && nlEmailError) {
            nlEmailError.textContent = 'Insira um e-mail válido';
        }
    });
}

const nlForm = document.getElementById('newsletterForm');
if (nlForm) {
    nlForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nameEl = document.getElementById('nlName');
        const emailEl = document.getElementById('newsletterEmail');
        const consentEl = document.getElementById('nlConsent');
        const btn = document.getElementById('nlSubmitBtn');
        const consentError = document.getElementById('nlConsentError');
        const successEl = document.getElementById('newsletterSuccess');
        const errorEl = document.getElementById('newsletterError');
        const errorMsg = document.getElementById('nlErrorMsg');

        if (consentError) consentError.textContent = '';
        if (nlEmailError) nlEmailError.textContent = '';

        const email = emailEl.value.trim();
        if (!email || !isValidEmail(email)) {
            emailEl.classList.add('nl-invalid');
            if (nlEmailError) nlEmailError.textContent = 'Insira um e-mail válido';
            emailEl.focus();
            return;
        }

        if (!consentEl.checked) {
            if (consentError) consentError.textContent = 'Você precisa aceitar para se inscrever';
            return;
        }

        const eventId = generateEventId('newsletter');

        btn.classList.add('nl-loading');
        btn.disabled = true;

        const btnText = document.getElementById('nlBtnText');
        const btnSpinner = document.getElementById('nlBtnSpinner');
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'flex';

        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', { content_name: 'SharkNews Newsletter' }, { eventID: eventId });
        }

        const payload = {
            email: email,
            name: nameEl ? nameEl.value.trim() || null : null,
            consentAccepted: true,
            consentVersion: '1.0',
            consentSource: 'shkgroup-landing-page',
            event_id: eventId,
            event_name: 'Lead',
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            lead_source: 'newsletter'
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
                if (successEl) successEl.style.display = 'block';
            } else {
                const data = await res.json().catch(() => null);
                let msg = 'Ocorreu um erro. Tente novamente.';
                if (res.status === 409) msg = 'Este e-mail já está inscrito na SharkNews!';
                else if (res.status === 400 && data) msg = data.message || data.error || 'Verifique os dados e tente novamente.';
                else if (res.status >= 500) msg = 'Servidor temporariamente indisponível. Tente em alguns minutos.';
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
            if (btnText) btnText.style.display = '';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    });
}

const nlRetryBtn = document.getElementById('nlRetryBtn');
if (nlRetryBtn) {
    nlRetryBtn.addEventListener('click', function() {
        const errorEl = document.getElementById('newsletterError');
        const form = document.getElementById('newsletterForm');
        if (errorEl) errorEl.style.display = 'none';
        if (form) form.style.display = 'block';
    });
}

const nlUnsubToggle = document.getElementById('nlUnsubToggle');
const nlUnsubForm = document.getElementById('nlUnsubForm');
if (nlUnsubToggle && nlUnsubForm) {
    nlUnsubToggle.setAttribute('aria-expanded', 'false');
    nlUnsubForm.setAttribute('aria-hidden', 'true');

    nlUnsubToggle.addEventListener('click', function() {
        const isOpen = nlUnsubForm.classList.toggle('nl-show');
        nlUnsubForm.style.display = isOpen ? 'block' : 'none';
        nlUnsubToggle.setAttribute('aria-expanded', String(isOpen));
        nlUnsubForm.setAttribute('aria-hidden', String(!isOpen));
        this.textContent = isOpen ? 'Fechar' : 'Já é inscrito? Cancelar inscrição';
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

        const unsubText = document.getElementById('nlUnsubBtnText');
        const unsubSpinner = document.getElementById('nlUnsubBtnSpinner');
        if (unsubText) unsubText.style.display = 'none';
        if (unsubSpinner) unsubSpinner.style.display = 'flex';

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
            if (unsubText) unsubText.style.display = '';
            if (unsubSpinner) unsubSpinner.style.display = 'none';
        }
    });
}

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

const liveCount = document.querySelector('.hero-live-count');
if (liveCount) {
    let base = 247;
    setInterval(() => {
        const delta = Math.floor(Math.random() * 3) - 1;
        base = Math.max(230, Math.min(280, base + delta));
        liveCount.textContent = base;
    }, 3000);
}
