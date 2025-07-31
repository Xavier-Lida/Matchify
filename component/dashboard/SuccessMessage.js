import { useEffect, useState } from "react";

export default function SuccessMessage({ message }) {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      setTimeout(() => setFade(true), 50); // slight delay for scale effect
    } else if (show) {
      setFade(false); // fade out
      const timeout = setTimeout(() => setShow(false), 500); // match transition
      return () => clearTimeout(timeout);
    }
  }, [message, show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        left: "50%",
        transform: `translateX(-50%) scale(${fade ? 1 : 0.95})`,
        background: "linear-gradient(90deg, #09A129 0%, #0FCF6A 100%)",
        color: "white",
        padding: "16px 32px",
        borderRadius: "12px",
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(9,161,41,0.15), 0 2px 8px rgba(0,0,0,0.10)",
        opacity: fade ? 1 : 0,
        transition:
          "opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)",
        fontWeight: 600,
        fontSize: "1.15rem",
        letterSpacing: "0.02em",
        border: "2px solid #0FCF6A",
        backdropFilter: "blur(4px)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            background: "#0FCF6A",
            borderRadius: "50%",
            padding: 2,
          }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {message}
      </span>
    </div>
  );
}
