import { NextRequest, NextResponse } from "next/server";
import { appendLead, createLeadId, storeAttachment } from "@/lib/leads";
import type { LeadPayload, LeadType, RfqLine } from "@/lib/types";

const VALID_LEAD_TYPES: LeadType[] = [
  "price_request",
  "rfq_upload",
  "epc_enquiry",
  "cj_enquiry",
  "general_enquiry",
];

const ALLOWED_EXTENSIONS = [".pdf", ".xls", ".xlsx", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 10;
const MAX_ITEMS = 100;

class RequestError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

function isValidLeadType(value: unknown): value is LeadType {
  return typeof value === "string" && (VALID_LEAD_TYPES as string[]).includes(value);
}

function str(value: unknown, max = 5000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function cleanItems(value: unknown): RfqLine[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.slice(0, MAX_ITEMS).map((raw) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const quantity = Number(r.quantity);
    return {
      product: str(r.product, 300) ?? "",
      brand: str(r.brand, 200) ?? "",
      part_number: str(r.part_number, 200) ?? "",
      quantity: Number.isFinite(quantity) && quantity >= 1 ? Math.floor(quantity) : 1,
      required_delivery: str(r.required_delivery, 200),
      notes: str(r.notes, 1000),
    };
  });
}

function buildPayload(source: Record<string, unknown>): LeadPayload {
  if (!isValidLeadType(source.lead_type)) throw new RequestError("Invalid lead_type");

  const payload: LeadPayload = {
    site: "TP",
    lead_type: source.lead_type,
    name: str(source.name, 200) ?? "",
    email: str(source.email, 254) ?? "",
    phone: str(source.phone, 50) ?? "",
    country: str(source.country, 100) ?? "",
    company: str(source.company, 200),
    job_title: str(source.job_title, 200),
    enquiry_type: str(source.enquiry_type, 100),
    project: str(source.project, 300),
    end_user: str(source.end_user, 300),
    message: str(source.message),
    items: cleanItems(source.items),
    page_url: str(source.page_url, 500),
    utm_source: str(source.utm_source, 200),
    utm_medium: str(source.utm_medium, 200),
    utm_campaign: str(source.utm_campaign, 200),
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.country) {
    throw new RequestError("Missing required fields");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new RequestError("Invalid email address");
  }
  return payload;
}

function validateFiles(files: File[]) {
  if (files.length > MAX_FILES) throw new RequestError(`You can attach up to ${MAX_FILES} files`);
  for (const file of files) {
    const name = file.name.toLowerCase();
    if (!ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      throw new RequestError(`${file.name} is not an accepted file type`);
    }
    if (file.size > MAX_FILE_BYTES) throw new RequestError(`${file.name} exceeds the 25MB limit`);
    if (file.size === 0) throw new RequestError(`${file.name} is empty`);
  }
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim();
}

async function forwardToWordPress(
  endpoint: string,
  payload: LeadPayload,
  files: File[],
  ip: string
): Promise<string> {
  const secret = process.env.BB_LEADS_PROXY_SECRET;
  if (!secret) throw new Error("BB_LEADS_PROXY_SECRET is not set but BB_LEADS_ENDPOINT is");

  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || key === "items" || key === "site") continue;
    form.set(key, String(value));
  }
  if (payload.items) form.set("items", JSON.stringify(payload.items));
  for (const file of files) form.append("files[]", file, file.name);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "X-BB-Proxy-Secret": secret, "X-BB-Client-IP": ip },
    body: form,
    signal: AbortSignal.timeout(60000),
  });

  if (res.status === 429) throw new RequestError("Too many submissions. Please wait a few minutes and try again.", 429);
  if (res.status >= 400 && res.status < 500 && res.status !== 401 && res.status !== 403) {
    const detail = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new RequestError(detail?.message ?? "The enquiry could not be accepted");
  }
  if (!res.ok) throw new Error(`Lead service responded ${res.status}`);

  const data = (await res.json()) as { lead_id?: string };
  if (!data.lead_id) throw new Error("Lead service did not return a lead_id");
  return data.lead_id;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  try {
    let payload: LeadPayload;
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      payload = buildPayload(Object.fromEntries(form.entries()));
      files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    } else {
      payload = buildPayload((await req.json()) as Record<string, unknown>);
    }
    validateFiles(files);

    const endpoint = process.env.BB_LEADS_ENDPOINT;
    if (endpoint) {
      const lead_id = await forwardToWordPress(endpoint, payload, files, clientIp(req));
      return NextResponse.json({ lead_id });
    }

    const lead_id = await createLeadId();
    const attachments = [];
    for (const file of files) {
      attachments.push(await storeAttachment(lead_id, file.name, Buffer.from(await file.arrayBuffer())));
    }
    const stored = await appendLead(lead_id, payload, attachments);
    return NextResponse.json({ lead_id: stored.lead_id });
  } catch (err) {
    if (err instanceof RequestError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Lead submission failed", err);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
