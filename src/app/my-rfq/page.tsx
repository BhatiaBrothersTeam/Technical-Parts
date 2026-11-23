"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { t } from "@/lib/locale";
import { useRfq } from "@/lib/rfq-context";

type Status = "idle" | "submitting" | "success" | "error";

export default function MyRfqPage() {
  const { lines, updateLine, removeLine, clear } = useRfq();
  const [status, setStatus] = useState<Status>("idle");
  const [leadId, setLeadId] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      lead_type: "price_request",
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      country: String(fd.get("country") || ""),
      company: String(fd.get("company") || ""),
      project: String(fd.get("project") || ""),
      end_user: String(fd.get("end_user") || ""),
      message: String(fd.get("message") || ""),
      items: lines,
      page_url: window.location.href,
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
      clear();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && leadId) {
    return (
      <div className="container-tp section-y max-w-xl">
        <div className="card p-8 text-center bg-tp-blue-light border-tp-blue">
          <h1 className="text-2xl font-bold text-tp-navy mb-2">{t.myRfq.successHeading}</h1>
          <p className="text-[var(--tp-neutral-600)] mb-4">{t.myRfq.successCopy}</p>
          <p className="text-sm text-[var(--tp-neutral-600)]">{t.myRfq.yourRfqId}</p>
          <p className="text-3xl font-mono font-bold text-tp-blue mb-6">{leadId}</p>
          <Link href="/epc" className="btn btn-primary">
            {t.myRfq.browseProducts}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-tp section-y">
      <h1 className="text-3xl font-bold mb-1">{t.myRfq.title}</h1>
      <p className="text-[var(--tp-neutral-600)] mb-8 max-w-2xl">{t.myRfq.subtitle}</p>

      {lines.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[var(--tp-neutral-600)] mb-4">{t.myRfq.empty}</p>
          <Link href="/epc" className="btn btn-primary">
            {t.myRfq.browseProducts}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-[var(--tp-neutral-50)] text-start">
                <tr>
                  <th className="text-start ps-4 py-3 font-semibold text-tp-navy">{t.myRfq.colProduct}</th>
                  <th className="text-start py-3 font-semibold text-tp-navy w-20">{t.myRfq.colQty}</th>
                  <th className="text-start py-3 font-semibold text-tp-navy w-40">{t.myRfq.colDelivery}</th>
                  <th className="text-start py-3 font-semibold text-tp-navy">{t.myRfq.colNotes}</th>
                  <th className="pe-4 py-3 w-16" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={`${line.part_number}-${i}`} className="border-t border-[var(--tp-neutral-100)]">
                    <td className="ps-4 py-3">
                      <p className="font-semibold text-tp-navy">{line.product}</p>
                      <p className="text-xs text-[var(--tp-neutral-600)]">
                        {[line.brand, line.part_number].filter(Boolean).join(" · ")}
                      </p>
                    </td>
                    <td className="py-3">
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateLine(i, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                        className="w-16"
                        aria-label={t.form.quantity}
                      />
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        placeholder="e.g. 2 weeks"
                        value={line.required_delivery ?? ""}
                        onChange={(e) => updateLine(i, { required_delivery: e.target.value })}
                        aria-label={t.form.requiredDelivery}
                      />
                    </td>
                    <td className="py-3 pe-2">
                      <input
                        type="text"
                        value={line.notes ?? ""}
                        onChange={(e) => updateLine(i, { notes: e.target.value })}
                        aria-label={t.form.notes}
                      />
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        className="text-red-600 text-xs font-semibold"
                      >
                        {t.myRfq.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/epc" className="btn btn-outline-navy">
              {t.myRfq.addAnother}
            </Link>
            <Link href="/rfq" className="btn btn-outline-navy">
              {t.myRfq.uploadInstead}
            </Link>
          </div>

          <div className="card p-6 space-y-4 max-w-2xl">
            <h2 className="text-lg font-bold text-tp-navy">{t.myRfq.contactHeading}</h2>

            {status === "error" && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                <p className="font-semibold">{t.myRfq.errorHeading}</p>
                <p>{t.myRfq.errorCopy}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="name">{t.form.name} *</label>
                <input id="name" name="name" required />
              </div>
              <div>
                <label className="form-label" htmlFor="email">{t.form.email} *</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div>
                <label className="form-label" htmlFor="phone">{t.form.phone} *</label>
                <input id="phone" name="phone" type="tel" required />
              </div>
              <div>
                <label className="form-label" htmlFor="country">{t.form.country} *</label>
                <input id="country" name="country" required />
              </div>
              <div>
                <label className="form-label" htmlFor="company">{t.form.company}</label>
                <input id="company" name="company" />
              </div>
              <div>
                <label className="form-label" htmlFor="project">{t.form.project}</label>
                <input id="project" name="project" />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label" htmlFor="end_user">{t.form.endUser}</label>
                <input id="end_user" name="end_user" />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label" htmlFor="message">{t.form.message}</label>
                <textarea id="message" name="message" rows={4} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "submitting"}>
              {status === "submitting" ? t.myRfq.submitting : t.myRfq.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
