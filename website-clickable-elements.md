# Clickable Elements Inventory: Harsh Infotech

This document lists all interactive widgets, forms, anchor tags, and buttons across the website pages.

---

## 1. Global Navigation & Action Elements

### Global Header Navbar
- **Home Link:** `<a>` pointing to `/` or `/index.html` (Desktop & Mobile drawer).
- **Services Submenu dropdowns:**
  - Tally Prime: `<a>` pointing to `/services.html#tally-license`.
  - Tally on Cloud: `<a>` pointing to `/services.html#tally-cloud`.
  - Tally Customization: `<a>` pointing to `/services.html#tally-customization`.
  - AMC & Support: `<a>` pointing to `/more-services.html#amc`.
  - Customizations Store: `<a>` pointing to `/customizations.html`.
  - VPS Hosting: `<a>` pointing to `/more-services.html#vps`.
  - Excel to Tally: `<a>` pointing to `/more-services.html#excel`.
  - Data Migration: `<a>` pointing to `/more-services.html#data`.
  - Hardware Support: `<a>` pointing to `/more-services.html#hardware`.
- **Products Submenu dropdowns:**
  - Servers: `<a>` pointing to `/products.html#servers`.
  - Workstations: `<a>` pointing to `/products.html#workstations`.
  - Printers: `<a>` pointing to `/products.html#printers`.
  - Scanners: `<a>` pointing to `/products.html#scanners`.
- **Theme Switcher:** Custom checkbox toggle updating `html` class lists.
- **Sign Up Button:** HTML `<button>` triggering the auth gate modal overlay.
- **CTA Routing Button:** Dynamic contextual link (varies between `#services`, `#products`, `#about`, `#contact` depending on active index sections).

### Global Footer
- **Social Media Icons:**
  - Facebook, Instagram, Twitter, GitHub, LinkedIn.
- **Email Link:** `<a>` with data actions mapping `mailto:harshinfotech2005@gmail.com`.
- **WhatsApp Contact Buttons:**
  - Contact 1: `917558604483`
  - Contact 2: `918828275219`
- **Newsletter Subscription:**
  - Text input (Email) and "Join" submit button.
- **Floating Badge:** Bottom-right fixed WhatsApp float shortcut link (`https://wa.me/917558604483`).

---

## 2. Page-Specific Interactive Components

### Home Page (`index.html` / `App.tsx`)
- **Hero CTA Call Button:** Mobile-only shortcut calling `tel:+917558604483`.
- **Hero CTA WhatsApp Button:** Mobile-only WhatsApp chat hook.
- **Service Cards (3x):** Large clickable cards pointing to corresponding `#` anchors on `/services.html`.
- **Product Cards (4x):** Inquire buttons triggering WhatsApp custom inquiry parameters.
- **Customizations Link Card:** CTA pointing directly to `/customizations.html`.
- **Contact Inquiry Form:**
  - Inputs: Name, Email, Custom Message text area.
  - Dropdown: Service selector.
  - Submit Button: Send Inquiry (Triggers validation & saves lead).

### Customizations Shop (`customizations.html` / `CustomizationsApp.tsx`)
- **Layout Switchers (3x):** Button selectors triggering grid/list/stack transitions.
- **Category Filter Chips (8x):** Clicking dynamically narrows customization results.
- **Industry Filter Selection (8x):** Select options matching vertical targets.
- **Sort Dropdown:** Dynamic order triggers (Popular, Price: Low-to-High, Price: High-to-Low).
- **Inquire on WhatsApp Buttons (8x):** Mapped to each catalog card, launching pre-filled product chats.
