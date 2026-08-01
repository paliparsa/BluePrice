// ==========================================================================
// BLUEGATE COMPLETE CONTROLLER (Preserved Redesign & 100% Admin Parity)
// ==========================================================================

let appConfig = null;
let currentReceiptText = '';
let countdownInterval = null;
let activeDiscountPercent = 0;
let basePriceValue = 249000;

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            themeToggleBtn.innerHTML = isLight ? 
                '<i class="fa-solid fa-moon"></i> تم تاریک' : 
                '<i class="fa-solid fa-sun"></i> تم روشن';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> تم تاریک';
        }
    }

    // =========================================================
    // HARDCODED ENGLISH TRANSLATIONS (full page coverage)
    // =========================================================
    const HARDCODED_EN = {
        pageTitle: 'BlueGate | Your Secure Gateway to Free Internet',
        metaDesc: 'BlueGate - Premium VPN service with quality, security and fair pricing. High speed, 24/7 support and money-back guarantee.',
        statusBar: 'Network Online • 99.9% Uptime',
        calcBtn: 'Price Calculator',
        annText: '⚡ Limited Special Offer! All services include a 7-day 100% money-back guarantee.',
        heroTagline: 'Your Secure Gateway to the Free Internet',
        heroCapsule: '3 Professional Services, Tailored to Your Needs',
        promoLabel: 'Special Offer',
        promoTitle: 'Quality, security, and fair pricing — all in one place!',
        promoSubtitle: 'Choose your preferred package and receive an instant invoice',
        countdownTitle: 'Time Remaining for Special Offer:',
        cdHour: 'hr',
        cdMin: 'min',
        cdSec: 'sec',
        calcTitle: 'Smart Price Calculator',
        calcSubtitle: 'Choose the data volume you need and find your optimal price',
        calcSliderLabel: 'Data Needed: {gb} GB',
        calcStdPlan: 'Standard (Volume)',
        calcStdNote: '5,000 Toman per GB',
        calcProPlan: 'Pro (Static IP)',
        calcProNote: 'For trading & high performance',
        calcEmgPlan: 'Emergency (Critical)',
        calcEmgNote: 'For extreme disruption conditions',
        calcBuyBtn: 'Get This Invoice',

        stdPlanTags: 'Multi-Location • Reliable Speed • Perfect for Daily Use',
        stdLocation: 'Connect to 3 Top Countries:',
        stdGb_UK: 'United Kingdom',
        stdGb_SE: 'Sweden',
        stdGb_TR: 'Turkey',
        stdVolumeTitle: 'Volume Based',
        stdVolumeNote: 'Pay per GB (5K/GB)',
        stdUnlimitedTitle: 'Unlimited',
        stdUnlimitedNote: 'No data cap',
        stdSingleUser: 'Single User',
        stdDualUser: 'Dual User',
        stdFooterBadge: 'Best value for everyday use',
        stdExtraGbNote: '5,000 Toman per extra GB',
        stdBuyBtn: 'Get Invoice & Buy Standard',

        proBadge: 'Most Popular',
        proPlanTags: 'Single Location • Static IP • For Trading & Professional Use',
        proExtraGbNote: '10,000 Toman per extra GB',
        proFooterBadge: 'Best pick for trading & sensitive tasks',
        proBuyBtn: 'Get Invoice & Buy Pro',
        proFeats: [
            { title: 'Static IP', subtitle: 'Dedicated Static IP' },
            { title: 'High Speed', subtitle: 'Greater Stability' },
            { title: 'High Security', subtitle: 'Ideal for Online Trading' },
            { title: 'Excellent Uptime', subtitle: 'Around the clock' }
        ],

        emgPlanTags: 'Single Location • Static IP • For Internet Outage Periods',
        emgFooterBadge: 'Your reliable solution in emergency situations',
        emgBuyBtn: 'Get Invoice & Buy Emergency',
        emgFeats: [
            { title: 'High Resistance', subtitle: 'Active even in full blackout' },
            { title: 'Static IP', subtitle: 'VIP Single Location' },
            { title: 'High Stability', subtitle: 'In critical conditions' },
            { title: 'Great for Trading', subtitle: 'And essential tasks' }
        ],

        guaranteeTitle: '100% Money-Back Guarantee',
        guaranteeText: 'If you are not satisfied with the service quality, you can request a full refund within 7 days.',
        guaranteeBadge: 'Quality Assured 💙',

        featuresTitle: '',
        featuresDefault: [
            { title: 'High Speed', text: 'Blazing fast, stable connections with no bandwidth throttling' },
            { title: 'Full Security', text: 'Advanced data encryption with absolute privacy priority' },
            { title: '24/7 Support', text: 'Quick responses and expert support always by your side' },
            { title: 'Guaranteed Quality', text: 'Dedicated servers with the highest uptime and a different experience' }
        ],

        tutSectionTitle: 'Installation & Connection Guide',
        tutDefaultCard: [
            { os: 'Android', app: 'v2rayNG', steps: ['Download v2rayNG from Google Play', 'Copy the link received from support', 'In the app, tap + and select "Import from Clipboard"', 'Tap the Connect button'] },
            { os: 'iPhone (iOS)', app: 'Streisand / V2Box', steps: ['Download Streisand or V2Box from App Store', 'Copy the config link and import it into the app', 'Press the Connect button to establish connection'] },
            { os: 'Windows', app: 'v2rayN', steps: ['Run v2rayN', 'Press Ctrl + V to import the config', 'Enable System Proxy mode'] }
        ],

        revSectionTitle: 'BlueGate User Reviews',
        revDefaultCards: [
            { name: 'AmirReza', rating: 5, text: "The Pro service speed is amazing! I use it for Binance trading without any drops." },
            { name: 'Sara M.', rating: 5, text: "Their Telegram support is very fast and courteous." },
            { name: 'MohammadReza', rating: 5, text: "Emergency service was the only thing that stayed connected during a complete internet blackout." }
        ],

        faqTitle: 'Frequently Asked Questions',
        faqDefaultItems: [
            { q: 'Which devices support the services?', a: 'All services are compatible with Android, iPhone (iOS), Windows, Mac, and Linux.' },
            { q: 'Is the Pro service suitable for trading on Binance?', a: 'Yes, the Pro service has a dedicated static IP and high stability, making it ideal for exchange and trading activities.' },
            { q: 'How does the money-back guarantee work?', a: 'If you are not satisfied with the service quality, you have 7 full days to request a refund — the full amount will be returned to your account.' }
        ],

        compTitle: 'Detailed Comparison of BlueGate Services',
        compFeatureHeader: 'Feature',
        compDefaultRows: [
            { feature: 'IP Type', standard: 'Dynamic (Multi-Location)', pro: 'Static IP', emergency: 'Dedicated VIP Static IP' },
            { feature: 'Server Variety', standard: 'UK, Sweden, Turkey', pro: 'Single Dedicated Location', emergency: 'Single Anti-Sanction Dedicated Location' },
            { feature: 'Suitable for Trading', standard: '—', pro: '✅ Excellent', emergency: '✅ Dedicated' },
            { feature: 'Stability During Full Outage', standard: 'Normal', pro: 'Very High', emergency: '🔥 Maximum (Anti-disruption)' },
            { feature: 'Unlimited Volume Option', standard: '✅ Available', pro: 'Volume Plans', emergency: 'Emergency Volume Plans' }
        ],

        ctaTitle: 'Join the BlueGate Community Now!',
        ctaSubtitle: 'Contact us on Telegram for free consultation, a trial, and fast purchase.',
        ctaChannelLabel: 'Official Channel: ',
        ctaSupportLabel: 'Telegram Support: ',
        footerCopyright: '© 2026 BlueGate Network. All rights reserved.',

        // Receipt / Modal
        receiptTitle: 'Official BlueGate Purchase Invoice',
        receiptTrackLabel: 'Tracking Code:',
        receiptServiceLabel: 'Selected Service:',
        receiptTypeLabel: 'Type / Spec:',
        receiptVolumeLabel: 'Specified Volume:',
        receiptTimeLabel: 'Invoice Timestamp:',
        receiptDiscountPlaceholder: 'Discount code (e.g. BLUE20)',
        receiptApplyBtn: 'Apply Code',
        receiptTotalLabel: 'Total Amount Payable:',
        receiptGuarantee: 'Includes 7-day 100% money-back guarantee',
        receiptSendTgBtn: 'Send Invoice to Support',
        receiptCopyBtn: 'Copy Invoice Text',
        discountInvalidMsg: 'Invalid or expired discount code.',

        // Scanner section
        scannerTitle: 'What does your internet reveal about you?',
        scannerSubtitle: 'Without a VPN, every website sees this information',
        scanLabel_ip: 'IP Address',
        scanLabel_isp: 'Internet Service Provider',
        scanLabel_loc: 'Location',
        scanLabel_os: 'Operating System',
        scanLabel_browser: 'Browser',
        scanLabel_vpn: 'VPN Status',
        scanBadgeDanger: 'Unprotected ⚠️',
        scannerCtaText: 'This information is visible to any website. Hide it with BlueGate.',
        scannerCtaBtn: 'Protect Yourself Now',

        // Speed test section
        speedTitle: 'Connection Speed Test',
        speedSubtitle: 'See what speed BlueGate gives you',
        speedDlLabel: 'Download',
        speedUlLabel: 'Upload',
        speedPingLabel: 'Ping',
        speedReady: 'Ready',
        speedConnecting: 'Connecting...',
        speedTestingDl: 'Testing Download...',
        speedTestingUl: 'Testing Upload...',
        speedDone: '✅ BlueGate is Ready!',
        speedStartBtn: 'Start Speed Test',
        speedRetryBtn: 'Test Again',
        speedNote: 'This is a simulated speed test demonstrating BlueGate capability',

        // Wheel modal
        wheelTitle: 'BlueGate Lucky Wheel',
        wheelSubtitle: 'Spin once and claim your prize!',
        wheelCodeLabel: 'Your discount code:',
        wheelCopyBtn: 'Copy Code',
        wheelHint: 'Enter this code when creating your invoice',
        wheelSpinBtn: 'Spin!',
        wheelTryAgain: 'Try again!',
    };

    // Language Switcher Logic
    let currentLang = localStorage.getItem('bg_app_lang') || 'fa';
    const langToggleBtn = document.getElementById('langToggleBtn');

    function applyEnglishTranslation() {
        const cfg = appConfig || {};
        const en = (cfg.en && typeof cfg.en === 'object') ? cfg.en : {};
        const H = HARDCODED_EN;

        // Page meta
        document.title = (en.site && en.site.title) || H.pageTitle;

        // Status bar
        const statusSpan = document.querySelector('.status-indicator span:last-child');
        if (statusSpan) statusSpan.textContent = H.statusBar;

        // Calc button top bar
        const calcBtnEl = document.getElementById('calculatorToggleBtn');
        if (calcBtnEl) calcBtnEl.innerHTML = `<i class="fa-solid fa-calculator"></i> ${H.calcBtn}`;

        // Announcement bar
        const annTextEl = document.getElementById('announcementText');
        if (annTextEl) {
            const annTxt = (en.announcement && en.announcement.text) || H.annText;
            annTextEl.innerHTML = `<i class="fa-solid fa-bullhorn text-cyan"></i> ${annTxt}`;
        }

        // Hero
        const brandNameEl = document.querySelector('.brand-name');
        if (brandNameEl) brandNameEl.innerHTML = 'Blue<span>Gate</span>';

        const taglineEl = document.querySelector('.brand-tagline');
        if (taglineEl) taglineEl.innerHTML = `<i class="fa-solid fa-shield-halved text-cyan"></i> ${(en.site && en.site.subtitle) || H.heroTagline}`;

        const capsuleEl = document.querySelector('.services-badge span');
        if (capsuleEl) capsuleEl.textContent = (en.site && en.site.capsuleText) || H.heroCapsule;

        const promoLabel = document.querySelector('.promo-badge');
        if (promoLabel) promoLabel.textContent = H.promoLabel;

        const promoTitle = document.querySelector('.promo-text h3');
        if (promoTitle) promoTitle.innerHTML = `${H.promoTitle} <span class="heart">💙</span>`;

        const promoSub = document.querySelector('.promo-text p');
        if (promoSub) promoSub.textContent = H.promoSubtitle;

        // Countdown
        const cdTitleEl = document.getElementById('cdTitleText');
        if (cdTitleEl) cdTitleEl.textContent = (cfg.countdown && cfg.countdown.title) ? cfg.countdown.title : H.countdownTitle;
        const cdHourLabel = document.querySelector('#countdownWidget .digit-box:nth-child(1) small');
        if (cdHourLabel) cdHourLabel.textContent = H.cdHour;
        const cdMinLabel = document.querySelector('#countdownWidget .digit-box:nth-child(3) small');
        if (cdMinLabel) cdMinLabel.textContent = H.cdMin;
        const cdSecLabel = document.querySelector('#countdownWidget .digit-box:nth-child(5) small');
        if (cdSecLabel) cdSecLabel.textContent = H.cdSec;

        // Calculator section
        const calcTitle = document.querySelector('.calc-header h2');
        if (calcTitle) calcTitle.innerHTML = `<i class="fa-solid fa-sliders text-cyan"></i> ${H.calcTitle}`;
        const calcSubtitle = document.querySelector('.calc-header p');
        if (calcSubtitle) calcSubtitle.textContent = H.calcSubtitle;
        const gbLabel = document.querySelector('.calc-slider-group label');
        const gbVal = document.getElementById('gbValue');
        if (gbLabel && gbVal) gbLabel.innerHTML = `Data Needed: <span id="gbValue" class="text-cyan font-bold">${gbVal.textContent}</span> GB`;
        const stdResplan = document.querySelector('.calc-res-item.standard .res-plan');
        if (stdResplan) stdResplan.textContent = H.calcStdPlan;
        const stdResNote = document.querySelector('.calc-res-item.standard small');
        if (stdResNote) stdResNote.textContent = H.calcStdNote;
        const proResplan = document.querySelector('.calc-res-item.pro .res-plan');
        if (proResplan) proResplan.textContent = H.calcProPlan;
        const proResNote = document.querySelector('.calc-res-item.pro small');
        if (proResNote) proResNote.textContent = H.calcProNote;
        const emgResplan = document.querySelector('.calc-res-item.emergency .res-plan');
        if (emgResplan) emgResplan.textContent = H.calcEmgPlan;
        const emgResNote = document.querySelector('.calc-res-item.emergency small');
        if (emgResNote) emgResNote.textContent = H.calcEmgNote;
        document.querySelectorAll('.btn-calc-buy').forEach(b => b.textContent = H.calcBuyBtn);

        // Standard card
        const stdCard = document.querySelector('.pricing-card.card-standard');
        if (stdCard) {
            const tags = stdCard.querySelector('.plan-tags');
            if (tags) tags.textContent = H.stdPlanTags;
            const locTitle = stdCard.querySelector('.loc-title');
            if (locTitle) locTitle.innerHTML = `<i class="fa-solid fa-globe"></i> ${H.stdLocation}`;
            const flagChips = stdCard.querySelectorAll('.flag-chip span:not(.flag-icon):not(.ping)');
            const names = [H.stdGb_UK, H.stdGb_SE, H.stdGb_TR];
            flagChips.forEach((s, i) => { if (names[i]) s.textContent = names[i]; });
            const volBlockTitle = stdCard.querySelector('.sub-block-title.green span:first-of-type');
            if (volBlockTitle) volBlockTitle.textContent = 'Volume';
            const volBlockNote = stdCard.querySelector('.sub-block-title.green .sub-note');
            if (volBlockNote) volBlockNote.textContent = H.stdVolumeNote;
            const unlimTitle = stdCard.querySelector('.sub-pricing-block:last-child .sub-block-title span:first-of-type');
            if (unlimTitle) unlimTitle.textContent = 'Unlimited';
            const unlimNote = stdCard.querySelector('.sub-pricing-block:last-child .sub-block-title .sub-note');
            if (unlimNote) unlimNote.textContent = H.stdUnlimitedNote;
            const extraNote = stdCard.querySelector('.std-note span');
            if (extraNote) extraNote.textContent = H.stdExtraGbNote;
            const footBadge = stdCard.querySelector('.footer-badge span');
            if (footBadge) footBadge.textContent = H.stdFooterBadge;
            const buyBtn = stdCard.querySelector('.buy-btn-action');
            if (buyBtn) buyBtn.innerHTML = `<i class="fa-solid fa-receipt"></i> ${H.stdBuyBtn}`;
            // Translate unlimited box labels
            stdCard.querySelectorAll('.unlimited-box .u-user').forEach(u => {
                if (u.innerHTML.includes('fa-users')) u.innerHTML = u.innerHTML.replace(/دو کاربره|2 users?/i, 'Dual User');
                else u.innerHTML = u.innerHTML.replace(/تک کاربر|single user/i, 'Single User');
            });
        }

        // Pro card
        const proCard = document.querySelector('.pricing-card.card-pro');
        if (proCard) {
            const ribbon = proCard.querySelector('.featured-ribbon');
            if (ribbon) ribbon.textContent = 'Most Popular';
            const tags = proCard.querySelector('.plan-tags');
            if (tags) tags.textContent = H.proPlanTags;
            const extraNote = proCard.querySelector('.pro-note span');
            if (extraNote) extraNote.textContent = H.proExtraGbNote;
            const footBadge = proCard.querySelector('.footer-badge span');
            if (footBadge) footBadge.textContent = H.proFooterBadge;
            const buyBtn = proCard.querySelector('.buy-btn-action');
            if (buyBtn) buyBtn.innerHTML = `<i class="fa-solid fa-receipt"></i> ${H.proBuyBtn}`;
            // Feature pills – only translate if NOT already injected by admin config
            const featGrid = proCard.querySelector('.pro-features-grid');
            const proFeats = (en.plans && en.plans[1] && en.plans[1].pills) ? en.plans[1].pills : H.proFeats;
            if (featGrid) {
                const pills = featGrid.querySelectorAll('.feat-pill .fp-text');
                proFeats.forEach((f, i) => {
                    if (pills[i]) {
                        const t = pills[i].querySelector('strong');
                        const s = pills[i].querySelector('small');
                        if (t) t.textContent = f.title;
                        if (s) s.textContent = f.subtitle;
                    }
                });
            }
        }

        // Emergency card
        const emgCard = document.querySelector('.pricing-card.card-emergency');
        if (emgCard) {
            const tags = emgCard.querySelector('.plan-tags');
            if (tags) tags.textContent = H.emgPlanTags;
            const footBadge = emgCard.querySelector('.footer-badge span');
            if (footBadge) footBadge.textContent = H.emgFooterBadge;
            const buyBtn = emgCard.querySelector('.buy-btn-action');
            if (buyBtn) buyBtn.innerHTML = `<i class="fa-solid fa-receipt"></i> ${H.emgBuyBtn}`;
            const featGrid = emgCard.querySelector('.pro-features-grid');
            const emgFeats = (en.plans && en.plans[2] && en.plans[2].pills) ? en.plans[2].pills : H.emgFeats;
            if (featGrid) {
                const pills = featGrid.querySelectorAll('.feat-pill .fp-text');
                emgFeats.forEach((f, i) => {
                    if (pills[i]) {
                        const t = pills[i].querySelector('strong');
                        const s = pills[i].querySelector('small');
                        if (t) t.textContent = f.title;
                        if (s) s.textContent = f.subtitle;
                    }
                });
            }
        }

        // Guarantee bar
        const gTitle = document.querySelector('.g-content h3');
        if (gTitle) gTitle.textContent = H.guaranteeTitle;
        const gText = document.querySelector('.g-content p');
        if (gText) gText.textContent = H.guaranteeText;
        const gBadge = document.querySelector('.g-badge-gold');
        if (gBadge) gBadge.textContent = H.guaranteeBadge;

        // Features / Pillars
        const pillarCards = document.querySelectorAll('.pillar-card');
        const feats = (en.features && en.features.length >= 4) ? en.features : H.featuresDefault;
        pillarCards.forEach((card, i) => {
            if (!feats[i]) return;
            const t = card.querySelector('h4');
            const d = card.querySelector('p');
            if (t) t.textContent = feats[i].title;
            if (d) d.textContent = feats[i].text;
        });

        // Tutorials section title
        const tutTitle = document.querySelector('.tutorials-panel .section-title');
        if (tutTitle) tutTitle.innerHTML = `<i class="fa-solid fa-book-bookmark text-cyan"></i> ${H.tutSectionTitle}`;

        // Tutorials cards — use admin-configured EN or hardcoded default
        const tutGrid = document.querySelector('.tutorials-grid');
        if (tutGrid) {
            const tutData = (en.tutorials && en.tutorials.length > 0) ? en.tutorials : H.tutDefaultCard;
            tutGrid.innerHTML = tutData.map(t => `
                <div class="tutorial-card glass-panel">
                    <h4>${escHtml(t.os)}</h4>
                    <small>Recommended app: ${escHtml(t.app)}</small>
                    <ol>${(t.steps || []).map(s => `<li>${escHtml(s)}</li>`).join('')}</ol>
                </div>
            `).join('');
        }

        // Reviews section title
        const revTitle = document.querySelector('.reviews-panel .section-title');
        if (revTitle) revTitle.innerHTML = `<i class="fa-solid fa-comments text-purple"></i> ${H.revSectionTitle}`;

        // Review cards
        const revGrid = document.querySelector('.reviews-grid');
        if (revGrid) {
            const revData = (en.reviews && en.reviews.length > 0) ? en.reviews : H.revDefaultCards;
            revGrid.innerHTML = revData.map(r => `
                <div class="review-card glass-panel">
                    <div class="review-header">
                        <strong>${escHtml(r.name)}</strong>
                        <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
                    </div>
                    <p>${escHtml(r.text)}</p>
                </div>
            `).join('');
        }

        // FAQ section
        const faqTitle = document.querySelector('.faq-title');
        if (faqTitle) faqTitle.innerHTML = `<i class="fa-solid fa-circle-question text-cyan"></i> ${H.faqTitle}`;
        const faqList = document.querySelector('.faq-list');
        if (faqList) {
            const faqData = (en.faq && en.faq.length > 0) ? en.faq : H.faqDefaultItems;
            faqList.innerHTML = faqData.map(f => `
                <div class="faq-item glass-panel">
                    <div class="faq-q">
                        <span><i class="fa-solid fa-circle-question text-cyan"></i> ${escHtml(f.q)}</span>
                        <i class="fa-solid fa-chevron-down faq-arrow"></i>
                    </div>
                    <div class="faq-a hidden"><p>${escHtml(f.a)}</p></div>
                </div>
            `).join('');
        }

        // Comparison table
        const compTitle = document.querySelector('.comp-title');
        if (compTitle) compTitle.innerHTML = `<i class="fa-solid fa-table-columns"></i> ${H.compTitle}`;
        const compHead = document.querySelector('.comp-table thead th');
        if (compHead) compHead.textContent = H.compFeatureHeader;
        const compTbody = document.querySelector('.comp-table tbody');
        if (compTbody) {
            const compData = (en.comparison && en.comparison.length > 0) ? en.comparison : H.compDefaultRows;
            compTbody.innerHTML = compData.map(c => `
                <tr>
                    <td><strong>${escHtml(c.feature)}</strong></td>
                    <td>${escHtml(c.standard)}</td>
                    <td>${escHtml(c.pro)}</td>
                    <td>${escHtml(c.emergency)}</td>
                </tr>
            `).join('');
        }

        // Footer CTA
        const ctaTitleEl = document.querySelector('.cta-title');
        if (ctaTitleEl) ctaTitleEl.textContent = (cfg.telegram && cfg.telegram.joinBtnText_en) || H.ctaTitle;
        const ctaSubEl = document.querySelector('.cta-subtitle');
        if (ctaSubEl) ctaSubEl.textContent = H.ctaSubtitle;

        const mainTgSpan = document.querySelector('.tg-btn.main-tg span');
        if (mainTgSpan) {
            const handle = mainTgSpan.querySelector('strong') ? mainTgSpan.querySelector('strong').textContent : '@BlueGate';
            mainTgSpan.innerHTML = `${H.ctaChannelLabel}<strong>${handle}</strong>`;
        }
        const supportTgSpan = document.querySelector('.tg-btn.support-tg span');
        if (supportTgSpan) {
            const handle = supportTgSpan.querySelector('strong') ? supportTgSpan.querySelector('strong').textContent : '@BlueGateSupport';
            supportTgSpan.innerHTML = `${H.ctaSupportLabel}<strong>${handle}</strong>`;
        }

        const footCopy = document.querySelector('.sub-footer p');
        if (footCopy) footCopy.textContent = H.footerCopyright;

        // Receipt modal
        const recTitle = document.querySelector('.receipt-title-box h2');
        if (recTitle) recTitle.textContent = H.receiptTitle;
        document.querySelectorAll('.receipt-row .label').forEach((l, i) => {
            const labels = [H.receiptServiceLabel, H.receiptTypeLabel, H.receiptVolumeLabel, H.receiptTimeLabel];
            if (labels[i] !== undefined) {
                const icon = l.querySelector('i');
                l.innerHTML = (icon ? icon.outerHTML + ' ' : '') + labels[i];
            }
        });
        const discInput = document.getElementById('receiptDiscountInput');
        if (discInput) discInput.placeholder = H.receiptDiscountPlaceholder;
        const applyBtn = document.getElementById('applyDiscountBtn');
        if (applyBtn) applyBtn.textContent = H.receiptApplyBtn;
        const totalLabel = document.querySelector('.receipt-total-box span');
        if (totalLabel) totalLabel.textContent = H.receiptTotalLabel;
        const guaranteeNote = document.querySelector('.receipt-guarantee-note span');
        if (guaranteeNote) guaranteeNote.textContent = H.receiptGuarantee;
        const copyBtn = document.getElementById('copyReceiptBtn');
        if (copyBtn) copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> ${H.receiptCopyBtn}`;
        const sendTgBtn = document.getElementById('sendTelegramBtn');
        if (sendTgBtn) {
            const supportHandle = (cfg.telegram && cfg.telegram.supportHandle) || '@BlueGateSupport';
            sendTgBtn.innerHTML = `<i class="fa-brands fa-telegram"></i> ${H.receiptSendTgBtn} (${supportHandle})`;
        }

        // ── Scanner section ────────────────────────────────────────────────
        const scannerTitleEl = document.getElementById('scannerTitle');
        if (scannerTitleEl) scannerTitleEl.textContent = (en.scanner && en.scanner.title) || H.scannerTitle;
        const scannerSubEl = document.querySelector('.scanner-subtitle');
        if (scannerSubEl) scannerSubEl.textContent = H.scannerSubtitle;

        const scanLabelMap = [
            { id: 'scan-ip',      text: H.scanLabel_ip },
            { id: 'scan-isp',     text: H.scanLabel_isp },
            { id: 'scan-loc',     text: H.scanLabel_loc },
            { id: 'scan-os',      text: H.scanLabel_os },
            { id: 'scan-browser', text: H.scanLabel_browser },
            { id: 'scan-vpn',     text: H.scanLabel_vpn },
        ];
        scanLabelMap.forEach(({ id, text }) => {
            const valEl = document.getElementById(id);
            if (!valEl) return;
            const row = valEl.closest('.scanner-row');
            if (!row) return;
            const labelEl = row.querySelector('.scan-label');
            if (labelEl) {
                const icon = labelEl.querySelector('i');
                labelEl.innerHTML = (icon ? icon.outerHTML + ' ' : '') + text;
            }
        });
        // VPN status badge
        const vpnEl = document.getElementById('scan-vpn');
        if (vpnEl) {
            const badge = vpnEl.querySelector('.scan-badge');
            if (badge) badge.textContent = H.scanBadgeDanger;
        }
        const scanCtaText = document.querySelector('.scanner-cta-text');
        if (scanCtaText) {
            const icon = scanCtaText.querySelector('i');
            scanCtaText.innerHTML = (icon ? icon.outerHTML + ' ' : '') + H.scannerCtaText;
        }
        const scanCtaBtn = document.querySelector('.scanner-buy-btn');
        if (scanCtaBtn) scanCtaBtn.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${H.scannerCtaBtn}`;

        // ── Speed test section ─────────────────────────────────────────────
        const speedTitleEl = document.querySelector('.speed-panel .section-title');
        if (speedTitleEl) speedTitleEl.innerHTML = `<i class="fa-solid fa-gauge-high text-cyan"></i> ${H.speedTitle}`;
        const speedSubEl = document.querySelector('.speed-subtitle');
        if (speedSubEl) speedSubEl.textContent = H.speedSubtitle;
        const gaugeReadyEl = document.getElementById('gaugeLabel');
        if (gaugeReadyEl && gaugeReadyEl.textContent === 'آماده') gaugeReadyEl.textContent = H.speedReady;
        // Stat labels
        const statItems = document.querySelectorAll('.speed-stat-item small');
        const statLabels = [H.speedDlLabel, H.speedUlLabel, H.speedPingLabel];
        statItems.forEach((s, i) => { if (statLabels[i]) s.textContent = statLabels[i]; });
        // Start button (only if not mid-test)
        const speedBtn = document.getElementById('speedStartBtn');
        if (speedBtn && !speedBtn.disabled) {
            const icon = speedBtn.querySelector('i');
            speedBtn.innerHTML = (icon ? icon.outerHTML + ' ' : '<i class="fa-solid fa-play"></i> ') + H.speedStartBtn;
        }
        const speedNoteEl = document.getElementById('speedNote');
        if (speedNoteEl) speedNoteEl.textContent = H.speedNote;

        // ── Wheel modal ────────────────────────────────────────────────────
        const wheelTitleEl = document.querySelector('.wheel-header h2');
        if (wheelTitleEl) wheelTitleEl.textContent = H.wheelTitle;
        const wheelSubEl = document.querySelector('.wheel-header p');
        if (wheelSubEl) wheelSubEl.textContent = H.wheelSubtitle;
        const wheelCodeLabelEl = document.querySelector('.wheel-code-label');
        if (wheelCodeLabelEl) wheelCodeLabelEl.textContent = H.wheelCodeLabel;
        const wheelCopyEl = document.getElementById('wheelCopyBtn');
        if (wheelCopyEl) wheelCopyEl.innerHTML = `<i class="fa-solid fa-copy"></i> ${H.wheelCopyBtn}`;
        const wheelHintEl = document.querySelector('.wheel-hint');
        if (wheelHintEl) wheelHintEl.textContent = H.wheelHint;
        const wheelSpinEl = document.getElementById('wheelSpinBtn');
        if (wheelSpinEl) wheelSpinEl.innerHTML = `<i class="fa-solid fa-dharmachakra"></i> ${H.wheelSpinBtn}`;
    }

    function updateLanguageUI(lang) {
        currentLang = lang;
        localStorage.setItem('bg_app_lang', lang);
        const isEn = (lang === 'en');
        document.documentElement.dir = isEn ? 'ltr' : 'rtl';
        document.documentElement.lang = isEn ? 'en' : 'fa';

        if (langToggleBtn) {
            langToggleBtn.innerHTML = isEn
                ? '<i class="fa-solid fa-globe"></i> فارسی'
                : '<i class="fa-solid fa-globe"></i> English';
        }

        if (isEn) {
            applyEnglishTranslation();
        } else {
            // Restore Persian: re-apply config which overwrites everything back to FA
            if (appConfig) {
                applyConfigToPlantedLayout(appConfig);
            } else {
                // Reload the page to fully restore default Persian HTML
                window.location.reload();
            }
        }
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = (currentLang === 'fa') ? 'en' : 'fa';
            updateLanguageUI(nextLang);
        });
    }

    // Restore language from previous session
    if (currentLang === 'en') {
        // Wait for config to load, then apply
        setTimeout(() => updateLanguageUI('en'), 500);
    }

    // Calculator Toggle (Default Closed)
    const calcBtn = document.getElementById('calculatorToggleBtn');
    const calcSection = document.getElementById('calculatorSection');
    if (calcBtn && calcSection) {
        calcSection.classList.add('hidden'); // Closed by default
        calcBtn.addEventListener('click', () => {
            calcSection.classList.toggle('hidden');
            if (!calcSection.classList.contains('hidden')) {
                calcSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Poster Mode Toggle
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('poster-mode');
            if (document.body.classList.contains('poster-mode')) {
                viewToggleBtn.innerHTML = '<i class="fa-solid fa-compress"></i> خروج از پوستر';
            } else {
                viewToggleBtn.innerHTML = '<i class="fa-solid fa-expand"></i> حالت پوستر';
            }
        });
    }

    // Modal Close Listeners
    const modal = document.getElementById('receiptModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const copyReceiptBtn = document.getElementById('copyReceiptBtn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }
    if (copyReceiptBtn) {
        copyReceiptBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(currentReceiptText).then(() => {
                showToast('متن فاکتور با موفقیت کپی شد!');
            }).catch(() => {
                showToast('خطا در کپی متن!');
            });
        });
    }

    // Discount Code Application
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    const receiptDiscountInput = document.getElementById('receiptDiscountInput');
    const discountMsg = document.getElementById('discountMsg');

    if (applyDiscountBtn && receiptDiscountInput) {
        applyDiscountBtn.addEventListener('click', () => {
            const code = receiptDiscountInput.value.trim().toUpperCase();
            const codes = appConfig?.discountCodes || {};

            if (code && codes[code]) {
                activeDiscountPercent = codes[code];
                const newPrice = Math.round(basePriceValue * (1 - activeDiscountPercent / 100));
                document.getElementById('receiptTotal').textContent = formatToman(newPrice) + ` (${activeDiscountPercent}٪ تخفیف)`;
                discountMsg.textContent = `کد تخفیف ${code} (${activeDiscountPercent}٪) اعمال گردید!`;
                discountMsg.className = 'text-green mt-1';
                discountMsg.classList.remove('hidden');
                showToast(`کد تخفیف ${activeDiscountPercent}٪ اعمال شد!`);
            } else {
                discountMsg.textContent = 'کد تخفیف نامعتبر یا منقضی شده است.';
                discountMsg.className = 'text-purple mt-1';
                discountMsg.classList.remove('hidden');
            }
        });
    }

    // Dynamic Range Calculator Logic
    const gbRange = document.getElementById('gbRange');
    const gbValue = document.getElementById('gbValue');
    const calcPriceStandard = document.getElementById('calcPriceStandard');
    const calcPricePro = document.getElementById('calcPricePro');
    const calcPriceEmergency = document.getElementById('calcPriceEmergency');

    if (gbRange) {
        gbRange.addEventListener('input', (e) => {
            const gb = parseInt(e.target.value);
            gbValue.textContent = gb;

            const priceStd = gb * 5000;
            let pricePro = (gb <= 5) ? 69000 : (gb <= 10) ? 139000 : (gb <= 15) ? 195000 : (gb <= 20) ? 249000 : (gb <= 25) ? 289000 : 289000 + (gb - 25) * 10000;
            let priceEmerg = (gb <= 5) ? 195000 : (gb <= 10) ? 390000 : (gb <= 15) ? 585000 : (gb <= 20) ? 780000 : 780000 + (gb - 20) * 39000;

            calcPriceStandard.textContent = formatToman(priceStd);
            calcPricePro.textContent = formatToman(pricePro);
            calcPriceEmergency.textContent = formatToman(priceEmerg);
        });
    }

    // Initialize Global Event Delegation (Plans & FAQ)
    initDelegatedListeners();

    // Start Countdown immediately with default end date (2026-08-10) until config loads
    startCountdownTimer('2026-08-10T23:59:59');

    // Load config (from network and fallback storage)
    loadConfig();

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'previewConfig' && event.data.config) {
            appConfig = event.data.config;
            applyConfigToPlantedLayout(appConfig);
        }
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'bg_app_config' && event.newValue) {
            try {
                appConfig = JSON.parse(event.newValue);
                applyConfigToPlantedLayout(appConfig);
            } catch(e) {}
        }
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js').catch(function(err) {
                console.log('SW registration error:', err);
            });
        });
    }
});

