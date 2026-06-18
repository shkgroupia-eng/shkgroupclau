const CONFIG = (() => {
    const cfg = window.SHK_CONFIG || {};
    return {
        newsletterSubscribeUrl: cfg.newsletterSubscribeUrl || 'https://sharknews-sub.com.br/api/subscribe',
        // Unsubscribe = DELETE /api/subscribe/{email} (endpoint publico que o backend ja expoe).
        // Deriva da base de subscribe; resiliente a SHK_CONFIG legado que ainda aponte /api/unsubscribe.
        newsletterUnsubscribeBase: cfg.newsletterUnsubscribeBase || cfg.newsletterSubscribeUrl || 'https://sharknews-sub.com.br/api/subscribe',
        capiWebhookUrl: cfg.capiWebhookUrl || '/webhook/capi-lead',
        newsletterApiKey: cfg.newsletterApiKey || '',
        consentKey: 'shk_cookie_consent_v1',
        exitShownKey: 'shk_exit_shown'
    };
})();

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () {
    dataLayer.push(arguments);
};

window.SHKTracking = (() => {
    function generateEventId(prefix = 'shk') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? decodeURIComponent(match[2]) : '';
    }

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name) || '';
    }

    function getFbp() {
        return getCookie('_fbp') || '';
    }

    function getFbc() {
        const current = getCookie('_fbc');
        if (current) return current;

        const fbclid = getQueryParam('fbclid');
        return fbclid ? `fb.1.${Date.now()}.${fbclid}` : '';
    }

    function hasMarketingConsent() {
        return localStorage.getItem(CONFIG.consentKey) === 'granted';
    }

    function pushEvent(event, data = {}) {
        const payload = {
            event,
            event_id: data.event_id || generateEventId(event),
            page_url: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            user_agent: navigator.userAgent,
            fbp: getFbp(),
            fbc: getFbc(),
            marketing_consent: hasMarketingConsent() ? 'granted' : 'denied',
            ...data
        };

        window.dataLayer.push(payload);
        return payload;
    }

    // CAPI direto desativado no front-end.
    // Arquitetura final: script.js -> dataLayer -> GTM -> n8n -> Meta CAPI.
    // Esta função permanece como compatibilidade para chamadas antigas, mas não envia rede.
    function sendServerEvent(payload) {
        return Promise.resolve(false);
    }

    function trackMetaEvent({
        dlEvent,
        metaEventName,
        leadSource,
        sendServer = false,
        customData = {},
        userData = {}
    }) {
        const payload = pushEvent(dlEvent, {
            meta_event_name: metaEventName,
            lead_source: leadSource,
            content_name: customData.content_name || '',
            value: customData.value || '',
            currency: customData.currency || 'BRL',
            ...customData,
            ...userData
        });

        return payload;
    }

    return {
        generateEventId,
        hasMarketingConsent,
        pushEvent,
        sendServerEvent,
        trackMetaEvent
    };
})();

function $(selector, scope = document) {
    return scope.querySelector(selector);
}

function $$(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function parseMoneyFromCard(card) {
    if (!card) return '';

    const amount = $('.pricing-amount', card)?.textContent?.trim() || '';
    const dec = $('.pricing-dec', card)?.textContent?.replace(',', '.')?.trim() || '';
    const normalized = `${amount}${dec ? `.${dec.replace('.', '')}` : ''}`.replace(/[^\d.]/g, '');

    if (!normalized) return '';
    const value = Number(normalized);
    return Number.isFinite(value) ? value : '';
}

function setLoadingState(button, isLoading, textEl, spinnerEl) {
    if (!button) return;
    button.disabled = isLoading;
    if (textEl) textEl.style.display = isLoading ? 'none' : '';
    if (spinnerEl) spinnerEl.style.display = isLoading ? 'inline-flex' : 'none';
}

function showEl(el, display = 'block') {
    if (el) el.style.display = display;
}

function hideEl(el) {
    if (el) el.style.display = 'none';
}

function applyConsentState(state) {
    const granted = state === 'granted';

    gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied'
    });

    window.dataLayer.push({
        event: 'cookie_consent_update',
        consent_state: state
    });
}

