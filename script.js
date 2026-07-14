// --- PREMIUM CORE SYSTEMS ---

// 0. Mobile Menu Toggle
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    // Re-run if elements are dynamic
});

// 1. Safety Check & Library Check
const hasGSAP = typeof gsap !== 'undefined';
const hasLenis = typeof Lenis !== 'undefined';

if (hasGSAP) {
    document.documentElement.classList.add('js-active');
}

// 1. Lenis Smooth Scroll
let lenis;
if (hasLenis) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// 2. Custom Cursor Init
function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    const noise = document.querySelector('.noise-overlay');

    if (hasGSAP && cursor && follower) {
        document.documentElement.classList.add('cursor-enabled');
        if(noise) noise.style.display = 'block';
        
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
        });

        const interactiveElements = document.querySelectorAll('a, button, .gs-card, .insta-post, .iit-card, .topper-premium-card, .ladder-card, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-active');
                gsap.to(follower, { scale: 2, backgroundColor: 'rgba(29, 78, 216, 0.1)', borderColor: 'transparent', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-active');
                gsap.to(follower, { scale: 1, backgroundColor: 'transparent', borderColor: 'var(--primary-blue)', duration: 0.3 });
            });
        });
    }
}

// 3. Scroll Progress & Sticky Navbar
function initScrollHandlers() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const scrollProgress = document.querySelector('.scroll-progress');
        const scrollToTop = document.querySelector('.scroll-to-top');
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        if (window.scrollY > 50) {
            if (navbar) navbar.classList.add('scrolled');
            if (scrollToTop) scrollToTop.style.display = 'flex';
            setTimeout(() => { if(scrollToTop) scrollToTop.classList.add('visible'); }, 10);
        } else {
            if (navbar) navbar.classList.remove('scrolled');
            if (scrollToTop) {
                scrollToTop.classList.remove('visible');
                setTimeout(() => { scrollToTop.style.display = 'none'; }, 300);
            }
        }
    });

    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// 4. 3D Card Tilt Effect
function initCardTilt() {
    if (!hasGSAP) return;
    const cards = document.querySelectorAll('.gs-card, .insta-post, .iit-card, .topper-premium-card, .ladder-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            gsap.to(card, { rotationX: rotateX, rotationY: rotateY, transformPerspective: 1000, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" });
        });
    });
}

// 5. Magnetic Buttons
function initMagneticButtons() {
    if (!hasGSAP) return;
    const magneticBtns = document.querySelectorAll('.cta-btn, .btn-secondary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// 6. Text Splitting
function splitText() {
    const titles = document.querySelectorAll('.hero-title, .section-head h2');
    titles.forEach(title => {
        const text = title.innerText;
        title.innerHTML = '';
        text.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.className = 'word';
            span.style.display = 'inline-block';
            span.style.overflow = 'hidden';
            span.innerHTML = `<span style="display:inline-block">${word}</span>&nbsp;`;
            title.appendChild(span);
        });
    });
}

// --- HERO CINEMATIC CORE ---
let masterTl;

function setupDrawIn() {
    if (!hasGSAP) return;
    const paths = document.querySelectorAll('.draw-line');
    paths.forEach(path => {
        let length = path.getTotalLength ? path.getTotalLength() : 600;
        path.style.strokeDasharray = (length + 10).toString();
        path.style.strokeDashoffset = (length + 10).toString();
    });

    const ambientContainer = document.getElementById('ambient-particles');
    if(ambientContainer && ambientContainer.children.length === 0) {
        for(let i=0; i<30; i++) {
            const isDot = Math.random() > 0.5;
            const x = Math.random() * 1000;
            const y = Math.random() * 600;
            if (isDot) {
                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("r", (Math.random() * 3 + 1).toString());
                dot.setAttribute("transform", `translate(${x}, ${y})`);
                dot.classList.add("sec-line"); if(Math.random() > 0.5) dot.classList.add("blue-accent");
                ambientContainer.appendChild(dot);
            } else {
                const size = Math.random() * 8 + 4;
                const cross = document.createElementNS("http://www.w3.org/2000/svg", "g");
                const l1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                l1.setAttribute("x1", (-size).toString()); l1.setAttribute("x2", size.toString());
                const l2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
                l2.setAttribute("y1", (-size).toString()); l2.setAttribute("y2", size.toString());
                cross.setAttribute("transform", `translate(${x}, ${y})`);
                cross.appendChild(l1); cross.appendChild(l2);
                cross.classList.add("sec-line"); ambientContainer.appendChild(cross);
            }
        }
    }
}

