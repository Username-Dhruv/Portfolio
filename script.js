/* ═══════════════════════════════════════════════════════════
   DHRUV PORTFOLIO — script.js
   Vanilla JS + GSAP + ScrollTrigger
   ═══════════════════════════════════════════════════════════ */

   'use strict';

   /* ─── Register GSAP Plugins ────────────────────────────── */
   gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
   
   /* ─── Utility ───────────────────────────────────────────── */
   const $ = (sel, ctx = document) => ctx.querySelector(sel);
   const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
   const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
   const lerp = (a, b, t) => a + (b - a) * t;
   const rand = (min, max) => Math.random() * (max - min) + min;
   const randInt = (min, max) => Math.floor(rand(min, max));
   
   /* ═══════════════════════════════════════════════════════════
      1. PAGE LOADER
      ═══════════════════════════════════════════════════════════ */
   (function initLoader() {
     const loader = $('#pageLoader');
     const fill   = $('#loaderFill');
     if (!loader || !fill) return;
   
     let progress = 0;
     const target = { val: 0 };
   
     // Animate fill bar
     const interval = setInterval(() => {
       progress += rand(8, 18);
       if (progress > 100) progress = 100;
       fill.style.width = progress + '%';
       if (progress >= 100) {
         clearInterval(interval);
         setTimeout(dismissLoader, 300);
       }
     }, 100);
   
     function dismissLoader() {
       gsap.to(loader, {
         opacity: 0,
         duration: 0.7,
         ease: 'power2.inOut',
         onComplete: () => {
           loader.classList.add('loaded');
           loader.style.pointerEvents = 'none';
           document.body.style.overflow = '';
         }
       });
     }
   
     // Prevent scroll during load
     document.body.style.overflow = 'hidden';
   })();
   
   /* ═══════════════════════════════════════════════════════════
      2. GALAXY CANVAS — animated starfield + galaxy
      ═══════════════════════════════════════════════════════════ */
   (function initGalaxy() {
     const canvas = $('#galaxyCanvas');
     if (!canvas) return;
   
     const ctx = canvas.getContext('2d');
     let W, H, stars = [], nebulaClouds = [], animId;
   
     /* ── Resize ── */
     function resize() {
       W = canvas.width  = canvas.offsetWidth;
       H = canvas.height = canvas.offsetHeight;
     }
   
     /* ── Star factory ── */
     function createStar(scatterFull) {
       const angle  = rand(0, Math.PI * 2);
       const radius = scatterFull ? rand(0, Math.max(W, H)) : rand(0, Math.max(W, H) * 0.5);
       return {
         x:     W / 2 + Math.cos(angle) * radius,
         y:     H / 2 + Math.sin(angle) * radius,
         size:  rand(0.3, 2.2),
         alpha: rand(0.1, 1),
         speed: rand(0.0003, 0.0015),
         twinkleSpeed: rand(0.005, 0.025),
         twinkleDir: Math.random() > 0.5 ? 1 : -1,
         hue:   Math.random() > 0.85
                  ? (Math.random() > 0.5 ? '180,220,255' : '220,180,255')
                  : '255,255,255',
         orbitRadius: radius,
         orbitAngle:  angle,
         orbitCx: W / 2,
         orbitCy: H / 2,
       };
     }
   
     /* ── Nebula cloud factory ── */
     function createNebula() {
       return {
         x:      rand(0, W),
         y:      rand(0, H),
         rx:     rand(80, 220),
         ry:     rand(50, 140),
         rot:    rand(0, Math.PI),
         alpha:  rand(0.012, 0.055),
         hue:    randInt(240, 300), // purple-blue range
         drift:  rand(-0.08, 0.08),
       };
     }
   
     /* ── Init population ── */
     function populate() {
       stars = Array.from({ length: 260 }, () => createStar(true));
       nebulaClouds = Array.from({ length: 8 }, createNebula);
     }
   
     /* ── Draw loop ── */
     let t = 0;
     function draw() {
       animId = requestAnimationFrame(draw);
       t += 0.016;
   
       ctx.clearRect(0, 0, W, H);
   
       // Deep space gradient bg
       const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
       bg.addColorStop(0,   'rgba(14, 20, 50, 0.55)');
       bg.addColorStop(0.5, 'rgba(6, 11, 26, 0.4)');
       bg.addColorStop(1,   'rgba(3, 7, 18, 0.25)');
       ctx.fillStyle = bg;
       ctx.fillRect(0, 0, W, H);
   
       // Nebula clouds
       nebulaClouds.forEach(nc => {
         nc.rot += 0.0003;
         nc.x   += nc.drift * 0.05;
         if (nc.x > W + nc.rx) nc.x = -nc.rx;
         if (nc.x < -nc.rx)    nc.x = W + nc.rx;
   
         ctx.save();
         ctx.translate(nc.x, nc.y);
         ctx.rotate(nc.rot);
         const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, nc.rx);
         grad.addColorStop(0,   `hsla(${nc.hue}, 80%, 65%, ${nc.alpha * 1.6})`);
         grad.addColorStop(0.5, `hsla(${nc.hue + 30}, 70%, 55%, ${nc.alpha})`);
         grad.addColorStop(1,   'rgba(0,0,0,0)');
         ctx.scale(1, nc.ry / nc.rx);
         ctx.beginPath();
         ctx.arc(0, 0, nc.rx, 0, Math.PI * 2);
         ctx.fillStyle = grad;
         ctx.fill();
         ctx.restore();
       });
   
       // Stars — slow galaxy rotation
       stars.forEach(s => {
         // Twinkle
         s.alpha += s.twinkleSpeed * s.twinkleDir;
         if (s.alpha >= 1)    { s.alpha = 1;    s.twinkleDir = -1; }
         if (s.alpha <= 0.05) { s.alpha = 0.05; s.twinkleDir =  1; }
   
         // Gentle orbit around centre
         s.orbitAngle += s.speed;
         s.x = s.orbitCx + Math.cos(s.orbitAngle) * s.orbitRadius;
         s.y = s.orbitCy + Math.sin(s.orbitAngle) * s.orbitRadius;
   
         // Glow for larger stars
         if (s.size > 1.4) {
           const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
           glow.addColorStop(0,   `rgba(${s.hue}, ${s.alpha * 0.6})`);
           glow.addColorStop(1,   'rgba(0,0,0,0)');
           ctx.beginPath();
           ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
           ctx.fillStyle = glow;
           ctx.fill();
         }
   
         ctx.beginPath();
         ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(${s.hue}, ${s.alpha})`;
         ctx.fill();
       });
   
       // Milky-way-style arm overlay
       const armGrad = ctx.createLinearGradient(0, H * 0.3, W, H * 0.7);
       armGrad.addColorStop(0,   'rgba(80,60,160,0)');
       armGrad.addColorStop(0.4, 'rgba(100,80,200,0.04)');
       armGrad.addColorStop(0.6, 'rgba(60,120,200,0.04)');
       armGrad.addColorStop(1,   'rgba(80,60,160,0)');
       ctx.fillStyle = armGrad;
       ctx.fillRect(0, 0, W, H);
     }
   
     /* ── Boot ── */
     resize();
     populate();
     draw();
   
     // Re-center orbits on resize
     window.addEventListener('resize', () => {
       resize();
       const cx = W / 2, cy = H / 2;
       stars.forEach(s => { s.orbitCx = cx; s.orbitCy = cy; });
       nebulaClouds = Array.from({ length: 8 }, createNebula);
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      3. FLOATING STAR PARTICLES (DOM — parallax layers)
      ═══════════════════════════════════════════════════════════ */
   (function initStarLayers() {
     const layers = [
       { id: 'starsFar',  count: 80, size: [1, 2],   opacity: [0.15, 0.5]  },
       { id: 'starsMid',  count: 50, size: [1.5, 3], opacity: [0.3,  0.7]  },
       { id: 'starsNear', count: 25, size: [2, 4],   opacity: [0.5,  1]    },
     ];
   
     layers.forEach(layer => {
       const el = $(`#${layer.id}`);
       if (!el) return;
       for (let i = 0; i < layer.count; i++) {
         const dot = document.createElement('span');
         dot.className = 'star-particle';
         const s = rand(...layer.size);
         dot.style.cssText = `
           width:${s}px; height:${s}px;
           left:${rand(0,100)}%;
           top:${rand(0,100)}%;
           opacity:${rand(...layer.opacity)};
           animation: twinkleStar ${rand(2,6)}s ${rand(0,4)}s ease-in-out infinite alternate;
         `;
         el.appendChild(dot);
       }
     });
   
     // Inject twinkle keyframe once
     if (!document.getElementById('star-keyframes')) {
       const style = document.createElement('style');
       style.id = 'star-keyframes';
       style.textContent = `
         @keyframes twinkleStar {
           from { opacity: var(--op-from, 0.1); transform: scale(1); }
           to   { opacity: var(--op-to, 0.9);   transform: scale(1.4); }
         }
       `;
       document.head.appendChild(style);
     }
   })();
   
   /* ═══════════════════════════════════════════════════════════
      4. FOOTER STARS
      ═══════════════════════════════════════════════════════════ */
   (function initFooterStars() {
     const container = $('#footerStars');
     if (!container) return;
     for (let i = 0; i < 60; i++) {
       const dot = document.createElement('span');
       dot.className = 'star-particle';
       const s = rand(0.5, 2);
       dot.style.cssText = `
         width:${s}px; height:${s}px;
         left:${rand(0,100)}%;
         top:${rand(0,100)}%;
         opacity:${rand(0.05, 0.4)};
       `;
       container.appendChild(dot);
     }
   })();
   
   /* ═══════════════════════════════════════════════════════════
      5. CONTACT SECTION PARTICLES
      ═══════════════════════════════════════════════════════════ */
   (function initContactParticles() {
     const container = $('#contactParticles');
     if (!container) return;
     for (let i = 0; i < 40; i++) {
       const dot = document.createElement('span');
       dot.className = 'star-particle';
       const s = rand(1, 3);
       dot.style.cssText = `
         width:${s}px; height:${s}px;
         left:${rand(0,100)}%;
         top:${rand(0,100)}%;
         opacity:${rand(0.05, 0.3)};
         background: ${Math.random() > 0.5 ? '#22d3ee' : '#a855f7'};
         box-shadow: 0 0 ${s * 3}px currentColor;
       `;
       container.appendChild(dot);
     }
   })();
   
   /* ═══════════════════════════════════════════════════════════
      6. CUSTOM CURSOR
      ═══════════════════════════════════════════════════════════ */
   (function initCursor() {
     const outer = $('#cursorOuter');
     const inner = $('#cursorInner');
     if (!outer || !inner) return;
   
     // Detect touch → skip cursor
     if (window.matchMedia('(pointer: coarse)').matches) return;
   
     let mx = 0, my = 0, ox = 0, oy = 0;
   
     document.addEventListener('mousemove', e => {
       mx = e.clientX;
       my = e.clientY;
       // Inner follows instantly
       inner.style.left = mx + 'px';
       inner.style.top  = my + 'px';
     });
   
     // Outer follows with lerp
     (function animCursor() {
       requestAnimationFrame(animCursor);
       ox = lerp(ox, mx, 0.12);
       oy = lerp(oy, my, 0.12);
       outer.style.left = ox + 'px';
       outer.style.top  = oy + 'px';
     })();
   
     // Hover effects
     const hoverTargets = 'a, button, .skill-card, .project-card, .testi-card, .filter-btn, .test-btn, .contact-link-item, .fsocial';
     document.addEventListener('mouseover', e => {
       if (e.target.closest(hoverTargets)) outer.classList.add('hovering');
     });
     document.addEventListener('mouseout', e => {
       if (e.target.closest(hoverTargets)) outer.classList.remove('hovering');
     });
   
     document.addEventListener('mousedown', () => {
       gsap.to(inner, { scale: 0.6, duration: 0.15 });
       gsap.to(outer, { scale: 0.8, duration: 0.15 });
     });
     document.addEventListener('mouseup', () => {
       gsap.to(inner, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
       gsap.to(outer, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      7. NAVBAR — scroll state, active links, hamburger
      ═══════════════════════════════════════════════════════════ */
   (function initNavbar() {
     const navbar    = $('#navbar');
     const hamburger = $('#hamburger');
     const mobileMenu= $('#mobileMenu');
     const navLinks  = $$('.nav-link');
     const mobLinks  = $$('.mob-link');
     const sections  = $$('section[id]');
     if (!navbar) return;
   
     /* Scroll → glassy state */
     window.addEventListener('scroll', () => {
       navbar.classList.toggle('scrolled', window.scrollY > 60);
       updateActiveLink();
       toggleBackToTop();
     }, { passive: true });
   
     /* Active link based on scroll position */
     function updateActiveLink() {
       let current = '';
       sections.forEach(sec => {
         if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
       });
       navLinks.forEach(a => {
         a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
       });
     }
   
     /* Hamburger toggle */
     function toggleMenu(open) {
       hamburger.classList.toggle('open', open);
       mobileMenu.classList.toggle('open', open);
       document.body.style.overflow = open ? 'hidden' : '';
     }
   
     hamburger.addEventListener('click', () => {
       const isOpen = mobileMenu.classList.contains('open');
       toggleMenu(!isOpen);
     });
   
     // Close mobile menu on link click
     mobLinks.forEach(link => {
       link.addEventListener('click', () => toggleMenu(false));
     });
   
     // Close on outside click
     document.addEventListener('click', e => {
       if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
         toggleMenu(false);
       }
     });
   
     /* Smooth scroll for all anchor links */
     document.addEventListener('click', e => {
       const link = e.target.closest('a[href^="#"]');
       if (!link) return;
       const target = $(link.getAttribute('href'));
       if (!target) return;
       e.preventDefault();
       gsap.to(window, {
         scrollTo: { y: target, offsetY: 80 },
         duration: 1.1,
         ease: 'power3.inOut'
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      8. BACK TO TOP BUTTON
      ═══════════════════════════════════════════════════════════ */
   function toggleBackToTop() {
     const btn = $('#backToTop');
     if (!btn) return;
     btn.classList.toggle('visible', window.scrollY > 500);
   }
   $('#backToTop')?.addEventListener('click', () => {
     gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' });
   });
   
   /* ═══════════════════════════════════════════════════════════
      9. HERO MOUSE PARALLAX
      ═══════════════════════════════════════════════════════════ */
   (function initHeroParallax() {
     const hero    = $('.hero');
     const orbs    = $$('.orb');
     const content = $('#heroContent');
     const layers  = [
       { el: $('#starsFar'),  depth: 0.008 },
       { el: $('#starsMid'),  depth: 0.015 },
       { el: $('#starsNear'), depth: 0.025 },
       { el: $('#nebula'),    depth: 0.012 },
     ];
     if (!hero) return;
   
     let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
   
     hero.addEventListener('mousemove', e => {
       const rect = hero.getBoundingClientRect();
       targetX = (e.clientX - rect.left - rect.width  / 2);
       targetY = (e.clientY - rect.top  - rect.height / 2);
     });
   
     hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
   
     (function animParallax() {
       requestAnimationFrame(animParallax);
       currentX = lerp(currentX, targetX, 0.06);
       currentY = lerp(currentY, targetY, 0.06);
   
       // Star layers
       layers.forEach(({ el, depth }) => {
         if (!el) return;
         el.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
       });
   
       // Orbs
       orbs.forEach((orb, i) => {
         const d = (i + 1) * 0.02;
         const dir = i % 2 === 0 ? 1 : -1;
         orb.style.transform = `translate(${currentX * d * dir}px, ${currentY * d * dir}px)`;
       });
   
       // Subtle content tilt
       if (content) {
         content.style.transform = `
           perspective(1000px)
           rotateY(${currentX * 0.003}deg)
           rotateX(${-currentY * 0.003}deg)
         `;
       }
     })();
   })();
   
   /* ═══════════════════════════════════════════════════════════
      10. TYPED TEXT EFFECT
      ═══════════════════════════════════════════════════════════ */
   (function initTyped() {
     const el = $('#typedText');
     if (!el) return;
   
     const strings = [
       'Web Developer',
       'UI/UX Designer',
       'Front-End Developer',
       'Creative Designer',
       'Freelance Designer and Developer',
     ];
   
     let strIdx  = 0;
     let charIdx = 0;
     let deleting = false;
     let pauseFrames = 0;
   
     function tick() {
       const current = strings[strIdx];
   
       if (!deleting && charIdx <= current.length) {
         el.textContent = current.slice(0, charIdx++);
         if (charIdx > current.length) { pauseFrames = 60; deleting = true; }
         setTimeout(tick, 80);
       } else if (deleting && charIdx >= 0) {
         if (pauseFrames > 0) { pauseFrames--; setTimeout(tick, 16); return; }
         el.textContent = current.slice(0, charIdx--);
         if (charIdx < 0) {
           deleting = false;
           charIdx  = 0;
           strIdx   = (strIdx + 1) % strings.length;
           setTimeout(tick, 400);
         } else {
           setTimeout(tick, 40);
         }
       }
     }
   
     // Start after loader / hero animation settles
     setTimeout(tick, 2200);
   })();
   
   /* ═══════════════════════════════════════════════════════════
      11. SCROLL-TRIGGERED REVEAL ANIMATIONS (GSAP)
      ═══════════════════════════════════════════════════════════ */
   (function initScrollAnimations() {
   
     /* Generic reveal classes */
     function makeReveal(selector, xFrom, yFrom) {
       gsap.utils.toArray(selector).forEach((el, i) => {
         const delay = +(el.dataset.delay || 0) / 1000;
         gsap.fromTo(el,
           { opacity: 0, x: xFrom, y: yFrom },
           {
             opacity: 1, x: 0, y: 0,
             duration: 0.9,
             delay,
             ease: 'power3.out',
             scrollTrigger: {
               trigger: el,
               start: 'top 88%',
               toggleActions: 'play none none none',
             }
           }
         );
       });
     }
   
     makeReveal('.reveal-up',    0,   60);
     makeReveal('.reveal-left', -60,   0);
     makeReveal('.reveal-right', 60,   0);
   
     /* Section headers — stagger children */
     gsap.utils.toArray('.section-header').forEach(header => {
       gsap.from(header.children, {
         opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out',
         scrollTrigger: { trigger: header, start: 'top 85%' }
       });
     });
   
     /* About timeline items */
     gsap.utils.toArray('.timeline-item').forEach((item, i) => {
       gsap.from(item, {
         opacity: 0, x: -40, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
         scrollTrigger: { trigger: item, start: 'top 88%' }
       });
     });
   
     /* Project cards stagger */
     ScrollTrigger.batch('.project-card', {
       onEnter: batch =>
         gsap.from(batch, {
           opacity: 0, y: 50, stagger: 0.12, duration: 0.8, ease: 'power3.out'
         }),
       start: 'top 88%',
     });
   
     /* Skill groups stagger */
     ScrollTrigger.batch('.skill-group', {
       onEnter: batch =>
         gsap.from(batch, {
           opacity: 0, y: 40, stagger: 0.15, duration: 0.7, ease: 'power3.out'
         }),
       start: 'top 85%',
     });
   
     /* Testimonial cards */
     ScrollTrigger.batch('.testi-card', {
       onEnter: batch =>
         gsap.from(batch, {
           opacity: 0, scale: 0.92, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)'
         }),
       start: 'top 85%',
     });
   
     /* Contact grid children */
     gsap.utils.toArray('.contact-link-item').forEach((item, i) => {
       gsap.from(item, {
         opacity: 0, x: -30, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
         scrollTrigger: { trigger: item, start: 'top 90%' }
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      12. HERO SCROLL PARALLAX (scrollY-based)
      ═══════════════════════════════════════════════════════════ */
   (function initHeroScrollParallax() {
     const hero    = $('.hero');
     const content = $('#heroContent');
     const scroller= $('#scrollIndicator');
   
     if (!hero) return;
   
     gsap.to(content, {
       y: 120,
       opacity: 0.3,
       ease: 'none',
       scrollTrigger: {
         trigger: hero,
         start: 'top top',
         end: 'bottom top',
         scrub: true,
       }
     });
   
     if (scroller) {
       gsap.to(scroller, {
         opacity: 0, y: 20,
         ease: 'none',
         scrollTrigger: {
           trigger: hero,
           start: 'top top',
           end: '20% top',
           scrub: true,
         }
       });
     }
   
     // Parallax the canvas/orbs with scroll
     gsap.to('#galaxyCanvas', {
       y: '-20%',
       ease: 'none',
       scrollTrigger: {
         trigger: hero,
         start: 'top top',
         end: 'bottom top',
         scrub: 1,
       }
     });
   
     gsap.to('.orb-1', {
       y: '-30%', x: '5%',
       ease: 'none',
       scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 2 }
     });
     gsap.to('.orb-2', {
       y: '25%', x: '-8%',
       ease: 'none',
       scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 }
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      13. ANIMATED EXPERIENCE COUNTERS
      ═══════════════════════════════════════════════════════════ */
   (function initCounters() {
     const counters = $$('.counter-num[data-target]');
     counters.forEach(counter => {
       const target = +counter.dataset.target;
       ScrollTrigger.create({
         trigger: counter,
         start: 'top 85%',
         once: true,
         onEnter: () => {
           gsap.fromTo(counter,
             { textContent: 0 },
             {
               textContent: target,
               duration: 1.8,
               ease: 'power2.out',
               snap: { textContent: 1 },
               onUpdate() {
                 counter.textContent = Math.floor(+counter.textContent);
               }
             }
           );
         }
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      14. SKILL BAR ANIMATIONS
      ═══════════════════════════════════════════════════════════ */
   (function initSkillBars() {
     const fills = $$('.skill-fill[data-width]');
     fills.forEach(fill => {
       const width = +fill.dataset.width;
       ScrollTrigger.create({
         trigger: fill,
         start: 'top 90%',
         once: true,
         onEnter: () => {
           gsap.to(fill, {
             width: width + '%',
             duration: 1.4,
             ease: 'power3.out',
             delay: rand(0, 0.3),
           });
         }
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      15. ABOUT SECTION — avatar 3D tilt on hover
      ═══════════════════════════════════════════════════════════ */
   (function initAvatarTilt() {
     const frame = $('.avatar-frame');
     if (!frame) return;
   
     frame.addEventListener('mousemove', e => {
       const rect = frame.getBoundingClientRect();
       const cx   = rect.left + rect.width  / 2;
       const cy   = rect.top  + rect.height / 2;
       const rx   = clamp((e.clientY - cy) / (rect.height / 2) * -12, -12, 12);
       const ry   = clamp((e.clientX - cx) / (rect.width  / 2) *  12, -12, 12);
       gsap.to(frame, {
         rotateX: rx, rotateY: ry,
         transformPerspective: 800,
         duration: 0.3, ease: 'power2.out'
       });
     });
   
     frame.addEventListener('mouseleave', () => {
       gsap.to(frame, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      16. SKILL CARD HOVER — glow magnetic effect
      ═══════════════════════════════════════════════════════════ */
   (function initSkillMagnetic() {
     $$('.skill-card').forEach(card => {
       card.addEventListener('mousemove', e => {
         const rect = card.getBoundingClientRect();
         const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
         const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
         gsap.to(card, {
           x, y,
           rotateX: -y * 0.4,
           rotateY:  x * 0.4,
           transformPerspective: 500,
           duration: 0.3,
           ease: 'power2.out'
         });
       });
       card.addEventListener('mouseleave', () => {
         gsap.to(card, {
           x: 0, y: 0, rotateX: 0, rotateY: 0,
           duration: 0.5, ease: 'elastic.out(1, 0.5)'
         });
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      17. PROJECT FILTER TABS
      ═══════════════════════════════════════════════════════════ */
   (function initProjectFilters() {
     const filterBtns = $$('.filter-btn');
     const cards      = $$('.project-card');
     if (!filterBtns.length) return;
   
     filterBtns.forEach(btn => {
       btn.addEventListener('click', () => {
         filterBtns.forEach(b => b.classList.remove('active'));
         btn.classList.add('active');
   
         const filter = btn.dataset.filter;
         cards.forEach(card => {
           const cats = card.dataset.category || '';
           const show = filter === 'all' || cats.split(' ').some(c => c === filter);
   
           if (show) {
             card.style.display = '';
             gsap.fromTo(card,
               { opacity: 0, scale: 0.9, y: 20 },
               { opacity: 1, scale: 1,   y: 0, duration: 0.5, ease: 'back.out(1.4)' }
             );
           } else {
             gsap.to(card, {
               opacity: 0, scale: 0.85, y: -10, duration: 0.3, ease: 'power2.in',
               onComplete: () => { card.style.display = 'none'; }
             });
           }
         });
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      18. PROJECT CARD — dynamic glow follows cursor
      ═══════════════════════════════════════════════════════════ */
   (function initProjectCardGlow() {
     $$('.project-card').forEach(card => {
       card.addEventListener('mousemove', e => {
         const rect = card.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         card.style.setProperty('--mx', `${x}px`);
         card.style.setProperty('--my', `${y}px`);
         // Dynamic border glow
         const glow = card.querySelector('.card-glow');
         if (glow) {
           const pct = (x / rect.width) * 100;
           glow.style.background = `linear-gradient(90deg, transparent ${pct - 20}%, #a855f7 ${pct}%, #22d3ee ${pct + 15}%, transparent ${pct + 35}%)`;
         }
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      19. TESTIMONIAL SLIDER
      ═══════════════════════════════════════════════════════════ */
   (function initTestimonials() {
     const track   = $('#testimonialsTrack');
     const prevBtn = $('#testPrev');
     const nextBtn = $('#testNext');
     const dots    = $$('.test-dot');
     if (!track || !prevBtn || !nextBtn) return;
   
     const cards       = $$('.testi-card', track);
     const total       = cards.length;
     let current       = 0;
     let autoTimer     = null;
     let cardsVisible  = getCardsVisible();
   
     function getCardsVisible() {
       if (window.innerWidth < 640)  return 1;
       if (window.innerWidth < 900)  return 2;
       return 3;
     }
   
     function getMaxIndex() {
       return Math.max(0, total - cardsVisible);
     }
   
     function goTo(idx) {
       current = clamp(idx, 0, getMaxIndex());
       const cardWidth = cards[0].getBoundingClientRect().width + 24; // gap
       gsap.to(track, {
         x: -current * cardWidth,
         duration: 0.6,
         ease: 'power3.inOut'
       });
       dots.forEach((d, i) => d.classList.toggle('active', i === current));
     }
   
     prevBtn.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
     nextBtn.addEventListener('click', () => { resetAuto(); goTo(current + 1); });
     dots.forEach((d, i) => d.addEventListener('click', () => { resetAuto(); goTo(i); }));
   
     // Auto-advance
     function startAuto() {
       autoTimer = setInterval(() => {
         const next = current >= getMaxIndex() ? 0 : current + 1;
         goTo(next);
       }, 4500);
     }
     function resetAuto() { clearInterval(autoTimer); startAuto(); }
     startAuto();
   
     // Touch swipe
     let touchStartX = 0;
     track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
     track.addEventListener('touchend',   e => {
       const diff = touchStartX - e.changedTouches[0].clientX;
       if (Math.abs(diff) > 40) { resetAuto(); goTo(diff > 0 ? current + 1 : current - 1); }
     });
   
     // Recalculate on resize
     window.addEventListener('resize', () => {
       cardsVisible = getCardsVisible();
       current = clamp(current, 0, getMaxIndex());
       goTo(current);
     });
   
     // GSAP parallax on scroll
     gsap.to(track, {
       y: '-4%',
       ease: 'none',
       scrollTrigger: {
         trigger: '.testimonials',
         start: 'top bottom',
         end: 'bottom top',
         scrub: 1.5,
       }
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      20. CONTACT FORM
      ═══════════════════════════════════════════════════════════ */
   (function initContactForm() {
     const form    = $('#contactForm');
     const success = $('#formSuccess');
     if (!form) return;
   
     // Floating label / input focus effects
     $$('input, textarea', form).forEach(input => {
       input.addEventListener('focus', () => {
         const wrap = input.closest('.input-wrap');
         if (wrap) {
           gsap.to(wrap.querySelector('.input-icon'), {
             color: '#22d3ee', scale: 1.15, duration: 0.25, ease: 'back.out(2)'
           });
         }
       });
       input.addEventListener('blur', () => {
         const wrap = input.closest('.input-wrap');
         if (wrap && !input.value) {
           gsap.to(wrap.querySelector('.input-icon'), {
             color: 'rgba(255,255,255,0.25)', scale: 1, duration: 0.25
           });
         }
       });
     });
   
     form.addEventListener('submit', e => {
       e.preventDefault();
   
       const btn = form.querySelector('.form-submit');
       const originalHTML = btn.innerHTML;
   
       // Validate
       const name  = $('#fname',    form).value.trim();
       const email = $('#femail',   form).value.trim();
       const msg   = $('#fmessage', form).value.trim();
       if (!name || !email || !msg) {
         // Shake invalid fields
         [name ? null : $('#fname', form), email ? null : $('#femail', form), msg ? null : $('#fmessage', form)]
           .filter(Boolean)
           .forEach(field => {
             gsap.to(field, {
               x: [-6, 6, -5, 5, -3, 3, 0],
               duration: 0.4,
               ease: 'none',
             });
             field.style.borderColor = '#f43f5e';
             field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
           });
         return;
       }
   
       // Loading state
       btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
       btn.disabled  = true;
   
       // Simulate send (replace with real API call)
       setTimeout(() => {
         btn.innerHTML = originalHTML;
         btn.disabled  = false;
         form.reset();
         if (success) {
           success.classList.add('show');
           gsap.from(success, { opacity: 0, y: 10, duration: 0.4 });
           setTimeout(() => {
             gsap.to(success, { opacity: 0, duration: 0.4, onComplete: () => success.classList.remove('show') });
           }, 4000);
         }
       }, 1600);
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      21. SECTION PARALLAX DEPTH (section bg elements)
      ═══════════════════════════════════════════════════════════ */
   (function initSectionParallax() {
   
     // About floating rings parallax
     ['.ring-1', '.ring-2', '.ring-3'].forEach((sel, i) => {
       const el = $(sel);
       if (!el) return;
       const speed = (i + 1) * 0.08;
       gsap.to(el, {
         y: `${(i % 2 === 0 ? '-' : '')}${12 + i * 5}%`,
         ease: 'none',
         scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: speed * 10 }
       });
     });
   
     // Skills nebula parallax
     gsap.to('.skills-nebula', {
       y: '-15%',
       ease: 'none',
       scrollTrigger: { trigger: '.skills', start: 'top bottom', end: 'bottom top', scrub: 2 }
     });
   
     // Projects bg fx
     gsap.to('.projects-bg-fx', {
       y: '-10%',
       ease: 'none',
       scrollTrigger: { trigger: '.projects', start: 'top bottom', end: 'bottom top', scrub: 1.5 }
     });
   
     // Contact orb drift
     gsap.to('.contact-glow-orb', {
       y: '-20%', x: '5%',
       ease: 'none',
       scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: 2 }
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      22. GSAP HORIZONTAL SCROLL HINT — skills ticker
      ═══════════════════════════════════════════════════════════ */
   (function initSkillsTicker() {
     // Inject a subtle floating icon ticker above skills
     const skillsSection = $('.skills');
     if (!skillsSection) return;
   
     const icons = ['fa-code', 'fa-palette', 'fa-database', 'fa-terminal', 'fa-pen-nib', 'fa-layer-group', 'fa-wand-magic-sparkles', 'fa-bolt'];
   
     const tickerWrap = document.createElement('div');
     tickerWrap.style.cssText = `
       position: absolute; top: 20px; left: 0; right: 0;
       overflow: hidden; height: 32px; pointer-events: none; z-index: 1;
       mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
       -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
     `;
   
     const tickerInner = document.createElement('div');
     tickerInner.style.cssText = 'display:flex; gap:40px; width:max-content;';
   
     // Duplicate for seamless loop
     [...icons, ...icons, ...icons].forEach(ic => {
       const span = document.createElement('span');
       span.style.cssText = `color:rgba(34,211,238,0.15); font-size:1rem; flex-shrink:0;`;
       span.innerHTML = `<i class="fa-solid ${ic}"></i>`;
       tickerInner.appendChild(span);
     });
   
     tickerWrap.appendChild(tickerInner);
     skillsSection.prepend(tickerWrap);
   
     gsap.to(tickerInner, {
       x: '-33.33%',
       duration: 18,
       ease: 'none',
       repeat: -1,
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      23. FOOTER YEAR
      ═══════════════════════════════════════════════════════════ */
   const yearEl = $('#footerYear');
   if (yearEl) yearEl.textContent = new Date().getFullYear();
   
   /* ═══════════════════════════════════════════════════════════
      24. SECTION TITLE SPLIT-TEXT REVEAL (GSAP)
      ═══════════════════════════════════════════════════════════ */
      (function initTitleSplits() {
        $$('.section-title').forEach(title => {
          if (title.querySelector('span')) return;
          // Walk child nodes so we preserve <span class="gradient-text"> and other tags
          const nodes = Array.from(title.childNodes);
          title.innerHTML = '';
       
          nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              // Split plain text into individual word spans
              const words = node.textContent.split(/(\s+)/);
              words.forEach(word => {
                if (/^\s+$/.test(word) || word === '') {
                  // Preserve whitespace as a text node
                  title.appendChild(document.createTextNode(word));
                } else {
                  const outer = document.createElement('span');
                  outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
                  const inner = document.createElement('span');
                  inner.className = 'word-inner';
                  inner.style.cssText = 'display:inline-block;';
                  inner.textContent = word;
                  outer.appendChild(inner);
                  title.appendChild(outer);
                }
              });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Wrap the whole element (e.g. <span class="gradient-text">) in a single word-inner
              const outer = document.createElement('span');
              outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
              const inner = document.createElement('span');
              inner.className = 'word-inner';
              inner.style.cssText = 'display:inline-block;';
              inner.appendChild(node.cloneNode(true));
              outer.appendChild(inner);
              title.appendChild(outer);
            }
          });
       
          gsap.from($$('.word-inner', title), {
            y: '110%', duration: 0.8, stagger: 0.08, ease: 'power4.out',
            scrollTrigger: { trigger: title, start: 'top 88%', once: true }
          });
        });
      })();
   
   /* ═══════════════════════════════════════════════════════════
      25. GSAP MAGNETIC BUTTONS (CTA buttons)
      ═══════════════════════════════════════════════════════════ */
   (function initMagneticBtns() {
     $$('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
       btn.addEventListener('mousemove', e => {
         const rect = btn.getBoundingClientRect();
         const cx = rect.left + rect.width  / 2;
         const cy = rect.top  + rect.height / 2;
         const dx = (e.clientX - cx) * 0.3;
         const dy = (e.clientY - cy) * 0.3;
         gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
       });
       btn.addEventListener('mouseleave', () => {
         gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      26. PAGE TRANSITION FLASH ON EXTERNAL LINKS
      ═══════════════════════════════════════════════════════════ */
   (function initExternalLinkFlash() {
     // Subtle border glow ripple on external links
     $$('a[target="_blank"]').forEach(a => {
       a.addEventListener('click', () => {
         const flash = document.createElement('div');
         flash.style.cssText = `
           position:fixed; inset:0; background:rgba(34,211,238,0.03);
           pointer-events:none; z-index:9990;
         `;
         document.body.appendChild(flash);
         gsap.to(flash, { opacity: 0, duration: 0.5, onComplete: () => flash.remove() });
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      27. SCROLL PROGRESS LINE
      ═══════════════════════════════════════════════════════════ */
   (function initScrollProgress() {
     const bar = document.createElement('div');
     bar.style.cssText = `
       position: fixed; top: 0; left: 0; height: 2px; width: 0%;
       background: linear-gradient(90deg, #7c3aed, #22d3ee, #f97316);
       z-index: 9997; pointer-events: none;
       box-shadow: 0 0 8px rgba(34,211,238,0.5);
       transition: width 0.1s linear;
     `;
     document.body.appendChild(bar);
   
     window.addEventListener('scroll', () => {
       const scrollTop  = document.documentElement.scrollTop;
       const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
       const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
       bar.style.width = pct + '%';
     }, { passive: true });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      28. GSAP ZOOM REVEAL — About section visual
      ═══════════════════════════════════════════════════════════ */
   (function initZoomReveal() {
     const avatar = $('.avatar-frame');
     if (!avatar) return;
     gsap.from(avatar, {
       scale: 0.6,
       opacity: 0,
       duration: 1.1,
       ease: 'back.out(1.6)',
       scrollTrigger: { trigger: avatar, start: 'top 88%', once: true }
     });
   
     const rings = $$('.a-ring');
     rings.forEach((ring, i) => {
       gsap.from(ring, {
         scale: 0, opacity: 0,
         duration: 1.2,
         delay: i * 0.15,
         ease: 'back.out(1.4)',
         scrollTrigger: { trigger: avatar, start: 'top 88%', once: true }
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      29. GSAP STAGGER — counter cards pop in
      ═══════════════════════════════════════════════════════════ */
   (function initCounterCardAnim() {
     const cards = $$('.counter-card');
     gsap.from(cards, {
       scale: 0.7, opacity: 0, y: 20,
       stagger: 0.12, duration: 0.7, ease: 'back.out(1.8)',
       scrollTrigger: { trigger: '.exp-counters', start: 'top 88%', once: true }
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      30. HERO SECTION — particle burst on CTA click
      ═══════════════════════════════════════════════════════════ */
   (function initCtaBurst() {
     $$('.btn-primary').forEach(btn => {
       btn.addEventListener('click', e => {
         const rect = btn.getBoundingClientRect();
         for (let i = 0; i < 12; i++) {
           const particle = document.createElement('span');
           const size     = rand(4, 10);
           const angle    = rand(0, Math.PI * 2);
           const dist     = rand(40, 120);
           const colors   = ['#22d3ee', '#a855f7', '#f97316', '#fff'];
           particle.style.cssText = `
             position: fixed;
             width: ${size}px; height: ${size}px;
             border-radius: 50%;
             background: ${colors[randInt(0, colors.length)]};
             left: ${rect.left + rect.width / 2}px;
             top:  ${rect.top  + rect.height/ 2}px;
             pointer-events: none;
             z-index: 9996;
             transform: translate(-50%, -50%);
           `;
           document.body.appendChild(particle);
           gsap.to(particle, {
             x: Math.cos(angle) * dist,
             y: Math.sin(angle) * dist,
             opacity: 0,
             scale:   rand(0.1, 0.6),
             duration: rand(0.5, 1),
             ease: 'power2.out',
             onComplete: () => particle.remove(),
           });
         }
       });
     });
   })();
   
   /* ═══════════════════════════════════════════════════════════
      31. KEYBOARD ACCESSIBILITY — escape closes mobile menu
      ═══════════════════════════════════════════════════════════ */
   document.addEventListener('keydown', e => {
     if (e.key === 'Escape') {
       const mobileMenu = $('#mobileMenu');
       const hamburger  = $('#hamburger');
       if (mobileMenu?.classList.contains('open')) {
         mobileMenu.classList.remove('open');
         hamburger?.classList.remove('open');
         document.body.style.overflow = '';
       }
     }
   });
   
   /* ═══════════════════════════════════════════════════════════
      32. INTERSECTION OBSERVER fallback for CSS reveals
      ═══════════════════════════════════════════════════════════ */
   (function initIntersectionFallback() {
     // For elements that CSS transitions need a class toggle
     const targets = $$('.reveal-up, .reveal-left, .reveal-right');
     if (!targets.length) return;
   
     const obs = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('revealed');
           obs.unobserve(entry.target);
         }
       });
     }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
   
     targets.forEach(el => obs.observe(el));
   })();
   
   /* ═══════════════════════════════════════════════════════════
      INIT COMPLETE LOG
      ═══════════════════════════════════════════════════════════ */
   console.log(
     '%c< DHRUV /> Portfolio Loaded ✦',
     'color:#22d3ee; font-family: monospace; font-size:14px; font-weight:bold; text-shadow: 0 0 10px #22d3ee;'
   );