function acceptCookies() {
    localStorage.setItem(CONFIG.consentKey, 'granted');
    applyConsentState('granted');
    $('#cookieBanner')?.classList.add('hidden');
}

function rejectCookies() {
    localStorage.setItem(CONFIG.consentKey, 'denied');
    applyConsentState('denied');
    $('#cookieBanner')?.classList.add('hidden');
}

function closeExit() {
    $('#exitPopup')?.classList.remove('open');
    $('#exitOverlay')?.classList.remove('open');
}

function openExit() {
    $('#exitPopup')?.classList.add('open');
    $('#exitOverlay')?.classList.add('open');
}

function loadVideo() {
    const placeholder = $('#videoPlaceholder');
    const frame = $('#videoFrame');
    if (!placeholder || !frame) return;

    if (!frame.src) {
        frame.src = frame.dataset.src || '';
    }

    placeholder.style.display = 'none';
    frame.style.display = 'block';

    if (!frame.dataset.tracked) {
        frame.dataset.tracked = '1';
        window.SHKTracking.trackMetaEvent({
            dlEvent: 'video_play',
            metaEventName: 'ViewContent',
            leadSource: 'video_demo',
            customData: {
                content_name: 'Video Demo Agente IA'
            }
        });
    }
}

function initCustomCursor() {
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    if (window.innerWidth <= 768 || !dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = `${mx - 3}px`;
        dot.style.top = `${my - 3}px`;
    });

    (function loop() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = `${rx - 18}px`;
        ring.style.top = `${ry - 18}px`;
        requestAnimationFrame(loop);
    })();

    const interactiveSelector = [
        'a',
        'button',
        '.btn',
        '.stab',
        '.faq-question',
        '.benefit-card',
        '.proof-card',
        '.proof-card--sm',
        '.practice-item',
        '.agent-feature',
        '.step-card',
        '.integration-card',
        '.diff-card',
        '.hero-phone',
        '.pricing-card',
        '.nl-submit-btn',
        '.nl-unsub-btn'
    ].join(',');

    $$(interactiveSelector).forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

function initHeroAnimations() {
    $$('.hero-anim').forEach((el) => {
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
    });

    const chatMsgs = $$('.hero-msg-anim');
    const playChat = () => {
        chatMsgs.forEach((el) => {
            const delay = parseInt(el.dataset.msgDelay || '0', 10);
            setTimeout(() => el.classList.add('visible'), delay);
        });
    };

    playChat();

    if (chatMsgs.length) {
        setInterval(() => {
            chatMsgs.forEach((el) => el.classList.remove('visible'));
            setTimeout(playChat, 500);
        }, 14000);
    }

    const liveCount = $('.hero-live-count');
    if (liveCount) {
        let value = parseInt(liveCount.textContent || '247', 10);
        setInterval(() => {
            const delta = Math.floor(Math.random() * 5) - 2;
            value = Math.max(180, Math.min(320, value + delta));
            liveCount.textContent = value;
        }, 4500);
    }
}

function initNavbar() {
    const navbar = $('#navbar');
    const navToggle = $('#navToggle');
    const navLinks = $('#navLinks');
    const navOverlay = $('#navOverlay');

    const closeMenu = () => {
        navToggle?.classList.remove('open');
        navLinks?.classList.remove('open');
        navOverlay?.classList.remove('open');
        document.body.classList.remove('nav-open');
        navToggle?.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        navToggle?.classList.add('open');
        navLinks?.classList.add('open');
        navOverlay?.classList.add('open');
        document.body.classList.add('nav-open');
        navToggle?.setAttribute('aria-expanded', 'true');
    };

    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            if (isOpen) closeMenu();
            else openMenu();
        });

        $$('a', navLinks).forEach((a) => a.addEventListener('click', closeMenu));
        navOverlay?.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }
}

function initRevealObserver() {
    const revealItems = $$('.reveal');
    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target || '0', 10);
    if (!Number.isFinite(target)) return;

    const duration = 2200;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    }

    requestAnimationFrame(tick);
}

