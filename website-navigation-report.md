# Website Navigation Report: Harsh Infotech Consultancy Services

This report contains the details of the site architecture, page routes, navigation structure, and interlinking flows for the Harsh Infotech Consultancy Services website.

## 1. Information Architecture Overview

The website is structured as a **Multi-Page Application (MPA)** optimized with Vite and React components for dynamic rendering. 

```
Website Root (/)
 ├── Navbar (Global Header)
 ├── Footer (Global Footer)
 ├── Pages
 │    ├── Home (index.html)
 │    ├── Core Services (services.html)
 │    ├── Additional Services (more-services.html)
 │    ├── Hardware Products (products.html)
 │    ├── Customizations Store (customizations.html)
 │    └── About Us (about.html)
 └── Protected Gateway (Auth Gate Modal)
```

---

## 2. Directory Mappings & Page Routes

| Page Name | Active Route | Physical HTML File | Primary Code Component | Primary Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | `/` or `/index.html` | `index.html` | [App.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/App.tsx) | Landing and core contact forms |
| **Core Services** | `/services.html` | `services.html` | [MainServicesApp.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/MainServicesApp.tsx) | Tally Prime, Cloud, Customizations details |
| **More Services** | `/more-services.html` | `more-services.html` | [ServicesApp.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/ServicesApp.tsx) | AMC, VPS, Data migration info |
| **Products** | `/products.html` | `products.html` | [ProductsApp.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/ProductsApp.tsx) | Servers, desktops, workstations, printers specs |
| **Customizations** | `/customizations.html` | `customizations.html` | [CustomizationsApp.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/CustomizationsApp.tsx) | Dynamic list/grid/stack filterable catalog |
| **About Us** | `/about.html` | `about.html` | [AboutApp.tsx](file:///d:/Harsh%20Documents/Projects/Webiste/google/harsh-infotech/src/AboutApp.tsx) | Mission statement, team, email, and locations |

---

## 3. Dynamic Routes & Query Parameters

### Customizations Selection
- **Base Route:** `/customizations.html`
- **Dynamic Parameter:** `?module=[module-slug]`
- **Active State Handling:** 
  - On loading, the page parses `window.location.search` to resolve `activeSlug`.
  - Dynamically centers the catalog view or shifts the active slider position to showcase the highlighted customization module (e.g. `Hotel & Lodging Management System`).
  - Sets browser titles and injects dynamic structured JSON-LD schemas.

---

## 4. Global Modules & Navigation Overlays

### Sticky Navbar
- **Mobile breakpoint:** `< 1280px` (Hamburger Drawer overlay)
- **Desktop viewports:** `>= 1280px` (Horizontal link layouts, nested CSS hover submenus for Services and Products)
- **Scroll Behavior:** Smooth visibility transition (translates out of view when scrolling down, glides back into view when scrolling up).

### Global Footer
- Direct sitemap links to Home, Services, About, Careers.
- Quick mailto anchors (`mailto:harshinfotech2005@gmail.com`) and dual-action WhatsApp contact links.
- Newsletter submission wrapper.

### Authorization Gate (`Auth.tsx`)
- Intercepts all lead actions (`data-auth-gated="true"`).
- Displays a 3D tilting card requesting details to log the lead information to `/api/auth-log` (logged locally in `data/login_information.csv`).
- Restores page flows and performs original user-action triggers upon verification.
