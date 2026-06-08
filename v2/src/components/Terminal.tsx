"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion";
import { X, Maximize2, Minus } from "lucide-react";
import { useShell } from "./context/ShellContext";

/* ── Line types ── */
type TextLine = string;
type LinkLine = { text: string; url: string };
type Line = TextLine | LinkLine;

const isLink = (l: Line): l is LinkLine => typeof l === "object";

/* ── Syntax coloring (subset of v1's renderTextLine) ── */
function renderTextLine(line: string): React.ReactNode {
  if (line === "") return " ";

  if (line.startsWith("rodriwu.io")) {
    const [brand, ...rest] = line.split(" — ");
    return (
      <>
        <span style={{ color: "rgba(180,140,255,0.9)", fontWeight: 600 }}>{brand}</span>
        {rest.length > 0 && (
          <>
            <span style={{ color: "rgba(255,255,255,0.2)" }}> — </span>
            <span style={{ color: "rgba(100,210,130,0.7)" }}>{rest.join(" — ")}</span>
          </>
        )}
      </>
    );
  }
  if (line.startsWith("~ $ ") || line.startsWith("~ $") ) {
    const rest = line.replace(/^~ \$ ?/, "");
    const spaceIdx = rest.indexOf(" ");
    const cmd  = spaceIdx === -1 ? rest : rest.slice(0, spaceIdx);
    const args = spaceIdx === -1 ? "" : rest.slice(spaceIdx);
    return (
      <>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>~ </span>
        <span style={{ color: "rgba(100,210,130,0.65)" }}>$</span>
        <span style={{ color: "rgba(140,210,255,0.9)" }}> {cmd}</span>
        {args && <span style={{ color: "rgba(255,255,255,0.65)" }}>{args}</span>}
      </>
    );
  }
  if (/^(name|email|msg\s+)[> ]/.test(line) && line.includes(">")) {
    const gtIdx = line.indexOf(">");
    const label = line.slice(0, gtIdx);
    const val   = line.slice(gtIdx + 1);
    return (
      <>
        <span style={{ color: "rgba(180,140,255,0.7)" }}>{label}{">"}</span>
        <span style={{ color: "rgba(255,255,255,0.72)" }}>{val}</span>
      </>
    );
  }
  if (line.startsWith("command not found:") || line.startsWith("comando no encontrado:")) {
    const idx = line.indexOf(":") + 1;
    const head = line.slice(0, idx);
    const cmd = line.slice(idx);
    return (
      <>
        <span style={{ color: "rgba(255,90,80,0.65)" }}>{head}</span>
        <span style={{ color: "rgba(255,120,100,0.88)" }}>{cmd}</span>
      </>
    );
  }
  if (line.includes("Message sent") || line.includes("Mensaje enviado") || line.includes("Sending") || line.includes("Enviando")) {
    return <span style={{ color: "rgba(100,210,130,0.85)" }}>{line}</span>;
  }
  if (
    line.startsWith("Failed to send") || line.startsWith("No se pudo") ||
    line.startsWith("Message was empty") || line.startsWith("El mensaje") ||
    line.startsWith("(ask cancelled)") || line.startsWith("(ask cancelado)")
  ) {
    return <span style={{ color: "rgba(255,110,80,0.65)" }}>{line}</span>;
  }
  if (
    line.startsWith("Let's send") || line.startsWith("Enviemos") ||
    line.startsWith("Your name")  || line.startsWith("Tu nombre") ||
    line.startsWith("Your email") || line.startsWith("Tu email") ||
    line.startsWith("Your message")|| line.startsWith("Tu mensaje")
  ) {
    return <span style={{ color: "rgba(180,140,255,0.75)" }}>{line}</span>;
  }
  if (line.trim().startsWith("—")) {
    return <span style={{ color: "rgba(180,140,255,0.7)" }}>{line}</span>;
  }
  if (line === "Available commands:" || line === "Comandos disponibles:") {
    return <span style={{ color: "rgba(255,255,255,0.4)" }}>{line}</span>;
  }
  const helpMatch = line.match(/^(\s+)(\w+)(\s+)(—\s+.+)$/);
  if (helpMatch) {
    const [, indent, cmd, pad, desc] = helpMatch;
    const dashIdx = desc.indexOf("—");
    return (
      <>
        <span>{indent}</span>
        <span style={{ color: "rgba(100,210,130,0.9)" }}>{cmd}</span>
        <span>{pad}</span>
        <span style={{ color: "rgba(255,255,255,0.22)" }}>{"—"}</span>
        <span style={{ color: "rgba(255,255,255,0.42)" }}>{desc.slice(dashIdx + 1)}</span>
      </>
    );
  }
  const keyMatch = line.match(/^(\s*)([A-Za-z][A-Za-z\/ ]*:)(\s+)(.+)$/);
  if (keyMatch) {
    const [, indent, key, pad, val] = keyMatch;
    return (
      <>
        <span>{indent}</span>
        <span style={{ color: "rgba(100,185,255,0.8)" }}>{key}</span>
        <span>{pad}</span>
        <span style={{ color: "rgba(255,255,255,0.75)" }}>{val}</span>
      </>
    );
  }
  if (/'[^']+'/.test(line)) {
    const parts = line.split(/('[\w\s]+')/g);
    return (
      <>
        {parts.map((p, i) =>
          /^'[^']+'$/.test(p)
            ? <span key={i} style={{ color: "rgba(100,210,130,0.9)" }}>{p}</span>
            : <span key={i} style={{ color: "rgba(255,255,255,0.45)" }}>{p}</span>
        )}
      </>
    );
  }
  return <span style={{ color: "rgba(255,255,255,0.72)" }}>{line}</span>;
}