function initCounters() {
    const counters = $$('.counter, .nl-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.3 });

    counters.forEach((el) => observer.observe(el));
}

function initBars() {
    const bars = $$('.proof-bar[data-width], .avc-bar-fill[data-width]');
    if (!bars.length) return;

    bars.forEach((bar) => {
        bar.style.width = '0%';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const width = entry.target.dataset.width || '0';
            setTimeout(() => {
                entry.target.style.width = `${width}%`;
            }, 120);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    bars.forEach((bar) => observer.observe(bar));
}

function initFAQ() {
    $$('.faq-item').forEach((item) => {
        const question = $('.faq-question', item);
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            $$('.faq-item.open').forEach((openItem) => {
                if (openItem !== item) openItem.classList.remove('open');
            });

            item.classList.toggle('open', !isOpen);
        });
    });
}

function initServiceTabs() {
    const tabs = $$('.stab');
    const panels = $$('.stab-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach((btn) => btn.classList.remove('active'));
            panels.forEach((panel) => panel.classList.remove('active'));

            tab.classList.add('active');
            $(`#tab-${target}`)?.classList.add('active');
        });
    });
}

function initVideo() {
    const placeholder = $('#videoPlaceholder');
    if (!placeholder) return;

    placeholder.addEventListener('click', loadVideo);
    placeholder.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadVideo();
        }
    });
}

