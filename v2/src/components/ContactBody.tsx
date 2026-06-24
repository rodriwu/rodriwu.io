"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader, Mail, Github, Linkedin } from "lucide-react";
import { useShell } from "./context/ShellContext";

type Status = "idle" | "sending" | "sent" | "error";

const T = {
  en: {
    formHeader: "SEND A MESSAGE",
    name: "Name", email: "Email", message: "Message",
    send: "Send message", sending: "Sending…",
    sent: "Message sent. I'll get back to you soon.",
    error: "Something went wrong. Try rodriwuu@gmail.com.",
    reachAt: "REACH ME AT",
  },
  es: {
    formHeader: "ENVIAR MENSAJE",
    name: "Nombre", email: "Correo", message: "Mensaje",
    send: "Enviar mensaje", sending: "Enviando…",
    sent: "Mensaje enviado. Te responderé pronto.",
    error: "Algo salió mal. Escríbeme a rodriwuu@gmail.com.",
    reachAt: "ENCUÉNTRAME",
  },
};

const BehanceIcon = ({ style }: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M7.799 5.698c.589 0 1.12.051 1.606.156.482.108.895.285 1.235.534.34.247.601.582.788 1.002.183.418.275.93.275 1.53 0 .66-.148 1.21-.444 1.65-.296.44-.737.804-1.32 1.09.794.23 1.386.63 1.771 1.2.385.57.578 1.26.578 2.06 0 .66-.127 1.23-.378 1.71-.254.48-.597.87-1.03 1.17-.434.3-.935.52-1.506.66-.567.14-1.16.21-1.775.21H0V5.698h7.799zm-.47 5.51c.504 0 .914-.12 1.228-.37.313-.25.47-.63.47-1.14 0-.29-.05-.53-.154-.72a1.19 1.19 0 00-.415-.45 1.69 1.69 0 00-.59-.24 3.27 3.27 0 00-.7-.07H2.87v2.99h4.46zm.202 5.772c.27 0 .526-.026.768-.077.244-.05.458-.138.642-.265.186-.127.333-.302.44-.523.109-.22.163-.505.163-.853 0-.68-.19-1.165-.57-1.455-.38-.29-.882-.435-1.504-.435H2.87v3.608h4.66zm9.35-9.544c1.018 0 1.907.19 2.668.57.76.38 1.387.893 1.88 1.54a6.6 6.6 0 011.087 2.22c.23.835.315 1.71.252 2.625H14.18c.05.97.37 1.71.963 2.23.59.515 1.32.773 2.19.773.627 0 1.167-.157 1.62-.47.45-.315.754-.65.908-1.01h2.833c-.45 1.34-1.143 2.3-2.08 2.88-.934.576-2.063.864-3.387.864a7.08 7.08 0 01-2.517-.432 5.65 5.65 0 01-1.95-1.23 5.56 5.56 0 01-1.263-1.91c-.298-.747-.448-1.574-.448-2.48 0-.876.156-1.69.466-2.44a5.63 5.63 0 011.315-1.918 6.02 6.02 0 011.986-1.25 6.7 6.7 0 012.493-.46zm.043 2.3c-.738 0-1.356.21-1.851.63-.494.42-.797 1.05-.907 1.89h5.35c-.067-.794-.34-1.41-.82-1.845-.478-.435-1.07-.653-1.772-.653zM16.89 4.1h5.52v1.55H16.89V4.1z"/>
  </svg>
);

const LINKS = [
  { icon: Mail,        label: "Email",    value: "rodriwuu@gmail.com",           href: "mailto:rodriwuu@gmail.com" },
  { icon: BehanceIcon, label: "Behance",  value: "behance.net/rodriwu",          href: "https://www.behance.net/rodriwu" },
  { icon: Github,      label: "GitHub",   value: "github.com/rodriwu",           href: "https://github.com/rodriwu" },
  { icon: Linkedin,    label: "LinkedIn", value: "linkedin.com/in/rodriwu",      href: "https://linkedin.com/in/rodriwu" },
];

