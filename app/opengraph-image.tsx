import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { MIN_BID, POOL_CAP, formatUsd } from "@/lib/bids";

export const alt =
  "lamborghini.lol — your logo on a real Lamborghini's digital billboard, forever";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const YELLOW = "#FFC800";
const INK = "#0E0E10";

const [saira700, saira800] = await Promise.all([
  readFile(join(process.cwd(), "assets/SairaCondensed-700.ttf")),
  readFile(join(process.cwd(), "assets/SairaCondensed-800.ttf")),
]);

// Each headline line gets an explicit height: Satori sizes a flex container's
// line box near 1.2× regardless of lineHeight, which overflowed the layout.
function HeadlineLine({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        height: 82,
        alignItems: "center",
        fontSize: 88,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: -1,
        color,
      }}
    >
      {text}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: INK,
          fontFamily: "Saira Condensed",
          position: "relative",
        }}
      >
        {/* headlight glow behind the car */}
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 560,
            width: 720,
            height: 440,
            borderRadius: 9999,
            background: YELLOW,
            opacity: 0.16,
            filter: "blur(100px)",
            display: "flex",
          }}
        />
        {/* yellow rule down the left edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 10,
            height: "100%",
            background: YELLOW,
            display: "flex",
          }}
        />

        {/* wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 92,
            flexShrink: 0,
            padding: "0 56px 0 68px",
            fontSize: 31,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#FAFAFA",
          }}
        >
          lamborghini<span style={{ color: YELLOW }}>.lol</span>
        </div>

        {/* headline + car */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 48px 0 68px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 23,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 7,
                color: YELLOW,
                marginBottom: 20,
              }}
            >
              Advertising, but stupid
            </div>
            <HeadlineLine text="Your logo." color="#FAFAFA" />
            <HeadlineLine text="On a Lamborghini." color={YELLOW} />
            <HeadlineLine text="Forever." color="#FAFAFA" />
          </div>

          {/* the car. Satori has no SVG <text>, so the billboard is an HTML
              box layered over the car — and it must come after the <svg>
              in the DOM or the car paints on top of it. */}
          <div style={{ display: "flex", position: "relative" }}>
            <svg width="430" height="240" viewBox="0 0 640 260">
              <g stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="5">
                <line x1="6" y1="112" x2="104" y2="112" />
                <line x1="0" y1="140" x2="80" y2="140" />
                <line x1="24" y1="168" x2="92" y2="168" />
              </g>
              <path
                d="M118 196 L96 190 L84 174 L94 156 L130 140 L198 118 L248 92 L270 80 L342 76 L370 78 L432 92 L474 100 L546 114 L562 122 L568 146 L562 174 L546 188 L520 196 Z"
                fill="#232326"
                stroke="#FFFFFF"
                strokeOpacity="0.16"
                strokeWidth="2"
              />
              <path
                d="M274 84 L340 80 L364 82 L400 89 L354 104 L298 106 Z"
                fill={INK}
              />
              <path d="M520 100 L588 91 L596 100 L538 111 Z" fill="#2C2C30" />
              <circle cx="182" cy="186" r="37" fill="#0A0A0B" />
              <circle
                cx="182"
                cy="186"
                r="21"
                fill="none"
                stroke={YELLOW}
                strokeOpacity="0.85"
                strokeWidth="4"
                strokeDasharray="10 8"
              />
              <circle cx="486" cy="186" r="37" fill="#0A0A0B" />
              <circle
                cx="486"
                cy="186"
                r="21"
                fill="none"
                stroke={YELLOW}
                strokeOpacity="0.85"
                strokeWidth="4"
                strokeDasharray="10 8"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 171,
                top: 105,
                width: 121,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                border: `3px solid ${YELLOW}`,
                background: "#0A0A0B",
                color: YELLOW,
                fontSize: 19,
                fontWeight: 800,
                letterSpacing: 1.5,
              }}
            >
              YOUR LOGO
            </div>
          </div>
        </div>

        {/* stat bar */}
        <div
          style={{
            display: "flex",
            height: 122,
            flexShrink: 0,
            alignItems: "center",
            borderTop: "2px solid rgba(255,255,255,0.10)",
            padding: "0 56px 0 68px",
            gap: 58,
          }}
        >
          {[
            { v: formatUsd(MIN_BID), l: "minimum bid" },
            { v: formatUsd(POOL_CAP), l: "buys the whole car" },
            { v: "1 payment", l: "lifetime of the car" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#FAFAFA",
                  letterSpacing: -0.5,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  color: "#8B8B93",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Saira Condensed",
          data: saira700,
          weight: 700,
          style: "normal",
        },
        {
          name: "Saira Condensed",
          data: saira800,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
