# Dynamic Routing Architecture Report

## Evaluation of Dynamic Routes for Harsh Infotech Website

We compare **Option A (Static Compile-Time HTML Page Generation)** and **Option B (Dynamic Client-Side React Router)**.

### Option A: Static Compile-Time HTML Generation (Current Choice)
*   **How it works:** The CMS sync script generates folders containing physical HTML pages for each slug (e.g. `customizations/hotel-lodging.html`).
*   **Pros:**
    1.  **Stellar SEO:** Crawlers immediately get pre-rendered HTML tags, meta titles, descriptions, and structural schema scripts.
    2.  **No Server Route Rewrites Required:** Works natively on simple static CDNs or static servers without fallback redirects.
    3.  **Speed:** Instant initial loading times.
*   **Cons:**
    1.  **File clutter:** Creates physical HTML files inside the codebase directory.
    2.  **Vite bundle scan overhead:** Requires Vite to register multiple inputs at compile time.

### Option B: Dynamic Client-Side React Routing
*   **How it works:** Uses a client-side library (like React Router) to resolve routes inside a single HTML bundle (`customizations.html`), swapping pages dynamically depending on path URL.
*   **Pros:**
    1.  No physical HTML page generation needed.
    2.  Simpler Vite compilation (only one entry point per category).
*   **Cons:**
    1.  **SEO challenges:** Search crawlers must execute client-side JavaScript to read dynamic SEO tags (prone to indexation failures on non-Google crawlers).
    2.  **Server redirection rules required:** The hosting provider must rewrite paths to point to a fallback entry HTML file, otherwise loading a route directly results in a 404.

### Recommendations for Future Scale (2,000+ Items)
*   At scale, **Option A** remains superior for SEO purposes. However, to avoid directory pollution, we recommend wrapping the dynamic routes into a build-time pre-renderer or using a lightweight framework (like Astro or Next.js static exports).
*   For the current catalog size (supporting up to 500+ customizations, 200+ services, and 1,000+ products), **Option A (Static Compile-Time Generation)** provides the absolute best balance of extreme SEO indexability and deployment zero-maintenance.