function initNewsletter() {
    const form = $('#newsletterForm');
    const nameInput = $('#nlName');
    const emailInput = $('#newsletterEmail');
    const consentInput = $('#nlConsent');
    const emailStatus = $('#nlEmailStatus');
    const emailError = $('#nlEmailError');
    const consentError = $('#nlConsentError');

    const submitBtn = $('#nlSubmitBtn');
    const submitText = $('#nlBtnText');
    const submitSpinner = $('#nlBtnSpinner');

    const formCard = $('#nlFormCard');
    const errorBox = $('#newsletterError');
    const errorMsg = $('#nlErrorMsg');
    const retryBtn = $('#nlRetryBtn');
    const successBox = $('#newsletterSuccess');

    const unsubToggle = $('#nlUnsubToggle');
    const unsubForm = $('#nlUnsubForm');
    const unsubEmail = $('#nlUnsubEmail');
    const unsubBtn = $('#nlUnsubBtn');
    const unsubBtnText = $('#nlUnsubBtnText');
    const unsubBtnSpinner = $('#nlUnsubBtnSpinner');
    const unsubMsg = $('#nlUnsubMsg');

    function clearNewsletterErrors() {
        if (emailError) emailError.textContent = '';
        if (consentError) consentError.textContent = '';
        if (emailStatus) emailStatus.textContent = '';
        emailInput?.classList.remove('is-valid', 'is-invalid');
    }

    function validateNewsletterEmail(showError = false) {
        const value = emailInput?.value?.trim() || '';

        if (!value) {
            emailInput?.classList.remove('is-valid', 'is-invalid');
            if (emailStatus) emailStatus.textContent = '';
            if (showError && emailError) emailError.textContent = 'Informe seu e-mail.';
            return false;
        }

        if (!isValidEmail(value)) {
            emailInput?.classList.add('is-invalid');
            emailInput?.classList.remove('is-valid');
            if (emailStatus) emailStatus.textContent = '✕';
            if (showError && emailError) emailError.textContent = 'Digite um e-mail válido.';
            return false;
        }

        emailInput?.classList.add('is-valid');
        emailInput?.classList.remove('is-invalid');
        if (emailStatus) emailStatus.textContent = '✓';
        if (emailError) emailError.textContent = '';
        return true;
    }

    emailInput?.addEventListener('input', () => {
        if (emailError?.textContent) validateNewsletterEmail(true);
        else validateNewsletterEmail(false);
    });

    emailInput?.addEventListener('blur', () => validateNewsletterEmail(true));

    consentInput?.addEventListener('change', () => {
        if (consentInput.checked && consentError) consentError.textContent = '';
    });

    retryBtn?.addEventListener('click', () => {
        hideEl(errorBox);
        showEl(form, 'block');
        formCard?.classList.remove('has-error');
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearNewsletterErrors();

        const name = nameInput?.value?.trim() || '';
        const email = emailInput?.value?.trim() || '';
        const consent = !!consentInput?.checked;

        const validEmail = validateNewsletterEmail(true);
        if (!consent && consentError) {
            consentError.textContent = 'Você precisa aceitar a política para continuar.';
        }

        if (!validEmail || !consent) return;

        setLoadingState(submitBtn, true, submitText, submitSpinner);
        hideEl(errorBox);

        try {
            const subscribeHeaders = { 'Content-Type': 'application/json' };
            if (CONFIG.newsletterApiKey) subscribeHeaders['X-Admin-Token'] = CONFIG.newsletterApiKey;

            const res = await fetch(CONFIG.newsletterSubscribeUrl, {
                method: 'POST',
                headers: subscribeHeaders,
                body: JSON.stringify({
                    name,
                    first_name: name,
                    email,
                    consentAccepted: true,
                    source: 'site_shkgroup',
                    page_url: window.location.href,
                    page_title: document.title
                })
            });

            // O backend responde text/plain (sucesso e erros como 409 duplicado).
            const text = (await res.text().catch(() => '')).trim();

            if (!res.ok) {
                let message = text;
                // Erros de validacao (400) podem vir como JSON { campo: msg }.
                if (message && message.startsWith('{')) {
                    try {
                        const parsed = JSON.parse(message);
                        message = Object.values(parsed)[0] || message;
                    } catch (_) {}
                }
                throw new Error(message || 'Não foi possível concluir sua inscrição agora.');
            }

            hideEl(form);
            hideEl(errorBox);
            showEl(successBox, 'block');

            window.SHKTracking.trackMetaEvent({
                dlEvent: 'newsletter_lead',
                metaEventName: 'Lead',
                leadSource: 'newsletter',
                sendServer: true,
                customData: {
                    content_name: 'SharkNews Newsletter'
                },
                userData: {
                    email,
                    first_name: name
                }
            });
        } catch (err) {
            if (errorMsg) errorMsg.textContent = err.message || 'Ocorreu um erro. Tente novamente.';
            hideEl(form);
            showEl(errorBox, 'flex');
            formCard?.classList.add('has-error');
        } finally {
            setLoadingState(submitBtn, false, submitText, submitSpinner);
        }
    });

    unsubToggle?.addEventListener('click', () => {
        if (!unsubForm) return;
        const isVisible = unsubForm.style.display === 'block';
        unsubForm.style.display = isVisible ? 'none' : 'block';
        unsubToggle.classList.toggle('open', !isVisible);
    });

    unsubBtn?.addEventListener('click', async () => {
        const email = unsubEmail?.value?.trim() || '';
        if (!isValidEmail(email)) {
            if (unsubMsg) {
                unsubMsg.textContent = 'Digite um e-mail válido.';
                unsubMsg.classList.add('error');
            }
            return;
        }

        if (unsubMsg) {
            unsubMsg.textContent = '';
            unsubMsg.classList.remove('error');
        }

        setLoadingState(unsubBtn, true, unsubBtnText, unsubBtnSpinner);

        try {
            // Backend de prod: descadastro por e-mail = DELETE /api/subscribe/{email} (publico).
            const res = await fetch(`${CONFIG.newsletterUnsubscribeBase}/${encodeURIComponent(email)}`, {
                method: 'DELETE'
            });

            // Resposta e text/plain (mensagem neutra anti-enumeracao).
            const text = (await res.text().catch(() => '')).trim();

            if (!res.ok) {
                throw new Error(text || 'Não foi possível cancelar agora.');
            }

            if (unsubMsg) {
                unsubMsg.textContent = text || 'Inscrição cancelada com sucesso.';
                unsubMsg.classList.remove('error');
            }
        } catch (err) {
            if (unsubMsg) {
                unsubMsg.textContent = err.message || 'Ocorreu um erro ao cancelar.';
                unsubMsg.classList.add('error');
            }
        } finally {
            setLoadingState(unsubBtn, false, unsubBtnText, unsubBtnSpinner);
        }
    });
}

