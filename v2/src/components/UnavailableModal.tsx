"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useShell } from "./context/ShellContext";

export default function UnavailableModal() {
  const { isDark, unavailableCase, closeUnavailable } = useShell();
  const open = unavailableCase !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUnavailable();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeUnavailable]);

  const surface = isDark ? "#15172b" : "#ffffff";
  const ink     = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body    = isDark ? "rgba(255,255,255,0.66)" : "rgba(10,12,35,0.62)";
  const dim     = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,12,35,0.45)";
  const fade    = isDark ? "rgba(255,255,255,0.12)" : "rgba(10,12,35,0.12)";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeUnavailable}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(4,6,18,0.74)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unavailable-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 440,
              background: surface,
              border: `1px solid ${fade}`,
              borderRadius: 14,
              padding: "32px 28px 28px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            }}
          >
            <button
              type="button"
              onClick={closeUnavailable}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: dim,
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              <X size={16} strokeWidth={1.8} />
            </button>

            <p
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                color: dim,
                marginBottom: 14,
                textTransform: "uppercase",
              }}
            >
              {unavailableCase}
            </p>

            <h2
              id="unavailable-title"
              className="font-mono"
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: ink,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                marginBottom: 14,
              }}
            >
              This case study is currently unavailable.
            </h2>

            <p style={{ fontSize: 15, lineHeight: 1.6, color: body, marginBottom: 24 }}>
              Sorry for the inconvenience.
            </p>

            <button
              type="button"
              onClick={closeUnavailable}
              className="font-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                fontSize: 12,
                letterSpacing: "0.06em",
                color: "#0c0e22",
                background: "var(--accent-highlight)",
                border: "1px solid var(--accent-highlight)",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
