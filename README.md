# technicalparts.com — EPC Packages & C&J Fabrication

BB Group's enquiry-led industrial B2B website, focused on two divisions:

- **EPC Packages** — 24 fabricated package types for oil and gas EPC projects,
  in four groups (Piping & Plant Works, Process Vessels & Exchangers, Skids &
  Manifolds, Safety, Marine & Utilities).
- **C&J Fabrication** — capability-led fabrication to the customer's drawings.
  *"C&J" is not defined in the source documents, so the page uses placeholder
  text that is clearly marked. Confirm what C&J stands for and replace it.*

Not a webshop: a "My RFQ" basket, an Upload RFQ page, division and contact
enquiry forms. Every submission is saved and returns a `TP-YYYYMMDD-XXXX` lead
ID. No cart, no checkout, no prices.

Pages: `/` · `/epc` · `/epc/[group]` · `/epc/[group]/[package]` ·
`/fabrication` · `/projects` · `/industries` · `/about` · `/contact` · `/rfq` ·
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
  the public Store API, cached 5 minutes and refreshed instantly by a
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

## Load the EPC packages into WooCommerce

`content/woocommerce-packages.csv` holds the 24 packages (SKU `EPC-01` to
`EPC-24`, with groups as categories).

1. WooCommerce > Products > **Import**, choose the CSV, map columns
   automatically, run the import.
2. Delete any products that do not belong to these divisions.
3. Edit descriptions, add photos and attributes in WooCommerce. Leave prices
   empty. The site picks up changes within 5 minutes, or instantly with the
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

## Deploy

1. Push this repo to GitHub and import it into Vercel (Next.js preset).
2. Set the variables from `.env.example` in the Vercel project, then redeploy.
3. **Known platform limit:** Vercel caps request bodies around 4.5 MB, below the
   25 MB upload limit enforced in the code. Resolve before relying on large
   drawing uploads in production.

## Placeholder content to replace before go-live

- **C&J Fabrication** page: scope, capability, codes. Marked as placeholder.
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
