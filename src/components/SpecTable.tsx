import type { Specification } from "@/lib/types";

export function SpecTable({ specs }: { specs: Specification[] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr key={spec.label} className={i % 2 === 0 ? "bg-tp-blue-light/40" : ""}>
              <th scope="row" className="text-start ps-4 py-2.5 font-semibold text-tp-navy w-1/2 align-top">
                {spec.label}
              </th>
              <td className="py-2.5 pe-4 text-[var(--tp-neutral-700)]">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
