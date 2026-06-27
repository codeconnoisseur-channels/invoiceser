import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2563EB, #4F46E5)",
          borderRadius: "110px",
          color: "white",
          fontSize: 340,
          fontWeight: 900,
          fontFamily: "sans-serif",
          letterSpacing: "-0.05em",
        }}
      >
        I
      </div>
    ),
    { ...size }
  );
}
