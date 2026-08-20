# Security Policy

## Supported versions

Security fixes are applied to the `main` branch.

## Reporting a vulnerability

**Do not** open a public GitHub issue for security vulnerabilities.

Report privately via [GitHub Security Advisories](https://github.com/Nisarg-13/Nisarg-TradeLab-Frontend/security/advisories/new).

Include:

- Description of the issue
- Steps to reproduce
- Impact (data exposure, auth bypass, etc.)

We aim to acknowledge reports within 7 days.

## Secrets and configuration

- Never commit `.env`, `.env.local`, or API keys.
- Clerk **secret** keys belong on the server only — never use `NEXT_PUBLIC_` for secrets.
- See [`.env.example`](./.env.example) for required variables.

## Related repositories

- Backend API: [Nisarg-TradeLab-Backend-FastAPI](https://github.com/Nisarg-13/Nisarg-TradeLab-Backend-FastAPI)
