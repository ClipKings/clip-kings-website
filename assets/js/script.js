document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DYNAMIC FOOTER YEAR
    // ==========================================
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 2. SMOOTH SCROLLING (Lenis)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false, // Touch devices pe native scroll chalega
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 3. CUSTOM MAGNETIC CURSOR
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    // Sirf desktop (fine pointers) par custom cursor chalega
    if (cursorDot && cursorRing && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
        });

        // Hover state for links aur buttons
        const interactives = document.querySelectorAll('a, button, .magnetic, input[type="range"]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });

        // Click effect
        window.addEventListener('mousedown', () => {
            gsap.to(cursorRing, { scale: 0.8, duration: 0.15 });
        });
        window.addEventListener('mouseup', () => {
            gsap.to(cursorRing, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
        });
    }

    // ==========================================
    // 4. MAGNETIC BUTTON PULL EFFECT
    // ==========================================
    const magneticElements = document.querySelectorAll('.magnetic');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Element ko mouse ki taraf thoda pull karna
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            });
            
            el.addEventListener('mouseleave', () => {
                // Wapas original jagah par snap karna
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // ==========================================
    // 5. STICKY HEADER
    // ==========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 6. MOBILE MENU OVERLAY
    // ==========================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        if (!mobileMenu) return;
        
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            mobileMenu.classList.remove('active');
            lenis.start(); // Menu close hone par scroll wapas chalu
        } else {
            mobileMenu.classList.add('active');
            lenis.stop(); // Menu open hone par background scroll lock
        }
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // ==========================================
    // 7. BEFORE & AFTER SLIDER (Fixed Webkit Support)
    // ==========================================
    const baSlider = document.getElementById('ba-slider');
    const baAfterImg = document.getElementById('ba-after-img');
    const baHandle = document.getElementById('ba-handle');

    if (baSlider && baAfterImg && baHandle) {
        baSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            // Safari aur Chrome dono ke liye clip-path update
            baAfterImg.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            baAfterImg.style.webkitClipPath = `inset(0 ${100 - value}% 0 0)`;
            baHandle.style.left = `${value}%`;
        });
    }

    // ==========================================
    // 8. GSAP ANIMATIONS & PRELOADER
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Lenis aur ScrollTrigger ko sync karna taaki animations smooth rahein
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // --- Cinematic Preloader Sequence ---
        const preloaderTl = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('loading');
                document.getElementById('preloader').style.display = 'none';
            }
        });

        preloaderTl.to('.preloader-line', { width: '100%', duration: 1.5, ease: "power3.inOut" })
                   .to('.preloader-text', { opacity: 1, duration: 0.5 }, "-=0.5")
                   .to('.preloader-content', { opacity: 0, y: -20, duration: 0.5, delay: 0.3 })
                   .to('#preloader', { yPercent: -100, duration: 1, ease: "power4.inOut" })
                   // Hero Reveal exactly preloader ke baad
                   .from('.massive-title', { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" }, "-=0.5")
                   .from('.hero-separator', { width: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
                   .from('.sub-title', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
                   .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
                   .from('.hero-cta-group .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
                   .from('.site-header', { y: -100, opacity: 0, duration: 1, ease: "power3.out" }, "-=1");

        // --- Scroll Reveal Animations (Neeche aane par) ---
        const revealElements = document.querySelectorAll('.gs-reveal');
        revealElements.forEach((el) => {
            gsap.fromTo(el, 
                { autoAlpha: 0, y: 50 },
                { 
                    duration: 1, 
                    autoAlpha: 1, 
                    y: 0, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", 
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // --- Subtle Parallax Effects ---
        if (document.getElementById('hero-bg-parallax')) {
            gsap.to('#hero-bg-parallax', {
                yPercent: 30,
                ease: "none",
                scrollTrigger: { 
                    trigger: ".hero-section", 
                    start: "top top", 
                    end: "bottom top", 
                    scrub: true 
                }
            });
        }

        if (document.getElementById('cta-bg-parallax')) {
            gsap.to('#cta-bg-parallax', {
                yPercent: 20,
                ease: "none",
                scrollTrigger: { 
                    trigger: ".final-cta", 
                    start: "top bottom", 
                    end: "bottom top", 
                    scrub: true 
                }
            });
        }
    } else {
        // Fallback agar internet ki wajah se GSAP load na ho
        document.body.classList.remove('loading');
        const preloader = document.getElementById('preloader');
        if(preloader) preloader.style.display = 'none';
    }
});
