/* ==========================================================================
   GLAYVUE — Premium Interactive Website Script
   Inspired by Googlebook.google smoothness:
   - Particle canvas background
   - IntersectionObserver scroll reveal
   - 3D card tilt with glare
   - Staggered animations
   - FAQ accordion, Showcase tabs, Nav scroll spy
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Dark / Light Theme Toggle
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('glayvue_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'); // default dark

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('glayvue_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' ? `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
      ` : `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      `;
    }
  }

  applyTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------------------------------------------------------
     2. Hero Particle Canvas
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x:       Math.random() * canvas.width,
          y:       Math.random() * canvas.height,
          r:       Math.random() * 1.8 + 0.3,
          dx:      (Math.random() - 0.5) * 0.3,
          dy:      (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          // Color: mix of terracotta, gold, teal
          color:   ['200,75,47', '212,137,10', '42,140,130'][Math.floor(Math.random() * 3)]
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      animFrame = requestAnimationFrame(drawParticles);
    }

    function initCanvas() {
      resizeCanvas();
      createParticles();
      cancelAnimationFrame(animFrame);
      drawParticles();
    }

    initCanvas();
    window.addEventListener('resize', () => {
      initCanvas();
    });
  }

  /* --------------------------------------------------------------------------
     3. Navbar Scroll State & ScrollSpy
     -------------------------------------------------------------------------- */
  const navbar     = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks   = document.querySelectorAll('.nav-links .nav-link');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.body.classList.toggle('mobile-nav-open');
    });
  }

  // ScrollSpy
  const spySections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) spySections.push({ link, section });
    }
  });

  function updateActiveNavLink() {
    if (spySections.length === 0) return;
    const scrollY = window.scrollY + 140;
    const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    if (atBottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      spySections[spySections.length - 1].link.classList.add('active');
      return;
    }

    let activeLink = spySections[0].link;
    for (const { link, section } of spySections) {
      if (scrollY >= section.offsetTop) activeLink = link;
    }
    navLinks.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('resize', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Smooth scroll + close mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        document.body.classList.remove('mobile-nav-open');
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Scroll-Reveal IntersectionObserver  (Re-animates every time you scroll)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal, .hero-content, .hero-visual');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // When element scrolls out of view (above or below), remove 'is-visible'
        // so it re-triggers the animation cleanly every time it is scrolled back into view
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* --------------------------------------------------------------------------
     5. 3D Card Tilt Effect with Glare
     -------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.feature-card');

  tiltCards.forEach(card => {
    const glare = card.querySelector('.tilt-glare');

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const mouseX = e.clientX - cx;
      const mouseY = e.clientY - cy;
      const maxTilt = 10; // degrees

      const rotateY =  (mouseX / (rect.width  / 2)) * maxTilt;
      const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;

      card.style.transform    = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      card.style.transition   = 'transform 0.1s ease';

      // Glare follows mouse
      if (glare) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
        glare.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      if (glare) glare.style.opacity = '0';
    });
  });

  /* --------------------------------------------------------------------------
     6. App Showcase Feature Slider, Tabs & Touch Swipe
     -------------------------------------------------------------------------- */
  const showcaseTabs    = document.querySelectorAll('.showcase-tab-btn');
  const showcaseTitle   = document.getElementById('showcaseTitle');
  const showcaseDesc    = document.getElementById('showcaseDesc');
  const showcaseBullets = document.getElementById('showcaseBullets');
  const showcaseVideo   = document.getElementById('showcaseVideo');
  const showcaseCard    = document.getElementById('showcaseCard');
  const showcasePrevBtn = document.getElementById('showcasePrevBtn');
  const showcaseNextBtn = document.getElementById('showcaseNextBtn');
  const showcaseDots    = document.querySelectorAll('.showcase-dot');

  const featureKeys = ['lidar', 'glazelog', 'community', 'shelf'];
  let currentIdx  = 0;
  let isAnimating = false;

  const showcaseData = {
    lidar: {
      title: "Precision 3D LiDAR Scanning",
      desc:  "Transform physical ceramics into interactive 3D digital assets using your device's built-in LiDAR sensor. Capture intricate curves, wheel ridges, and fine details with high resolution.",
      bullets: [
        "Instant mesh reconstruction directly on device",
        "Export 3D assets in standard USDZ and OBJ formats",
        "Accurate physical dimensions and scale measurement",
        "Seamless overlay of digital glaze simulations"
      ],
      video: "assets/videos/lidar scan.mp4"
    },
    glazelog: {
      title: "Chemical Recipe & Cone Manager",
      desc:  "Keep all your glaze formulas, chemical percentages, cone firings, and firing curves meticulously organized in your digital GlazeLog lab notebook.",
      bullets: [
        "Log firing atmosphere (Oxidation vs. Reduction)",
        "Categorize by Cone 04, Cone 5, Cone 6, Cone 10",
        "Track test tiles, shrinkage, and crazing notes",
        "Search, filter, and favorite your best glazes"
      ],
      video: "assets/videos/lidar scan.mp4"
    },
    community: {
      title: "Potters Hub Social Community",
      desc:  "Connect with thousands of ceramic artists, studio potters, and ceramic sculptors worldwide. Share test tile results, glaze discoveries, and studio inspiration.",
      bullets: [
        "Post high-resolution glaze test tiles & finished pottery",
        "Exchange recipe tips and firing atmosphere feedback",
        "Follow inspiring ceramicists and build your studio network",
        "Bookmark and favorite community glaze formulas"
      ],
      video: "assets/videos/lidar scan.mp4"
    },
    shelf: {
      title: "My Digital Studio Shelf",
      desc:  "Organize your active ceramics, finished works, gallery inventory, and studio collections in a clean visual digital shelf.",
      bullets: [
        "Track pieces from wet clay to bisque and final glaze fire",
        "Archive kiln load histories and firing outcomes",
        "Manage private studio collection vs. public showcase",
        "Earn ceramic milestones and studio achievements"
      ],
      video: "assets/videos/lidar scan.mp4"
    }
  };

  function updateShowcaseContent(key) {
    const data = showcaseData[key];
    if (!data) return;
    if (showcaseTitle) showcaseTitle.textContent = data.title;
    if (showcaseDesc)  showcaseDesc.textContent  = data.desc;
    if (showcaseVideo) {
      showcaseVideo.style.opacity = '0';
      showcaseVideo.style.transform = 'scale(0.95)';
      setTimeout(() => {
        showcaseVideo.src = data.video;
        showcaseVideo.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        showcaseVideo.style.opacity = '1';
        showcaseVideo.style.transform = 'scale(1)';
      }, 150);
    }

    if (showcaseBullets) {
      showcaseBullets.innerHTML = data.bullets.map(b => `
        <li>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          <span>${b}</span>
        </li>
      `).join('');
    }

    showcaseTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === key));
    const targetIndex = featureKeys.indexOf(key);
    showcaseDots.forEach((dot, idx) => dot.classList.toggle('active', idx === targetIndex));
  }

  function goToFeature(newIdx, direction = 'right') {
    if (isAnimating || newIdx === currentIdx) return;
    if (newIdx < 0) newIdx = featureKeys.length - 1;
    if (newIdx >= featureKeys.length) newIdx = 0;

    isAnimating = true;
    const key = featureKeys[newIdx];
    currentIdx = newIdx;

    if (showcaseCard) {
      const exitClass  = direction === 'right' ? 'slide-out-left' : 'slide-out-right';
      const enterClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';

      showcaseCard.classList.add(exitClass);
      setTimeout(() => {
        updateShowcaseContent(key);
        showcaseCard.classList.remove(exitClass);
        showcaseCard.classList.add(enterClass);
        setTimeout(() => {
          showcaseCard.classList.remove(enterClass);
          isAnimating = false;
        }, 400);
      }, 180);
    } else {
      updateShowcaseContent(key);
      isAnimating = false;
    }
  }

  showcaseTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-tab');
      const targetIdx = featureKeys.indexOf(key);
      goToFeature(targetIdx, targetIdx >= currentIdx ? 'right' : 'left');
    });
  });

  if (showcasePrevBtn) showcasePrevBtn.addEventListener('click', () => goToFeature(currentIdx - 1, 'left'));
  if (showcaseNextBtn) showcaseNextBtn.addEventListener('click', () => goToFeature(currentIdx + 1, 'right'));

  showcaseDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToFeature(idx, idx >= currentIdx ? 'right' : 'left'));
  });

  // Touch & Mouse Drag
  const sliderWrapper = document.getElementById('showcaseSlider') || showcaseCard;
  if (sliderWrapper) {
    let startX = 0, startY = 0, deltaX = 0, deltaY = 0;
    let isSwiping = false, isMouseDown = false;

    sliderWrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      deltaX = 0; deltaY = 0; isSwiping = true;
    }, { passive: true });

    sliderWrapper.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      deltaX = e.touches[0].clientX - startX;
      deltaY = e.touches[0].clientY - startY;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goToFeature(currentIdx + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 'right' : 'left');
      }
    });

    sliderWrapper.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      isMouseDown = true; startX = e.clientX; startY = e.clientY; deltaX = 0; deltaY = 0;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      deltaX = e.clientX - startX; deltaY = e.clientY - startY;
    });
    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        goToFeature(currentIdx + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 'right' : 'left');
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. FAQ Accordion
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  /* --------------------------------------------------------------------------
     8. Animated Count-Up Stats (for future use)
     -------------------------------------------------------------------------- */
  const statItems = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function checkStatsScroll() {
    if (statItems.length === 0) return;
    const firstStat = statItems[0];
    const rect = firstStat.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom >= 0;

    if (inView && !animatedStats) {
      animatedStats = true;
      statItems.forEach(stat => {
        const target    = parseInt(stat.getAttribute('data-target') || '0', 10);
        const suffix    = stat.getAttribute('data-suffix') || '';
        let current     = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { current = target; clearInterval(timer); }
          stat.textContent = current.toLocaleString() + suffix;
        }, 30);
      });
    } else if (!inView && animatedStats) {
      animatedStats = false;
    }
  }

  window.addEventListener('scroll', checkStatsScroll, { passive: true });
  checkStatsScroll();

  /* --------------------------------------------------------------------------
     9. Smooth image load fallback for showcase
     -------------------------------------------------------------------------- */
  if (showcaseVideo) {
    showcaseVideo.addEventListener('error', () => {
      showcaseVideo.src = "assets/videos/lidar scan.mp4";
    });
  }

});
