import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.fullName} (${siteConfig.name}) portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #050505 0%, #171717 55%, #3b0764 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "40px",
            display: "flex",
            flexDirection: "column",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div style={{ color: "#c4b5fd", display: "flex", fontSize: 34, letterSpacing: 4 }}>
            FPH • OFFICIAL PORTFOLIO
          </div>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, marginTop: 24 }}>
            {siteConfig.fullName}
          </div>
          <div style={{ color: "#d4d4d8", display: "flex", fontSize: 38, marginTop: 22 }}>
            FPHaikal — IT Support & Full Stack Developer
          </div>
        </div>
      </div>
    ),
    size,
  );
}
