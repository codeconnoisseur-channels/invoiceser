import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Invoiceser - Professional Invoicing for Freelancers";
export const size = {
  width: 1200,
  height: 630,
};
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #0F172A, #1E1B4B)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #2563EB, #4F46E5)",
            borderRadius: "32px",
            width: "160px",
            height: "160px",
            fontSize: "110px",
            fontWeight: 900,
            marginBottom: "60px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          I
        </div>
        <h1
          style={{
            fontSize: "76px",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.02em",
            background: "linear-gradient(to right, #ffffff, #9CA3AF)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "24px",
          }}
        >
          Invoiceser
        </h1>
        <p
          style={{
            fontSize: "36px",
            fontWeight: 500,
            color: "#9CA3AF",
            margin: 0,
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Professional invoicing for freelancers and small businesses.
        </p>
      </div>
    ),
    { ...size }
  );
}
