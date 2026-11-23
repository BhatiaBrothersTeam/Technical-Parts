export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  part_number: string;
  model: string;
  category: string;
  subcategory?: string;
  description: string;
  features?: string[];
  applications?: string[];
  specifications: Specification[];
  industries: string[];
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
}

export type LeadType =
  | "price_request"
  | "rfq_upload"
  | "epc_enquiry"
  | "cj_enquiry"
  | "general_enquiry";

export interface Door {
  id: string;
  slug: string;
  path: string;
  title: string;
  intro: string;
  points: string[];
  ctaLabel: string;
  leadType: LeadType;
}

export interface RfqLine {
  product: string;
  brand: string;
  part_number: string;
  quantity: number;
  required_delivery?: string;
  notes?: string;
}

export interface LeadAttachment {
  filename: string;
  storedPath: string;
  size: number;
  type: string;
}

export interface LeadPayload {
  site: "TP";
  lead_type: LeadType;
  name: string;
  email: string;
  phone: string;
  country: string;
  company?: string;
  job_title?: string;
  enquiry_type?: string;
  project?: string;
  end_user?: string;
  message?: string;
  items?: RfqLine[];
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface StoredLead extends LeadPayload {
  lead_id: string;
  attachments: LeadAttachment[];
  created_at: string;
  status: "new";
}
