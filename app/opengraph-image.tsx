import { ImageResponse } from "next/og";

import { MIN_BID, POOL_CAP, formatUsd } from "@/lib/bids";

export const alt =
  "lamborghini.lol — your logo on a real Lamborghini's digital billboard, forever";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111113",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        {/* yellow glow */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: 300,
            width: 700,
            height: 520,
            borderRadius: 9999,
            background: "#FFC800",
            opacity: 0.16,
            filter: "blur(90px)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              color: "#FAFAFA",
              letterSpacing: -1,
            }}
          >
            lamborghini
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              color: "#FFC800",
              letterSpacing: -1,
            }}
          >
            .lol
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 92,
              fontWeight: 900,
              color: "#FAFAFA",
              lineHeight: 1.02,
              letterSpacing: -3,
            }}
          >
            Your logo. On a&nbsp;
            <span style={{ color: "#FFC800" }}>Lamborghini</span>. Forever.
          </div>

          {/* the billboard */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
              border: "4px solid #FFC800",
              borderRadius: 12,
              padding: "14px 34px",
              color: "#FFC800",
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: 6,
            }}
          >
            YOUR LOGO
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 26,
            color: "#A1A1A6",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ display: "flex" }}>From {formatUsd(MIN_BID)}</div>
          <div style={{ display: "flex", color: "#3A3A3E" }}>·</div>
          <div style={{ display: "flex" }}>
            {formatUsd(POOL_CAP)} buys the whole car
          </div>
          <div style={{ display: "flex", color: "#3A3A3E" }}>·</div>
          <div style={{ display: "flex" }}>Lifetime of the car</div>
        </div>
      </div>
    ),
    size,
  );
}
