# technicalparts.com — EPC Packages & C&J Packages

BB Group's enquiry-led industrial B2B website, focused on two divisions:

- **C&J Packages** (`/cj-packages`) — the packages uploaded to WooCommerce
  (brand "C&J Gulf Equipment Manufacturing L.L.C.", SKUs `CJ-PKG-nnn`). Any
  product whose brand contains "C&J" is shown here and only here.
- **EPC Packages** (`/epc`) — no packages uploaded yet, so the page shows a
  "coming soon" message and an enquiry form. Products without the C&J brand
  appear here automatically once added to WooCommerce.

Not a webshop: a "My RFQ" basket, an Upload RFQ page, division and contact
enquiry forms. Every submission is saved and returns a `TP-YYYYMMDD-XXXX` lead
ID. No cart, no checkout, no prices.

Pages: `/` · `/epc` · `/epc/[group]` · `/epc/[group]/[package]` ·
`/cj-packages` · `/projects` · `/industries` · `/about` · `/contact` · `/rfq` ·
`/my-rfq`. The earlier MRO, Repair & AMC, Equipment and Brands pages were
removed.

## Tool & stack

- Built with **Claude Code**.
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Headless.
- **Architecture (headless WooCommerce):** the Next.js storefront on Vercel
  reads the package catalogue from WordPress + WooCommerce on Hostinger and
  sends every enquiry to the `bb-leads` plugin on the same WordPress site. The
  browser never talks to WordPress; only the Next.js server does. WooCommerce
  is a catalogue only: no cart, checkout or price endpoints are used.
- **Data layer:** every read goes through `src/lib/data`. With
  `WOOCOMMERCE_STORE_URL` set, packages and groups come from WooCommerce
  (`src/lib/woocommerce.ts`): REST API with a read-only key, falling back to
  the public Store API, cached 30 seconds and refreshed instantly by a
  WooCommerce webhook (`/api/revalidate`). If WooCommerce is unreachable the
  catalogue is empty (never silently replaced by sample data). With the URL
  empty, the bundled sample JSON in `src/lib/data/*.json` is used.
- **Leads:** `POST /api/leads` is the single write path. Lead types:
  `epc_enquiry`, `cj_enquiry`, `rfq_upload`, `price_request`,
  `general_enquiry`. It validates on the server (required fields, email,
  25 MB, allowed file types) and forwards data and files to the `bb-leads`
  plugin when `BB_LEADS_ENDPOINT` is set. With no endpoint it writes to
  `data/leads.json` + `data/uploads/` for demos.

## Install, run, build

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start        # serve the production build
```

No environment variables are needed for the sample-data demo. Copy
`.env.example` to `.env.local` and fill it in to use a real WordPress site.
Restart after changing it; production builds read it at build time.

## Adding products in WooCommerce

- **C&J packages:** set the product **Brand** to a name containing "C&J". They
  appear on `/cj-packages`.
- **EPC packages:** add products with any other brand (or none). They appear on
  `/epc`, grouped by their WooCommerce category. None are uploaded yet.
- Leave prices empty. Changes show within about 30 seconds, or instantly with the
  webhook below.

## Connect WooCommerce (Hostinger)

1. WooCommerce > Settings > Advanced > REST API > Add key, permission **Read**.
   Put them in `WOOCOMMERCE_CONSUMER_KEY` / `WOOCOMMERCE_CONSUMER_SECRET`, and
   the site address in `WOOCOMMERCE_STORE_URL`.
2. Product fields: SKU becomes the package code; the first category becomes
   the group; attributes become the specification table; tags link industries.
3. Optional: WooCommerce > Settings > Advanced > Webhooks, topic **Product
   updated** (and created / deleted), delivery URL
   `https://your-site/api/revalidate`, secret = `WOOCOMMERCE_WEBHOOK_SECRET`.
4. Photos served from a CDN host must be listed in `WOOCOMMERCE_IMAGE_HOSTS`.
5. Install the `bb-leads` plugin (**v1.2.0 or later** — earlier versions reject
   `epc_enquiry` and `cj_enquiry`) and set `BB_LEADS_ENDPOINT` /
   `BB_LEADS_PROXY_SECRET`. See `wordpress-plugin/bb-leads/README.md`.

## Deploy to Netlify

1. Import the GitHub repository into Netlify using the Next.js framework
   settings.
2. In **Project configuration > Environment variables**, add
   `WOOCOMMERCE_STORE_URL` and, if using the authenticated REST API, both
   `WOOCOMMERCE_CONSUMER_KEY` and `WOOCOMMERCE_CONSUMER_SECRET`. Use the same
   values as your local `.env.local`; that file is ignored by Git and is not
   uploaded to Netlify. Never commit it or share the keys.
3. If variable scopes are available, enable both **Builds** and **Functions**
   for these variables. Add any other required variables from `.env.example`
   for images, webhooks and leads as appropriate.
4. Redeploy after changing environment variables. C&J products appear on
   `/cj-packages` and on the home page; other products appear on `/epc`.
   Only published products are returned by the catalogue.
5. If the catalogue is still empty, check the Netlify build and function logs
   for WooCommerce errors and verify the store URL and API permissions.

## Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel (Next.js preset).
2. Set the variables from `.env.example` in the Vercel project, then redeploy.
3. **Known platform limit:** Vercel caps request bodies around 4.5 MB, below the
   25 MB upload limit enforced in the code. Resolve before relying on large
   drawing uploads in production.

## Placeholder content to replace before go-live

- **C&J Packages** page: scope, capability, codes. Marked as placeholder.
- **Projects** page: reference projects and certifications are sample sections.
- Home, About, Industries and footer contact details are sample text.
- Package descriptions in the CSV are starting text; add real photos.

## Known issues / not done

- The plugin and catalogue were tested on the real WordPress for the earlier
  version; the EPC restructure was verified locally (all routes return 200, new
  lead types are accepted, an invalid type is rejected).
- DWG/DXF drawings are not accepted yet (PDF, Excel, Word, JPG, PNG only).
- Product search runs in the browser; fine for hundreds of packages.
- No CAPTCHA (rate limiting only), no customer confirmation email, no Zoho sync.
- No automated test suite is committed to the repo.
