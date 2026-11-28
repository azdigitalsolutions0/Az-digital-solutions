# Security checklist before public launch

[ ] Supabase project belongs to AZ Digital Solutions.
[ ] Only public anon/publishable key is present in `config.js`.
[ ] `service_role` key is NOT present in any website file.
[ ] SQL setup ran successfully.
[ ] Storage bucket `review-photos` has 2 MB size limit and image MIME allowlist.
[ ] Cloudflare Turnstile token is verified server-side via an Edge Function before accepting public reviews/enquiries.
[ ] Server-side rate limiting is active for review and enquiry endpoints.
[ ] Test that public users cannot select enquiries, update reviews, or delete reviews.
[ ] Test mobile form submission, invalid photo type, oversized photo and network failure.
