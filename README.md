# AZ Digital Solutions — Complete Website Package

A mobile-first, multi-page website for AZ Digital Solutions. Original AZ logo and supplied brand/contact details are included.

## Pages
- `index.html` — Home, service categories, business metrics, latest reviews
- `services.html` — Searchable service directory
- `about.html` — About and approach
- `portfolio.html` — Capability showcase (not fabricated client case studies)
- `reviews.html` — Public review submission, latest reviews and Google review link
- `contact.html` — Enquiry form and contact channels

## Upload to the existing GitHub repository (Android)
1. Download and extract this ZIP.
2. Open your GitHub repository: `azdigitalsolutions0/Az-digital-solutions`.
3. Back up the existing repository first (download ZIP or create a branch).
4. Upload/replace the files from this package at the repository root. Keep the `assets` folder and its `az-logo.png` together.
5. Ensure `index.html`, `style.css`, `script.js`, and `config.js` are at the root (not inside another folder).
6. Commit changes. GitHub Pages may take a few minutes to refresh.

## Supabase setup (required for live reviews and enquiry storage)
1. Create/use a **dedicated AZ Digital Solutions Supabase project**.
2. Open SQL Editor and run `supabase/setup.sql`.
3. In Storage, create a public bucket named `review-photos`, set max file size to 2 MB and allowed MIME types to `image/jpeg`, `image/png`, `image/webp`.
4. Open Project Settings > API. Copy Project URL and the public anon/publishable key.
5. Edit `config.js`; replace the two `PASTE_...` values. Use only the public anon/publishable key. Never use the `service_role` key.
6. Upload the updated `config.js` to GitHub and test a review submission and enquiry.

## Security and instant publication
- Reviews are inserted with `is_visible = true` and immediately appear in the public list; no manual approval queue is included.
- Public visitors can read visible reviews and submit reviews. Public users cannot update/delete reviews through the supplied policies.
- Enquiries can be inserted publicly but cannot be read publicly.
- Photo type and size are checked in the browser and Storage bucket. SQL policies restrict file extensions.
- Before public promotion, add server-side CAPTCHA verification (Cloudflare Turnstile) and server-side rate limiting using an Edge Function. Do not treat browser-only validation as spam protection.
- For an admin moderation/report/hide workflow, build a separate authenticated admin interface; it is intentionally not included in this public instant-publish starter.

## Important
- No fabricated customer testimonials or project case studies are included.
- The supplied business figures are displayed as provided by the owner.
- Google reviews open the supplied Maps link.
- The website can render without Supabase, but live review publishing and database-backed enquiries require the setup above. If Supabase is not configured, the contact form offers a WhatsApp handoff.
- GitHub Pages can host this static site. Cloudflare Pages is optional; connect the same repository if you later want a `*.pages.dev` address.
