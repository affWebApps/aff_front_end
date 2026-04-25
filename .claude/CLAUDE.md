# AFF Frontend — Claude Code Guide

## Project

**African Fashion Fusion (AFF)** is a fashion-tech B2B2C marketplace connecting three user roles:
- **Clients** — buyers who commission or purchase fashion items
- **Tailors** — service providers offering custom sewing/tailoring
- **Designers** — service providers showcasing portfolios and offering design services

Core features: marketplace (products & services), custom project bidding, design studio, portfolio management, blog, wallet, order management, admin panel.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Client State | Zustand 5 — persisted to `localStorage` via `persist` middleware |
| Server State | TanStack React Query 5 — caching, mutations, invalidation |
| Styling | Tailwind CSS 4.1 (primary), Material-UI 7.3, Emotion (CSS-in-JS) |
| Animations | Framer Motion 12 |
| Forms | Formik 2.4 + Yup 1.7 |
| HTTP Client | Axios — configured instance at `lib/api/axios.ts` |
| File Storage | Supabase Storage (bucket: `AFF Bucket`) |
| 3D / Canvas | Three.js + @react-three/fiber + @react-three/drei; Fabric.js |
| Charts | Recharts |
| Icons | Lucide React + MUI Icons |
| Fonts | Geist, Montserrat, Poppins, Roboto (Google Fonts via Next.js) |

Path alias: `@/` maps to the project root (configured in `tsconfig.json`).

---

## Development Commands

```bash
npm run dev       # Start dev server (Next.js, port 3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

---

## Environment Variables

Copy `.env.example` and fill in values before running locally.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/v1   # Backend REST API base URL
NEXT_PUBLIC_SUPABASE_URL=                           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=                      # Supabase anon/public key
NEXT_PUBLIC_SUPABASE_BUCKET=uploads                 # Supabase storage bucket name
```

Production backend: `https://aff-back-end.onrender.com/v1`

---

## Project Structure

```
app/                    # Next.js App Router
  (home)/               # Public landing page
  (auth)/               # Auth routes: sign-in, sign-up, forgot-password,
  │                     #   reset-password, verify-email, callback
  (onboarding)/         # Role-based onboarding: general, client, tailor, both
  (user)/               # Protected routes (requires auth): dashboard, products,
  │                     #   projects, services, analytics, wallet, user/profile
  (admin)/              # Admin panel
  marketplace/          # Public product & service browsing
  blog/                 # Blog listing + article pages
  cart/                 # Shopping cart
  orders/               # Order history + order detail [id]
  payment/              # Payment callback handling
  studio/               # Design studio (3D + canvas tools)
  hub/                  # Community hub & quick links
  gallery/              # Public portfolio gallery
  layout.tsx            # Root layout — wraps everything in QueryProvider
  globals.css           # Global CSS + CSS variable tokens

components/             # Reusable React components
  auth/                 # Auth forms and redirect wrappers
  blog/                 # Blog cards, editors, lists
  cart/                 # Cart item components
  modals/               # All modal dialogs (portfolio, profile, etc.)
  profile/              # Profile view/edit components
  ui/                   # Base primitives: Button, Header, inputs
  user/                 # User-specific dashboard components
  grid/ table/          # Layout components
  [LandingSection].tsx  # Top-level landing page sections (Features, Roles, etc.)

services/               # Business logic + API call methods (service objects)
  authServices.tsx      # Auth CRUD: login, register, logout, updateProfile, etc.
  cartService.ts        # Cart operations
  blogService.ts        # Blog CRUD
  portfolioService.ts   # Portfolio management
  googleAuthService.ts  # Google OAuth
  facebookAuthService.ts# Facebook OAuth
  imageUploadService.ts # Upload images to Supabase Storage

hooks/                  # Custom React hooks
  useProducts.ts        # Product list, single product, create/update/delete mutations
  useProduct.ts         # Single product fetch
  useCart.ts            # Cart state + mutations
  useOAuth.ts           # Generic OAuth flow
  useGoogleAuth.tsx     # Google-specific OAuth
  usePublishedBlogs.ts  # Published blog query
  useAuth.ts            # Auth helpers

store/                  # Zustand client state stores
  authStore.tsx         # Auth: user, token, isAuthenticated, setAuth, clearAuth, logout
  blogStore.ts          # Blog CRUD state + loading flags
  portfolioStore.ts     # Portfolio state

lib/
  api/axios.ts          # Configured Axios instance (see below)
  supabaseClient.ts     # Supabase JS client init
  storageService.ts     # Supabase Storage helpers (upload, getPublicUrl)

providers/
  query-provider.tsx    # React Query ClientProvider + DevTools

types/                  # TypeScript interfaces
  blog.ts
  product.ts
  buttonTypes.ts
  onboardingTypes.ts

data/                   # Static/seed data
utils/                  # Shared utility functions
styles/                 # CSS modules (e.g. login.module.css)
```

---

## Architecture & Data Flow

