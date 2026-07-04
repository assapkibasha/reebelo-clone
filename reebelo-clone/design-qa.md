# Design QA

Current target: KG Phones Store mobile-first storefront refresh.

## Checks
- Branding uses KG Phones Store language and green KG visual cues.
- Public social links use TikTok at `https://www.tiktok.com/@kgphones`.
- Admin is hidden from public navigation and footer; staff access uses `/kg-admin`.
- The homepage hero uses `public/assets/kg-phones-hero.png` as the primary first-viewport image.
- Store content remains focused on iPhone, Samsung Galaxy, and Google Pixel phones.
- Prices display in RWF and WhatsApp enquiry actions prefill selected phone details.
- Demo product images are KG-named local assets and are only a preview fallback when backend inventory is empty.
- Real admin-uploaded Cloudinary product images remain the source of truth when backend inventory exists.
- Mobile-first layout must be checked at 360px, 390px, and 430px widths.
- Product cards should keep equal-height behavior, readable specs, clear price, and one WhatsApp action.
