AZ DIGITAL SOLUTIONS WEBSITE — QUICK GUIDE

New feature: Admin Panel + Enquiry inbox + Privacy Policy.

1) Upload all files and folders inside this package to the root of your existing GitHub repository.
2) Keep assets/ and supabase/ folders in place.
3) In Supabase SQL Editor, run supabase/admin-setup.sql.
4) Create an admin user in Supabase Authentication > Users.
5) Copy the Auth user's UUID and insert it into public.admin_users:
   INSERT INTO public.admin_users (user_id) VALUES ('YOUR-AUTH-USER-UUID');
6) Open your website URL followed by /admin.html to manage reviews and enquiries.

No CAPTCHA was added, as requested. Never put a service_role key in config.js.