/* ── Ask flow state ── */
type AskStep =
  | null
  | { step: "name" }
  | { step: "email"; name: string }
  | { step: "message"; name: string; email: string };

/* ── Translations ── */
const T = {
  en: {
    banner:      "rodriwu.io v2.0 — rodriwu@desktop",
    hint:        "Type 'help' for commands. Press \\` to toggle.",
    help: [
      "Available commands:",
      "",
      "— Core —",
      "  whoami      — about Rodrigo",
      "  skills      — design & tech skills",
      "  links       — github & social media",
      "  contact     — contact information",
      "  work        — work philosophy",
      "  ask         — leave me a message",
      "  clear       — clear terminal",
      "",
      "— System —",
      "  echo <txt>  — repeat text",
      "  date        — show system date",
      "  joke        — random dev joke",
      "  sudo        — superuser do (try it!)",
      "  weather     — simulated weather",
      "  exit        — close terminal",
    ],
    whoami: [
      "Rodrigo Martínez (Rodriwu)",
      "Designer with 5+ years of experience.",
      "Focused on interaction design & UX.",
      "Easy-going, persistent, a lot of fun.",
    ],
    skills: [
      "Design:     Figma, Sketch, Adobe XD",
      "Research:   User interviews, usability testing",
      "Frontend:   HTML, CSS, basic React",
      "Motion:     Principle, Framer, GSAP",
      "Systems:    Design tokens, component libraries",
    ],
    linksHeader: "— Social & work —",
    contact: [
      "Email:   rodriwuu@gmail.com",
      "Web:     rodriwu.com",
      "",
      "Run 'links' to open social profiles.",
      "Run 'ask' to leave a message.",
    ],
    work: [
      "\"Dependable and a solid team player.\"",
      "Human-centered design philosophy.",
      "Creating meaningful interactions,",
      "one pixel at a time.",
    ],
    askStart:    "Let's send a message to Rodrigo.",
    askName:     "Your name:",
    askEmail:    "Your email (press Enter to skip):",
    askMessage:  "Your message:",
    askSending:  "Sending message...",
    askSent:     "Message sent! Rodrigo will get back to you soon.",
    askFail:     "Failed to send. Try rodriwuu@gmail.com directly.",
    askEmpty:    "Message was empty. Ask cancelled.",
    askCancelled:"(ask cancelled)",
    notFound:    "command not found:",
  },
  es: {
    banner:      "rodriwu.io v2.0 — rodriwu@escritorio",
    hint:        "Escribe 'help' para los comandos. Presiona \\` para alternar.",
    help: [
      "Comandos disponibles:",
      "",
      "— Núcleo —",
      "  whoami      — sobre Rodrigo",
      "  skills      — habilidades",
      "  links       — redes y github",
      "  contact     — información de contacto",
      "  work        — filosofía de trabajo",
      "  ask         — déjame un mensaje",
      "  clear       — limpiar terminal",
      "",
      "— Sistema —",
      "  echo <txt>  — repetir texto",
      "  date        — fecha del sistema",
      "  joke        — chiste aleatorio",
      "  sudo        — superusuario (¡pruébalo!)",
      "  weather     — clima simulado",
      "  exit        — cerrar terminal",
    ],
    whoami: [
      "Rodrigo Martínez (Rodriwu)",
      "Diseñador con más de 5 años de experiencia.",
      "Enfocado en diseño de interacción y UX.",
      "Amigable, persistente y con mucha energía.",
    ],
    skills: [
      "Diseño:     Figma, Sketch, Adobe XD",
      "Research:   Entrevistas, pruebas de usabilidad",
      "Frontend:   HTML, CSS, React básico",
      "Motion:     Principle, Framer, GSAP",
      "Sistemas:   Tokens de diseño, librerías",
    ],
    linksHeader: "— Social y trabajo —",
    contact: [
      "Email:   rodriwuu@gmail.com",
      "Web:     rodriwu.com",
      "",
      "Ejecuta 'links' para abrir perfiles.",
      "Ejecuta 'ask' para dejar un mensaje.",
    ],
    work: [
      "\"Confiable y excelente jugador de equipo.\"",
      "Filosofía de diseño centrada en el humano.",
      "Creando interacciones significativas,",
      "un píxel a la vez.",
    ],
    askStart:    "Enviemos un mensaje a Rodrigo.",
    askName:     "Tu nombre:",
    askEmail:    "Tu email (Enter para omitir):",
    askMessage:  "Tu mensaje:",
    askSending:  "Enviando mensaje...",
    askSent:     "¡Mensaje enviado! Rodrigo te responderá pronto.",
    askFail:     "No se pudo enviar. Escríbeme a rodriwuu@gmail.com.",
    askEmpty:    "El mensaje estaba vacío. Cancelado.",
    askCancelled:"(ask cancelado)",
    notFound:    "comando no encontrado:",
  },
} as const;

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "A SQL query walks into a bar, walks up to two tables, and asks 'Can I join you?'",
  "Real programmers count from 0.",
  "I'd tell you a joke about UDP, but you might not get it.",
];

