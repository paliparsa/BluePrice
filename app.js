// ==========================================================================
   BLUEGATE COMPLETE CONTROLLER (Preserved Redesign & 100% Admin Parity)
   ==========================================================================

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

    // Calculator Toggle
    const calcBtn = document.getElementById('calculatorToggleBtn');
    const calcSection = document.getElementById('calculatorSection');
    if (calcBtn && calcSection) {
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

    attachCardRowListeners();
    attachFaqListeners();
    loadConfig();

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'previewConfig' && event.data.config) {
            appConfig = event.data.config;
            applyConfigToPlantedLayout(appConfig);
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

function loadConfig() {
    fetch('config.json?v=' + Date.now())
        .then(res => res.json())
        .then(data => {
            appConfig = data;
            applyConfigToPlantedLayout(data);
        })
        .catch(err => {
            console.log('Config load note:', err);
        });
}

function applyConfigToPlantedLayout(cfg) {
    if (!cfg) return;

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

    // Plans Update
    if (cfg.plans && Array.isArray(cfg.plans)) {
        cfg.plans.forEach(plan => {
            const planId = (plan.id || plan.title || '').toLowerCase();
            let card = null;

            if (planId.includes('standard') || planId.includes('economy')) {
                card = document.querySelector('.pricing-card.card-standard');
            } else if (planId.includes('pro') || planId.includes('tunnel')) {
                card = document.querySelector('.pricing-card.card-pro');
            } else if (planId.includes('emergency') || planId.includes('national')) {
                card = document.querySelector('.pricing-card.card-emergency');
            }

            if (card) {
                const titleEl = card.querySelector('.plan-title');
                if (titleEl && plan.title) {
                    titleEl.innerHTML = escHtml(plan.title).replace('Standard', '<span>Standard</span>').replace('Pro', '<span>Pro</span>').replace('Emergency', '<span>Emergency</span>');
                }

                const tagsEl = card.querySelector('.plan-tags');
                if (tagsEl && plan.subtitle) {
                    tagsEl.textContent = plan.subtitle;
                }

                const noteEl = card.querySelector('.extra-gb-info span');
                if (noteEl && plan.note) {
                    noteEl.textContent = plan.note;
                }

                if (plan.options && Array.isArray(plan.options)) {
                    const priceList = card.querySelector('.price-list');
                    if (priceList) {
                        const iconClass = card.classList.contains('card-standard') ? '' : card.classList.contains('card-pro') ? 'purple' : 'blue';
                        priceList.innerHTML = plan.options.map((opt, idx) => `
                            <div class="price-row selectable ${idx === 0 ? 'active' : ''}" data-gb="${escHtml(opt.volume)}" data-price="${formatToman(opt.price)}" data-price-num="${opt.price}" data-type="${escHtml(plan.subtitle || plan.title)}">
                                <div class="gb-badge ${iconClass}"><i class="fa-solid fa-cube"></i> ${escHtml(opt.volume)}</div>
                                <div class="price-val">${formatToman(opt.price)}</div>
                                <div class="select-indicator"><i class="fa-solid ${idx === 0 ? 'fa-circle-check' : 'fa-circle'}"></i></div>
                            </div>
                        `).join('');
                    }
                }
            }
        });

        attachCardRowListeners();
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
            attachFaqListeners();
        }
    }
}

function attachFaqListeners() {
    const faqQueries = document.querySelectorAll('.faq-q');
    faqQueries.forEach(q => {
        // Avoid duplicate listeners
        if (!q.dataset.bound) {
            q.dataset.bound = 'true';
            q.addEventListener('click', () => {
                const item = q.parentElement;
                const ans = item.querySelector('.faq-a');
                if (ans) ans.classList.toggle('hidden');
                const arrow = item.querySelector('.faq-arrow');
                if (arrow) arrow.classList.toggle('rotate');
            });
        }
    });
}

// Live Countdown Timer
function startCountdownTimer(endDateStr) {
    if (countdownInterval) clearInterval(countdownInterval);

    function updateTimer() {
        const end = new Date(endDateStr).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdownWidget').classList.add('hidden');
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    countdownInterval = setInterval(updateTimer, 1000);
}

// Attach Event Listeners to Selectable Rows and Buy Buttons
function attachCardRowListeners() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const selectableRows = card.querySelectorAll('.selectable');
        selectableRows.forEach(row => {
            row.addEventListener('click', () => {
                selectableRows.forEach(r => {
                    r.classList.remove('active');
                    const indicator = r.querySelector('.select-indicator i');
                    if (indicator) indicator.className = 'fa-solid fa-circle';
                });

                row.classList.add('active');
                const indicator = row.querySelector('.select-indicator i');
                if (indicator) indicator.className = 'fa-solid fa-circle-check';
            });
        });
    });

    const buyBtns = document.querySelectorAll('.buy-btn-action');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            const card = btn.closest('.pricing-card');
            const activeRow = card.querySelector('.selectable.active');

            let gb = '۲۰ گیگ';
            let price = '۲۴۹,۰۰۰ تومان';
            let priceNum = 249000;
            let type = 'سرویس اختصاصی';

            if (activeRow) {
                gb = activeRow.getAttribute('data-gb');
                price = activeRow.getAttribute('data-price');
                priceNum = parseInt(activeRow.getAttribute('data-price-num')) || 249000;
                type = activeRow.getAttribute('data-type') || 'سرویس اختصاصی';
            }

            openReceiptModal(plan, type, gb, price, priceNum);
        });
    });
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
    
    basePriceValue = priceNum;
    activeDiscountPercent = 0;
    
    const receiptDiscountInput = document.getElementById('receiptDiscountInput');
    const discountMsg = document.getElementById('discountMsg');
    if (receiptDiscountInput) receiptDiscountInput.value = '';
    if (discountMsg) discountMsg.classList.add('hidden');

    const now = new Date();
    const timeStr = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    }).format(now);

    document.getElementById('receiptId').textContent = `کد پیگیری: ${trackingId}`;
    document.getElementById('receiptPlan').textContent = plan;
    document.getElementById('receiptType').textContent = type;
    document.getElementById('receiptVolume').textContent = gb;
    document.getElementById('receiptTotal').textContent = price;
    document.getElementById('receiptTime').textContent = timeStr;

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
    return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
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
