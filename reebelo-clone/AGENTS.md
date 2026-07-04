# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Prototype decisions:
- Website/store name is KG Phone Store.
- Product inventory should be backend-driven through Next.js API routes.
- Use MongoDB for product storage.
- Use Cloudinary for admin-uploaded phone images.
- Storefront product listings, product categories, deal sections, and product detail content should be derived from backend inventory only; do not show fallback or seed products when MongoDB is unavailable or empty.
- Admin product management must require login and protect the API routes server-side.
- Visual direction should be modern, clean, and polished rather than old-style ecommerce chrome.
- For prototype visualization, demo phone data may appear when MongoDB returns no products, but it should be clearly labeled as demo preview data and real backend inventory should take priority.
- Main nav should stay focused: All phones, Deals, Warranty, TikTok, plus WhatsApp as the primary contact action. Admin must not appear in public navigation; staff access uses `/kg-admin`.
- Keep the storefront minimal and functional: remove cart/account/save/subscribe/pagination/partial-filter controls unless they are fully implemented.
- Visual system should be calm and premium: Inter font, restrained slate/white/teal palette, consistent 8px radius, max-width page alignment, polished scrollbars, and no noisy repeated product sections.
- Do not use a separate desktop nav row; keep the burger/menu button in the primary top bar and put secondary navigation in the drawer.
- Product cards should use a premium ecommerce card structure: staged image area, brand label, stable spec chips, clear price, and one WhatsApp action with equal-height responsive behavior.
- Admin product editor should be list-first; add/edit opens an overlay with live preview, modern image picker, featured checkbox, and searchable brand selection sourced from all existing backend brands plus core defaults.
- Home hero should use the KG Phones Store brand hero image as the first-viewport signal; backend `featured` products can still inform WhatsApp enquiry text.