function initHeroAnimation() {
    if (!hasGSAP) return;
    setupDrawIn();
    const introTl = gsap.timeline({
        onComplete: () => {
            gsap.set('.draw-line', { clearProps: "strokeDashoffset,strokeDasharray" });
            startLoopSequence();
        }
    });

    introTl.fromTo("#hero-svg", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }, 0);
    introTl.to('.draw-line', { strokeDashoffset: 0, duration: 2, ease: "power3.inOut", stagger: 0.01 }, 0);

    const heroWords = document.querySelectorAll('.hero-title .word span');
    if (heroWords.length) {
        gsap.from(heroWords, { y: 80, opacity: 0, rotation: 15, duration: 1.5, stagger: 0.08, ease: "expo.out", delay: 0.5 });
    }
    gsap.from('.hero-subtitle', { y: 20, opacity: 0, duration: 1, ease: "power2.out", delay: 0.3 });
    gsap.from('.hero-desc', { y: 20, opacity: 0, duration: 1, ease: "power2.out", delay: 0.7 });
    gsap.from('.hero-buttons', { y: 20, opacity: 0, duration: 1, ease: "power2.out", delay: 0.9 });
}

function startLoopSequence() {
    if (!hasGSAP) return;
    
    // Dynamic Camera System
    const svg = document.querySelector("#hero-svg");
    const container = document.querySelector(".vector-anim-container");
    
    masterTl = gsap.timeline({ repeat: -1 });

    // 0. RESET PHASE
    masterTl.set(["#success-text", "#hud-group", "#target-fragments", "#arrow-group", "#shockwaves circle"], { opacity: 0 });
    masterTl.set(["#target-rings", ".target-decor", ".target-decor-2", "#character-group", "#target-wrapper"], { opacity: 1 });
    masterTl.set(".draw-line", { strokeDashoffset: 0 });
    
    // 1. AIMING PHASE (CINEMATIC SLOW)
    masterTl.add("aim", "+=0.3");
    
    // Camera Zoom-in
    masterTl.to(container, { scale: 1.15, x: 50, y: 20, duration: 2, ease: "power2.inOut" }, "aim");
    
    // Character setup
    masterTl.to("#char-aura", { opacity: 0.6, scale: 1.3, duration: 2, ease: "sine.inOut" }, "aim");
    
    // HUD Activation
    masterTl.to("#hud-group", { opacity: 1, duration: 0.5 }, "aim");
    masterTl.fromTo("#hud-spinners", { scale: 0.2, rotation: -180 }, { scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)" }, "aim");
    masterTl.to("#hud-t1", { opacity: 1, duration: 0.3 }, "aim+=0.4");
    
    // Bow Tension with Physics
    masterTl.to("#arm-r", { attr: { d: "M 0 0 Q -40 30 -60 0" }, duration: 2, ease: "power2.inOut" }, "aim");
    masterTl.to("#bow-string", { attr: { d: "M 0 -80 L -190 0 L 0 80" }, duration: 2, ease: "power2.inOut" }, "aim");
    masterTl.to("#bow-arc", { attr: { d: "M 0 -80 Q 60 5 0 80" }, duration: 2, ease: "power2.inOut" }, "aim");
    masterTl.to("#arrow-group", { opacity: 1, x: -190, duration: 0.5 }, "aim+=0.5");
    
    // 2. LOCK & TENSION (THE "HUMAN" PAUSE)
    masterTl.add("lock", "aim+=1.5");
    masterTl.to("#hud-t1", { opacity: 0, duration: 0.1 }, "lock");
    masterTl.to("#hud-t2", { opacity: 1, duration: 0.1 }, "lock+=0.1");
    // Vibration (Vibration indicates energy)
    masterTl.to(["#bow-group", "#arrow-group", "#arm-r"], { x: "+=2", y: "+=1.5", rotation: 0.5, duration: 0.05, repeat: 10, yoyo: true }, "lock");
    
    // 3. RELEASE PHASE (ACCELERATION)
    masterTl.add("release", "lock+=0.6");
    
    // Camera Snap
    masterTl.to(container, { scale: 1.05, x: -100, y: 10, duration: 0.2, ease: "power3.in" }, "release");
    
    // Arrow Physics (Acceleration Curve + Arc)
    masterTl.to("#arrow-group", { 
        x: 600, 
        y: -10, // Slight arc 
        rotation: 2, // Micro wobble
        duration: 0.18, 
        ease: "power4.in" 
    }, "release");
    
    // Bowstring Snap-back (Vibration)
    masterTl.to("#bow-string", { attr: { d: "M 0 -80 L 0 0 L 0 80" }, duration: 0.4, ease: "elastic.out(1.8, 0.2)" }, "release");
    masterTl.to("#bow-arc", { attr: { d: "M 0 -80 Q 25 0 0 80" }, duration: 0.6, ease: "elastic.out(1.5, 0.3)" }, "release");

    // 4. IMPACT MOMENT (THE HERO FRAME)
    masterTl.add("impact", "release+=0.16");
    
    // IMPACT PAUSE (Slo-mo feeling)
    masterTl.to(container, { scale: 1.08, duration: 0.05, yoyo: true, repeat: 1 }, "impact");
    
    // BRIGHTNESS FLASH & SHOCKWAVE
    masterTl.set("#sw1", { opacity: 0.8, r: 10 }, "impact");
    masterTl.to("#sw1", { r: 150, opacity: 0, duration: 0.6, ease: "power2.out" }, "impact");
    masterTl.set("#sw2", { opacity: 1, r: 5 }, "impact+=0.05");
    masterTl.to("#sw2", { r: 100, opacity: 0, duration: 0.4, ease: "power3.out" }, "impact+=0.05");
    
    // Camera Shake
    masterTl.to(container, { x: "-=12", y: "+=6", rotation: -1.2, duration: 0.05, repeat: 4, yoyo: true, ease: "none" }, "impact");
    
    // Shatter (Multi-layer)
    masterTl.set(["#target-rings", ".target-decor", ".target-decor-2"], { opacity: 0 }, "impact");
    masterTl.set("#target-fragments", { opacity: 1 }, "impact");
    
    const frags = document.querySelectorAll(".frag");
    frags.forEach((frag, i) => {
        const angle = (i / frags.length) * Math.PI * 2;
        const dist = 300 + Math.random() * 200;
        masterTl.to(frag, { 
            x: Math.cos(angle) * dist, 
            y: Math.sin(angle) * dist, 
            rotation: Math.random() * 720 - 360, 
            opacity: 0, 
            duration: 1.2 + Math.random() * 0.5, 
            ease: "expo.out" 
        }, "impact");
    });
    
    // 5. CELEBRATION (LIFE-LIKE)
    masterTl.add("success", "impact+=0.4");
    
    // Character Jump & Arms Raise
    masterTl.to("#char-jump", { y: -50, duration: 0.4, ease: "power2.out" }, "success");
    masterTl.to("#char-jump", { y: 0, duration: 0.6, ease: "bounce.out" }, "success+=0.4");
    masterTl.to("#arm-l", { attr: { d: "M 0 0 Q 30 -80 60 -120" }, duration: 0.5, ease: "back.out(2)" }, "success+=0.2");
    masterTl.to("#arm-r", { attr: { d: "M 0 0 Q -30 -80 -60 -120" }, duration: 0.5, ease: "back.out(2)" }, "success+=0.25");
    
    // Text Reveal
    masterTl.to("#success-text", { opacity: 1, scale: 1.1, rotation: -2, duration: 0.6, ease: "elastic.out(1, 0.6)" }, "success");
    masterTl.to("#success-text", { scale: 1, rotation: 0, duration: 3, ease: "sine.inOut" }, "success+=0.6");

    // 6. DISSOLVE & LOOP (SEAMLESS)
    masterTl.add("dissolve", "+=2.5");
    masterTl.to(container, { scale: 1, x: 0, y: 0, duration: 1.5, ease: "power2.inOut" }, "dissolve");
    masterTl.to("#success-text", { opacity: 0, scale: 0.9, duration: 0.5 }, "dissolve");
    masterTl.to("#char-aura", { opacity: 0, duration: 1 }, "dissolve");
    masterTl.to("#character-group", { opacity: 0, duration: 0.5 }, "dissolve+=0.5");
    masterTl.to("#target-wrapper", { opacity: 0, duration: 0.5 }, "dissolve+=0.5");
    
}

// 7. Interactive (Parallax & Hover Speed)
function initInteractiveHero() {
    if (!hasGSAP) return;
    const container = document.querySelector(".vector-anim-container");
    
    window.addEventListener("mousemove", (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 30;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(container, { x: xPos, y: yPos, duration: 1, ease: "power2.out" });
    });

    container.addEventListener("mouseenter", () => {
        if (masterTl) masterTl.timeScale(1.2);
    });
    container.addEventListener("mouseleave", () => {
        if (masterTl) masterTl.timeScale(1);
    });
}

// 8. Scroll Animations
function initScrollAnimations() {
    if (!hasGSAP || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.gs-reveal').forEach(elem => {
        gsap.fromTo(elem, { opacity: 0, y: 50 }, { scrollTrigger: { trigger: elem, start: "top 90%" }, y: 0, opacity: 1, duration: 1, ease: "power3.out" });
    });

    const counterItems = document.querySelectorAll('.stat-item');
    counterItems.forEach(item => {
        const target = parseInt(item.getAttribute('data-count') || "0");
        const number = item.querySelector('.stat-number');
        if (!number) return;
        const obj = { value: 0 };
        gsap.to(obj, { scrollTrigger: { trigger: item, start: "top 90%" }, value: target, duration: 2, onUpdate: () => { number.innerText = Math.ceil(obj.value).toLocaleString() + (number.innerText.includes('%') ? '%' : number.innerText.includes('+') ? '+' : ''); } });
    });

    gsap.from(".timeline-line", { scrollTrigger: { trigger: ".timeline-container", start: "top center", end: "bottom center", scrub: 1 }, scaleY: 0, transformOrigin: "top" });
    
    gsap.utils.toArray('.timeline-step').forEach((step, i) => {
        gsap.fromTo(step, { opacity: 0, x: i % 2 === 0 ? -100 : 100 }, { scrollTrigger: { trigger: step, start: "top 85%" }, x: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
    });

    // --- NEW SECTIONS ANIMATIONS ---
    
    // 1. Journey Timeline Elevation
    const activePath = document.querySelector('#active-path');
    const pathLength = activePath ? activePath.getTotalLength() : 0;
    if (activePath) {
        gsap.set(activePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.to(activePath, {
            strokeDashoffset: 0,
            scrollTrigger: {
                trigger: '.journey-viz-container',
                start: "top 70%",
                end: "bottom 30%",
                scrub: 1
            }
        });

        // Activate points based on path progress
        const points = document.querySelectorAll('.j-point');
        points.forEach((point, i) => {
            gsap.to(point, {
                scrollTrigger: {
                    trigger: '.journey-viz-container',
                    start: `top ${70 - (i * (40/points.length))}%`,
                    onEnter: () => point.classList.add('active'),
                    onLeaveBack: () => point.classList.remove('active')
                }
            });
        });
    }

    // 2. JoSAA Flow Stagger
    gsap.from('.josaa-step', {
        scrollTrigger: { trigger: '.josaa-flow-container', start: "top 80%" },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    });

    // 3. Problem -> Solution Arrow
    const arrowPath = document.querySelector('.arrow-path path');
    if (arrowPath) {
        const arrowLength = arrowPath.getTotalLength();
        gsap.set(arrowPath, { strokeDasharray: arrowLength, strokeDashoffset: arrowLength });
        gsap.to(arrowPath, {
            strokeDashoffset: 0,
            scrollTrigger: { trigger: '.prob-sol-sec', start: "top 70%" },
            duration: 1.5,
            ease: "power2.inOut"
        });
    }

    // 4. Prime Services Cards
    gsap.from('.prime-card', {
        scrollTrigger: { trigger: '.prime-services-grid', start: "top 85%" },
        opacity: 0,
        scale: 0.8,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.7)"
    });
    
    // 5. IIT Ladder Stagger Reveal
    const ladderCards = gsap.utils.toArray('.iit-ladder-sec .ladder-card');
    if (ladderCards.length > 0) {
        // Set initial invisible state only if GSAP is running
        gsap.set(ladderCards, { opacity: 0, y: 60 });
        
        ScrollTrigger.create({
            trigger: '.iit-ladder-sec',
            start: "top 80%",
            onEnter: () => {
                gsap.to(ladderCards, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 1,
                    ease: "power3.out",
                    overwrite: "auto",
                    onComplete: () => {
                        gsap.set(ladderCards, { clearProps: "all" });
                    }
                });
            }
        });
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    splitText();
    setTimeout(() => {
        initCursor(); initScrollHandlers(); initCardTilt(); initMagneticButtons(); initHeroAnimation(); initInteractiveHero(); initScrollAnimations();
    }, 100);
});
