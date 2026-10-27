<div align="center">

# ✦ Muhammad Umer Faheem

## Frontend Developer | Business Intelligence Enthusiast

A modern single-page portfolio showcasing my journey at the intersection of **frontend development, user experience design, and business intelligence**.

</div>

---

# 🚀 Portfolio Website

Welcome to my personal portfolio repository.

This project is designed to represent my skills, experience, projects, certifications, and professional growth through a clean, interactive, and responsive web experience.

The website combines modern frontend practices with a premium **Liquid Glass inspired design approach**, focusing on smooth interactions, elegant layouts, and performance.

---

# 🌟 Project Overview

This portfolio is built as a complete personal brand website where visitors can explore:

- My professional background
- Technical skills
- Development experience
- Education journey
- Featured projects
- Certifications and achievements
- Resume information
- Contact details

The goal of this project is to create more than a traditional portfolio it is designed as an interactive digital identity.

---

# ✨ Features

## 🎨 Modern UI Design

- Custom Liquid Glass inspired interface
- Premium dark theme
- Glassmorphism elements
- Smooth gradients
- Soft shadows and depth effects
- Clean typography system
- Responsive layouts

---

## ⚡ Interactive Experience

- Animated hero section
- Typewriter text animation
- Dynamic skill visualization
- Smooth scrolling navigation
- Interactive project cards
- Timeline-based sections
- Mobile-friendly navigation
- Keyboard shortcuts
- Custom UI interactions

---

## 📱 Responsive Design

The website is optimized for:

- Desktop computers
- Laptops
- Tablets
- Mobile devices

Every section adapts smoothly across different screen sizes.

---

# 🛠 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, animations, layouts |
| JavaScript | Interactivity and dynamic behavior |

## Tools

| Tool | Usage |
|---|---|
| Git | Version control |
| GitHub | Repository management |
| VS Code | Development environment |
| Figma | UI planning and design |

## Additional Resources

| Resource | Usage |
|---|---|
| Google Fonts | Typography |
| Font Awesome | Icons |

---

# 🧩 Main Sections

## 👨‍💻 About Section

Introduces my background, interests, and development journey.

## 🛠 Skills Section

Displays technical abilities including:

- Frontend development
- UI design concepts
- Programming skills
- Business intelligence knowledge
- Data-related tools

## 🧭 Experience

A role rail (newest first) with one detail panel at a time: period, time in role, setting, what I did and the tools used, with current skill scores shown next to matching tools. Arrow keys, Home and End move between roles. Without JavaScript every role is shown stacked.

## 🎓 Education Section

A credential card for the BBIS degree (semester progress included), a ledger linking each area studied to the project or role where it was applied, and a short strip for the school before UMT.

## 🏆 Awards & Recognition

Grouped by weight: formal honours first (ICAISAI'26 selection, Best ERP Innovative Idea, Top 3 ERP Projects, Recognised Intern), then leadership and service, then credentials. Each entry carries a `data-tier` (`honour`, `leadership` or `credential`) that feeds `js/data.js`.

## 💼 Projects Showcase

Displays selected projects with:

- Project descriptions
- Technologies used
- Roles and responsibilities
- Key outcomes

## 🏆 Certifications

Showcases completed certifications and professional achievements.

## 📄 Resume Section

Provides a structured professional overview.

---

# 🗂 Project Structure

```
MyPortfolio/
├── index.html              # markup only
├── css/
│   ├── base.css            # variables, layout, sections, responsive rules
│   ├── documents.css       # CV / cover-letter cards and preview modal
│   ├── polish.css          # glass refinements, breakpoints, print styles
│   ├── ai-chat.css         # AI assistant panel
│   ├── back-to-top.css
│   ├── effects.css         # orbs, grain, scrollbars
│   ├── sparkles.css
│   ├── glass-theme.css     # final glass pass
│   ├── premium.css         # command palette, tilt, clock, …
│   ├── experience.css      # experience rail + panels
│   ├── education.css       # academic credential, ledger, prior school
│   ├── awards.css          # honours, leadership, credentials
│   └── tabbar.css          # ★ tab bar (desktop header + mobile dock)
├── js/
│   ├── main.js             # cursor, scroll, menu, skills tabs, reveal, contact form
│   ├── ai-chat.js          # AI assistant knowledge base + UI
│   ├── documents.js        # CV / cover-letter preview modal
│   ├── effects.js          # hero stars + sparkle canvas
│   ├── radar-chart.js      # skills radar (canvas)
│   ├── premium.js          # command palette (Ctrl/⌘+K), tilt, shortcuts
│   ├── experience.js       # experience role tabs + live durations
│   └── tabbar.js           # ★ active-tab logic
└── assets/
    ├── images/             # Logo.png, profile.jpg
    └── docs/               # CV and cover-letter PDFs
```

Stylesheets and scripts load in the order listed in `index.html` – keep that order.

After editing roles or awards in `index.html`, run `npm run data` then `npm run check` to regenerate `js/data.js` and validate it.

## Tab bar

The navigation is a dark pill: every tab shows an outline icon, and the active tab expands into a white pill with a filled icon and its label. On screens up to 768px it becomes a floating dock at the bottom of the screen.

All colours and sizes are variables at the top of `css/tabbar.css` (`--tab-bar-bg`, `--tab-active-bg`, `--tab-size`, …). To add a tab, add an `<li>` to `#navLinks` in `index.html` – `js/tabbar.js` picks it up automatically.

---

# 🎨 Design Philosophy

The design follows a modern digital product approach.

## Core Principles

- Minimal but impactful layouts
- Strong visual hierarchy
- Smooth user interactions
- Consistent spacing
- Accessible design
- Performance optimization

## Visual Identity

Color direction:

| Element | Color |
|---|---|
| Background | `#070A12` |
| Primary Text | `#FFFFFF` |
| Secondary Text | `#CBD5E1` |
| Gold Accent | `#FFB84D` |
| Blue Highlight | `#38BDF8` |
| Purple Accent | `#A78BFA` |

---

# 🔐 License

**All Rights Reserved**

This repository contains original code, design, and content created by **Muhammad Umer Faheem**.

The project may not be:

- Copied
- Redistributed
- Reused as a template
- Modified for commercial purposes
- Republished under another identity

without prior written permission from the author.

Any unauthorized use, reproduction, or distribution of this project and its components is strictly prohibited.

---

# **⭐ Support**

If you find this project useful or inspiring, consider giving the repository a star.

---

# 📂 Repository Structure

```bash
.
├── index.html
├── README.md
├── LICENSE
└── assets/

