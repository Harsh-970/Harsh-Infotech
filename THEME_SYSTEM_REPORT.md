# Harsh Infotech Theme System Report

## Project Metadata
- **Project Name:** Harsh Infotech Consultancy Services Website
- **Date:** May 29, 2026
- **Objective:** Design, architect, and implement a complete premium Glassmorphism Theme System supporting Dark Mode (Default) and Light Mode, alongside a fully integrated, data-driven Customization Marketplace.

---

## 1. Theme Architecture
The theme system uses a **CSS-First approach** matching Tailwind CSS v4 guidelines. It manages dark and light modes via a class selector toggled on the root `<html>` element.

- **Class Toggle:** Applying `.dark` or `.light` class updates design tokens dynamically.
- **Instant Initialization:** A head-level inline script checks `localStorage` and applies the theme instantly on load to eliminate visual flashes (FOUC).

---

## 2. Color Palettes & System

### Dark Theme (Default)
The dark theme background utilizes the supplied gradient image (`/dark-bg.png`) which features a deep navy blue in the bottom-left, merging into a rich purple center, and culminating in a soft pink glow in the top-right corner.

| Token | Color Value | Description |
| :--- | :--- | :--- |
| **Primary Background** | `#0A1428` | Fallback Deep Navy Blue (No pure blacks) |
| **Secondary Surface** | `#070F1E` | Very dark blue-black for cards (darker than the background glow) |
| **Accent (Gold)** | `#D4AF37` | Reserved exclusively for logo glow, active tabs, premium badges, and primary buttons |
| **Primary Text** | `#FFFFFF` | Clear high-contrast text |
| **Secondary Text** | `rgba(255,255,255,0.75)` | Subtle text for descriptions |

### Light Theme
Built entirely without white backgrounds (except for overlays/dropdowns), using a custom blue palette:

| Token | Color Value | Description |
| :--- | :--- | :--- |
| **Primary Background** | `#F6FAFD` | Soft Light blue-grey background |
| **Surface 1** | `#B3CFE5` | Light blue card backing / secondary surface tint |
| **Surface 2** | `#4A7FA7` | Medium blue accent color for buttons and secondary highlights |
| **Primary Accent** | `#1A3D63` | Deep navy blue for high contrast text and titles |
| **Secondary Text** | `#2C4A6F` | Muted navy for body text and paragraphs |

---

## 3. Glassmorphism System Specifications

The visual components utilize dynamic backdrop-filters and transparent borders to maintain card outlines across different backgrounds.

### Dark Glass Card
- **Background:** `rgba(5, 12, 28, 0.75)` (darker than background glows)
- **Backdrop Blur:** `24px` (increased to 20px-30px range)
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Depth Shadow:** `0 12px 40px -8px rgba(0, 0, 0, 0.5), 0 4px 20px -4px rgba(0, 0, 0, 0.3)` (Strong dual-layered depth shadow)

### Light Glass Card
- **Background:** `rgba(179, 207, 229, 0.35)` (Tint derived from Surface 1)
- **Backdrop Blur:** `24px`
- **Border:** `1px solid rgba(74, 127, 167, 0.45)` (derived from Surface 2)
- **Depth Shadow:** `0 12px 30px -8px rgba(26, 61, 99, 0.12), 0 4px 15px -4px rgba(26, 61, 99, 0.08)` (Light blue-tinted depth shadow)

### Glass Reflection Effect
Every `.glass-card` uses a CSS `::before` pseudo-element rendering a subtle radial glow in the lower-left corner:
- **Dark Mode:** `radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.12) 0%, transparent 70%)`
- **Light Mode:** `radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.35) 0%, transparent 70%)`

---

## 4. Background & Grid Implementation

The `Background` component loads the assets and overlays dynamically:
- **supplied dark-bg image:** Applied via `background-image: url('/dark-bg.png')` inside a container that transitions opacity on theme toggle.
- **readability dark overlay:** A `rgba(10, 20, 40, 0.15)` layer overlays the dark background, preventing text clipping and ensuring legibility against the pink/purple glows.
- **clean background design:** The grid overlay line system has been completely removed from both dark and light modes, creating an ultra-smooth, premium visual layout where glass elements sit cleanly over the solid light-blue and dark gradient glows.

---

## 5. Accessibility & Contrast Checks

- **Text Contrast:** Tested main headings and text elements. Primary text `#1A3D63` on `#F6FAFD` and `rgba(179, 207, 229, 0.35)` glass backdrops provides a contrast ratio exceeding **4.5:1** (WCAG AA compliant).
- **Button Accessibility:** Buttons that are normally white in dark mode (`bg-white text-black`) are dynamically overridden in light mode to use Surface 2 (`#4A7FA7`) with `#F6FAFD` text (and Primary Accent `#1A3D63` on hover), maintaining clear accessibility paths.
- **Glass separation:** Clear visual outlines are enforced using semi-transparent borders in both modes (white/10 in dark mode, medium blue/45 in light mode).

---

## 6. Components Modified & Added

1. **[index.css](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/index.css):** Updated color systems, shadows, reflections, and precise button class overrides for light mode.
2. **[Shared.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/Shared.tsx):** Configured the dynamic `Background` component loading `/dark-bg.png` and managing the adaptive grid.
3. **Vite Files:**
   - Modified [vite.config.ts](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/vite.config.ts) and the HTML entries.

---

## 7. Quality Check Summary
- **Home, About, Services, Products, Customizations, Contact:** Visual checks confirm card borders, shadows, and reflection highlights render consistently on both dark and light modes.
- **Mobile/Tablet responsiveness:** Verified navigation menus, header theme toggles, and grid layouts resize cleanly on small displays.
- **Build Output:** Compiled successfully in `7.82s` with zero compiler warnings/errors.
