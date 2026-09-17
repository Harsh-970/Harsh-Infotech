# Promotional Offers Management & Future Reinstatement Guide

## Overview

As per business requirements, active promotional offers and coupon cards have been **temporarily hidden** from the public Offers page (`/offers.html`).

Instead of active discount cards, visitors now see a branded **"Promotional Offers Are Being Updated"** status with direct channels to inquire about custom pricing, volume licensing, and enterprise AMC bundles via WhatsApp or the Contact form.

> **Note:** **No offer data was deleted.** All promotional datasets, category mappings, and UI components are fully preserved and ready to be reinstated whenever new seasonal campaigns launch.

---

## Preserved Files & Assets

1. **Offer Data**: [`src/data/offers.json`](./src/data/offers.json)
   - Contains all promotional definitions:
     - `WELCOMEFY25` (Flat 20% Off on Tally Prime Gold/Silver)
     - `VPSCLOUD1M` (1 Month Free Tally on Cloud VPS)
     - `AMCSUPPORT20` (20% Off Annual Maintenance Contract Bundle)
     - `MIGRATEFREE` (Free Data Migration to Cloud ERP)
2. **Component Architecture**: [`src/OffersApp.tsx`](./src/OffersApp.tsx)
   - Retains all category filtering, clipboard copy functionality, dynamic expiry badges, WhatsApp deep links, and motion animations.

---

## How to Re-Enable Offers in the Future

To restore the promotional cards on `/offers.html`:

1. Open [`src/OffersApp.tsx`](./src/OffersApp.tsx).
2. Locate the feature flag near line 24:
   ```typescript
   const SHOW_ACTIVE_OFFERS = false;
   ```
3. Change it to:
   ```typescript
   const SHOW_ACTIVE_OFFERS = true;
   ```
4. Update the promo codes, discounts, or expiry dates in [`src/data/offers.json`](./src/data/offers.json).
5. Build and deploy:
   ```bash
   npm run build
   git commit -am "feat(offers): re-enable seasonal promotional offers"
   git push origin master
   ```

---

## Schema for Adding / Editing Offers (`src/data/offers.json`)

```json
{
  "id": "unique-offer-id",
  "offerName": "Offer Display Name",
  "slug": "offer-url-slug",
  "discount": "e.g. 20% OFF or 1 Mo Free",
  "category": "Tally Prime | Cloud VPS | AMC | Customization",
  "description": "Short benefit-focused description of the promotion.",
  "couponCode": "PROMOCODE",
  "expiryDate": "YYYY-MM-DD"
}
```
