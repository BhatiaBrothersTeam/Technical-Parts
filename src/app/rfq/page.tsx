"use client";

import { useState, type FormEvent } from "react";
import { t } from "@/lib/locale";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PageHero } from "@/components/PageHero";

type Status = "idle" | "submitting" | "success" | "error";

export default function RfqUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [rejection, setRejection] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("lead_type", "rfq_upload");
    fd.set("page_url", window.location.href);
    files.forEach((file) => fd.append("files", file));

    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setLeadId(data.lead_id);
      setStatus("success");
      form.reset();
      setFiles([]);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && leadId) {
    return (
      <div className="container-tp section-y max-w-xl">
        <div className="card p-8 text-center bg-tp-blue-light border-tp-blue">
          <h1 className="text-2xl font-bold text-tp-navy mb-2">{t.rfqUpload.successHeading}</h1>
          <p className="text-[var(--tp-neutral-600)] mb-4">{t.rfqUpload.successCopy}</p>
          <p className="text-sm text-[var(--tp-neutral-600)]">{t.rfqUpload.yourRfqId}</p>
          <p className="text-3xl font-mono font-bold text-tp-blue">{leadId}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <PageHero
      eyebrow="Request a quote"
      title={<>{t.rfqUpload.title} <span className="text-tp-accent">{t.rfqUpload.subtitle}</span></>}
      subtitle={t.rfqUpload.copy}
      crumbs={[{ label: "Upload RFQ" }]}
    />
    <div className="container-tp section-y max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {status === "error" && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            <p className="font-semibold">{t.rfqUpload.errorHeading}</p>
            <p>{t.rfqUpload.errorCopy}</p>
          </div>
        )}

        {rejection && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
            {rejection}
          </div>
        )}

        <UploadDropzone files={files} onFilesChange={setFiles} onRejected={setRejection} />

        <div className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="u-name">{t.form.name} *</label>
              <input id="u-name" name="name" required />
            </div>
            <div>
              <label className="form-label" htmlFor="u-email">{t.form.email} *</label>
              <input id="u-email" name="email" type="email" required />
            </div>
            <div>
              <label className="form-label" htmlFor="u-phone">{t.form.phone} *</label>
              <input id="u-phone" name="phone" type="tel" required />
            </div>
            <div>
              <label className="form-label" htmlFor="u-country">{t.form.country} *</label>
              <input id="u-country" name="country" required />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="u-company">{t.form.company}</label>
              <input id="u-company" name="company" />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label" htmlFor="u-message">{t.rfqUpload.messageLabel}</label>
              <textarea id="u-message" name="message" rows={4} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "submitting"}>
            {status === "submitting" ? t.rfqUpload.submitting : t.rfqUpload.submit}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
