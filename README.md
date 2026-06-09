# &lt;DHRUV/&gt; — Personal Portfolio Website

![Portfolio Preview](https://img.shields.io/badge/Status-Live-22d3ee?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-264DE4?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)

> A cinematic, galaxy-inspired dark portfolio — built with pure HTML, CSS & Vanilla JS.

---

# Live Preview

Open `index.html` in your browser or run with a local server:

```bash
# Using VS Code Live Server
Right-click index.html → Open with Live Server

# Using Python
python -m http.server 5500

# Using Node
npx serve .
```

---

# Features

- **Galactic Hero** — animated canvas starfield with rotating nebula clouds and parallax depth layers
- **Mouse Parallax** — star layers, orbs and hero content respond to cursor movement with depth-based offsets
- **Typed Text Effect** — multi-string typewriter with erase & pause timing
- **Glassmorphism UI** — frosted glass cards, navbar, forms and badges throughout
- **GSAP Animations** — scroll-triggered reveals, word-split titles, counter animations, skill bar fills
- **Custom Cursor** — lerp-smoothed outer ring with click & hover states
- **Scroll Progress Bar** — gradient line fixed to the top of the viewport
- **Project Filter Tabs** — animated show/hide by category
- **Testimonial Slider** — auto-advance, dot nav, touch swipe support
- **Contact Form** — shake validation, loading state, success message
- **Magnetic Buttons** — CTA buttons drift toward cursor
- **Fully Responsive** — desktop, tablet and mobile with hamburger menu

---

# File Structure

```
portfolio/
├── index.html       # Markup — all 6 sections
├── style.css        # All styles, variables, animations, responsive
├── script.js        # 30 JS modules — GSAP, parallax, interactions
└── README.md        # You are here
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure |
| CSS3 | Styling, animations, glassmorphism, responsive layout |
| Vanilla JavaScript | All interactivity and DOM logic |
| GSAP + ScrollTrigger | Scroll animations, parallax scrub, counters |
| Google Fonts | Syne, Space Mono, DM Sans |
| Font Awesome 6 | Icons throughout |

---

# Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Deep Black | `#030712` | Background |
| Space Blue | `#0a1628` | Section backgrounds |
| Cyan | `#22d3ee` | Primary accent, highlights |
| Purple | `#a855f7` | Gradient, glow effects |
| Orange | `#f97316` | Secondary accent |

---

# Dependencies (CDN — no install needed)

```html
<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

<!-- Google Fonts: Syne, Space Mono, DM Sans -->
```

All dependencies are loaded via CDN — no `npm install` or build step required.

---

# Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `> 1100px` | Full desktop — 3-column projects, 2-column skills |
| `900px` | Tablet — stacked about, 2-col projects, hamburger menu |
| `640px` | Mobile — single column, touch-friendly, swipeable slider |
| `400px` | Small mobile — 2-col skill grid |

---

# Customisation

**Change name/text** → Edit `index.html` directly

**Change colors** → Edit CSS variables at the top of `style.css`:
```css
:root {
  --cyan:   #22d3ee;
  --purple: #a855f7;
  --orange: #f97316;
}
```

**Change typed strings** → Edit the `strings` array in `script.js`:
```js
const strings = [
  'Web Developer',
  'UI/UX Designer',
  ...
];
```

**Add a project** → Copy a `.project-card` block in `index.html` and update the content.

**Replace avatar** → Swap the `.avatar-placeholder` div with an `<img>` tag inside `.avatar-frame`.

---

# Author

**Dhruv**
Web Developer & UI/UX Designer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/Username-Dhruv)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin)]([https://linkedin.com/in/dhruv](https://www.linkedin.com/in/dhruv-1b829a276/))
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail)](mailto:dhruv011d@gmail.com)

---

<p align="center">Built with ❤️ & ✨ by Dhruv</p>