// Event Delegation for Pricing Card Selections, Buy Buttons & FAQ Items
function initDelegatedListeners() {
    document.addEventListener('click', (e) => {
        // 1. Handle Selection of Plan Rows (.selectable)
        const selectableRow = e.target.closest('.selectable');
        if (selectableRow) {
            const card = selectableRow.closest('.pricing-card');
            if (card) {
                const allSelectables = card.querySelectorAll('.selectable');
                allSelectables.forEach(r => {
                    r.classList.remove('active');
                    const indicator = r.querySelector('.select-indicator i');
                    if (indicator) indicator.className = 'fa-solid fa-circle';
                });

                selectableRow.classList.add('active');
                const indicator = selectableRow.querySelector('.select-indicator i');
                if (indicator) indicator.className = 'fa-solid fa-circle-check';
                return;
            }
        }

        // 2. Handle Buy Buttons (.buy-btn-action)
        const buyBtn = e.target.closest('.buy-btn-action');
        if (buyBtn) {
            const plan = buyBtn.getAttribute('data-plan') || 'BlueGate';
            const card = buyBtn.closest('.pricing-card');
            
            // Find active row in card, or fallback to first selectable row
            let activeRow = card ? card.querySelector('.selectable.active') : null;
            if (!activeRow && card) {
                activeRow = card.querySelector('.selectable');
                if (activeRow) activeRow.classList.add('active');
            }

            let gb = '۲۰ گیگ';
            let price = '۲۴۹,۰۰۰ تومان';
            let priceNum = 249000;
            let type = 'سرویس اختصاصی';

            if (activeRow) {
                gb = activeRow.getAttribute('data-gb') || gb;
                price = activeRow.getAttribute('data-price') || price;
                const rawPriceNum = activeRow.getAttribute('data-price-num');
                if (rawPriceNum && !isNaN(parseInt(rawPriceNum))) {
                    priceNum = parseInt(rawPriceNum);
                } else if (price) {
                    priceNum = parseInt(String(price).replace(/[^0-9]/g, '')) || priceNum;
                }
                type = activeRow.getAttribute('data-type') || type;
            }

            openReceiptModal(plan, type, gb, price, priceNum);
            return;
        }

        // 3. Handle FAQ Toggle (.faq-q)
        const faqQ = e.target.closest('.faq-q');
        if (faqQ) {
            const item = faqQ.parentElement;
            if (item) {
                const ans = item.querySelector('.faq-a');
                if (ans) ans.classList.toggle('hidden');
                const arrow = item.querySelector('.faq-arrow');
                if (arrow) arrow.classList.toggle('rotate');
            }
            return;
        }
    });
}

