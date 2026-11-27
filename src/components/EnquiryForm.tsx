"use client";

import { useState, type FormEvent } from "react";
import { t } from "@/lib/locale";
import type { LeadType } from "@/lib/types";
import { Honeypot, useFormTimer } from "@/components/SpamGuard";
import { PrivacyNote } from "@/components/PrivacyNote";

const enquiryTypeOptions = [
  "C&J Packages",
  "EPC Packages",
  "RFQ",
  "Technical Support",
  "Distributor / Vendor",
  "General",
];

interface EnquiryFormProps {
  leadType: LeadType;
  heading?: string;
  showEnquiryType?: boolean;
  /** Adds a Project field. */
  showProjectFields?: boolean;
  /** Adds a collapsed "Technical details (optional)" block. */
  showTechnicalFields?: boolean;
  contextLabel?: string;
  submitLabel?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({
  leadType,
  heading,
  showEnquiryType = false,
  showProjectFields = false,
  showTechnicalFields = false,
  contextLabel,
  submitLabel,
}: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [leadId, setLeadId] = useState<string | null>(null);
  const elapsed = useFormTimer();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const field = (name: string) => String(fd.get(name) || "").trim();
    const details = [
      contextLabel,
      field("application") && `Application: ${field("application")}`,
      field("size_capacity") && `Size / capacity: ${field("size_capacity")}`,
      field("design_code") && `Design code: ${field("design_code")}`,
      field("delivery_location") && `Delivery location: ${field("delivery_location")}`,
      field("required_date") && `Required delivery date: ${field("required_date")}`,
    ].filter(Boolean);
    const message = [details.join("\n"), field("message")].filter(Boolean).join("\n\n");

    const payload = {
      lead_type: leadType,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      country: String(fd.get("country") || ""),
      company: String(fd.get("company") || ""),
      job_title: "",
      enquiry_type: String(fd.get("enquiry_type") || ""),
      project: String(fd.get("project") || ""),
      end_user: String(fd.get("end_user") || ""),
      message,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      hp_contact: String(fd.get("hp_contact") || ""),
      elapsed_ms: elapsed(),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setLeadId(data.lead_id);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && leadId) {
    return (
      <div className="card p-8 text-center bg-tp-blue-light border-tp-blue shadow-md">
        <h3 className="text-xl font-bold text-tp-navy mb-1">Enquiry received</h3>
        <p className="text-[var(--tp-neutral-600)] mb-3">
          Thank you. Our team will review your enquiry and get back to you.
        </p>
        <p className="text-sm text-[var(--tp-neutral-600)]">Your enquiry number</p>
        <p className="text-2xl font-mono font-bold text-tp-blue">{leadId}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 md:p-8 space-y-5 shadow-md border-t-4 border-t-tp-blue"
      noValidate
    >
      {heading && <h3 className="text-xl font-extrabold text-tp-navy">{heading}</h3>}

      {status === "error" && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          <p className="font-semibold">{t.myRfq.errorHeading}</p>
          <p>{t.myRfq.errorCopy}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor={`${leadType}-name`}>{t.form.name} *</label>
          <input id={`${leadType}-name`} name="name" autoComplete="name" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-email`}>{t.form.email} *</label>
          <input id={`${leadType}-email`} name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-phone`}>{t.form.phone} *</label>
          <input id={`${leadType}-phone`} name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-country`}>{t.form.country} *</label>
          <input id={`${leadType}-country`} name="country" autoComplete="country-name" required />
        </div>
        <div className={showProjectFields || showEnquiryType ? "" : "sm:col-span-2"}>
          <label className="form-label" htmlFor={`${leadType}-company`}>{t.form.company}</label>
          <input id={`${leadType}-company`} name="company" autoComplete="organization" />
        </div>

        {showEnquiryType && (
          <div>
            <label className="form-label" htmlFor={`${leadType}-enquiry_type`}>{t.form.enquiryType}</label>
            <select id={`${leadType}-enquiry_type`} name="enquiry_type" defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {enquiryTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {showProjectFields && (
          <div>
            <label className="form-label" htmlFor={`${leadType}-project`}>{t.form.project}</label>
            <input id={`${leadType}-project`} name="project" />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="form-label" htmlFor={`${leadType}-message`}>{t.form.message}</label>
          <textarea id={`${leadType}-message`} name="message" rows={4} />
        </div>
      </div>

      {showTechnicalFields && (
        <details className="group rounded-xl border border-[var(--tp-neutral-200)] bg-[var(--tp-neutral-50)] open:bg-white">
          <summary className="cursor-pointer select-none list-none flex items-center justify-between px-4 py-3 text-sm font-semibold text-tp-navy">
            Technical details (optional)
            <span aria-hidden className="text-tp-blue transition-transform group-open:rotate-45 text-lg leading-none">+</span>
          </summary>
          <div className="grid sm:grid-cols-2 gap-4 px-4 pb-4">
            <div>
              <label className="form-label" htmlFor={`${leadType}-application`}>{t.form.application}</label>
              <input id={`${leadType}-application`} name="application" />
            </div>
            <div>
              <label className="form-label" htmlFor={`${leadType}-size_capacity`}>{t.form.sizeCapacity}</label>
              <input id={`${leadType}-size_capacity`} name="size_capacity" />
            </div>
            <div>
              <label className="form-label" htmlFor={`${leadType}-design_code`}>{t.form.designCode}</label>
              <input id={`${leadType}-design_code`} name="design_code" />
            </div>
            <div>
              <label className="form-label" htmlFor={`${leadType}-delivery_location`}>{t.form.deliveryLocation}</label>
              <input id={`${leadType}-delivery_location`} name="delivery_location" />
            </div>
            <div>
              <label className="form-label" htmlFor={`${leadType}-end_user`}>{t.form.endUser}</label>
              <input id={`${leadType}-end_user`} name="end_user" />
            </div>
            <div>
              <label className="form-label" htmlFor={`${leadType}-required_date`}>{t.form.requiredDate}</label>
              <input id={`${leadType}-required_date`} name="required_date" />
            </div>
          </div>
        </details>
      )}

      <Honeypot />

      <button type="submit" className="btn btn-primary w-full" disabled={status === "submitting"}>
        {status === "submitting" ? t.myRfq.submitting : submitLabel ?? t.doors.formHeading}
      </button>
      <PrivacyNote />
    </form>
  );
}
