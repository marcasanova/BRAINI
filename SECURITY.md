# Security Policy

## Reporting a vulnerability

If you believe you have found a security issue in Braini Emotions, please email
**info@brainiemotions.com** with a description and steps to reproduce.

Do not open a public GitHub issue for vulnerabilities that could expose user or
child data.

## What is not a secret

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are intended for the browser.
  They appear in the client bundle. Protection relies on Supabase Auth, RLS,
  and server-side Edge Functions.

## What must never be committed

- `.env`, `.env.local`, `.env.test` (see `.gitignore`)
- Supabase `service_role` key
- Database passwords, Vercel tokens, private keys (`.pem`, etc.)
- Production demo passwords for real users

## Architecture notes

- User signup is invite-only via Edge Functions (`complete-*-invite`) that use
  `service_role` only inside the Supabase project secrets, not in this repo.
- The SPA talks to Supabase with the anon key under RLS.
