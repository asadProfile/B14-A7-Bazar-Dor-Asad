# 🛒 বাজার দর — BazarDor

**আজকের পণ্যমূল্য, এক নজরে।**

A Bengali-first daily market price tracker. It shows what got more expensive
and what got cheaper at the country's biggest bazaars today, lets you drill
into any single product for a bazar-by-bazar price table, and keeps the detail
view behind an account.

Built as the **B14-A7 "Bazar Dor"** assignment for Programming Hero.

**লাইভ ডেমো:** _add your Vercel URL here_ · **রিপোজিটরি:** _add your repo URL here_

---

## ✨ ফিচার (Features)

- **আজকের বাজার দর টিকার** — an endless marquee strip under the navbar cycling
  through live prices. It pauses on hover and stops entirely under
  `prefers-reduced-motion`.
- **এক নজরে ওঠানামা** — the home page splits the catalogue into the six biggest
  risers (▲ লাল) and the six biggest fallers (▼ সবুজ), so the day's story is
  readable without scrolling far.
- **ক্যাটাগরি ব্রাউজিং + সাজান** — eight categories (চাল, ডাল, তেল, সবজি, মাছ,
  মাংস, ডিম-দুধ, মসলা) each with a sort control: ডিফল্ট / দাম: কম থেকে বেশি /
  দাম: বেশি থেকে কম. The sort runs on the raw numeric price, so ৯৯ correctly
  outranks ১৪৮ instead of losing to it on Bengali codepoint order.
- **পণ্যের বিস্তারিত পেজ (সুরক্ষিত)** — summary card, সর্বনিম্ন / সর্বোচ্চ / গড় দাম
  and a per-bazar table covering twelve markets. Signed-out visitors are sent to
  sign-in and returned to the product afterwards.
- **অ্যাকাউন্ট ব্যবস্থাপনা** — email/password registration and login plus Google
  and GitHub, a profile page, and a separate update-information route.
- **সবকিছু বাংলায়** — Bengali numerals everywhere (১২৩ টাকা), a hand-built
  Bangla date (মঙ্গলবার, ৬ অক্টোবর, ২০২৬), Bengali unit labels (প্রতি কেজি /
  লিটার / ডজন / পিস) and Bengali toasts.
- **প্রতিরোধী ডেটা স্তর** — three API mirrors are tried in order, the response is
  validated before parsing, and a bundled JSON snapshot catches the last
  fallback — so the deployed app never shows an error page because upstream
  rate-limited.

---

## 🧰 টেকনোলজি (Technologies)

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org) — App Router, React Server Components |
| Language | [TypeScript](https://www.typescriptlang.org) (strict) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) — CSS-first `@theme` tokens, no config file |
| Auth | [BetterAuth](https://better-auth.com) — email/password + Google + GitHub |
| Database | [Drizzle ORM](https://orm.drizzle.team) on [libSQL](https://turso.tech) — SQLite file locally, Turso in production |
| Icons | [Lucide](https://lucide.dev) plus two inline brand SVGs |
| Notifications | [react-hot-toast](https://react-hot-toast.com) |
| Fonts | Hind Siliguri via `next/font/google` |

---

## 🚀 চালু করা (Getting started)

```bash
git clone <this-repo>
cd B14-A7-Bazar-Dor-Asad
npm install

cp .env.example .env.local        # then paste in a secret (see below)
npm run dev                       # http://localhost:3000
```

Only `BETTER_AUTH_SECRET` is required to run locally — everything else has a
working default. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

There is no migration step: the SQLite tables are created idempotently on first
boot and `bazardor.db` appears in the project root. To start from an empty
database, delete that file and restart.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## 🔐 পরিবেশ ভেরিয়েবল (Environment variables)

| Variable | Required | Purpose |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | **yes** | Signs session cookies |
| `BETTER_AUTH_URL` | Recommended | Public origin, used for social-login redirects (`http://localhost:3000` locally) |
| `TURSO_DATABASE_URL` | Production | libSQL/Turso URL. Unset locally → `file:./bazardor.db`; on Vercel → `/tmp` |
| `TURSO_AUTH_TOKEN` | Production | Turso auth token |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Enables the Google button |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | Enables the GitHub button |

For social login, register `<BETTER_AUTH_URL>/api/auth/callback/google` (or
`.../github`) as the redirect URI. A provider with no credentials still shows
its button — clicking it explains what is missing rather than failing with an
opaque configuration error.

---

## ☁️ ডিপ্লয় (Deploying to Vercel)

1. Push the repo and import it at [vercel.com/new](https://vercel.com/new).
2. Create a free [Turso](https://turso.tech) database and put its URL and token
   in `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` — Vercel's filesystem is
   ephemeral, so the local SQLite file cannot hold sessions there.
3. Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (the deployed origin).
4. Deploy, then add the production callback URLs in the Google and GitHub
   consoles.

---

## 📁 কাঠামো (Project structure)

```
src/
├── app/
│   ├── layout.tsx              # navbar + ticker + footer shell
│   ├── page.tsx                # home: hero, risers, fallers, সব পণ্য
│   ├── category/[slug]/        # catalogue with the sort control
│   ├── product/[slug]/         # protected detail page + market table
│   ├── profile/                # profile and update-information route
│   ├── signin/ signup/         # auth pages
│   ├── not-found.tsx           # ৪০৪
│   └── api/auth/[...all]/      # BetterAuth handler
├── components/                 # UI, incl. auth/ and skeletons
├── data/                       # bundled JSON snapshot fallback
├── lib/
│   ├── api.ts                  # mirror-walking data layer
│   ├── auth.ts / auth-client.ts
│   ├── bn.ts                   # Bengali numerals, dates, unit labels
│   ├── db/                     # Drizzle schema + libSQL client
│   └── validation.ts
└── middleware.ts               # optimistic guard on protected routes
```

---

## 📡 ডেটা সোর্স (Data source)

Prices come from the Programming Hero BazarDor API
(`openapi.programming-hero.com/api/bazardor`), with two worker mirrors as backup
and a bundled snapshot as the final fallback — 33 products across 8 categories,
each with quotes from 12 bazaars. Responses are cached for six hours.

> দাম শুধুমাত্র প্রদর্শনের জন্য; বাজার অনুযায়ী সামান্য ভিন্ন হতে পারে।