export default function ContactBody() {
  const { isDark, locale } = useShell();
  const t = T[locale];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const ink   = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body  = isDark ? "rgba(255,255,255,0.62)" : "rgba(10,12,35,0.60)";
  const dim   = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade  = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.12)";
  const focus = isDark ? "rgba(195,200,232,0.65)" : "rgba(60,66,94,0.55)";
  const fieldBg = isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.022)";

  const submit = async () => {
    if (!message.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) { setName(""); setEmail(""); setMessage(""); }
    } catch {
      setStatus("error");
    }
  };

  const canSend = message.trim().length > 0 && status !== "sending" && status !== "sent";

  const inputStyle = (id: string): React.CSSProperties => ({
    width: "100%", fontSize: 14, color: ink, background: "transparent",
    border: "none",
    borderBottom: `1.5px solid ${focused === id ? focus : fade}`,
    outline: "none", padding: "0 0 10px 0", fontFamily: "inherit",
    transition: "border-color 0.2s ease", caretColor: focus,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 14 }}>
          {t.formHeader}
        </p>

        {status === "sent" ? (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 12,
            background: isDark ? "rgba(90,210,120,0.07)" : "rgba(40,160,80,0.06)",
            border: `1px solid ${isDark ? "rgba(90,210,120,0.20)" : "rgba(40,160,80,0.18)"}`,
          }}>
            <CheckCircle size={18} strokeWidth={1.5} style={{ color: "rgba(90,210,120,0.9)", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: isDark ? "rgba(90,210,120,0.9)" : "rgba(40,140,70,0.95)" }}>{t.sent}</span>
          </motion.div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
              {[
                { id: "name",  label: t.name,  value: name,  set: setName,  type: "text" },
                { id: "email", label: t.email, value: email, set: setEmail, type: "email" },
              ].map(({ id, label, value, set, type }) => (
                <div key={id}>
                  <label htmlFor={id} className="font-mono" style={{
                    display: "block", fontSize: 10, letterSpacing: "0.12em",
                    color: focused === id ? focus : dim, marginBottom: 8, transition: "color 0.2s ease",
                  }}>
                    {label.toUpperCase()}
                  </label>
                  <input id={id} type={type} value={value}
                    onChange={e => set(e.target.value)}
                    onFocus={() => setFocused(id)}
                    onBlur={() => setFocused(null)}
                    style={inputStyle(id)}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label htmlFor="message" className="font-mono" style={{
                display: "block", fontSize: 10, letterSpacing: "0.12em",
                color: focused === "message" ? focus : dim, marginBottom: 8, transition: "color 0.2s ease",
              }}>
                {t.message.toUpperCase()}
              </label>
              <textarea id="message" value={message}
                onChange={e => setMessage(e.target.value)}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                rows={4}
                style={{
                  width: "100%", fontSize: 14, color: ink,
                  background: focused === "message" ? fieldBg : "transparent",
                  border: `1.5px solid ${focused === "message" ? focus : fade}`,
                  borderRadius: 10, outline: "none", padding: "12px 14px",
                  fontFamily: "inherit", resize: "none", lineHeight: 1.6,
                  transition: "all 0.2s ease", caretColor: focus,
                }}
              />
            </div>

            {status === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <AlertCircle size={13} strokeWidth={1.5} style={{ color: "rgba(255,90,80,0.8)", flexShrink: 0 }} />
                <span className="font-mono" style={{ fontSize: 10, color: "rgba(255,90,80,0.85)" }}>{t.error}</span>
              </div>
            )}

            <button onClick={submit} disabled={!canSend}
              className="font-mono"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: "14px 20px", borderRadius: 12,
                fontSize: 12, letterSpacing: "0.08em", fontWeight: 500,
                background: canSend
                  ? (isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.08)")
                  : "transparent",
                border: `1px solid ${canSend ? (isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.18)") : fade}`,
                color: canSend ? ink : dim,
                cursor: canSend ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
              }}>
              {status === "sending"
                ? <><Loader size={13} strokeWidth={1.8} style={{ animation: "spin 1s linear infinite" }} />{t.sending}</>
                : <><Send size={13} strokeWidth={1.8} />{t.send}</>}
            </button>
          </>
        )}
      </div>

      {/* Reach me — quick links */}
      <div>
        <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 12 }}>
          {t.reachAt}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {LINKS.map(({ icon: Icon, label, value, href }) => (
            <a key={label} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
                border: `1px solid ${fade}`, textDecoration: "none",
                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.018)",
                transition: "background 0.18s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.018)")}
            >
              <Icon size={14} strokeWidth={1.5} style={{ color: dim, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div className="font-mono" style={{ fontSize: 9, color: dim, letterSpacing: "0.10em" }}>{label.toUpperCase()}</div>
                <div className="font-mono" style={{ fontSize: 11, color: body, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
