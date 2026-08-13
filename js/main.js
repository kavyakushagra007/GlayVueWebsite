/* ==========================================================================
   GLAYVUE — Main Interactive Website Script
   Handles Navigation, Dark/Light Theme Switching, FAQ Accordions,
   Screenshot Showcase Tabs, Form Validation, and Scroll Animations.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Dark / Light Theme Toggle
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('glayvue_theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
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
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     2. Navbar Scroll State, ScrollSpy Active Links & Mobile Menu Toggle
     -------------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  
  // Navbar scroll background change
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.body.classList.toggle('mobile-nav-open');
    });
  }

  // Build section mapping for ScrollSpy
  const spySections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetSection = document.querySelector(href);
      if (targetSection) {
        spySections.push({ link, section: targetSection });
      }
    }
  });

  // ScrollSpy active link updater
  function updateActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // On subpages like privacy.html or terms.html, mark the matching page link active if present
    if (currentPath !== 'index.html' && currentPath !== '') {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPath)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

    if (spySections.length === 0) return;

    const scrollPosition = window.scrollY + 140; // Offset for fixed navbar + breathing room

    // Check if scrolled near the bottom of the page
    const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    if (atBottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      spySections[spySections.length - 1].link.classList.add('active');
      return;
    }

    let activeLink = spySections[0].link; // Default to first (Home)

    for (let i = 0; i < spySections.length; i++) {
      const { link, section } = spySections[i];
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop) {
        activeLink = link;
      }
    }

    navLinks.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');
  }

  // Update active state on scroll & load
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('resize', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Smooth scroll for nav links & close mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        document.body.classList.remove('mobile-nav-open');
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        // Set active immediately on click
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. App Screenshot Showcase Tab Switcher
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     3. App Showcase Feature Slider & Touch Swipe Animation
     -------------------------------------------------------------------------- */
  const showcaseTabs = document.querySelectorAll('.showcase-tab-btn');
  const showcaseTitle = document.getElementById('showcaseTitle');
  const showcaseDesc = document.getElementById('showcaseDesc');
  const showcaseBullets = document.getElementById('showcaseBullets');
  const showcaseImg = document.getElementById('showcaseImg');
  const showcaseCard = document.getElementById('showcaseCard');
  const showcasePrevBtn = document.getElementById('showcasePrevBtn');
  const showcaseNextBtn = document.getElementById('showcaseNextBtn');
  const showcaseDots = document.querySelectorAll('.showcase-dot');

  const featureKeys = ['lidar', 'glazelog', 'community', 'shelf'];
  let currentIdx = 0;
  let isAnimating = false;

  const showcaseData = {
    lidar: {
      title: "Precision 3D LiDAR Scanning",
      desc: "Transform physical ceramics into interactive 3D digital assets using your device's built-in LiDAR sensor. Capture intricate curves, wheel ridges, and fine details with high resolution.",
      bullets: [
        "Instant mesh reconstruction directly on device",
        "Export 3D assets in standard USDZ and OBJ formats",
        "Accurate physical dimensions and scale measurement",
        "Seamless overlay of digital glaze simulations"
      ],
      image: "assets/images/Simulator Screenshot - iPhone Air - 2026-08-12 at 23.09.54.png"
    },
    glazelog: {
      title: "Chemical Recipe & Cone Manager",
      desc: "Keep all your glaze formulas, chemical percentages, cone firings, and firing curves meticulously organized in your digital GlazeLog lab notebook.",
      bullets: [
        "Log firing atmosphere (Oxidation vs. Reduction)",
        "Categorize by Cone 04, Cone 5, Cone 6, Cone 10",
        "Track test tiles, shrinkage, and crazing notes",
        "Search, filter, and favorite your best glazes"
      ],
      image: "assets/images/glaze1.png"
    },
    community: {
      title: "Potters Hub Social Community",
      desc: "Connect with thousands of ceramic artists, studio potters, and ceramic sculptors worldwide. Share test tile results, glaze discoveries, and studio inspiration.",
      bullets: [
        "Post high-resolution glaze test tiles & finished pottery",
        "Exchange recipe tips and firing atmosphere feedback",
        "Follow inspiring ceramicists and build your studio network",
        "Bookmark and favorite community glaze formulas"
      ],
      image: "assets/images/glaze2.png"
    },
    shelf: {
      title: "My Digital Studio Shelf",
      desc: "Organize your active ceramics, finished works, gallery inventory, and studio collections in a clean visual digital shelf.",
      bullets: [
        "Track pieces from wet clay to bisque and final glaze fire",
        "Archive kiln load histories and firing outcomes",
        "Manage private studio collection vs. public showcase",
        "Earn ceramic milestones and studio achievements"
      ],
      image: "assets/images/glaze3.png"
    }
  };

  function updateShowcaseContent(key) {
    const data = showcaseData[key];
    if (!data) return;
    if (showcaseTitle) showcaseTitle.textContent = data.title;
    if (showcaseDesc) showcaseDesc.textContent = data.desc;
    if (showcaseImg) showcaseImg.src = data.image;

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

    // Update active tab button
    showcaseTabs.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === key);
    });

    // Update active dot indicator
    const targetIndex = featureKeys.indexOf(key);
    showcaseDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });
  }

  function goToFeature(newIdx, direction = 'right') {
    if (isAnimating || newIdx === currentIdx) return;
    if (newIdx < 0) newIdx = featureKeys.length - 1;
    if (newIdx >= featureKeys.length) newIdx = 0;

    isAnimating = true;
    const key = featureKeys[newIdx];
    currentIdx = newIdx;

    if (showcaseCard) {
      const exitClass = direction === 'right' ? 'slide-out-left' : 'slide-out-right';
      const enterClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';

      showcaseCard.classList.add(exitClass);

      setTimeout(() => {
        updateShowcaseContent(key);
        showcaseCard.classList.remove(exitClass);
        showcaseCard.classList.add(enterClass);

        setTimeout(() => {
          showcaseCard.classList.remove(enterClass);
          isAnimating = false;
        }, 300);
      }, 150);
    } else {
      updateShowcaseContent(key);
      isAnimating = false;
    }
  }

  // Event listeners for Tab Buttons
  showcaseTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const key = e.currentTarget.getAttribute('data-tab');
      const targetIdx = featureKeys.indexOf(key);
      const direction = targetIdx >= currentIdx ? 'right' : 'left';
      goToFeature(targetIdx, direction);
    });
  });

  // Event listeners for Arrow Buttons
  if (showcasePrevBtn) {
    showcasePrevBtn.addEventListener('click', () => {
      goToFeature(currentIdx - 1, 'left');
    });
  }
  if (showcaseNextBtn) {
    showcaseNextBtn.addEventListener('click', () => {
      goToFeature(currentIdx + 1, 'right');
    });
  }

  // Event listeners for Dots
  showcaseDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const direction = idx >= currentIdx ? 'right' : 'left';
      goToFeature(idx, direction);
    });
  });

  // Touch Swipe & Mouse Drag Handling
  const sliderWrapper = document.getElementById('showcaseSlider') || showcaseCard;
  if (sliderWrapper) {
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let isSwiping = false;

    // Touch events
    sliderWrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      deltaX = 0;
      deltaY = 0;
      isSwiping = true;
    }, { passive: true });

    sliderWrapper.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      deltaX = e.touches[0].clientX - startX;
      deltaY = e.touches[0].clientY - startY;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const minSwipeDistance = 40;
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goToFeature(currentIdx + 1, 'right');
        } else {
          goToFeature(currentIdx - 1, 'left');
        }
      }
    });

    // Mouse drag events
    let isMouseDown = false;
    sliderWrapper.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      deltaX = 0;
      deltaY = 0;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      deltaX = e.clientX - startX;
      deltaY = e.clientY - startY;
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const minSwipeDistance = 40;
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goToFeature(currentIdx + 1, 'right');
        } else {
          goToFeature(currentIdx - 1, 'left');
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. FAQ Accordion Toggle
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });


  /* --------------------------------------------------------------------------
     6. Animated Count Up Statistics on Scroll
     -------------------------------------------------------------------------- */
  const statItems = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function checkStatsScroll() {
    if (animatedStats || statItems.length === 0) return;
    const firstStat = statItems[0];
    const rect = firstStat.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animatedStats = true;
      statItems.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target') || '0', 10);
        const suffix = stat.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = current.toLocaleString() + suffix;
        }, 35);
      });
    }
  }

  window.addEventListener('scroll', checkStatsScroll);
  checkStatsScroll();

});
