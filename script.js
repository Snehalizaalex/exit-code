// DEVELOPER VARIABLES
const BATCH_CLOSES = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
const SEATS_TOTAL = 100;
const SEATS_TAKEN = 74;
const SEATS_LEFT = SEATS_TOTAL - SEATS_TAKEN; // 26

const YOUR_VIDEO_EMBED_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
const YOUR_CHECKOUT_LINK = "https://saisajeev.graphy.com/s/store";
const YOUR_WEBHOOK = "https://script.google.com/macros/s/AKfycbzsir9Zm-3Fn3ZstHSwVmF2ZRlfxUtnSqQqT9hxlr99f757pW--qWCfakeSWlVXL6dN/exec";
document.addEventListener('DOMContentLoaded', () => {
    // 1. Fade Up Observer
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // 2. Dynamic Seats Counter Initializers
    document.querySelectorAll('.seats-counter-val').forEach(el => {
        el.textContent = `${SEATS_LEFT} spots left in this batch`;
    });
    document.querySelectorAll('.seats-taken-val').forEach(el => {
        el.textContent = `${SEATS_TAKEN} / ${SEATS_TOTAL} enrolled — ${SEATS_LEFT} left`;
    });
    const vsBatchFill = document.getElementById('vs-batch-progress-fill');
    if (vsBatchFill) {
        vsBatchFill.style.width = `${Math.min(100, Math.round((SEATS_TAKEN / SEATS_TOTAL) * 100))}%`;
    }

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

    // 4. Custom VSL Video Player (Dropshippingwebsitevideoupdated.mp4)
    const video = document.getElementById('vsl-video');
    const playerContainer = document.getElementById('video-container-box');
    const overlay = document.getElementById('play-vsl-btn');
    const playToggleBtn = document.getElementById('vsl-play-toggle-btn');
    const muteToggleBtn = document.getElementById('vsl-mute-toggle-btn');
    const fullscreenBtn = document.getElementById('vsl-fullscreen-btn');
    const timelineFill = document.getElementById('vsl-timeline-fill');
    const timelineCursor = document.getElementById('vsl-timeline-cursor');
    const centerIndicator = document.getElementById('vsl-center-indicator');

    if (video && playerContainer) {
        let controlsTimeout = null;

        function showControlsTemporarily() {
            playerContainer.classList.add('show-controls');
            if (controlsTimeout) clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (!video.paused) {
                    playerContainer.classList.remove('show-controls');
                }
            }, 2500);
        }

        function triggerCenterFlash(isPlay) {
            if (!centerIndicator) return;
            centerIndicator.classList.remove('showing-play', 'showing-pause', 'animate');
            void centerIndicator.offsetWidth; // trigger reflow
            centerIndicator.classList.add(isPlay ? 'showing-play' : 'showing-pause', 'animate');
            setTimeout(() => {
                centerIndicator.classList.remove('animate');
            }, 500);
        }

        function togglePlay() {
            if (video.paused || video.ended) {
                video.play().then(() => {
                    playerContainer.classList.add('is-playing');
                    playerContainer.classList.remove('is-paused');
                    triggerCenterFlash(true);
                    showControlsTemporarily();
                }).catch(() => {
                    // Fallback if autoplay policy needs muted
                    video.muted = true;
                    playerContainer.classList.add('is-muted');
                    video.play().then(() => {
                        playerContainer.classList.add('is-playing');
                        playerContainer.classList.remove('is-paused');
                        triggerCenterFlash(true);
                    }).catch(() => { });
                });
            } else {
                video.pause();
                playerContainer.classList.remove('is-playing');
                playerContainer.classList.add('is-paused');
                triggerCenterFlash(false);
                playerContainer.classList.add('show-controls');
            }
        }

        // Overlay click (Watch This First initial screen)
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });
        }

        // Direct click on video to toggle play/pause
        video.addEventListener('click', () => {
            togglePlay();
        });

        // Bottom play/pause toggle button ONLY (No skip, no forward/backward)
        if (playToggleBtn) {
            playToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay();
            });
        }

        // User activity reveals controls
        playerContainer.addEventListener('mousemove', showControlsTemporarily);
        playerContainer.addEventListener('touchstart', showControlsTemporarily, { passive: true });

        video.addEventListener('play', () => {
            playerContainer.classList.add('is-playing');
            playerContainer.classList.remove('is-paused');
        });

        video.addEventListener('pause', () => {
            playerContainer.classList.remove('is-playing');
            playerContainer.classList.add('is-paused');
        });

        video.addEventListener('ended', () => {
            playerContainer.classList.remove('is-playing');
            playerContainer.classList.add('is-paused');
            if (timelineFill) timelineFill.style.width = '100%';
            if (timelineCursor) timelineCursor.style.left = '100%';
        });

        // Prevent keyboard seeking (Left/Right arrow keys) so viewers cannot skip
        window.addEventListener('keydown', (e) => {
            if (document.activeElement === video || playerContainer.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'j' || e.key === 'l') {
                    e.preventDefault();
                } else if (e.key === ' ' || e.key === 'k') {
                    e.preventDefault();
                    togglePlay();
                }
            }
        });

        // Mute / Unmute
        if (muteToggleBtn) {
            muteToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                if (video.muted) {
                    playerContainer.classList.add('is-muted');
                } else {
                    playerContainer.classList.remove('is-muted');
                }
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!document.fullscreenElement) {
                    if (playerContainer.requestFullscreen) {
                        playerContainer.requestFullscreen();
                    } else if (video.webkitEnterFullscreen) {
                        video.webkitEnterFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            });
        }

        // Video Speed & Progress Bar Management:
        // 1. Video plays at normal original speed (1.0x) throughout
        // 2. The progress bar & cursor moves speedily to 90% in the first 2 minutes (120s),
        //    and after 90% it moves slowly over the remaining 2 minutes.
        video.playbackRate = 1.0;

        function updateTimelineProgress() {
            const currentTime = video.currentTime;
            const duration = video.duration || 240; // Total video is ~240s (4 mins)
            const splitTime = 120; // 2 minutes marker

            let percent = 0;
            if (currentTime <= splitTime) {
                // First 2 minutes: progress bar moves speedily from 0% to 90%
                percent = (currentTime / splitTime) * 90;
            } else {
                // After 90%: progress bar moves slowly from 90% to 100% across the remaining duration
                const remainingTime = Math.max(0.1, duration - splitTime);
                const elapsedSinceSplit = currentTime - splitTime;
                percent = 90 + (elapsedSinceSplit / remainingTime) * 10;
            }

            percent = Math.min(100, Math.max(0, percent));

            if (timelineFill) {
                timelineFill.style.width = percent + '%';
            }
            if (timelineCursor) {
                timelineCursor.style.left = percent + '%';
            }
        }

        video.addEventListener('timeupdate', updateTimelineProgress);
        video.addEventListener('play', () => {
            video.playbackRate = 1.0;
        });
        video.addEventListener('ratechange', () => {
            if (video.playbackRate !== 1.0) {
                video.playbackRate = 1.0;
            }
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
            leadModal.scrollTop = 0;
            const content = leadModal.querySelector('.modal-content');
            if (content) content.scrollTop = 0;
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function openReviewModal() {
        if (reviewModal) {
            reviewModal.classList.add('active');
            reviewModal.scrollTop = 0;
            const content = reviewModal.querySelector('.modal-content');
            if (content) content.scrollTop = 0;
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function openValueModal() {
        if (valueModal) {
            closeAllModals();
            valueModal.classList.add('active');
            valueModal.scrollTop = 0;
            const content = valueModal.querySelector('.modal-content');
            if (content) content.scrollTop = 0;
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

    // Check URL hash to open modal directly (e.g. #pricing or #value-stack-modal)
    if (window.location.hash === '#pricing' || window.location.hash === '#value-stack-modal' || window.location.hash === '#value-stack') {
        setTimeout(openValueModal, 150);
    }
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#pricing' || window.location.hash === '#value-stack-modal' || window.location.hash === '#value-stack') {
            openValueModal();
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
            const href = el.getAttribute('href') || '';
            if (href === '#pricing' || href === '#value-stack-modal' || el.dataset.openModal === 'value-stack-modal') {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    openValueModal();
                });
                return;
            }

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
        name: '', whatsapp: '', email: '', consent: false,
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
    const leadConsent = document.getElementById('lead-consent');
    const consentCard = document.getElementById('consent-checkbox-card');

    if (leadConsent && consentCard) {
        leadConsent.addEventListener('change', () => {
            if (leadConsent.checked) {
                consentCard.classList.remove('has-error');
                const err = document.getElementById('step1-error');
                if (err && err.textContent.includes('agree')) {
                    err.style.display = 'none';
                }
            }
        });
    }

    if (btnStep1Next) {
        btnStep1Next.addEventListener('click', () => {
            const name = document.getElementById('lead-name').value.trim();
            const phone = document.getElementById('lead-phone').value.trim();
            const email = document.getElementById('lead-email').value.trim();
            const consentChecked = leadConsent ? leadConsent.checked : false;
            const err = document.getElementById('step1-error');

            if (!name || !phone || !email) {
                if (err) {
                    err.textContent = 'Please fill in all fields to continue.';
                    err.style.display = 'block';
                }
                return;
            }

            if (!consentChecked) {
                if (err) {
                    err.textContent = 'Please agree to the communications terms to continue.';
                    err.style.display = 'block';
                }
                if (consentCard) {
                    consentCard.classList.add('has-error');
                }
                return;
            }

            if (consentCard) consentCard.classList.remove('has-error');
            if (err) err.style.display = 'none';

            leadData.name = name;
            leadData.whatsapp = phone;
            leadData.email = email;
            leadData.consent = true;

            currentStep = 2;
            if (leadModal) leadModal.scrollTop = 0;
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
            if (leadModal) leadModal.scrollTop = 0;
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
            if (leadModal) leadModal.scrollTop = 0;
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
            if (leadModal) leadModal.scrollTop = 0;
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

            // Send lead data to Google Sheet webhook
            try {
                const now = new Date();
                const payload = {
                    // Exact Sheet Columns
                    'Full Name': leadData.name || '',
                    'WhatsApp Number': leadData.whatsapp || '',
                    'Email': leadData.email || '',
                    'Marketing Consent': leadData.consent ? 'Yes' : 'No',
                    'Current Situation (Step 2)': leadData.situation || '',
                    'Monthly Income (Step 3)': leadData.income || '',
                    'Exit Goal (Step 3)': leadData.intent || '',
                    'Registration Date & Time': now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),

                    // Fallback Aliases
                    name: leadData.name || '',
                    fullName: leadData.name || '',
                    whatsapp: leadData.whatsapp || '',
                    phone: leadData.whatsapp || '',
                    whatsappNumber: leadData.whatsapp || '',
                    email: leadData.email || '',
                    emailAddress: leadData.email || '',
                    'Email Address': leadData.email || '',
                    situation: leadData.situation || '',
                    currentSituation: leadData.situation || '',
                    'Current Situation': leadData.situation || '',
                    income: leadData.income || '',
                    monthlyIncome: leadData.income || '',
                    'Monthly Income': leadData.income || '',
                    intent: leadData.intent || '',
                    'Intent': leadData.intent || '',
                    exitGoal: leadData.intent || '',
                    consent: leadData.consent ? 'Yes' : 'No',
                    timestamp: now.toISOString(),
                    'Timestamp': now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                    date: now.toLocaleDateString('en-IN'),
                    'Date': now.toLocaleDateString('en-IN'),
                    source: 'The Exit - Get Access Form'
                };

                // Append query params so Apps Script e.parameter captures every field
                const queryParams = new URLSearchParams();
                Object.keys(payload).forEach(key => queryParams.append(key, payload[key]));
                const submitUrl = `${YOUR_WEBHOOK}${YOUR_WEBHOOK.includes('?') ? '&' : '?'}${queryParams.toString()}`;

                // Use mode: 'no-cors' with text/plain to prevent browser CORS preflight blockage
                fetch(submitUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload)
                }).catch(err => {
                    console.warn('Google Sheet submission notice:', err);
                });
            } catch (e) {
                console.warn('Google Sheet dispatch error:', e);
            }

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
            e.preventDefault();
            if (YOUR_CHECKOUT_LINK && YOUR_CHECKOUT_LINK !== '#checkout') {
                // Immediate visual feedback to prevent multiple clicks
                finalCheckoutBtn.disabled = true;
                finalCheckoutBtn.style.opacity = '0.85';
                finalCheckoutBtn.style.cursor = 'wait';
                finalCheckoutBtn.innerHTML = 'Redirecting to checkout &rarr;';

                // Professional pass-through: attach lead info & UTM tags to Graphy store
                try {
                    const checkoutUrl = new URL(YOUR_CHECKOUT_LINK);
                    if (leadData.email) checkoutUrl.searchParams.set('email', leadData.email);
                    if (leadData.name) checkoutUrl.searchParams.set('name', leadData.name);
                    if (leadData.whatsapp) checkoutUrl.searchParams.set('phone', leadData.whatsapp);
                    checkoutUrl.searchParams.set('utm_source', 'theexit_website');
                    checkoutUrl.searchParams.set('utm_medium', 'value_stack_modal');
                    window.location.href = checkoutUrl.toString();
                } catch (err) {
                    window.location.href = YOUR_CHECKOUT_LINK;
                }
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
            const storyEl = document.getElementById('review-text');
            const story = storyEl ? storyEl.value.trim() : '';
            const errorEl = document.getElementById('review-form-error');

            if (!author || !headline) {
                if (errorEl) {
                    errorEl.textContent = 'Please provide your name and write your review.';
                    errorEl.style.display = 'block';
                }
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