/* ── Default window dimensions ── */
const DEFAULT_W = 920;
const DEFAULT_H = 620;

/* ── Single component: window chrome + terminal logic with inline input ── */
export default function Terminal() {
  const { terminalOpen, closeTerminal, toggleTerminal, locale } = useShell();
  const t = T[locale];

  const initialLines: Line[] = [t.banner, t.hint, ""];
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [askStep, setAskStep] = useState<AskStep>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);

  /* Window state */
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();
  const xMv = useMotionValue(0);
  const yMv = useMotionValue(0);
  /* Window size — clamped to viewport so it always fits */
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [winPosReady, setWinPosReady] = useState(false);

  /* Center window when first opened, clamped to viewport */
  useEffect(() => {
    if (terminalOpen && !winPosReady) {
      const sidebarW = 56;
      const margin = 24;
      const w = Math.min(DEFAULT_W, window.innerWidth - sidebarW - margin * 2);
      const h = Math.min(DEFAULT_H, window.innerHeight - margin * 2);
      setSize({ w, h });
      const x = Math.max(sidebarW + 16, Math.round((window.innerWidth + sidebarW - w) / 2));
      const y = Math.max(40, Math.round((window.innerHeight - h) / 2));
      xMv.set(x);
      yMv.set(y);
      setWinPosReady(true);
    }
  }, [terminalOpen, winPosReady, xMv, yMv]);

  /* Focus input on open + after any output change */
  useEffect(() => {
    if (terminalOpen) inputRef.current?.focus();
  }, [terminalOpen]);

  /* Auto-scroll to keep the input line in view */
  useEffect(() => {
    inputLineRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [lines]);

  /* Global shortcuts — backtick toggles, Esc closes (when nothing critical is happening) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inTextField = target && (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && target !== inputRef.current));
      if (e.key === "`" && !inTextField) {
        e.preventDefault();
        toggleTerminal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTerminal]);

  const prompt =
    askStep === null        ? "~ $"     :
    askStep.step === "name" ? "name >"  :
    askStep.step === "email"? "email>"  :
                              "msg  >";

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed && !askStep) {
      setLines((prev) => [...prev, `${prompt} `]);
      setInput("");
      return;
    }

    if (askStep !== null) {
      if (askStep.step === "name") {
        const name = trimmed || "anonymous";
        setUserName(name);
        setLines((prev) => [...prev, `name > ${cmd}`, "", t.askEmail]);
        setAskStep({ step: "email", name });
      } else if (askStep.step === "email") {
        const { name } = askStep;
        setLines((prev) => [...prev, `email> ${cmd}`, "", t.askMessage]);
        setAskStep({ step: "message", name, email: trimmed });
      } else {
        const { name, email } = askStep;
        const msg = trimmed;
        setAskStep(null);
        if (!msg) {
          setLines((prev) => [...prev, `msg  > ${cmd}`, "", t.askEmpty, ""]);
        } else {
          setLines((prev) => [...prev, `msg  > ${cmd}`, "", t.askSending]);
          fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message: msg }),
          })
            .then((r) => r.ok ? r.json() : Promise.reject())
            .then(() => setLines((prev) => [...prev, t.askSent, ""]))
            .catch(() => setLines((prev) => [...prev, t.askFail, ""]));
        }
      }
      setInput("");
      return;
    }

    const parts = trimmed.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const newLines: Line[] = [...lines, `${prompt} ${cmd}`];

    if (mainCmd === "clear") {
      setLines(initialLines);
    } else if (mainCmd === "exit") {
      closeTerminal();
    } else if (mainCmd === "ask") {
      setLines([...newLines, "", t.askStart, t.askName]);
      setAskStep({ step: "name" });
    } else if (mainCmd === "links") {
      setLines([...newLines, t.linksHeader,
        { text: "  GitHub      → github.com/rodriwu",      url: "https://github.com/rodriwu" },
        { text: "  LinkedIn    → linkedin.com/in/rodriwu", url: "https://linkedin.com/in/rodriwu" },
        { text: "  Behance     → behance.net/rodriwu",     url: "https://behance.net/rodriwu" },
        "",
      ]);
    } else if (mainCmd === "whoami") {
      setLines([...newLines, ...t.whoami, ""]);
    } else if (mainCmd === "sudo") {
      setLines([...newLines, `${userName || "rodriwu"} is not in the sudoers file. This incident will be reported.`, ""]);
    } else if (mainCmd === "joke") {
      const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
      setLines([...newLines, joke, ""]);
    } else if (mainCmd === "weather") {
      const weathers = ["Sunny ☀️", "Cloudy ☁️", "Rainy 🌧️", "Cyber-storm ⚡", "Glitchy 👾"];
      const w = weathers[Math.floor(Math.random() * weathers.length)];
      setLines([...newLines, `Current conditions: ${w}`, "Temperature: 24°C / 75°F", ""]);
    } else if (mainCmd === "echo") {
      setLines([...newLines, args.join(" "), ""]);
    } else if (mainCmd === "date") {
      setLines([...newLines, new Date().toString(), ""]);
    } else if (mainCmd === "help") {
      setLines([...newLines, ...t.help, ""]);
    } else if (mainCmd === "skills" || mainCmd === "contact" || mainCmd === "work") {
      const out = t[mainCmd as "skills" | "contact" | "work"];
      if (Array.isArray(out)) setLines([...newLines, ...out, ""]);
    } else {
      setLines([...newLines, `${t.notFound} ${mainCmd}`, ""]);
    }

    if (mainCmd && mainCmd !== "ask") setHistory((h) => [trimmed, ...h]);
    setHistIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "Escape" && askStep !== null) {
      setAskStep(null);
      setLines((prev) => [...prev, t.askCancelled, ""]);
      setInput("");
    } else if (e.key === "Escape") {
      // Esc in idle state — close window
      closeTerminal();
    } else if (askStep === null && e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (askStep === null && e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines(initialLines);
    }
  };

  if (!terminalOpen || !winPosReady) {
    // Only render the window when open AND positioning is computed
    if (!terminalOpen) return null;
  }

  return (
    <AnimatePresence>
      {terminalOpen && winPosReady && (
        <motion.div
          key="terminal-window"
          drag={!isMaximized}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragConstraints={{ left: 72, top: 8, right: window.innerWidth - 200, bottom: window.innerHeight - 100 }}
          style={{
            position: "fixed",
            top: 0, left: 0,
            x: isMaximized ? 72 : xMv,
            y: isMaximized ? 16 : yMv,
            width: isMaximized ? `calc(100vw - 88px)` : size.w,
            height: isMaximized ? `calc(100vh - 32px)` : size.h,
            zIndex: 70,
            background: "rgba(10,10,12,0.93)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            display: "flex",
            flexDirection: "column",
          }}
          initial={{ opacity: 0, scale: 0.97, y: yMv.get() + 6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Title bar — drag handle */}
          <div
            onPointerDown={(e) => !isMaximized && dragControls.start(e)}
            onDoubleClick={() => setIsMaximized((m) => !m)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(20,20,24,0.7)",
              cursor: isMaximized ? "default" : "grab",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            <div className="flex items-center gap-2">
              {/* Stoplight dots — close (red) + maximize (green) only */}
              <button
                onClick={(e) => { e.stopPropagation(); closeTerminal(); }}
                aria-label="Close"
                title="Close"
                style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,95,86,0.95)", border: "none", padding: 0, cursor: "pointer" }}
              />
              <button
                aria-label={isMaximized ? "Restore" : "Maximize"}
                title={isMaximized ? "Restore" : "Maximize"}
                onClick={(e) => { e.stopPropagation(); setIsMaximized((m) => !m); }}
                style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(39,201,63,0.92)", border: "none", padding: 0, cursor: "pointer" }}
              />
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)", marginLeft: 10 }}>
                rodriwu@desktop — zsh
              </span>
            </div>
            <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)" }}>
              {isMaximized ? "MAX" : "WIN"}
            </span>
          </div>

          {/* Terminal body — single scrollable area with inline input as last "line" */}
          <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            className="flex-1 overflow-auto font-mono"
            style={{
              padding: "12px 14px",
              color: "rgba(255,255,255,0.82)",
              fontSize: 12,
              lineHeight: 1.55,
              cursor: "text",
            }}
          >
            {lines.map((line, i) =>
              isLink(line) ? (
                <div key={i} className="whitespace-pre">
                  <a
                    href={line.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "rgba(100,185,255,0.88)", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    {line.text}
                  </a>
                </div>
              ) : (
                <div key={i} className="whitespace-pre">
                  {renderTextLine(line)}
                </div>
              )
            )}

            {/* Inline input — sits as the last "line" in the stream */}
            <div ref={inputLineRef} style={{ display: "flex", alignItems: "center", whiteSpace: "pre" }}>
              <span
                style={{
                  color:
                    askStep === null ? undefined :
                    "rgba(180,140,255,0.75)",
                }}
              >
                {askStep === null ? (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>~ </span>
                    <span style={{ color: "rgba(100,210,130,0.75)" }}>$</span>
                    {" "}
                  </>
                ) : (
                  <>{prompt} </>
                )}
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "rgba(255,255,255,0.90)",
                  font: "inherit",
                  padding: 0,
                  margin: 0,
                  caretColor: "rgba(255,255,255,0.85)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
