# Lunaro

Production-oriented full-stack software company platform with:

- React + Vite + TypeScript + Tailwind public website
- Arabic RTL / English LTR localization with i18next
- Node.js + Express + TypeScript REST API
- PostgreSQL + Prisma
- Argon2 password hashing
- JWT authentication in HTTP-only cookies
- USER / ADMIN / SUPER_ADMIN roles
- Nodemailer branded contact notifications
- Separate protected React admin portal
- Docker Compose for local PostgreSQL

## Requirements

Node.js 20+
PostgreSQL 16+ (or Docker)

## Setup

1. Copy `backend/.env.example` to `backend/.env` and set production values.
2. Start PostgreSQL with `docker compose up -d postgres` or use an external PostgreSQL instance.
3. Install dependencies with `npm install`.
4. Generate Prisma client: `npm run db:generate`.
5. Apply migrations: `npm run db:migrate`.
6. Seed the initial super admin and sample public content: `npm run db:seed`.
7. Run all applications with `npm run dev`.

Public app: http://localhost:5173
Admin app: http://localhost:5174/admin/
API: http://localhost:4000/api

## Production

Build all workspaces with `npm run build`. Deploy the three applications according to your hosting provider. The backend must expose port 4000 (or the value of PORT) and must use HTTPS so secure cookies work in production.

Set `FRONTEND_URL` and `ADMIN_URL` to the exact deployed origins. Set `COOKIE_DOMAIN` only when a shared parent domain is intentionally used; otherwise leave it empty.

The seed command creates the initial super admin using the credentials in the environment. Change the password immediately after the first deployment.
