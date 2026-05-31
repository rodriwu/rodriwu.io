"use client";

import { motion } from "framer-motion";
import { Mail, Github, Globe, Linkedin, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useState, useRef } from "react";

type Locale = "en" | "es";
type Status = "idle" | "sending" | "sent" | "error";

const T = {
  en: {
    eyebrow: "CONTACT",
    heading: "Let's build something",
    headingAccent: "meaningful together.",
    sub: "Open to projects, collaborations, and conversations. Response time usually within 24h.",
    statusLabel: "AVAILABILITY",
    statusValue: "Open to work",
    responseLabel: "RESPONSE",
    responseValue: "< 24 hours",
    locationLabel: "TIMEZONE",
    locationValue: "CST — UTC−6",
    linksHeader: "REACH ME AT",
    formHeader: "SEND A MESSAGE",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "What's on your mind?",
    sendBtn: "Send message",
    sending: "Sending…",
    sent: "Message sent! I'll get back to you soon.",
    error: "Something went wrong. Try rodriwuu@gmail.com.",
    copyright: "© Rodriwu. All rights reserved. · Eat fruits and vegetables.",
  },
  es: {
    eyebrow: "CONTACTO",
    heading: "Construyamos algo",
    headingAccent: "significativo juntos.",
    sub: "Abierto a proyectos, colaboraciones y conversaciones. Tiempo de respuesta normalmente en 24h.",
    statusLabel: "DISPONIBILIDAD",
    statusValue: "Disponible",
    responseLabel: "RESPUESTA",
    responseValue: "< 24 horas",
    locationLabel: "ZONA HORARIA",
    locationValue: "CST — UTC−6",
    linksHeader: "ENCUÉNTRAME",
    formHeader: "ENVIAR MENSAJE",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Tu correo",
    messagePlaceholder: "¿Qué tienes en mente?",
    sendBtn: "Enviar mensaje",
    sending: "Enviando…",
    sent: "¡Mensaje enviado! Te responderé pronto.",
    error: "Algo salió mal. Escríbeme a rodriwuu@gmail.com.",
    copyright: "© Rodriwu. Todos los derechos reservados. · Come frutas y verduras.",
  },
};

