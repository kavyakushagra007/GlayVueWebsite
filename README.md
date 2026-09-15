<p align="center">
  <img src="https://img.shields.io/badge/GlayVue-3D%20Ceramic%20Studio-C84B2F?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMkwyIDdsMTAgNSAxMC01LTEwLTV6TTIgMTdsMTAgNSAxMC01TTIgMTJsMTAgNSAxMC01Ii8+PC9zdmc+" alt="GlayVue"/>
</p>

<h1 align="center">🏺 GlayVue — 3D Ceramic Studio & Glaze Lab</h1>

<p align="center">
  <strong>The ultimate iOS app for ceramic artists — scan pottery in 3D, simulate realistic glaze finishes, log chemical recipes, and connect with potters worldwide.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS-000000?style=flat-square&logo=apple&logoColor=white" alt="iOS"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/License-MIT-2A8C82?style=flat-square" alt="License"/>
</p>

---

## 📖 About

This is the **official landing page** for [GlayVue](https://glayvue.app) — a premium iOS application built for ceramic artists, studio potters, and sculptors. The website showcases GlayVue's core features including LiDAR 3D scanning, Metal shader glaze visualization, glaze chemistry logging, and a social community hub.

The site is designed with a cinematic dark aesthetic, earthy terracotta palette, glassmorphism effects, and smooth scroll-driven animations to reflect the artistry of ceramic craft.

---

## ✨ Website Features

| Feature | Description |
|---|---|
| 🎨 **Dark / Light Theme Toggle** | Seamless theme switching with `localStorage` persistence |
| 🌌 **Particle Canvas Background** | Animated particle system in the hero section using HTML Canvas |
| 📱 **Phone Mockup with Video** | Embedded autoplay video demo inside a realistic phone frame |
| 🃏 **3D Card Tilt Effect** | Interactive mouse-tracking card tilt with glare overlay |
| 🎠 **Tabbed App Showcase Slider** | Swipeable feature carousel with slide animations & dot navigation |
| ❓ **FAQ Accordion** | Expandable FAQ section with smooth open/close transitions |
| 🔍 **Scroll Spy Navigation** | Active nav link updates based on scroll position |
| 🎭 **Scroll Reveal Animations** | Elements animate in every time they enter the viewport |
| 📊 **Animated Count-Up Stats** | Number counters that animate on scroll (ready for use) |
| 📱 **Fully Responsive** | Mobile-first design with hamburger menu and adaptive layouts |

---

## 🏗️ Project Structure

```
GlayVueWebsite/
├── index.html              # Main landing page
├── privacy.html            # Privacy policy page
├── terms.html              # Terms of service page
├── README.md               # This file
│
├── css/
│   └── styles.css          # Complete stylesheet with design tokens,
│                           # glassmorphism, animations & responsive rules
│
├── js/
│   └── main.js             # Interactive features — theme toggle, particles,
│                           # tilt cards, showcase slider, FAQ, scroll spy
│
└── assets/
    ├── images/             # Screenshots, glaze textures, pottery images
    │   ├── glaze1.png
    │   ├── glaze2.png
    │   ├── glaze3.png
    │   ├── glaze4.png
    │   └── ...
    └── videos/             # App demo videos
        └── lidar scan.mp4
```

---

## 🎨 Design System

The website uses a curated **earthy ceramic palette** with CSS custom properties:

| Token | Color | Usage |
|---|---|---|
| `--color-terracotta` | ![#C84B2F](https://img.shields.io/badge/-%23C84B2F-C84B2F?style=flat-square) `#C84B2F` | Primary accent, CTAs, active states |
| `--color-gold` | ![#D4890A](https://img.shields.io/badge/-%23D4890A-D4890A?style=flat-square) `#D4890A` | Secondary accent, gradient highlights |
| `--color-teal` | ![#2A8C82](https://img.shields.io/badge/-%232A8C82-2A8C82?style=flat-square) `#2A8C82` | Checkmarks, success states |
| `--color-bg` | ![#080402](https://img.shields.io/badge/-%23080402-080402?style=flat-square) `#080402` | Dark background |
| `--color-text` | ![#F5EDE0](https://img.shields.io/badge/-%23F5EDE0-F5EDE0?style=flat-square) `#F5EDE0` | Primary text (warm white) |

**Typography:**
- **Headings:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — elegant serif
- **Body:** [Outfit](https://fonts.google.com/specimen/Outfit) — clean geometric sans-serif

---

## 🚀 Getting Started

### Prerequisites

No build tools required — this is a **static HTML/CSS/JS** website.

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/GlayVueWebsite.git
   cd GlayVueWebsite
   ```

2. **Open in browser:**
   ```bash
   # Option 1: Simply open the file
   open index.html

   # Option 2: Use a local server (recommended for video playback)
   npx serve .
   # or
   python -m http.server 8000
   ```

3. **Visit** `http://localhost:8000` in your browser.

> **Note:** A local server is recommended for proper video playback and to avoid CORS issues.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure with SEO meta tags & Open Graph |
| **CSS3** | Custom properties, glassmorphism, `@keyframes`, grid/flexbox |
| **Vanilla JavaScript** | Canvas particles, IntersectionObserver, touch/swipe handling |
| **Google Fonts** | Playfair Display + Outfit |

**Zero dependencies.** No frameworks, no build step, no npm packages.

---

## 📱 App Features Highlighted

The landing page showcases these GlayVue iOS app capabilities:

- **🔬 Precision 3D LiDAR Scanning** — Capture pottery into digital 3D models using iPhone/iPad LiDAR
- **🎨 Metal Glaze Shaders** — Preview glossy celadons, satin shinos, matte cobalts on 3D meshes
- **📋 GlazeLog Chemistry** — Log oxide percentages, firing schedules, cone levels, and test tiles
- **👥 Potters Hub Community** — Share work, exchange recipes, and follow ceramic artists globally
- **🗄️ Digital Studio Shelf** — Organize ceramics from greenware to final glaze fire

---

## 🌐 Browser Support

| Browser | Supported |
|---|---|
| Chrome 90+ | ✅ |
| Firefox 90+ | ✅ |
| Safari 15+ | ✅ |
| Edge 90+ | ✅ |
| Mobile Safari (iOS) | ✅ |
| Chrome Mobile | ✅ |

---

## 📄 Pages

| Page | File | Description |
|---|---|---|
| Landing Page | `index.html` | Main marketing page with all sections |
| Privacy Policy | `privacy.html` | Data collection & privacy practices |
| Terms of Service | `terms.html` | Usage terms & conditions |

---

<<<<<<< HEAD
## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---
=======

>>>>>>> 3711483b0b009d50c9e65be05af60b905047cb1e

## 📬 Contact

- **Website:** [glayvue.app](https://glayvue.app)
- **Email:** support@glayvue.app

---

<p align="center">
  <sub>Designed for Ceramic Artists, Sculptors, & Studio Potters.</sub><br/>
  <sub>© 2026 GlayVue. All rights reserved.</sub>
</p>
