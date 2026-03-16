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
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 3. CUSTOM MAGNETIC CURSOR (SHARP SCISSOR)
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    // Only run custom cursor on desktop (fine pointers)
    if (cursorDot && window.matchMedia("(pointer: fine)").matches) {
        
        // Hide the default ring since we are using a full custom SVG
        if (cursorRing) cursorRing.style.display = 'none';

        // Inject Professional, Sharp Barber Shear SVG
        cursorDot.innerHTML = `
            <svg class="scissor-cursor" width="48" height="48" viewBox="0 0 40 40" fill="none" style="position: absolute; top: -20px; left: -20px; transform: rotate(-20deg);">
                <g class="scissor-bottom-blade" style="transform-origin: 15px 15px;">
                    <path d="M15,15 L38,21 L36,24 L14,17 Z" fill="var(--color-gold)"/>
                    <circle cx="8" cy="8" r="4.5" stroke="var(--color-gold)" stroke-width="2"/>
                    <path d="M11.5,11 L15,15" stroke="var(--color-gold)" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M5,5 L2,2" stroke="var(--color-gold)" stroke-width="1.5" stroke-linecap="round"/>
                </g>
                <g class="scissor-top-blade" style="transform-origin: 15px 15px;">
                    <path d="M15,15 L38,9 L36,6 L14,13 Z" fill="var(--color-gold)"/>
                    <circle cx="8" cy="22" r="4.5" stroke="var(--color-gold)" stroke-width="2"/>
                    <path d="M11.5,19 L15,15" stroke="var(--color-gold)" stroke-width="2.5" stroke-linecap="round"/>
                </g>
                <circle cx="15" cy="15" r="1.5" fill="#fff"/>
                <circle cx="15" cy="15" r="2.5" stroke="var(--color-gold)" stroke-width="0.5"/>
            </svg>
        `;
        
        // Remove the old dot background
        cursorDot.style.backgroundColor = 'transparent';
        cursorDot.style.width = '0';
        cursorDot.style.height = '0';
        
        // Hide the default system cursor everywhere
        document.body.style.cursor = 'none';

        window.addEventListener('mousemove', (e) => {
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
        });

        const scissorTop = document.querySelector('.scissor-top-blade');
        const scissorBottom = document.querySelector('.scissor-bottom-blade');
        const scissorSvg = document.querySelector('.scissor-cursor');

        // Initially open the scissors slightly
        gsap.set(scissorTop, { rotation: -10 });
        gsap.set(scissorBottom, { rotation: 10 });

        // Hover state for interactive items (including new Google Review cards and IG posts)
        const interactives = document.querySelectorAll('a, button, .magnetic, input[type="range"], .google-review-card, .ig-post');
        
        interactives.forEach(el => {
            el.style.cursor = 'none';
            
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('is-hovering');
                // Open scissors wider when hovering over clickable items
                gsap.to(scissorTop, { rotation: -25, duration: 0.2, ease: "power2.out" });
                gsap.to(scissorBottom, { rotation: 25, duration: 0.2, ease: "power2.out" });
                gsap.to(scissorSvg, { scale: 1.15, duration: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('is-hovering');
                // Return to normal resting state
                gsap.to(scissorTop, { rotation: -10, duration: 0.2 });
                gsap.to(scissorBottom, { rotation: 10, duration: 0.2 });
                gsap.to(scissorSvg, { scale: 1, duration: 0.2 });
            });
        });

        // Click effect - SHARP SNAPPING!
        window.addEventListener('mousedown', () => {
            // Snapping shut instantly (0.05s) for a sharp feel
            gsap.to(scissorTop, { rotation: 2, duration: 0.05, ease: "power4.in" });
            gsap.to(scissorBottom, { rotation: -2, duration: 0.05, ease: "power4.in" });
        });
        window.addEventListener('mouseup', () => {
            // Re-open blades based on whether we are still hovering an element
            const isHovering = cursorDot.classList.contains('is-hovering');
            gsap.to(scissorTop, { rotation: isHovering ? -25 : -10, duration: 0.3, ease: "back.out(3)" });
            gsap.to(scissorBottom, { rotation: isHovering ? 25 : 10, duration: 0.3, ease: "back.out(3)" });
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
                
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // ==========================================
    // 5. STICKY HEADER & MOBILE CTA OBSERVER
    // ==========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            // Updated scroll trigger to account for announcement bar
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // UX CRO: Hide the mobile floating CTA when user is at the final CTA 
    const mobileCta = document.getElementById('mobile-floating-cta');
    const finalCta = document.getElementById('final-cta');
    
    if (mobileCta && finalCta && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mobileCta.style.opacity = '0';
                    mobileCta.style.pointerEvents = 'none';
                } else {
                    mobileCta.style.opacity = '1';
                    mobileCta.style.pointerEvents = 'all';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(finalCta);
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
            lenis.start(); 
        } else {
            mobileMenu.classList.add('active');
            lenis.stop(); 
        }
    };

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // ==========================================
    // 7. BEFORE & AFTER SLIDER
    // ==========================================
    const baSlider = document.getElementById('ba-slider');
    const baAfterImg = document.getElementById('ba-after-img');
    const baHandle = document.getElementById('ba-handle');

    if (baSlider && baAfterImg && baHandle) {
        baSlider.addEventListener('input', (e) => {
            const value = e.target.value;
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
                   .from('.announcement-bar', { y: -50, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
                   .from('.massive-title', { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" }, "-=0.5")
                   .from('.hero-separator', { width: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
                   .from('.sub-title', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
                   .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
                   .from('.hero-cta-group .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
                   .from('.site-header', { y: -50, opacity: 0, duration: 1, ease: "power3.out" }, "-=1");

        // --- Scroll Reveal Animations ---
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
        document.body.classList.remove('loading');
        const preloader = document.getElementById('preloader');
        if(preloader) preloader.style.display = 'none';
    }
});