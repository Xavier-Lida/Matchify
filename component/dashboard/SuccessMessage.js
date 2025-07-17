import { useEffect, useState } from "react";

export default function SuccessMessage({ message }) {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      setFade(true); // fade in
    } else if (show) {
      setFade(false); // fade out
      const timeout = setTimeout(() => setShow(false), 400); // match transition
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
        transform: "translateX(-50%)",
        background: "#09A129",
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.4s",
      }}
    >
      {message}
    </div>
  );
}
