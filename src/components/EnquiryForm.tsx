"use client";

import { useState, type FormEvent } from "react";
import { t } from "@/lib/locale";
import type { LeadType } from "@/lib/types";

const enquiryTypeOptions = [
  "C&J Fabrication",
  "EPC Packages",
  "RFQ",
  "Project requirement",
  "Technical Support",
  "Distributor / Vendor",
  "General",
];

interface EnquiryFormProps {
  leadType: LeadType;
  heading?: string;
  showEnquiryType?: boolean;
  showProjectFields?: boolean;
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
      job_title: String(fd.get("job_title") || ""),
      enquiry_type: String(fd.get("enquiry_type") || ""),
      project: String(fd.get("project") || ""),
      end_user: String(fd.get("end_user") || ""),
      message,
      page_url: typeof window !== "undefined" ? window.location.href : "",
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
        <h3 className="text-xl font-bold text-tp-navy mb-1">{t.myRfq.successHeading}</h3>
        <p className="text-[var(--tp-neutral-600)] mb-3">{t.myRfq.successCopy}</p>
        <p className="text-sm text-[var(--tp-neutral-600)]">{t.myRfq.yourRfqId}</p>
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
          <input id={`${leadType}-name`} name="name" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-email`}>{t.form.email} *</label>
          <input id={`${leadType}-email`} name="email" type="email" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-phone`}>{t.form.phone} *</label>
          <input id={`${leadType}-phone`} name="phone" type="tel" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-country`}>{t.form.country} *</label>
          <input id={`${leadType}-country`} name="country" required />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-company`}>{t.form.company}</label>
          <input id={`${leadType}-company`} name="company" />
        </div>
        <div>
          <label className="form-label" htmlFor={`${leadType}-job_title`}>{t.form.jobTitle}</label>
          <input id={`${leadType}-job_title`} name="job_title" />
        </div>

        {showEnquiryType && (
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor={`${leadType}-enquiry_type`}>{t.form.enquiryType}</label>
            <select id={`${leadType}-enquiry_type`} name="enquiry_type" defaultValue="">
              <option value="" disabled>
                {t.form.enquiryType}
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
          <>
            <div>
              <label className="form-label" htmlFor={`${leadType}-project`}>{t.form.project}</label>
              <input id={`${leadType}-project`} name="project" />
            </div>
            <div>
              <label className="form-label" htmlFor={`${leadType}-end_user`}>{t.form.endUser}</label>
              <input id={`${leadType}-end_user`} name="end_user" />
            </div>
          </>
        )}
        {showTechnicalFields && (
          <>
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
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor={`${leadType}-required_date`}>{t.form.requiredDate}</label>
              <input id={`${leadType}-required_date`} name="required_date" />
            </div>
          </>
        )}


        <div className="sm:col-span-2">
          <label className="form-label" htmlFor={`${leadType}-message`}>{t.form.message}</label>
          <textarea id={`${leadType}-message`} name="message" rows={4} />
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={status === "submitting"}>
        {status === "submitting" ? t.myRfq.submitting : submitLabel ?? t.doors.formHeading}
      </button>
    </form>
  );
}
