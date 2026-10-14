// DEVELOPER VARIABLES
const BATCH_CLOSES = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
const SEATS_TOTAL = 100;
const SEATS_TAKEN = 74;
const SEATS_LEFT = SEATS_TOTAL - SEATS_TAKEN; // 26

const YOUR_VIDEO_EMBED_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
const YOUR_CHECKOUT_LINK = "https://checkout.theexit.in/";
const YOUR_WEBHOOK = "https://api.theexit.in/v1/lead-webhook";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Static Content - No text, content, or image entrance animations
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));

    // 2. Dynamic Seats Counter Initializers
    document.querySelectorAll('.seats-counter-val').forEach(el => {
        el.textContent = `${SEATS_LEFT} spots left in this batch`;
    });
    document.querySelectorAll('.seats-taken-val').forEach(el => {
        el.textContent = `${SEATS_TAKEN} / ${SEATS_TOTAL} enrolled — ${SEATS_LEFT} left`;
    });

    // 3. Social Proof Toast (Rotates every 12 seconds)
    const toast = document.getElementById('social-proof-toast');
    const toastName = document.getElementById('toast-name');
    const toastMeta = document.getElementById('toast-meta');
    const toastAction = document.querySelector('.toast-action');

    const names = [
        "Adithya K.", "Sreelakshmi P.", "Vishnu R.", "Anjali M.", "Nikhil V.", "Devika S.",
        "Rahul N.", "Meenu T.", "Jishnu A.", "Athira C.", "Arjun P.", "Nithya E.", "Vivek K.",
        "Lakshmi R.", "Arun M.", "Parvathy N.", "Midhun S.", "Greeshma T.", "Abhijith V.",
        "Revathy K.", "Sreejith P.", "Nandana M.", "Unnikrishnan A.", "Divya R.", "Ashwin C.",
        "Aparna S.", "Jibin K.", "Swathi N.", "Manu P.", "Keerthana V.", "Harikrishnan T.",
        "Renjith M.", "Amrutha K.", "Sooraj R.", "Sindhu A.", "Deepak N.", "Priya S.", "Anand V.",
        "Neethu P.", "Sharath K.", "Roshni M.", "Biju T.", "Theertha A.", "Govind R.", "Meghna S.",
        "Vineeth N.", "Reshma K.", "Amal P.", "Haripriya V.", "Sandeep M.", "Arya T.", "Manoj K."
    ];

    const actions = [
        "just joined The Exit",
        "just got instant access",
        "just enrolled",
        "just got full access",
        "just joined"
    ];

    const locations = [
        "Kochi", "Thrissur", "Dubai", "Kozhikode", "Trivandrum", "Palakkad", "Toronto",
        "Ernakulam", "Riyadh", "London", "Kannur", "Malappuram", "Kuwait", "Kottayam",
        "Melbourne", "Alappuzha", "Bangalore", "Abu Dhabi", "Kasaragod", "Sharjah",
        "Pathanamthitta", "Singapore", "Kollam", "Muscat", "Wayanad", "Calicut", "Auckland",
        "Idukki", "Bahrain", "Nedumangad", "Ottapalam", "Doha", "Attingal", "Thalassery",
        "Manama", "Angamaly", "Irinjalakuda", "Ottawa", "Ponnani", "Guruvayur", "Perinthalmanna",
        "Wellington", "Kottarakkara", "Iritty"
    ];

    if (toast) {
        function showNextToast() {
            const rName = names[Math.floor(Math.random() * names.length)];
            const rAction = actions[Math.floor(Math.random() * actions.length)];
            const rLoc = locations[Math.floor(Math.random() * locations.length)];
            const rTime = Math.floor(Math.random() * 25) + 1;

            if (toastName) toastName.textContent = rName;
            if (toastAction) toastAction.textContent = rAction;
            if (toastMeta) toastMeta.innerHTML = `${rTime} mins ago &middot; ${rLoc}`;

            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 4500);
        }

        setTimeout(() => {
            showNextToast();
            setInterval(showNextToast, 12000);
        }, 3000);
    }

    // 4. Video Player & Progress Animation
    const playBtn = document.getElementById('play-vsl-btn');
    const videoContainer = document.getElementById('video-container-box');
    if (playBtn && videoContainer) {
        playBtn.addEventListener('click', () => {
            videoContainer.innerHTML = `
                <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000;">
                    <div style="width:80%; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; margin-bottom:1rem;">
                        <div id="vsl-progress" style="width:0%; height:100%; background:var(--accent-gold); transition: width 3.2s cubic-bezier(0.1, 0.7, 0.1, 1);"></div>
                    </div>
                    <p style="color:var(--text-secondary); font-size:0.85rem; letter-spacing:1px; text-transform:uppercase;">LOADING VIDEO ACCESS...</p>
                </div>
            `;
            setTimeout(() => {
                const prog = document.getElementById('vsl-progress');
                if (prog) prog.style.width = '100%';
            }, 50);

            setTimeout(() => {
                if (YOUR_VIDEO_EMBED_URL && YOUR_VIDEO_EMBED_URL !== 'YOUR_VIDEO_EMBED_URL') {
                    videoContainer.innerHTML = `<iframe src="${YOUR_VIDEO_EMBED_URL}" style="width:100%; height:100%; border:none;" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                } else {
                    videoContainer.innerHTML = `
                        <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#050505; color:var(--accent-gold); padding:2rem; text-align:center;">
                            <h3 style="font-size:1.5rem; margin-bottom:0.5rem; font-family:var(--font-serif);">THE EXIT — 28 DAYS BLUEPRINT</h3>
                            <p style="color:var(--text-secondary); max-width:500px;">Video is streaming live. Click below to lock in your spot before seats close.</p>
                            <button class="btn btn-primary trigger-lead-modal" style="margin-top:1.5rem;">GET INSTANT ACCESS &rarr;</button>
                        </div>
                    `;
                    bindModalTriggers();
                }
            }, 3300);
        });
    }

    // 5. AI Middleman Process Step Visualization & Continuous Package Loop
    const processSteps = [
        { step: "STEP 1 OF 4", title: "Customer buys from your store", desc: "Someone abroad finds your product and pays full price. That money lands in your account first.", nodeActive: 0 },
        { step: "STEP 2 OF 4", title: "You order from the supplier", desc: "You pay the supplier their much lower price and enter your customer's address. You keep the difference.", nodeActive: 1 },
        { step: "STEP 3 OF 4", title: "Supplier ships straight to the customer", desc: "No warehouse. No stock. No packing. You never see or touch the product.", nodeActive: 2 },
        { step: "STEP 4 OF 4", title: "AI runs the whole loop for you", desc: "Ads, orders, replies, fulfilment — automated. You check in about 2 hours a day.", nodeActive: 1 }
    ];

    let currentProcessStep = -1;
    const counterEl = document.getElementById('process-step-counter');
    const titleEl = document.getElementById('p-step-title');
    const descEl = document.getElementById('p-step-desc');
    const nodes = document.querySelectorAll('.p-card-col');
    const arcLabel = document.querySelector('.arc-shipping-label');
    const diagramWrapper = document.querySelector('.process-diagram-wrapper');
    const movingPackage = document.getElementById('moving-package');
    const trackLine = document.querySelector('.process-track-line');

    function setProcessStep(index) {
        if (currentProcessStep === index) return;
        currentProcessStep = index;
        if (counterEl) counterEl.textContent = processSteps[index].step;
        if (titleEl) titleEl.textContent = processSteps[index].title;
        if (descEl) descEl.textContent = processSteps[index].desc;

        nodes.forEach((node, idx) => {
            if (idx === processSteps[index].nodeActive) {
                node.classList.add('active');
            } else {
                node.classList.remove('active');
            }
        });

        if (arcLabel) {
            if (index === 2) {
                arcLabel.classList.add('highlighted');
            } else {
                arcLabel.classList.remove('highlighted');
            }
        }
    }

    // Geometry points cache
    let pts = {
        p0: { x: 0, y: 0 },
        p1: { x: 0, y: 0 },
        p2: { x: 0, y: 0 },
        arcP2: { x: 0, y: 0 },
        arcP0: { x: 0, y: 0 },
        arcCtrl: { x: 0, y: 0 }
    };

    function updateGeometry() {
        if (!diagramWrapper) return;
        const wrapperRect = diagramWrapper.getBoundingClientRect();
        const b0 = document.querySelector('#node-0 .p-icon-box');
        const b1 = document.querySelector('#node-1 .p-icon-box');
        const b2 = document.querySelector('#node-2 .p-icon-box');
        const arcContainer = document.querySelector('.process-arc-container');

        if (!b0 || !b1 || !b2) return;

        const r0 = b0.getBoundingClientRect();
        const r1 = b1.getBoundingClientRect();
        const r2 = b2.getBoundingClientRect();

        pts.p0 = {
            x: r0.left + r0.width / 2 - wrapperRect.left,
            y: r0.top + r0.height / 2 - wrapperRect.top
        };
        pts.p1 = {
            x: r1.left + r1.width / 2 - wrapperRect.left,
            y: r1.top + r1.height / 2 - wrapperRect.top
        };
        pts.p2 = {
            x: r2.left + r2.width / 2 - wrapperRect.left,
            y: r2.top + r2.height / 2 - wrapperRect.top
        };

        if (trackLine) {
            trackLine.style.left = pts.p0.x + 'px';
            trackLine.style.width = (pts.p2.x - pts.p0.x) + 'px';
            trackLine.style.top = pts.p0.y + 'px';
        }

        if (arcContainer) {
            const arcRect = arcContainer.getBoundingClientRect();
            const arcTopY = arcRect.top - wrapperRect.top;
            const startY = arcTopY + 8;
            const peakY = arcTopY + (window.innerWidth <= 768 ? 45 : 64);

            pts.arcP2 = { x: pts.p2.x, y: startY };
            pts.arcP0 = { x: pts.p0.x, y: startY };
            pts.arcCtrl = { x: pts.p1.x, y: 2 * peakY - startY };
        }
    }

    updateGeometry();
    window.addEventListener('resize', updateGeometry);
    window.addEventListener('orientationchange', () => setTimeout(updateGeometry, 200));
    setTimeout(updateGeometry, 400);

    const LOOP_DURATION = 8000;
    let animStart = performance.now();

    function bezierPoint(pStart, pCtrl, pEnd, t) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        return {
            x: uu * pStart.x + 2 * u * t * pCtrl.x + tt * pEnd.x,
            y: uu * pStart.y + 2 * u * t * pCtrl.y + tt * pEnd.y
        };
    }

    function bezierTangent(pStart, pCtrl, pEnd, t) {
        const u = 1 - t;
        return {
            dx: 2 * u * (pCtrl.x - pStart.x) + 2 * t * (pEnd.x - pCtrl.x),
            dy: 2 * u * (pCtrl.y - pStart.y) + 2 * t * (pEnd.y - pCtrl.y)
        };
    }

    function smoothStep(t) {
        return t * t * (3 - 2 * t);
    }

    function renderLoop(timestamp) {
        const elapsed = (timestamp - animStart) % LOOP_DURATION;
        const p = elapsed / LOOP_DURATION;

        let posX = pts.p0.x;
        let posY = pts.p0.y;
        let angle = 0;

        if (p < 0.28) {
            // 1. Customer -> You
            setProcessStep(0);
            const sub = smoothStep(p / 0.28);
            posX = pts.p0.x + (pts.p1.x - pts.p0.x) * sub;
            posY = pts.p0.y;
            angle = Math.sin(sub * Math.PI) * 4;
        } else if (p < 0.35) {
            // Pause at You (AI processes order)
            setProcessStep(1);
            posX = pts.p1.x;
            posY = pts.p1.y;
            angle = 0;
        } else if (p < 0.63) {
            // 2. You -> Supplier
            setProcessStep(1);
            const sub = smoothStep((p - 0.35) / 0.28);
            posX = pts.p1.x + (pts.p2.x - pts.p1.x) * sub;
            posY = pts.p1.y;
            angle = Math.sin(sub * Math.PI) * 4;
        } else if (p < 0.68) {
            // Pause at Supplier (Fulfilling order)
            setProcessStep(2);
            posX = pts.p2.x;
            posY = pts.p2.y;
            angle = 0;
        } else if (p < 0.94) {
            // 3. Supplier -> Customer along the curved arc
            setProcessStep(2);
            const tArc = (p - 0.68) / 0.26;
            const pt = bezierPoint(pts.arcP2, pts.arcCtrl, pts.arcP0, tArc);
            const tang = bezierTangent(pts.arcP2, pts.arcCtrl, pts.arcP0, tArc);
            posX = pt.x;
            posY = pt.y;
            const motionAngle = Math.atan2(-tang.dy, -tang.dx) * 180 / Math.PI;
            angle = Math.max(-20, Math.min(20, -motionAngle));
        } else {
            // 4. Arrived back at Customer (AI loop completed)
            setProcessStep(3);
            const sub = (p - 0.94) / 0.06;
            posX = pts.arcP0.x + (pts.p0.x - pts.arcP0.x) * sub;
            posY = pts.arcP0.y + (pts.p0.y - pts.arcP0.y) * sub;
            angle = 0;
        }

        if (movingPackage && pts.p0.x) {
            movingPackage.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0) rotate(${angle.toFixed(1)}deg)`;
        }

        requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);

    const replayBtn = document.getElementById('process-replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            animStart = performance.now();
            updateGeometry();
            setProcessStep(0);
        });
    }

    nodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            const stepTimes = [0, 0.35, 0.68];
            animStart = performance.now() - (stepTimes[idx] || 0) * LOOP_DURATION;
            setProcessStep(idx);
            updateGeometry();
        });
    });

    // 6. FAQ Accordion Interactive + / x
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const ans = i.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                    const icon = i.querySelector('.icon');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                });
                if (!isActive) {
                    item.classList.add('active');
                    const ans = item.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = ans.scrollHeight + "px";
                    const icon = item.querySelector('.icon');
                    if (icon) icon.style.transform = 'rotate(45deg)';
                }
            });
        }
    });

    // 7. Lead Capture Modal (Page 2), Value Stack Modal (Page 3) & Review Modal
    const leadModal = document.getElementById('lead-capture-modal');
    const valueModal = document.getElementById('value-stack-modal');
    const reviewModal = document.getElementById('review-submission-modal');
    const lightboxModal = document.getElementById('image-lightbox-modal');
    const closeBtns = document.querySelectorAll('.modal-close-btn');

    function openLeadModal() {
        if (leadModal) {
            leadModal.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function openReviewModal() {
        if (reviewModal) {
            reviewModal.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAllModals() {
        if (leadModal) leadModal.classList.remove('active');
        if (valueModal) valueModal.classList.remove('active');
        if (reviewModal) reviewModal.classList.remove('active');
        if (lightboxModal) lightboxModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));

    // Backdrop click dismiss for modals
    [leadModal, valueModal, reviewModal].forEach(modalOverlay => {
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeAllModals();
                }
            });
        }
    });

    // Bind review buttons
    document.querySelectorAll('.trigger-review-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openReviewModal();
        });
    });

    function bindModalTriggers() {
        document.querySelectorAll('button, a').forEach(el => {
            const text = (el.textContent || '').trim().toLowerCase();
            if (text.includes('get instant access') || text.includes('start with the 28-day system') || text.includes('get access now') || text.includes('get access →')) {
                if (!el.classList.contains('checkout-final-link')) {
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        openLeadModal();
                    });
                }
            }
        });
    }
    bindModalTriggers();

    // Multi-Step Form Logic (Page 2)
    let currentStep = 1;
    let leadData = {
        name: '', whatsapp: '', email: '',
        situation: '', income: '', intent: ''
    };

    const step1Box = document.getElementById('form-step-1');
    const step2Box = document.getElementById('form-step-2');
    const step3Box = document.getElementById('form-step-3');
    const stepConfirmBox = document.getElementById('form-step-confirm');
    const progressFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    // Step 1 -> 2
    const btnStep1Next = document.getElementById('btn-step1-next');
    if (btnStep1Next) {
        btnStep1Next.addEventListener('click', () => {
            const name = document.getElementById('lead-name').value.trim();
            const phone = document.getElementById('lead-phone').value.trim();
            const email = document.getElementById('lead-email').value.trim();
            const err = document.getElementById('step1-error');

            if (!name || !phone || !email) {
                if (err) err.style.display = 'block';
                return;
            }
            if (err) err.style.display = 'none';

            leadData.name = name;
            leadData.whatsapp = phone;
            leadData.email = email;

            currentStep = 2;
            if (step1Box) step1Box.style.display = 'none';
            if (step2Box) step2Box.style.display = 'block';
            if (progressFill) progressFill.style.width = '66%';
            if (progressText) progressText.textContent = 'Step 2 of 3';
        });
    }

    // Step 2 Option selection & ceiling callout
    const situationOptions = document.querySelectorAll('#form-step-2 .radio-option-card');
    const ceilingCallout = document.getElementById('ceiling-callout');
    situationOptions.forEach(card => {
        card.addEventListener('click', () => {
            situationOptions.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const val = card.dataset.val;
            leadData.situation = val;

            if (val === 'Full-time job' || val === 'Part-time job') {
                if (ceilingCallout) ceilingCallout.style.display = 'block';
            } else {
                if (ceilingCallout) ceilingCallout.style.display = 'none';
            }
        });
    });

    const btnStep2Back = document.getElementById('btn-step2-back');
    if (btnStep2Back) {
        btnStep2Back.addEventListener('click', () => {
            currentStep = 1;
            if (step2Box) step2Box.style.display = 'none';
            if (step1Box) step1Box.style.display = 'block';
            if (progressFill) progressFill.style.width = '33%';
            if (progressText) progressText.textContent = 'Step 1 of 3';
        });
    }

    const btnStep2Next = document.getElementById('btn-step2-next');
    if (btnStep2Next) {
        btnStep2Next.addEventListener('click', () => {
            if (!leadData.situation) {
                alert('Please select your current situation.');
                return;
            }
            currentStep = 3;
            if (step2Box) step2Box.style.display = 'none';
            if (step3Box) step3Box.style.display = 'block';
            if (progressFill) progressFill.style.width = '90%';
            if (progressText) progressText.textContent = 'Step 3 of 3';
        });
    }

    // Step 3 Radio selection
    const incomeOptions = document.querySelectorAll('#income-options .radio-option-card');
    incomeOptions.forEach(card => {
        card.addEventListener('click', () => {
            incomeOptions.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            leadData.income = card.dataset.val;
        });
    });

    const intentOptions = document.querySelectorAll('#intent-options .radio-option-card');
    intentOptions.forEach(card => {
        card.addEventListener('click', () => {
            intentOptions.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            leadData.intent = card.dataset.val;
        });
    });

    const btnStep3Back = document.getElementById('btn-step3-back');
    if (btnStep3Back) {
        btnStep3Back.addEventListener('click', () => {
            currentStep = 2;
            if (step3Box) step3Box.style.display = 'none';
            if (step2Box) step2Box.style.display = 'block';
            if (progressFill) progressFill.style.width = '66%';
            if (progressText) progressText.textContent = 'Step 2 of 3';
        });
    }

    const btnStep3Submit = document.getElementById('btn-step3-submit');
    if (btnStep3Submit) {
        btnStep3Submit.addEventListener('click', () => {
            if (!leadData.income || !leadData.intent) {
                alert('Please answer both questions to continue.');
                return;
            }

            // Show Confirmation Loading screen
            if (step3Box) step3Box.style.display = 'none';
            if (stepConfirmBox) stepConfirmBox.style.display = 'block';
            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = 'Complete';

            // Send webhook data silently
            try {
                fetch(YOUR_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData)
                }).catch(() => {});
            } catch (e) {}

            // Auto advance after 2.2 seconds to Page 3 Value Stack Modal
            setTimeout(() => {
                closeAllModals();
                if (valueModal) {
                    valueModal.classList.add('active');
                    document.body.classList.add('modal-open');
                    document.body.style.overflow = 'hidden';
                }
            }, 2200);
        });
    }

    // 8. Countdown Timer (Page 3)
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = BATCH_CLOSES.getTime() - now;

        if (distance < 0) return;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById('timer-days');
        const hEl = document.getElementById('timer-hours');
        const mEl = document.getElementById('timer-mins');
        const sEl = document.getElementById('timer-secs');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 9. Final Checkout Link Connection
    const finalCheckoutBtn = document.getElementById('final-checkout-link');
    if (finalCheckoutBtn) {
        finalCheckoutBtn.addEventListener('click', (e) => {
            if (YOUR_CHECKOUT_LINK && YOUR_CHECKOUT_LINK !== '#checkout') {
                window.location.href = YOUR_CHECKOUT_LINK;
            } else {
                alert("Redirecting to secure checkout page...");
            }
        });
    }

    // 10. Star Rating Picker in Review Modal
    let selectedRating = 5;
    const starPicker = document.getElementById('star-rating-select');
    const ratingFeedback = document.getElementById('rating-text-feedback');
    const stars = starPicker ? starPicker.querySelectorAll('.star-pick') : [];
    
    const ratingTexts = {
        1: "1.0 / 5.0 — Poor Experience",
        2: "2.0 / 5.0 — Fair",
        3: "3.0 / 5.0 — Good",
        4: "4.0 / 5.0 — Very Good",
        5: "5.0 / 5.0 — Outstanding Experience"
    };

    function updateStarsDisplay(rating) {
        stars.forEach(s => {
            const val = parseInt(s.dataset.val, 10);
            if (val <= rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        if (ratingFeedback) {
            ratingFeedback.textContent = ratingTexts[rating] || `${rating}.0 / 5.0`;
        }
    }

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.val, 10);
            stars.forEach(s => {
                const sVal = parseInt(s.dataset.val, 10);
                if (sVal <= val) {
                    s.classList.add('hovered');
                } else {
                    s.classList.remove('hovered');
                }
            });
            if (ratingFeedback) {
                ratingFeedback.textContent = ratingTexts[val] || `${val}.0 / 5.0`;
            }
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
            updateStarsDisplay(selectedRating);
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.val, 10);
            if (starPicker) starPicker.dataset.rating = selectedRating;
            updateStarsDisplay(selectedRating);
        });
    });

    // 11. Proof Screenshot Upload Preview in Review Modal
    const fileUploadBox = document.getElementById('file-upload-box');
    const fileInput = document.getElementById('review-image-input');
    const uploadPrompt = document.getElementById('upload-prompt');
    const previewWrapper = document.getElementById('image-preview-wrapper');
    const previewImg = document.getElementById('review-preview-img');
    const btnRemovePreview = document.getElementById('btn-remove-preview');
    let uploadedImageDataUrl = '';

    if (fileUploadBox && fileInput) {
        fileUploadBox.addEventListener('click', (e) => {
            if (e.target !== btnRemovePreview && !btnRemovePreview?.contains(e.target)) {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImageDataUrl = e.target.result;
                    if (previewImg) previewImg.src = uploadedImageDataUrl;
                    if (uploadPrompt) uploadPrompt.style.display = 'none';
                    if (previewWrapper) previewWrapper.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemovePreview) {
        btnRemovePreview.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadedImageDataUrl = '';
            if (fileInput) fileInput.value = '';
            if (previewImg) previewImg.src = '';
            if (previewWrapper) previewWrapper.style.display = 'none';
            if (uploadPrompt) uploadPrompt.style.display = 'flex';
        });
    }

    // 12. Review Form Submission Logic
    const reviewForm = document.getElementById('student-review-form');
    const reviewSuccessBox = document.getElementById('review-form-success');
    const btnReviewDone = document.getElementById('btn-review-done');

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = document.getElementById('review-author').value.trim();
            const location = document.getElementById('review-location').value.trim() || 'Verified Student';
            const headline = document.getElementById('review-headline').value.trim();
            const story = document.getElementById('review-text').value.trim();
            const errorEl = document.getElementById('review-form-error');

            if (!author || !headline) {
                if (errorEl) errorEl.style.display = 'block';
                return;
            }
            if (errorEl) errorEl.style.display = 'none';

            // Generate star rating string
            const starString = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);

            // Construct new Review Card
            const newCard = document.createElement('div');
            newCard.className = 'exit-review-card fade-up visible';

            let imageHtml = '';
            if (uploadedImageDataUrl) {
                imageHtml = `
                    <div class="exit-proof-img-wrap" data-caption="${author} — Proof Screenshot">
                        <img src="${uploadedImageDataUrl}" alt="${author} Proof" loading="lazy">
                    </div>
                `;
            }

            let storyHtml = '';
            if (story) {
                storyHtml = `
                    <div class="exit-review-text-block">
                        <p>${story}</p>
                    </div>
                `;
            }

            newCard.innerHTML = `
                <div class="exit-reviewer-row">
                    <div class="exit-avatar-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <circle cx="12" cy="8" r="4.2"></circle>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"></path>
                        </svg>
                    </div>
                    <div class="exit-reviewer-details">
                        <div class="exit-reviewer-name">
                            ${author} ${location ? `<span style="font-size:0.8rem; font-weight:normal; color:var(--text-secondary);">&middot; ${location}</span>` : ''}
                            <span class="exit-verified-tag">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                Verified
                            </span>
                        </div>
                        <div class="exit-reviewer-meta">
                            <span class="exit-stars-mini">${starString}</span>
                        </div>
                    </div>
                </div>
                <div class="exit-review-quote">${headline}</div>
                ${storyHtml}
                ${imageHtml}
            `;

            // Insert at the top of the cards container
            const cardsContainer = document.querySelector('.exit-frame-cards');
            if (cardsContainer) {
                cardsContainer.prepend(newCard);
                // Bind lightbox to new image if present
                bindLightboxToElements(newCard.querySelectorAll('.exit-proof-img-wrap'));
            }

            // Show success UI
            reviewForm.style.display = 'none';
            if (reviewSuccessBox) reviewSuccessBox.style.display = 'block';

            // Auto-close after 2.2 seconds
            setTimeout(() => {
                closeAllModals();
                // Reset form
                reviewForm.reset();
                reviewForm.style.display = 'block';
                if (reviewSuccessBox) reviewSuccessBox.style.display = 'none';
                if (btnRemovePreview) btnRemovePreview.click();
                selectedRating = 5;
                updateStarsDisplay(5);
                newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 2200);
        });
    }

    if (btnReviewDone) {
        btnReviewDone.addEventListener('click', () => {
            closeAllModals();
            if (reviewForm) {
                reviewForm.reset();
                reviewForm.style.display = 'block';
            }
            if (reviewSuccessBox) reviewSuccessBox.style.display = 'none';
        });
    }

    // 13. Fullscreen Image Lightbox Modal Logic (Makes all images fully visible)
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

    function openLightbox(src, caption) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = src;
        if (lightboxCaption) {
            lightboxCaption.textContent = caption || 'Student Proof Screenshot';
            lightboxCaption.style.display = caption ? 'block' : 'none';
        }
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
    }

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeAllModals();
        }
    });

    function bindLightboxToElements(elements) {
        elements.forEach(wrap => {
            wrap.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = wrap.querySelector('img');
                if (img) {
                    const src = img.currentSrc || img.src;
                    const caption = wrap.dataset.caption || img.alt || 'Proof Screenshot';
                    openLightbox(src, caption);
                }
            });
        });
    }

    // Bind lightbox to all proof image wrappers and timeline placeholders
    bindLightboxToElements(document.querySelectorAll('.exit-proof-img-wrap, .test-img-placeholder'));
});
