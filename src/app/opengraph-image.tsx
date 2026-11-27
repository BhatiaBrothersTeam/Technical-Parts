import { ImageResponse } from "next/og";

export const alt = "technicalparts.com | C&J Packages & EPC Packages";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share preview used by WhatsApp, LinkedIn, Slack and search results. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #061630 0%, #0b2545 55%, #13315c 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#1d5fbf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            tp
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 800, marginLeft: 20 }}>
            technicalparts<span style={{ color: "#6aa6f0" }}>.com</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>
          C&J Packages &amp; EPC Packages
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#f5a623", marginTop: 28 }}>
          Built to your drawings. Send an RFQ today.
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.7)", marginTop: 40 }}>
          Part of BB Group
        </div>
      </div>
    ),
    { ...size }
  );
}
