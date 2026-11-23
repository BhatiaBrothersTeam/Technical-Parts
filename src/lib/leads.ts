import { promises as fs } from "fs";
import path from "path";
import type { LeadPayload, StoredLead, LeadAttachment } from "@/lib/types";

/**
 * Stand-in for the "bb-leads" WordPress plugin endpoint
 * (POST /wp-json/bb-leads/v1/leads) described in the spec. Set
 * BB_LEADS_ENDPOINT in .env.local to forward leads to the real plugin
 * instead of writing to the local data/ folder — no page or component
 * needs to change either way, everything goes through this module.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]", "utf-8");
  }
}

async function readLeads(): Promise<StoredLead[]> {
  await ensureDataDir();
  const raw = await fs.readFile(LEADS_FILE, "utf-8");
  try {
    return JSON.parse(raw) as StoredLead[];
  } catch {
    return [];
  }
}

async function writeLeads(leads: StoredLead[]) {
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

function pad4(n: number) {
  return String(n).padStart(4, "0");
}

async function nextLeadId(existing: StoredLead[]): Promise<string> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const datePrefix = `TP-${y}${m}${d}-`;
  const todaysCount = existing.filter((l) => l.lead_id.startsWith(datePrefix)).length;
  return `${datePrefix}${pad4(todaysCount + 1)}`;
}

export async function createLeadId(): Promise<string> {
  const leads = await readLeads();
  return nextLeadId(leads);
}

export async function appendLead(
  lead_id: string,
  input: LeadPayload,
  attachments: LeadAttachment[]
): Promise<StoredLead> {
  const leads = await readLeads();
  const stored: StoredLead = {
    ...input,
    site: "TP",
    lead_id,
    attachments,
    created_at: new Date().toISOString(),
    status: "new",
  };
  leads.push(stored);
  await writeLeads(leads);
  return stored;
}

export async function storeAttachment(
  leadIdHint: string,
  filename: string,
  buffer: Buffer
): Promise<LeadAttachment> {
  await ensureDataDir();
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const dir = path.join(UPLOADS_DIR, leadIdHint);
  await fs.mkdir(dir, { recursive: true });
  const storedPath = path.join(dir, safeName);
  await fs.writeFile(storedPath, buffer);
  return {
    filename,
    storedPath: path.relative(process.cwd(), storedPath),
    size: buffer.length,
    type: safeName.split(".").pop() ?? "unknown",
  };
}