function initConsentBanner() {
    const cookieBanner = $('#cookieBanner');
    const savedConsent = localStorage.getItem(CONFIG.consentKey);

    if (!savedConsent) {
        cookieBanner?.classList.remove('hidden');
    } else {
        applyConsentState(savedConsent);
        cookieBanner?.classList.add('hidden');
    }

    $('#cookieAcceptBtn')?.addEventListener('click', acceptCookies);
    $('#cookieRejectBtn')?.addEventListener('click', rejectCookies);
}

function initExitIntent() {
    const exitOverlay = $('#exitOverlay');
    const exitClose = $('#exitClose');
    const exitSkip = $('#exitSkip');
    const exitCta = $('#exitCta');

    exitOverlay?.addEventListener('click', closeExit);
    exitClose?.addEventListener('click', closeExit);
    exitSkip?.addEventListener('click', closeExit);
    exitCta?.addEventListener('click', closeExit);

    if (window.innerWidth <= 768) return;
    if (sessionStorage.getItem(CONFIG.exitShownKey)) return;

    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && !sessionStorage.getItem(CONFIG.exitShownKey)) {
            openExit();
            sessionStorage.setItem(CONFIG.exitShownKey, '1');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeExit();
    });
}

function inferWhatsAppSource(el) {
    if (el.classList.contains('whatsapp-float')) return 'whatsapp_float';
    if (el.classList.contains('nav-cta')) return 'navbar_cta';
    if (el.classList.contains('mobile-sticky-btn')) return 'mobile_sticky';
    if (el.classList.contains('exit-cta')) return 'exit_intent';
    if (el.closest('#cta-final')) return 'cta_final';
    if (el.closest('.hero-actions')) return 'hero_cta';
    return 'whatsapp_link';
}

function initTracking() {
    const ofertaSection = $('#oferta');

    if (ofertaSection) {
        let pricingViewed = false;
        const pricingObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || pricingViewed) return;

                pricingViewed = true;
                window.SHKTracking.trackMetaEvent({
                    dlEvent: 'pricing_view',
                    metaEventName: 'ViewContent',
                    leadSource: 'pricing_section',
                    customData: {
                        content_name: 'Planos Agente IA',
                        content_category: 'pricing'
                    }
                });
            });
        }, { threshold: 0.3 });

        pricingObserver.observe(ofertaSection);
    }

    $$('a[href*="wa.me"]').forEach((btn) => {
        if (btn.classList.contains('pricing-btn')) return;

        btn.addEventListener('click', () => {
            window.SHKTracking.trackMetaEvent({
                dlEvent: 'whatsapp_click',
                metaEventName: 'Contact',
                leadSource: inferWhatsAppSource(btn),
                sendServer: true,
                customData: {
                    content_name: 'WhatsApp CTA'
                }
            });
        });
    });

    $$('.pricing-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.pricing-card');
            const planName = $('.pricing-plan-name', card)?.textContent?.trim() || 'Plano';
            const value = parseMoneyFromCard(card);

            window.SHKTracking.trackMetaEvent({
                dlEvent: 'checkout_click',
                metaEventName: 'InitiateCheckout',
                leadSource: `pricing_${planName.toLowerCase()}`,
                sendServer: true,
                customData: {
                    content_name: `Plano ${planName}`,
                    value,
                    currency: 'BRL'
                }
            });
        });
    });

    let scrollTracked75 = false;
    window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;

        if (!scrollTracked75 && pct >= 75) {
            scrollTracked75 = true;
            window.SHKTracking.trackMetaEvent({
                dlEvent: 'scroll_75',
                metaEventName: 'ViewContent',
                leadSource: 'deep_scroll',
                customData: {
                    content_name: 'Deep Scroll 75%'
                }
            });
        }
    }, { passive: true });
}

function initSHKSite() {
    initCustomCursor();
    initHeroAnimations();
    initNavbar();
    initRevealObserver();
    initCounters();
    initBars();
    initFAQ();
    initServiceTabs();
    initVideo();
    initNewsletter();
    initConsentBanner();
    initExitIntent();
    initTracking();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSHKSite);
} else {
    initSHKSite();
}
