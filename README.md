# AZ Digital Solutions — website package

This package preserves the existing six-page website, its design, original `assets/az-logo.png`, Supabase configuration, review form and enquiry form. It adds a private admin dashboard and a privacy policy.

## Pages
- `index.html` — Home
- `services.html` — Services
- `about.html` — About
- `portfolio.html` — Portfolio
- `reviews.html` — Customer review submission and published reviews
- `contact.html` — Enquiry form
- `privacy.html` — Privacy policy
- `admin.html` — Private admin dashboard (not listed in public navigation)

## Supabase setup
Your existing public website is already configured in `config.js`. Do not replace the publishable key with a service-role key.

If the existing reviews and enquiries are already working, do not rerun the root `setup.sql` unnecessarily. To enable the new admin dashboard:

1. Open Supabase Dashboard → SQL Editor.
2. Run `supabase/admin-setup.sql`.
3. In Supabase Dashboard → Authentication → Users, create an admin user with your chosen email and a strong password.
4. Copy that user's UUID.
5. In SQL Editor, run this statement after replacing the placeholder with the actual UUID:

   `INSERT INTO public.admin_users (user_id) VALUES ('YOUR-AUTH-USER-UUID');`

6. Open `https://azdigitalsolutions0.github.io/Az-digital-solutions/admin.html` and sign in with that admin email/password.

There is no public admin sign-up form. Only a user whose UUID is in `public.admin_users` can access the dashboard data. RLS controls review visibility changes/deletion and enquiry reads.

## CAPTCHA
CAPTCHA has intentionally not been added, as requested. The public review form remains instant-publish. This means spam protection is limited; periodically check submissions in the admin panel.

## Deployment
Upload the contents of this folder (not the enclosing folder itself) to the root of the existing GitHub repository `azdigitalsolutions0/Az-digital-solutions`, keeping the `assets/` and `supabase/` folders. GitHub Pages should continue to serve the site from the `main` branch root.

Keep `config.js` private to the extent possible and never add service-role secrets. The publishable key is intended for browser use and must be protected by correct RLS policies.