function loadConfig() {
    // 1. Instantly apply LocalStorage config if available (for local dev/preview)
    const localCfgStr = localStorage.getItem('bg_app_config');
    if (localCfgStr) {
        try {
            const localCfg = JSON.parse(localCfgStr);
            if (localCfg && typeof localCfg === 'object') {
                appConfig = localCfg;
                applyConfigToPlantedLayout(localCfg);
            }
        } catch(e) {}
    }

    // 2. Fetch fresh network config.json and ALWAYS apply it so live published edits show
    fetch('config.json?v=' + Date.now())
        .then(res => {
            if (!res.ok) throw new Error('HTTP status ' + res.status);
            return res.json();
        })
        .then(data => {
            if (data && typeof data === 'object') {
                appConfig = data;
                applyConfigToPlantedLayout(data);
            }
        })
        .catch(err => {
            console.warn('Network config.json load note:', err);
            if (!appConfig) {
                appConfig = {};
                applyConfigToPlantedLayout(appConfig);
            }
        });
}

function applyConfigToPlantedLayout(cfg) {
    if (!cfg) return;

    // Section Visibility Toggles
    if (cfg.sections) {
        const tutSec = document.getElementById('tutorialsSection');
        if (tutSec) tutSec.classList.toggle('hidden', cfg.sections.tutorials === false);

        const revSec = document.getElementById('reviewsSection');
        if (revSec) revSec.classList.toggle('hidden', cfg.sections.reviews === false);

        const faqSec = document.getElementById('faqSection');
        if (faqSec) faqSec.classList.toggle('hidden', cfg.sections.faq === false);

        const compSec = document.querySelector('.comparison-section');
        if (compSec) compSec.classList.toggle('hidden', cfg.sections.comparison === false);

        const calcSec = document.getElementById('calculatorSection');
        const calcBtn = document.getElementById('calculatorToggleBtn');
        if (calcSec) calcSec.classList.add('hidden');
        if (calcBtn) calcBtn.classList.toggle('hidden', cfg.sections.calculator === false);
    }

    // Site Info
    if (cfg.site) {
        if (cfg.site.title) document.title = cfg.site.title;
        
        const brandNameEl = document.querySelector('.brand-name');
        if (brandNameEl && cfg.site.brandName) {
            brandNameEl.innerHTML = escHtml(cfg.site.brandName).replace('Gate', '<span>Gate</span>');
        }

        const taglineEl = document.querySelector('.brand-tagline');
        if (taglineEl && cfg.site.subtitle) {
            taglineEl.innerHTML = `<i class="fa-solid fa-shield-halved text-cyan"></i> ${escHtml(cfg.site.subtitle)}`;
        }

        const capsuleEl = document.querySelector('.services-badge span');
        if (capsuleEl && cfg.site.capsuleText) {
            capsuleEl.textContent = cfg.site.capsuleText;
        }

        const promoTextEl = document.querySelector('.promo-text h3');
        if (promoTextEl && cfg.site.giftBadgeText) {
            promoTextEl.innerHTML = escHtml(cfg.site.giftBadgeText).replace(/\n/g, ' ') + ' <span class="heart">💙</span>';
        }

        if (cfg.site.logoBase64) {
            const logos = document.querySelectorAll('.brand-logo, .receipt-logo');
            logos.forEach(img => img.src = cfg.site.logoBase64);
        }
    }

    // Announcement Ticker
    const annBar = document.getElementById('announcementBar');
    const annText = document.getElementById('announcementText');
    if (annBar && cfg.announcement) {
        if (cfg.announcement.enabled && cfg.announcement.text) {
            annText.innerHTML = `<i class="fa-solid fa-bullhorn text-cyan"></i> ${escHtml(cfg.announcement.text)}`;
            annBar.classList.remove('hidden');
        } else {
            annBar.classList.add('hidden');
        }
    }

    // Countdown Timer Widget
    const cdWidget = document.getElementById('countdownWidget');
    if (cdWidget && cfg.countdown && cfg.countdown.endDate) {
        cdWidget.classList.remove('hidden');
        const cdTitleText = document.getElementById('cdTitleText');
        if (cdTitleText && cfg.countdown.title) cdTitleText.textContent = cfg.countdown.title;

        startCountdownTimer(cfg.countdown.endDate);
    }

    // Refund Banner
    if (cfg.refundBanner) {
        const gContentEl = document.querySelector('.g-content p');
        if (gContentEl) gContentEl.textContent = cfg.refundBanner;
    }

    // Telegram Info
    if (cfg.telegram) {
        const tg = cfg.telegram;
        const mainTgBtn = document.querySelector('.tg-btn.main-tg');
        if (mainTgBtn) {
            if (tg.channelUrl) mainTgBtn.href = tg.channelUrl;
            if (tg.channelHandle) mainTgBtn.querySelector('strong').textContent = tg.channelHandle;
        }

        const supportTgBtn = document.querySelector('.tg-btn.support-tg');
        if (supportTgBtn) {
            if (tg.supportUrl) supportTgBtn.href = tg.supportUrl;
            if (tg.supportHandle) supportTgBtn.querySelector('strong').textContent = tg.supportHandle;
        }

        const ctaTitleEl = document.querySelector('.cta-title');
        if (ctaTitleEl && tg.joinBtnText) {
            ctaTitleEl.textContent = tg.joinBtnText;
        }
    }

    // Features Pillars
    if (cfg.features && Array.isArray(cfg.features) && cfg.features.length >= 4) {
        const pillarCards = document.querySelectorAll('.pillar-card');
        cfg.features.slice(0, 4).forEach((f, i) => {
            if (pillarCards[i]) {
                const titleEl = pillarCards[i].querySelector('h4');
                const descEl = pillarCards[i].querySelector('p');
                if (titleEl) titleEl.textContent = f.title;
                if (descEl) descEl.textContent = f.text;
            }
        });
    }

    // Plans Update with Robust Index Fallback
    if (cfg.plans && Array.isArray(cfg.plans)) {
        const cards = document.querySelectorAll('.pricing-card');

        cfg.plans.forEach((plan, planIdx) => {
            const planId = (plan.id || plan.title || '').toLowerCase();
            let card = null;

            if (planId.includes('standard') || planId.includes('economy')) {
                card = document.querySelector('.pricing-card.card-standard');
            } else if (planId.includes('pro') || planId.includes('tunnel')) {
                card = document.querySelector('.pricing-card.card-pro');
            } else if (planId.includes('emergency') || planId.includes('national')) {
                card = document.querySelector('.pricing-card.card-emergency');
            }

            // Fallback by index if title/id didn't match English keywords
            if (!card && cards[planIdx]) {
                card = cards[planIdx];
            }

            if (card) {
                const titleEl = card.querySelector('.plan-title');
                if (titleEl && plan.title) {
                    titleEl.innerHTML = escHtml(plan.title);
                }

                const tagsEl = card.querySelector('.plan-tags');
                if (tagsEl && plan.subtitle) {
                    tagsEl.textContent = plan.subtitle;
                }

                const noteEl = card.querySelector('.extra-gb-info span');
                if (noteEl && plan.note) {
                    noteEl.textContent = plan.note;
                }

                // Feature Pills Update
                if (plan.pills && Array.isArray(plan.pills) && plan.pills.length > 0) {
                    const featGrid = card.querySelector('.pro-features-grid');
                    if (featGrid) {
                        featGrid.innerHTML = plan.pills.map(p => `
                            <div class="feat-pill">
                                <i class="${escHtml(p.icon || 'fa-solid fa-star text-cyan')}"></i>
                                <div class="fp-text">
                                    <strong>${escHtml(p.title || '')}</strong>
                                    <small>${escHtml(p.subtitle || '')}</small>
                                </div>
                            </div>
                        `).join('');
                    }
                }

                if (plan.options && Array.isArray(plan.options)) {
                    const priceList = card.querySelector('.price-list');
                    if (priceList) {
                        const iconClass = card.classList.contains('card-standard') ? '' : card.classList.contains('card-pro') ? 'purple' : 'blue';
                        priceList.innerHTML = plan.options.map((opt, idx) => {
                            const volStr = opt.volume || opt.label || '۲۰ گیگ';
                            const numPrice = typeof opt.price === 'number' ? opt.price : (parseInt(String(opt.price || '').replace(/[^0-9]/g, '')) || 0);
                            const priceStr = formatToman(numPrice);
                            const typeStr = plan.subtitle || plan.title || 'سرویس اختصاصی';
                            return `
                                <div class="price-row selectable ${idx === 0 ? 'active' : ''}" data-gb="${escHtml(volStr)}" data-price="${escHtml(priceStr)}" data-price-num="${numPrice}" data-type="${escHtml(typeStr)}">
                                    <div class="gb-badge ${iconClass}"><i class="fa-solid fa-cube"></i> ${escHtml(volStr)}</div>
                                    <div class="price-val">${escHtml(priceStr)}</div>
                                    <div class="select-indicator"><i class="fa-solid ${idx === 0 ? 'fa-circle-check' : 'fa-circle'}"></i></div>
                                </div>
                            `;
                        }).join('');
                    }
                }

                if (plan.unlimitedOptions && Array.isArray(plan.unlimitedOptions)) {
                    const unlimitedGrid = card.querySelector('.unlimited-grid');
                    if (unlimitedGrid) {
                        unlimitedGrid.innerHTML = plan.unlimitedOptions.map((opt) => {
                            const volStr = opt.volume || opt.label || 'نامحدود';
                            const numPrice = typeof opt.price === 'number' ? opt.price : (parseInt(String(opt.price || '').replace(/[^0-9]/g, '')) || 0);
                            const priceStr = formatToman(numPrice);
                            const userIcon = volStr.includes('دو') ? '<i class="fa-solid fa-users"></i>' : '<i class="fa-solid fa-user"></i>';
                            return `
                                <div class="unlimited-box selectable" data-gb="${escHtml(volStr)}" data-price="${escHtml(priceStr)}" data-price-num="${numPrice}" data-type="نامحدود">
                                    <div class="u-user">${userIcon} ${escHtml(volStr)}</div>
                                    <div class="u-price">${escHtml(priceStr)}</div>
                                </div>
                            `;
                        }).join('');
                    }
                }
            }
        });
    }

    // Tutorials Render
    if (cfg.tutorials && Array.isArray(cfg.tutorials) && cfg.tutorials.length > 0) {
        const tutGrid = document.querySelector('.tutorials-grid');
        if (tutGrid) {
            tutGrid.innerHTML = cfg.tutorials.map(t => `
                <div class="tutorial-card glass-panel">
                    <h4>${escHtml(t.os)}</h4>
                    <small>برنامه پیشنهاد شده: ${escHtml(t.app)}</small>
                    <ol>
                        ${(t.steps || []).map(s => `<li>${escHtml(s)}</li>`).join('')}
                    </ol>
                </div>
            `).join('');
        }
    }

    // Reviews Render
    if (cfg.reviews && Array.isArray(cfg.reviews) && cfg.reviews.length > 0) {
        const revGrid = document.querySelector('.reviews-grid');
        if (revGrid) {
            revGrid.innerHTML = cfg.reviews.map(r => `
                <div class="review-card glass-panel">
                    <div class="review-header">
                        <strong>${escHtml(r.name)}</strong>
                        <div class="review-stars">
                            ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}
                        </div>
                    </div>
                    <p>${escHtml(r.text)}</p>
                </div>
            `).join('');
        }
    }

    // FAQ Render
    if (cfg.faq && Array.isArray(cfg.faq) && cfg.faq.length > 0) {
        const listEl = document.querySelector('.faq-list');
        if (listEl) {
            listEl.innerHTML = cfg.faq.map(f => `
                <div class="faq-item glass-panel">
                    <div class="faq-q">
                        <span><i class="fa-solid fa-circle-question text-cyan"></i> ${escHtml(f.q)}</span>
                        <i class="fa-solid fa-chevron-down faq-arrow"></i>
                    </div>
                    <div class="faq-a hidden">
                        <p>${escHtml(f.a)}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Comparison Table Render
    if (cfg.comparison && Array.isArray(cfg.comparison) && cfg.comparison.length > 0) {
        const compTbody = document.querySelector('.comp-table tbody');
        if (compTbody) {
            compTbody.innerHTML = cfg.comparison.map(c => `
                <tr>
                    <td><strong>${escHtml(c.feature)}</strong></td>
                    <td>${escHtml(c.standard)}</td>
                    <td>${escHtml(c.pro)}</td>
                    <td>${escHtml(c.emergency)}</td>
                </tr>
            `).join('');
        }
    }

    // ── Restore Persian for Scanner ────────────────────────────────────────
    const scannerTitleEl = document.getElementById('scannerTitle');
    if (scannerTitleEl) {
        const title = (cfg.interactive && cfg.interactive.scanner && cfg.interactive.scanner.title)
            || 'اینترنت شما چه اطلاعاتی درباره‌تان فاش می‌کند؟';
        scannerTitleEl.textContent = title;
    }
    const scannerSubEl = document.querySelector('.scanner-subtitle');
    if (scannerSubEl) scannerSubEl.textContent = 'بدون VPN، هر سایتی این اطلاعات را می‌بیند';

    const scanLabelsFa = [
        { id: 'scan-ip',      text: 'آدرس IP' },
        { id: 'scan-isp',     text: 'سرویس‌دهنده اینترنت' },
        { id: 'scan-loc',     text: 'موقعیت مکانی' },
        { id: 'scan-os',      text: 'سیستم‌عامل' },
        { id: 'scan-browser', text: 'مرورگر' },
        { id: 'scan-vpn',     text: 'وضعیت VPN' },
    ];
    const scanIcons = ['fa-globe', 'fa-building', 'fa-location-dot', 'fa-laptop', 'fa-window-maximize', 'fa-shield-halved'];
    scanLabelsFa.forEach(({ id, text }, i) => {
        const valEl = document.getElementById(id);
        if (!valEl) return;
        const row = valEl.closest('.scanner-row');
        if (!row) return;
        const labelEl = row.querySelector('.scan-label');
        if (labelEl) labelEl.innerHTML = `<i class="fa-solid ${scanIcons[i]}"></i> ${text}`;
    });
    const vpnBadge = document.querySelector('#scan-vpn .scan-badge');
    if (vpnBadge) vpnBadge.textContent = 'محافظت نشده ⚠️';
    const scanCtaTextEl = document.querySelector('.scanner-cta-text');
    if (scanCtaTextEl) {
        const icon = scanCtaTextEl.querySelector('i');
        scanCtaTextEl.innerHTML = (icon ? icon.outerHTML + ' ' : '<i class="fa-solid fa-circle-exclamation text-purple"></i> ')
            + 'این اطلاعات توسط هر وبسایتی قابل مشاهده است. با BlueGate آن‌ها را پنهان کنید.';
    }
    const scanCtaBtnEl = document.querySelector('.scanner-buy-btn');
    if (scanCtaBtnEl) scanCtaBtnEl.innerHTML = '<i class="fa-solid fa-shield-halved"></i> همین حالا محافظت کنید';

    // ── Restore Persian for Speed Test ────────────────────────────────────
    const speedTitleEl = document.querySelector('.speed-panel .section-title');
    if (speedTitleEl) speedTitleEl.innerHTML = '<i class="fa-solid fa-gauge-high text-cyan"></i> تست سرعت اتصال';
    const speedSubEl = document.querySelector('.speed-subtitle');
    if (speedSubEl) speedSubEl.textContent = 'ببینید BlueGate چه سرعتی به شما می‌دهد';
    const gaugeLabel = document.getElementById('gaugeLabel');
    if (gaugeLabel && (gaugeLabel.textContent === 'Ready' || gaugeLabel.textContent === 'آماده')) {
        gaugeLabel.textContent = 'آماده';
    }
    const statSmalls = document.querySelectorAll('.speed-stat-item small');
    const faStatLabels = ['دانلود', 'آپلود', 'پینگ'];
    statSmalls.forEach((s, i) => { if (faStatLabels[i]) s.textContent = faStatLabels[i]; });
    const speedBtnEl = document.getElementById('speedStartBtn');
    if (speedBtnEl && !speedBtnEl.disabled) {
        speedBtnEl.innerHTML = '<i class="fa-solid fa-play"></i> شروع تست سرعت';
    }
    const speedNoteEl = document.getElementById('speedNote');
    if (speedNoteEl) speedNoteEl.textContent = 'این یک تست سرعت شبیه‌سازی‌شده است که قابلیت BlueGate را نشان می‌دهد';

    // ── Restore Persian for Wheel Modal ───────────────────────────────────
    const wheelHeaderH2 = document.querySelector('.wheel-header h2');
    if (wheelHeaderH2) wheelHeaderH2.textContent = 'گردونه شانس BlueGate';
    const wheelHeaderP = document.querySelector('.wheel-header p');
    if (wheelHeaderP) wheelHeaderP.textContent = 'یک بار بچرخان و جایزه‌ات را ببر!';
    const wheelCodeLabelEl = document.querySelector('.wheel-code-label');
    if (wheelCodeLabelEl) wheelCodeLabelEl.textContent = 'کد تخفیف شما:';
    const wheelCopyBtnEl = document.getElementById('wheelCopyBtn');
    if (wheelCopyBtnEl) wheelCopyBtnEl.innerHTML = '<i class="fa-solid fa-copy"></i> کپی کد';
    const wheelHintEl = document.querySelector('.wheel-hint');
    if (wheelHintEl) wheelHintEl.textContent = 'این کد را در هنگام ثبت فاکتور وارد کنید';
    const wheelSpinBtnEl = document.getElementById('wheelSpinBtn');
    if (wheelSpinBtnEl && !wheelSpinBtnEl.classList.contains('hidden')) {
        wheelSpinBtnEl.innerHTML = '<i class="fa-solid fa-dharmachakra"></i> بچرخان!';
    }

    // Interactive Features
    initInteractiveFeatures(cfg);
}

// ==========================================================================
// INTERACTIVE FEATURES ENGINE
// ==========================================================================

let _interactiveCfg = null;

function initInteractiveFeatures(cfg) {
    if (!cfg || !cfg.interactive) return;
    _interactiveCfg = cfg.interactive;
    const int = _interactiveCfg;

    // 1. Expose Scanner
    const scannerSec = document.getElementById('scannerSection');
    if (scannerSec) {
        if (int.scanner && int.scanner.enabled) {
            scannerSec.classList.remove('hidden');
            const titleEl = document.getElementById('scannerTitle');
            if (titleEl && int.scanner.title) titleEl.textContent = int.scanner.title;
            initExposedScanner();
        } else {
            scannerSec.classList.add('hidden');
        }
    }

    // 2. Virtual Speed Test
    const speedSec = document.getElementById('speedTestSection');
    if (speedSec) {
        if (int.speed && int.speed.enabled) {
            speedSec.classList.remove('hidden');
        } else {
            speedSec.classList.add('hidden');
        }
    }

    // 3. Catch the Bird
    const birdEl = document.getElementById('flyingBird');
    if (birdEl) {
        if (int.bird && int.bird.enabled) {
            birdEl.classList.remove('hidden');
            initCatchTheBird(int.bird.code || 'SECRET10');
        } else {
            birdEl.classList.add('hidden');
        }
    }

    // 4. Spin the Wheel
    if (int.wheel && int.wheel.enabled) {
        initSpinWheel(int.wheel.code || 'WHEEL20');
    }
}

// ────────────────────────────────────────────────────────────────────────────
// 1. EXPOSE SCANNER
// ────────────────────────────────────────────────────────────────────────────
let _scannerLoaded = false;

function initExposedScanner() {
    if (_scannerLoaded) return;
    _scannerLoaded = true;

    // Detect OS & Browser from UA immediately
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';

    if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT 6/.test(ua)) os = 'Windows 7/8';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';

    if (/Edg\//.test(ua)) browser = 'Microsoft Edge';
    else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Google Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Mozilla Firefox';
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Apple Safari';
    else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';

    // Reveal local fields immediately
    revealScanField('scan-os', os, 300);
    revealScanField('scan-browser', browser, 600);

    // Fetch IP data (no auth, public CORS)
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(data => {
            const ip = data.ip || '—';
            revealScanField('scan-ip', ip, 0);
            // Get ISP & location
            return fetch(`https://ipapi.co/${ip}/json/`);
        })
        .then(r => r.json())
        .then(geo => {
            revealScanField('scan-isp', geo.org || geo.asn || '—', 0);
            const loc = [geo.city, geo.country_name].filter(Boolean).join(', ') || '—';
            revealScanField('scan-loc', loc, 0);
        })
        .catch(() => {
            revealScanField('scan-ip', '—', 0);
            revealScanField('scan-isp', '—', 0);
            revealScanField('scan-loc', '—', 0);
        });
}

function revealScanField(id, value, delayMs) {
    setTimeout(() => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = value;
        el.classList.add('revealed');
        const row = el.closest('.scanner-row');
        if (row) {
            row.classList.remove('skeleton');
            row.classList.add('loaded');
        }
    }, delayMs);
}