const LINKS = [
  { icon: Mail,     label: "Email",    value: "rodriwuu@gmail.com",       href: "mailto:rodriwuu@gmail.com" },
  { icon: Globe,    label: "Website",  value: "rodriwu.com",              href: "https://rodriwu.com" },
  { icon: Github,   label: "GitHub",   value: "github.com/rodriwu",       href: "https://github.com/rodriwu" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/rodriwu",  href: "https://linkedin.com/in/rodriwu" },
];


export default function ContactWindow({ locale = "en", isDark = true }: { locale?: Locale; isDark?: boolean }) {
  const t = T[locale];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const glass = {
    background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
    borderRadius: 12,
  };

  const dimText  = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const bodyText = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.60)";
  const headText = isDark ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.85)";
  const rowSep   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const handleSubmit = async () => {
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

  return (
    <div>

      {/* ── Header band ── */}
      <div style={{ position: "relative", padding: "28px 20px 24px", borderBottom: `1px solid ${rowSep}` }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 80% 100% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 100% at 50% 0%, black 40%, transparent 100%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -20, left: -20,
          width: 160, height: 160, borderRadius: "50%",
          background: isDark ? "rgba(110,50,255,0.09)" : "rgba(110,50,255,0.05)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <p className="font-mono mb-3" style={{ fontSize: 10, letterSpacing: "0.16em", color: dimText, position: "relative" }}>
          {t.eyebrow}
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.25, color: headText, position: "relative", marginBottom: 10 }}>
          {t.heading}<br />
          <span style={{ color: bodyText }}>{t.headingAccent}</span>
        </h2>
        <p className="font-mono" style={{ fontSize: 11, lineHeight: 1.65, color: bodyText, position: "relative", maxWidth: 320 }}>
          {t.sub}
        </p>
      </div>

      {/* ── Contact Form ── */}
      <div className="px-5 pt-5 pb-4">
        <p className="font-mono mb-4" style={{ fontSize: 10, letterSpacing: "0.14em", color: dimText }}>
          {t.formHeader}
        </p>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "18px 20px", borderRadius: 14,
              background: isDark ? "rgba(90,210,120,0.07)" : "rgba(40,160,80,0.06)",
              border: `1px solid ${isDark ? "rgba(90,210,120,0.20)" : "rgba(40,160,80,0.18)"}`,
            }}
          >
            <CheckCircle size={18} strokeWidth={1.5} style={{ color: "rgba(90,210,120,0.9)", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: isDark ? "rgba(90,210,120,0.9)" : "rgba(40,160,80,0.9)", lineHeight: 1.5 }}>{t.sent}</span>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Name + Email row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              {[
                { id: "name",  label: locale === "es" ? "Nombre" : "Name",  value: name,  setter: setName,  type: "text"  },
                { id: "email", label: "Email",                               value: email, setter: setEmail, type: "email" },
              ].map(({ id, label, value, setter, type }) => (
                <div key={id} style={{ position: "relative" }}>
                  <label
                    htmlFor={id}
                    style={{
                      display: "block",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: focused === id
                        ? (isDark ? "rgba(160,120,255,0.9)" : "rgba(100,40,220,0.85)")
                        : dimText,
                      marginBottom: 8,
                      transition: "color 0.2s ease",
                      fontFamily: "monospace",
                    }}
                  >
                    {label.toUpperCase()}
                  </label>
                  <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    onFocus={() => setFocused(id)}
                    onBlur={() => setFocused(null)}
                    aria-label={label}
                    style={{
                      width: "100%",
                      fontSize: 13,
                      color: headText,
                      background: "transparent",
                      border: "none",
                      borderBottom: `1.5px solid ${
                        focused === id
                          ? (isDark ? "rgba(140,90,255,0.7)" : "rgba(100,40,220,0.55)")
                          : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)")
                      }`,
                      outline: "none",
                      padding: "0 0 10px 0",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s ease",
                      caretColor: isDark ? "rgba(160,120,255,0.9)" : "rgba(100,40,220,0.8)",
                    }}
                    placeholder=""
                  />
                </div>
              ))}
            </div>

            {/* Message */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: focused === "message"
                    ? (isDark ? "rgba(160,120,255,0.9)" : "rgba(100,40,220,0.85)")
                    : dimText,
                  marginBottom: 8,
                  transition: "color 0.2s ease",
                  fontFamily: "monospace",
                }}
              >
                {(locale === "es" ? "Mensaje" : "Message").toUpperCase()}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                aria-label={t.messagePlaceholder}
                rows={4}
                style={{
                  width: "100%",
                  fontSize: 13,
                  color: headText,
                  background: focused === "message"
                    ? (isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.018)")
                    : "transparent",
                  border: `1.5px solid ${
                    focused === "message"
                      ? (isDark ? "rgba(140,90,255,0.5)" : "rgba(100,40,220,0.40)")
                      : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")
                  }`,
                  borderRadius: 10,
                  outline: "none",
                  padding: "12px 14px",
                  fontFamily: "inherit",
                  resize: "none",
                  lineHeight: 1.65,
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  caretColor: isDark ? "rgba(160,120,255,0.9)" : "rgba(100,40,220,0.8)",
                }}
                placeholder=""
              />
              {/* character hint */}
              {message.length > 0 && (
                <span style={{
                  position: "absolute", bottom: -18, right: 2,
                  fontSize: 9, fontFamily: "monospace",
                  color: dimText, opacity: 0.6, letterSpacing: "0.04em",
                }}>
                  {message.length} chars
                </span>
              )}
            </div>

            {/* Error */}
            {status === "error" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <AlertCircle size={13} strokeWidth={1.5} style={{ color: "rgba(255,90,80,0.8)", flexShrink: 0 }} />
                <span className="font-mono" style={{ fontSize: 10, color: "rgba(255,90,80,0.8)" }}>{t.error}</span>
              </div>
            )}

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label={t.sendBtn}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "13px 20px",
                borderRadius: 12,
                fontSize: 12,
                letterSpacing: "0.06em",
                fontFamily: "monospace",
                fontWeight: 500,
                background: canSend
                  ? (isDark
                    ? "linear-gradient(135deg, rgba(120,55,255,0.28) 0%, rgba(60,160,240,0.18) 100%)"
                    : "linear-gradient(135deg, rgba(100,40,220,0.14) 0%, rgba(40,130,200,0.10) 100%)")
                  : "transparent",
                border: `1px solid ${canSend
                  ? (isDark ? "rgba(140,80,255,0.40)" : "rgba(100,40,220,0.28)")
                  : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)")}`,
                color: canSend
                  ? (isDark ? "rgba(200,165,255,0.95)" : "rgba(90,30,200,0.9)")
                  : dimText,
                cursor: canSend ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                boxShadow: canSend && isDark ? "0 0 20px rgba(120,55,255,0.12)" : "none",
              }}
              onMouseEnter={(e) => { if (canSend) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {status === "sending"
                ? <><Loader size={13} strokeWidth={1.8} style={{ animation: "spin 1s linear infinite" }} />{t.sending}</>
                : <><Send size={13} strokeWidth={1.8} />{t.sendBtn}</>
              }
            </button>
          </div>
        )}
      </div>

      {/* ── Links ── */}
      <div className="px-4 pb-3">
        <p className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: dimText }}>
          {t.linksHeader}
        </p>
        <div style={{ ...glass, overflow: "hidden" }}>
          {LINKS.map(({ icon: Icon, label, value, href }, i) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={`${label}: ${value}`}
              className="flex items-center gap-3 group"
              style={{
                padding: "10px 14px",
                borderBottom: i < LINKS.length - 1 ? `1px solid ${rowSep}` : "none",
                textDecoration: "none",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon size={13} strokeWidth={1.5} style={{ color: dimText, flexShrink: 0 }} aria-hidden="true" />
              <span className="font-mono" style={{ fontSize: 10, color: dimText, width: 64, flexShrink: 0, letterSpacing: "0.06em" }}>
                {label}
              </span>
              <span className="font-mono group-hover:opacity-60 transition-opacity flex-1" style={{ fontSize: 11, color: bodyText }}>
                {value}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Status strip ── */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[
          { label: t.statusLabel,   value: t.statusValue,   accent: true },
          { label: t.responseLabel, value: t.responseValue, accent: false },
          { label: t.locationLabel, value: t.locationValue, accent: false },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ ...glass, padding: "11px 10px", textAlign: "center" }}>
            {accent && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}>
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(90,210,120,0.85)", display: "inline-block" }}
                />
              </div>
            )}
            <div className="font-mono" style={{ fontSize: 11, fontWeight: 500, color: headText, lineHeight: 1.2 }}>
              {value}
            </div>
            <div className="font-mono" style={{ fontSize: 9, color: dimText, marginTop: 4, letterSpacing: "0.1em" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 pb-5">
        <p className="font-mono" style={{ fontSize: 10, color: dimText, opacity: 0.55, letterSpacing: "0.05em" }}>
          {t.copyright}
        </p>
      </div>
    </div>
  );
}
