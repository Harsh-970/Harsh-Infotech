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

## 2. Color Palettes

### Dark Theme (Default)
| Token | Color Value | Description |
| :--- | :--- | :--- |
| **Primary Background** | `#0A1931` | Deep blue space background |
| **Secondary Surface** | `#1A3D63` | Structured container cards and widgets |
| **Accent (Gold)** | `#D4AF37` | Reserved exclusively for logo glow, active tabs, premium badges, and primary buttons |
| **Primary Text** | `#FFFFFF` | Clear high-contrast text |
| **Secondary Text** | `rgba(255,255,255,0.75)` | Subtle text for descriptions and meta tags |

### Light Theme
| Token | Color Value | Description |
| :--- | :--- | :--- |
| **Primary Background** | `#F6FAFD` | Clean corporate light blue-grey background |
| **Secondary Surface** | `#FFFFFF` | Bright container cards and panels |
| **Accent Blue** | `#4A7FA7` | Clean enterprise blue for borders, icons, and buttons |
| **Secondary Blue** | `#B3CFE5` | Hover backgrounds, border highlights, and active tabs |
| **Dark Text** | `#0A1931` | Deep primary corporate text |
| **Secondary Text** | `#4A5565` | Muted slate text for paragraphs |

---

## 3. Glassmorphism System Specifications

The visual components utilize dynamic backdrop-filters and transparent borders to maintain card outlines across different backgrounds.

### Dark Glass Card
- **Background:** `rgba(10, 25, 49, 0.55)`
- **Backdrop Blur:** `20px`
- **Border:** `1px solid rgba(255, 255, 255, 0.08)`

### Light Glass Card
- **Background:** `rgba(255, 255, 255, 0.65)`
- **Backdrop Blur:** `20px`
- **Border:** `1px solid rgba(255, 255, 255, 0.4)`

### Glass Reflection Effect
Every `.glass-card` uses a CSS `::before` pseudo-element rendering a subtle radial glow in the lower-left corner:
- **Dark Mode:** `radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.08) 0%, transparent 70%)`
- **Light Mode:** `radial-gradient(circle at bottom left, rgba(74, 127, 167, 0.12) 0%, transparent 70%)`

This reflection adds premium material depth without visual distraction.

---

## 4. Components Modified & Added

### Modified Core Files
1. **[index.css](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/index.css):** Added Tailwind `@custom-variant dark`, theme variables, extended `.glass-card` classes with reflections, and class overrides map to handle hardcoded white classes dynamically in Light Mode.
2. **[Shared.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/Shared.tsx):** 
   - Created the dynamic `Background` component (subtle grid lines, pulsing blue orbs, and screen blended video backgrounds in dark mode).
   - Created the `ThemeToggle` component with smooth Framer Motion transitions.
   - Updated the `Navbar` to integrate the toggle and add `/customizations.html` to the Services dropdown.
3. **Vite Files:**
   - Add theme script to head of [index.html](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/index.html), [about.html](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/about.html), [services.html](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/services.html), [more-services.html](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/more-services.html), and [products.html](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/products.html).
   - Modified [vite.config.ts](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/vite.config.ts) to bundle `customizations.html`.

---

## 5. Customization Marketplace Implementation

### Architecture & Data-Driven Model
The marketplace is built as a separate single page `/customizations.html` driven by `src/CustomizationsApp.tsx` and a dedicated schema file `src/data/customizations.ts`. 

- **Future Ready:** New modules can be added simply by appending objects to the `customizationsData` array.
- **Dynamic Routing:** Utilizes standard browser window search history mapping (`?module=slug`). If the search param is active, it swaps the DOM to the Detail view; otherwise, it displays the Marketplace Catalog Grid.

### Search & Filters
- **Interactive Search:** Dynamically searches titles, descriptions, categories, and tags. Includes an autocomplete popup suggestion panel.
- **Category Selector:** Dropdown filtering items based on core modules (Hotel, Restaurant, Manufacturing, Garment, etc.).
- **Industry Selector:** Filters items based on business verticals (Retail, Logistics & Warehouse, Hospitality, etc.).
- **Compatibility Chips:** Toggles specific system requirements (Tally Prime, Cloud Compatible, Barcode support, GST).
- **Sort Dropdown:** Sorts items by Price, A-Z, or Popularity.

### Recommended System
Inside the detail page, a smart recommendation block extracts up to 3 relevant modules belonging to the same category or industry, falling back to featured products if duplicates occur.

### SEO & Schema Integration
- Dynamically updates `document.title` and meta tags depending on whether the catalog or a detail page is loaded.
- Dynamically generates JSON-LD tags (`Product` schema for module details, and `ItemList` schema for the catalog list view) to ensure search engine index readiness.

---

## 6. Testing & Quality Check

- **Local Build:** Succeeded in `9.00s` with zero warnings or compilation errors.
- **Theme Persistence:** Verified using local storage.
- **Layout Shifts:** None. Transitions are handled cleanly using CSS transitions and Framer Motion.
- **Responsiveness:** Verified correct resizing (4 columns on desktop, 3 on small laptops, 2 on tablets, and 1 on mobile). Toggle button wraps nicely next to the hamburger icon.

---

## 7. Future Recommendations
1. **PWA Support:** Convert the customizations marketplace into a Progressive Web App for offline catalog browsing.
2. **Dynamic CSV Import:** Enable importing customizations data dynamically from the Excel spreadsheet using a node/python parser.