// ────────────────────────────────────────────────────────────────────────────
// 2. VIRTUAL SPEED TEST
// ────────────────────────────────────────────────────────────────────────────
let _speedTestRunning = false;

window.startSpeedTest = function() {
    if (_speedTestRunning) return;
    _speedTestRunning = true;

    const maxSpeed = (_interactiveCfg && _interactiveCfg.speed && _interactiveCfg.speed.max) || 850;
    const btn = document.getElementById('speedStartBtn');
    const gaugeNumber = document.getElementById('gaugeNumber');
    const gaugeLabel = document.getElementById('gaugeLabel');
    const gaugeFill = document.getElementById('gaugeFill');
    const dlSpeed = document.getElementById('dlSpeed');
    const ulSpeed = document.getElementById('ulSpeed');
    const pingVal = document.getElementById('pingVal');

    if (btn) btn.disabled = true;
    if (pingVal) pingVal.textContent = '— ms';
    if (dlSpeed) dlSpeed.textContent = '— Mbps';
    if (ulSpeed) ulSpeed.textContent = '— Mbps';

    // Language-aware labels for phase text
    const isEnTest = (typeof currentLang !== 'undefined' && currentLang === 'en');
    const L = {
        connecting: isEnTest ? 'Connecting...'        : 'در حال اتصال...',
        testingDl:  isEnTest ? 'Testing Download...'  : 'تست دانلود...',
        testingUl:  isEnTest ? 'Testing Upload...'    : 'تست آپلود...',
        done:       isEnTest ? '✅ BlueGate is Ready!' : '✅ BlueGate آماده است!',
        retry:      isEnTest ? '<i class="fa-solid fa-rotate-right"></i> Test Again'
                             : '<i class="fa-solid fa-rotate-right"></i> تست دوباره',
    };

    const totalDasharray = 283;

    function setGauge(speed) {
        const ratio = Math.min(speed / (maxSpeed * 1.05), 1);
        const offset = totalDasharray - (totalDasharray * ratio);
        if (gaugeFill) gaugeFill.style.strokeDashoffset = offset;
        if (gaugeNumber) gaugeNumber.textContent = Math.round(speed);
    }

    // Phase 0: Ping
    if (gaugeLabel) gaugeLabel.textContent = L.connecting;
    setTimeout(() => {
        const fakePing = Math.floor(15 + Math.random() * 20);
        if (pingVal) pingVal.textContent = fakePing + ' ms';
        if (gaugeLabel) gaugeLabel.textContent = L.testingDl;

        // Phase 1: Ramp up download speed
        let current = 0;
        const target = maxSpeed * (0.92 + Math.random() * 0.08);
        const steps = 60;
        let step = 0;
        const rampInterval = setInterval(() => {
            step++;
            const t = step / steps;
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - t, 3);
            current = target * ease;
            setGauge(current);
            if (step >= steps) {
                clearInterval(rampInterval);
                if (dlSpeed) dlSpeed.textContent = Math.round(target) + ' Mbps';
                if (gaugeLabel) gaugeLabel.textContent = L.testingUl;

                // Phase 2: Ramp down for upload
                const uploadTarget = maxSpeed * (0.55 + Math.random() * 0.1);
                let upStep = 0;
                const upInterval = setInterval(() => {
                    upStep++;
                    const ut = upStep / 40;
                    const uease = 1 - Math.pow(1 - ut, 3);
                    const upCurrent = uploadTarget * uease;
                    setGauge(upCurrent);
                    if (upStep >= 40) {
                        clearInterval(upInterval);
                        if (ulSpeed) ulSpeed.textContent = Math.round(uploadTarget) + ' Mbps';
                        if (gaugeLabel) gaugeLabel.textContent = L.done;
                        if (gaugeNumber) gaugeNumber.style.color = 'var(--green-glow)';
                        if (btn) {
                            btn.disabled = false;
                            btn.innerHTML = L.retry;
                        }
                        _speedTestRunning = false;
                    }
                }, 50);
            }
        }, 50);
    }, 800);

