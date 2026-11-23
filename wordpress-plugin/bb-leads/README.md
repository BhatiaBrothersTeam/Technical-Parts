# bb-leads

WordPress plugin that receives every RFQ, price request and enquiry from the
technicalparts.com Next.js storefront and stores it as a private `bb_lead`
record. Endpoint: `POST /wp-json/bb-leads/v1/leads`.

The endpoint is **server-to-server only**: the browser never talks to
WordPress. The Next.js server calls it with a shared secret.

## Install (Hostinger WordPress)

1. Install and activate WooCommerce first (catalogue only: no cart or checkout
   pages are needed by the storefront).
2. Upload the `bb-leads` folder to `wp-content/plugins/` (File Manager or
   zip upload under Plugins > Add New) and activate **BB Leads**.
3. Add to `wp-config.php`, above the "That's all, stop editing" line:

   ```php
   define('BB_LEADS_PROXY_SECRET', 'at-least-32-random-characters');
   // Optional. Defaults to the site admin email (Settings > General).
   define('BB_LEADS_NOTIFY_EMAIL', 'sales@your-domain.com');
   ```

4. In the Next.js environment (Vercel project settings), set
   `BB_LEADS_ENDPOINT` to `https://your-wp-site/wp-json/bb-leads/v1/leads` and
   `BB_LEADS_PROXY_SECRET` to the same secret, then redeploy.
5. Configure working WordPress email (an SMTP plugin with an authenticated
   mailbox) so notification emails are delivered. Leads are saved even if
   email fails; the failure is written to the PHP error log.

Leads appear under **Leads** in WP Admin. Each lead shows the contact details,
requested items, attachments and a follow-up status (New, Assigned, Contacted,
Quoted, Follow-up, Won, Lost).

## Endpoint contract

- Auth: header `X-BB-Proxy-Secret` must equal `BB_LEADS_PROXY_SECRET`.
  Missing or wrong secret returns 401; an unconfigured plugin returns 503.
- Visitor IP: header `X-BB-Client-IP` is used for rate limiting
  (10 submissions per visitor per 10 minutes, then 429).
- Body: `multipart/form-data` (or JSON). Required: `lead_type`, `name`,
  `email` (valid), `phone`, `country`. `lead_type` is one of `price_request`,
  `rfq_upload`, `epc_enquiry`, `cj_enquiry`, `general_enquiry` (the earlier
  `oil_gas_enquiry`, `repair_enquiry` and `equipment_enquiry` are still accepted). Optional: `company`, `job_title`, `enquiry_type`,
  `project`, `end_user`, `message`, `page_url`, `utm_*`, `items` (JSON array
  of `{product, brand, part_number, quantity, required_delivery, notes}`,
  max 100) and files in `files[]`.
- Files: PDF, XLS/XLSX, DOC/DOCX, JPG, PNG; 25 MB each; up to 10. All files
  are validated before anything is saved. **A single invalid file rejects the
  whole request (400)**, so a customer is never told an RFQ was received when
  a file was dropped.
- Success: `{ "lead_id": "TP-YYYYMMDD-XXXX" }`. The daily number is allocated
  atomically, so simultaneous submissions never share an ID.
- If storing an attachment fails after the lead record is created, the record
  and any stored files are removed and an error is returned.

## Attachments are private

Files are stored in `wp-content/uploads/bb-leads-private/<lead-id>-<random>/`.
The folder has an `.htaccess` that denies direct web access (works on
Hostinger's LiteSpeed/Apache). Staff download files from the lead screen in
WP Admin through a nonce-protected link that checks their capability. If you
ever move to Nginx, add an equivalent `deny all` rule for that folder.

## Who can see leads (role-based access)

The plugin registers its own capabilities (`edit_bb_leads`, `read_private_bb_leads`,
and related) and grants them on activation to **Administrator** and
**Shop manager**. To give a sales team access without making them
administrators, create a role (for example Sales Manager) in a roles plugin and
grant it those capabilities. Leads cannot be created manually from the admin.

## Not included yet

- CAPTCHA (Cloudflare Turnstile). Rate limiting is in place; add Turnstile if
  spam appears.
- Zoho CRM sync and lead recommendations (need the Zoho account).
- Confirmation email to the customer.

## Status

The code parses cleanly but has **not been run on a real WordPress site**.
Test on the Hostinger staging site first: submit My RFQ, an RFQ with a PDF and
an Excel file, and one invalid file, then confirm the records, attachments,
notification email and the 429 limit behave as described above.
