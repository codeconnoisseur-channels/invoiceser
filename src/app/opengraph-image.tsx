import { ImageResponse } from "next/og";
import logo from "../../public/invoiceser-logo.png";

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
          background: "radial-gradient(circle at 50% 75%, #FFE0C7, transparent 34%), #FDFBF8",
          color: "#171714",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <img
          src={logo.src}
          alt=""
          style={{
            width: "160px",
            height: "160px",
            marginBottom: "60px",
            objectFit: "contain",
          }}
        />
        <h1
          style={{
            fontSize: "76px",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.02em",
            color: "#171714",
            marginBottom: "24px",
          }}
        >
          Invoiceser
        </h1>
        <p
          style={{
            fontSize: "36px",
            fontWeight: 500,
            color: "#68635D",
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
