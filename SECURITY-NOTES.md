# Security notes — AZ Digital Solutions

- `config.js` contains the Supabase publishable key only. Never place a Supabase `service_role` or secret key in website files.
- Admin access is protected by Supabase Auth plus the `admin_users` allow-list and Row Level Security policies. Hiding the admin URL alone is not security.
- Run `supabase/admin-setup.sql` after the existing `setup.sql`, then add the administrator's Auth user UUID to `public.admin_users`.
- The public review form publishes submissions immediately, as currently configured. Admins can hide or delete reviews from `admin.html`.
- CAPTCHA has intentionally not been added, as requested. Public forms can still receive spam; review/enquiry submissions should be checked periodically.
- Restrict access to the Supabase project dashboard and use a strong, unique admin password.
