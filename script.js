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

    function cleanPayloadValue(value) {
        if (
            value === undefined ||
            value === null ||
            value === '' ||
            value === 'undefined' ||
            value === 'null'
        ) {
            return undefined;
        }

        return value;
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

        Object.keys(payload).forEach((key) => {
            if (cleanPayloadValue(payload[key]) === undefined) {
                delete payload[key];
            }
        });

        window.dataLayer.push(payload);

        if (window.location.search.includes('debug_shk=1')) {
            console.log('[SHK dataLayer]', payload);
        }

        return payload;
    }

    /*
      CAPI direto desativado.

      Motivo:
      O envio server-side agora deve ser feito exclusivamente pelo GTM + n8n.

      Fluxo correto:
      script.js -> dataLayer -> GTM -> n8n -> Meta CAPI

      Esta função foi mantida apenas para compatibilidade,
      caso algum trecho antigo ainda chame window.SHKTracking.sendServerEvent().
    */
    function sendServerEvent(payload) {
        if (window.location.search.includes('debug_shk=1')) {
            console.warn('[SHK CAPI] Envio direto desativado. Use GTM + n8n.', payload);
        }

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
            email: userData.email || '',
            phone: userData.phone || '',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            external_id: userData.external_id || '',
            ...customData
        });

        /*
          Não enviar CAPI direto daqui.
          Mesmo que algum evento ainda esteja com sendServer: true,
          o envio server-side fica centralizado no GTM.
        */

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