```
Component
  └─ reads/writes state via ──▶ Zustand store  (useAuthStore, etc.)
  └─ fetches/mutates data via ▶ React Query hook  (useProducts, useCart, etc.)
                                    └─ calls ──▶ Service function  (authService.login(), etc.)
                                                    └─ calls ──▶ apiClient (Axios)
                                                                    └─ hits ──▶ Backend REST API
```

**Rule of thumb:**
- Zustand = client/UI state (auth session, local modal state, blog editor state)
- React Query = anything that comes from the server (products, orders, blogs)
- Services = the only place raw `apiClient` calls live; never call `apiClient` directly from components

---

## Axios Configuration (`lib/api/axios.ts`)

- Base URL from `NEXT_PUBLIC_API_BASE_URL`; timeout 30 s
- **Request interceptor:** reads `token` from `useAuthStore.getState()` and injects `Authorization: Bearer <token>` on every request
- **Response interceptor:**
  - `401` → calls `clearAuth()`, then redirects to `/sign-in?redirect=<current-path>`
  - `404` / `500` → logs errors to console
  - Network/CORS errors → logs CORS warning

Always import `apiClient` from `@/lib/api/axios`, not the raw `axios` package.

---

## Authentication

- JWT stored in Zustand (`authStore`) and persisted to `localStorage` under the key `auth-storage`
- `setAuth(user, token)` — call after successful login/register
- `clearAuth()` — wipes session; called automatically on 401
- `logout()` — calls `POST /auth/logout` then `clearAuth()`
- `checkAuth()` — validates token by hitting `GET /users/me`; clears auth on failure
- Protected pages check `useAuthStore().isAuthenticated` directly (no Next.js middleware yet)

Social login: Google (`googleAuthService` + `useGoogleAuth`) and Facebook (`facebookAuthService` + `useOAuth`) — both resolve to the same token/user flow via the OAuth callback route.

---

## State Management Patterns

### React Query
- Query keys follow `["resource", ...filters]` — e.g. `["products", page, limit]`, `["vendor-product", id]`
- `staleTime: 60_000` (1 minute) is the project default
- `keepPreviousData` / `placeholderData` used on paginated queries to avoid layout flash
- Mutations always call `queryClient.invalidateQueries()` on success to refetch affected lists

### Zustand
- Access stores with the `use*Store` hook inside components
- Access stores outside React (e.g. in Axios interceptors) with `useAuthStore.getState()`
- Stores are scoped: `authStore` for session, `blogStore` for blog CRUD, `portfolioStore` for portfolios

---

## Forms

All forms use **Formik** for state management and **Yup** for validation schemas. Pattern:

```tsx
const validationSchema = Yup.object({ email: Yup.string().email().required() });

<Formik initialValues={...} validationSchema={validationSchema} onSubmit={handleSubmit}>
  {({ values, errors, handleChange }) => (
    <Form>...</Form>
  )}
</Formik>
```

---

## File Uploads

Images are uploaded to **Supabase Storage**, not the main backend. Use `imageUploadService.ts` or `lib/storageService.ts`. After upload, the returned public URL is stored in the backend via the normal API.

---

## Styling Conventions

- **Tailwind CSS first** — use utility classes for layout, spacing, color, typography
- **MUI** for complex interactive components (tables, selects, modals from the design system)
- **Emotion** only where component-scoped CSS-in-JS is strictly needed
- **CSS Modules** (`styles/*.module.css`) for legacy or highly specific scoped styles
- CSS custom properties defined in `globals.css` for theming tokens

---

## TypeScript Conventions

- `strict: true` is enabled — no implicit `any`
- Shared types live in `types/`; service-specific types are co-located in the service file
- `@/*` path alias is available everywhere (maps to project root)
- Avoid `any` — use `unknown` + type guards or proper interfaces

---

## Next.js Config Notes

- `next.config.ts` allows **all remote image hostnames** (wildcard `**`) — keep this in mind for security
- Rewrite rule: `/ai-studio2/:path*` proxies to an external AI design studio on Vercel
- App Router only — no `pages/` directory

---

## Key API Endpoints (Backend)

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns `{ access_token, user }` |
| POST | `/auth/logout` | Invalidate token |
| GET | `/users/me` | Fetch current authenticated user |
| PATCH | `/users/me` | Update profile |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset with token |
| POST | `/auth/verify-email` | Verify email token |
| GET | `/store/products` | Public product list (paginated) |
| POST | `/store/vendors/products` | Create vendor product |
| POST | `/store/vendors/products/:id/update` | Update vendor product |
| DELETE | `/store/vendors/products/:id` | Delete vendor product |

---

## Debugging

The Axios interceptors emit structured `console.log` / `console.error` with emoji prefixes for every request and response:
- `🚀` — outgoing request
- `✅` — successful response
- `❌` — error (request or response)
- `🔄` — in-progress operation (login, profile update, etc.)

React Query DevTools are included and visible in development at the bottom of the screen.
