import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Landlord Ledger — Simple Rental Property Management Software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Background accent circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Icon badge */}
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            borderRadius: 24,
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            boxShadow: "0 20px 60px rgba(59,130,246,0.4)",
          }}
        >
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Landlord Ledger
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#94a3b8",
            fontSize: 30,
            textAlign: "center",
            maxWidth: 720,
            lineHeight: 1.45,
            marginBottom: 52,
          }}
        >
          Simple Rental Property Management
          <br />
          for Independent US Landlords
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {[
            "Tenant Tracking",
            "Lease Management",
            "Rent Collection",
            "Expense Logging",
            "Financial Reports",
          ].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 999,
                padding: "10px 22px",
                color: "#93c5fd",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 48,
            color: "#475569",
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          landoraapp.com
        </div>
      </div>
    ),
    { ...size }
  );
}