// ────────────────────────────────────────────────────────────────────────────

// 3. CATCH THE BIRD
// ────────────────────────────────────────────────────────────────────────────
let _birdMoveTimer = null;
let _birdCaught = false;

function initCatchTheBird(code) {
    const bird = document.getElementById('flyingBird');
    if (!bird) return;

    // Place bird at a random starting position
    moveBirdRandom();

    // Move every 3-5 seconds
    _birdMoveTimer = setInterval(moveBirdRandom, 3500 + Math.random() * 1500);

    // Click handler
    bird.addEventListener('click', () => {
        if (_birdCaught) return;
        _birdCaught = true;
        clearInterval(_birdMoveTimer);
        bird.classList.add('hidden');

        // Show congrats toast + code
        showBirdCatchModal(code);
    });
}

function moveBirdRandom() {
    const bird = document.getElementById('flyingBird');
    if (!bird || _birdCaught) return;
    const margin = 80;
    const maxTop = window.innerHeight - margin * 2;
    const maxLeft = window.innerWidth - margin * 2;
    const top = margin + Math.random() * maxTop;
    const left = margin + Math.random() * maxLeft;
    bird.style.top = top + 'px';
    bird.style.left = left + 'px';
}

function showBirdCatchModal(code) {
    // Create a temporary popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position:fixed;bottom:2rem;right:50%;transform:translateX(50%);
        background:linear-gradient(135deg,rgba(14,18,28,0.97),rgba(22,28,44,0.97));
        border:1px solid rgba(0,229,255,0.3);border-radius:20px;
        padding:1.5rem 2rem;z-index:9998;text-align:center;
        box-shadow:0 8px 40px rgba(0,229,255,0.25);
        backdrop-filter:blur(16px);
        animation:slideUpCard 0.4s cubic-bezier(0.34,1.56,0.64,1);
        max-width:320px;width:90%;
    `;
    popup.innerHTML = `
        <div style="font-size:2.5rem;margin-bottom:.5rem">🎉</div>
        <div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:.25rem">پرنده را گرفتی!</div>
        <div style="font-size:.85rem;color:rgba(255,255,255,.6);margin-bottom:1rem">کد تخفیف هدیه‌ات:</div>
        <div style="font-size:1.6rem;font-weight:900;letter-spacing:4px;color:var(--cyan-glow);font-family:Outfit,monospace;text-shadow:0 0 20px rgba(0,229,255,.5);margin-bottom:1rem">${code}</div>
        <button onclick="navigator.clipboard.writeText('${code}').then(()=>showToast('کد کپی شد!')).catch(()=>{});this.textContent='✅ کپی شد!'" style="background:var(--cyan-glow);border:none;color:#000;font-weight:700;font-family:Vazirmatn,sans-serif;font-size:.85rem;padding:.5rem 1.25rem;border-radius:20px;cursor:pointer;width:100%">
            <i class="fa-solid fa-copy"></i> کپی کد
        </button>
        <p style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:.6rem">در هنگام ثبت فاکتور وارد کنید</p>
    `;
    document.body.appendChild(popup);
    // Auto-remove after 12 seconds
    setTimeout(() => popup.remove(), 12000);
}

// ────────────────────────────────────────────────────────────────────────────
// 4. SPIN THE WHEEL
// ────────────────────────────────────────────────────────────────────────────
let _wheelSpinning = false;
let _wheelCurrentAngle = 0;

function initSpinWheel(code) {
    // Only show on first visit in this session
    if (sessionStorage.getItem('bg_wheel_shown')) return;

    const modal = document.getElementById('wheelModal');
    const spinBtn = document.getElementById('wheelSpinBtn');
    const closeBtn = document.getElementById('wheelCloseBtn');
    const copyBtn = document.getElementById('wheelCopyBtn');
    const wheelCodeEl = document.getElementById('wheelCode');
    if (!modal) return;

    // Set winning code
    if (wheelCodeEl) wheelCodeEl.textContent = code;

    // Draw the wheel
    drawWheel(code);

    // Show modal after 2.5 seconds
    setTimeout(() => {
        modal.classList.remove('hidden');
    }, 2500);

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            sessionStorage.setItem('bg_wheel_shown', '1');
        });
    }

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            sessionStorage.setItem('bg_wheel_shown', '1');
        }
    });

    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = '✅ کپی شد!';
                showToast('کد تخفیف کپی شد!');
            }).catch(() => {});
        });
    }

    // Spin button
    if (spinBtn) {
        spinBtn.addEventListener('click', () => {
            if (_wheelSpinning) return;
            spinWheel(code);
        });
    }
}

function drawWheel(winCode) {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 6;

    // Segments: 3 winning + 5 "try again" variants
    const segments = [
        { label: winCode, color: '#00e5ff', textColor: '#000', win: true },
        { label: 'دوباره!', color: '#1a1f2e', textColor: '#94a3b8', win: false },
        { label: winCode, color: '#b537ff', textColor: '#fff', win: true },
        { label: 'دوباره!', color: '#12172a', textColor: '#64748b', win: false },
        { label: winCode, color: '#00ff9d', textColor: '#000', win: true },
        { label: 'دوباره!', color: '#1a1f2e', textColor: '#94a3b8', win: false },
        { label: 'دوباره!', color: '#0e1220', textColor: '#475569', win: false },
        { label: 'دوباره!', color: '#12172a', textColor: '#64748b', win: false },
    ];

    const arc = (2 * Math.PI) / segments.length;

    function drawFrame(offset) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        segments.forEach((seg, i) => {
            const start = offset + i * arc;
            const end = start + arc;

            // Slice
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, end);
            ctx.closePath();
            ctx.fillStyle = seg.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(start + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = seg.textColor;
            ctx.font = seg.win ? 'bold 11px Outfit' : '10px Outfit';
            ctx.fillText(seg.label, r - 10, 4);
            ctx.restore();
        });

        // Center hub
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
        ctx.fillStyle = '#07090e';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,229,255,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Store drawFrame on canvas for animation
    canvas._draw = drawFrame;
    drawFrame(0);
}

function spinWheel(code) {
    const canvas = document.getElementById('wheelCanvas');
    const spinBtn = document.getElementById('wheelSpinBtn');
    const resultEl = document.getElementById('wheelResult');
    if (!canvas || !canvas._draw) return;

    _wheelSpinning = true;
    if (spinBtn) spinBtn.disabled = true;

    // Target: land on a winning segment (index 0 = position 0, we pick index 0)
    // Full spins + land on segment 0 which is our winning code
    const numSegments = 8;
    const arc = (2 * Math.PI) / numSegments;
    // Winning segment (index 0) center angle: arc/2
    // We want pointer (top = -π/2) to point at segment center
    const winSegCenter = arc / 2; // midpoint of first segment from angle=0
    const extraSpins = 5 * 2 * Math.PI;
    const targetAngle = extraSpins + (2 * Math.PI - winSegCenter) + Math.PI / 2;

    const duration = 4500;
    const startTime = performance.now();
    const startAngle = _wheelCurrentAngle;

    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

    function animate(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const angle = startAngle + targetAngle * easeOut(t);
        _wheelCurrentAngle = angle;
        canvas._draw(angle);

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            // Done
            _wheelSpinning = false;
            sessionStorage.setItem('bg_wheel_shown', '1');
            // Show result
            if (resultEl) resultEl.classList.remove('hidden');
            if (spinBtn) spinBtn.classList.add('hidden');
        }
    }

    requestAnimationFrame(animate);
}


// Browser-agnostic Target Date Parsing
function parseTargetDate(dateStr) {
    if (!dateStr) return null;
    let d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        const formatted = String(dateStr).replace(/-/g, '/').replace('T', ' ');
        d = new Date(formatted);
    }
    return isNaN(d.getTime()) ? null : d;
}

// Live Countdown Timer
function startCountdownTimer(endDateStr) {
    if (countdownInterval) clearInterval(countdownInterval);

    const endDate = parseTargetDate(endDateStr);
    if (!endDate) return;

    function updateTimer() {
        const end = endDate.getTime();
        const now = new Date().getTime();
        const diff = end - now;

        const cdWidget = document.getElementById('countdownWidget');

        if (diff <= 0) {
            clearInterval(countdownInterval);
            if (cdWidget) cdWidget.classList.add('hidden');
            return;
        }

        if (cdWidget) cdWidget.classList.remove('hidden');

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const cdHours = document.getElementById('cdHours');
        const cdMinutes = document.getElementById('cdMinutes');
        const cdSeconds = document.getElementById('cdSeconds');

        if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
        if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
        if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}

// Buy Custom Plan from Calculator
window.buyCustomPlan = function(planName, typeName, gbAmount, priceStr) {
    const numericPrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 99000;
    openReceiptModal(planName, typeName, gbAmount + ' گیگابایت (محاسبه‌گر)', priceStr, numericPrice);
};

// Open Receipt Modal
function openReceiptModal(plan, type, gb, price, priceNum = 249000) {
    const modal = document.getElementById('receiptModal');
    const sendTelegramBtn = document.getElementById('sendTelegramBtn');
    const trackingId = '#BG-' + Math.floor(10000 + Math.random() * 90000);
    
    basePriceValue = typeof priceNum === 'number' ? priceNum : (parseInt(String(priceNum).replace(/[^0-9]/g, '')) || 249000);
    activeDiscountPercent = 0;
    
    const receiptDiscountInput = document.getElementById('receiptDiscountInput');
    const discountMsg = document.getElementById('discountMsg');
    if (receiptDiscountInput) receiptDiscountInput.value = '';
    if (discountMsg) discountMsg.classList.add('hidden');

    const now = new Date();
    let timeStr = '';
    try {
        timeStr = new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        }).format(now);
    } catch(e) {
        timeStr = now.toLocaleString();
    }

    const rId = document.getElementById('receiptId');
    const rPlan = document.getElementById('receiptPlan');
    const rType = document.getElementById('receiptType');
    const rVol = document.getElementById('receiptVolume');
    const rTot = document.getElementById('receiptTotal');
    const rTime = document.getElementById('receiptTime');

    if (rId) rId.textContent = `کد پیگیری: ${trackingId}`;
    if (rPlan) rPlan.textContent = plan;
    if (rType) rType.textContent = type;
    if (rVol) rVol.textContent = gb;
    if (rTot) rTot.textContent = price;
    if (rTime) rTime.textContent = timeStr;

    currentReceiptText = `🧾 *فاکتور رسمی سفارش ${appConfig?.site?.brandName || 'BlueGate'}*\n\n` +
        `🆔 *کد پیگیری:* \`${trackingId}\`\n` +
        `🚀 *نوع سرویس:* ${plan}\n` +
        `🏷️ *خصوصیت:* ${type}\n` +
        `📦 *حجم انتخابی:* ${gb}\n` +
        `💰 *مبلغ کل:* ${price}\n\n` +
        `🛡️ *تضمین:* ۷ روز مهلت تست (بازگشت ۱۰۰٪ وجه)\n` +
        `📅 *تاریخ ثبت:* ${timeStr}\n\n` +
        `با سلام، فاکتور فوق ایجاد شد. لطفاً راهنمایی و اکانت را فعال فرمایید. 🙏`;

    const supportUrl = appConfig?.telegram?.supportUrl || 'https://t.me/BlueGateSupport';
    const tgUrl = `${supportUrl}${supportUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(currentReceiptText)}`;
    if (sendTelegramBtn) sendTelegramBtn.href = tgUrl;

    if (modal) modal.classList.remove('hidden');
}

// Utilities
function formatToman(num) {
    if (typeof num === 'string') return num;
    try {
        return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
    } catch(e) {
        return num + ' تومان';
    }
}

function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}
