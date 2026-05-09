"use client";

import React, { useEffect, useRef, useState } from "react";

/* ── Line types ── */
type TextLine = string;
type LinkLine = { text: string; url: string };
type Line = TextLine | LinkLine;

const isLink = (l: Line): l is LinkLine => typeof l === "object";

/* ── Syntax coloring for plain text lines ── */
function renderTextLine(line: string): React.ReactNode {
  if (line === "") return "\u00a0"; // keep empty rows from collapsing

  // $ command echo  →  green $ + cyan command + white args
  if (line.startsWith("$ ")) {
    const rest = line.slice(2);
    const spaceIdx = rest.indexOf(" ");
    const cmd  = spaceIdx === -1 ? rest : rest.slice(0, spaceIdx);
    const args = spaceIdx === -1 ? "" : rest.slice(spaceIdx);
    return (
      <>
        <span style={{ color: "rgba(100,210,130,0.65)" }}>$</span>
        <span style={{ color: "rgba(140,210,255,0.9)" }}> {cmd}</span>
        {args && <span style={{ color: "rgba(255,255,255,0.65)" }}>{args}</span>}
      </>
    );
  }

  // ask-flow echoes  →  violet label + white value
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

  // Errors
  if (line.startsWith("command not found:")) {
    const cmd = line.slice("command not found:".length);
    return (
      <>
        <span style={{ color: "rgba(255,90,80,0.65)" }}>command not found:</span>
        <span style={{ color: "rgba(255,120,100,0.88)" }}>{cmd}</span>
      </>
    );
  }
  if (
    line.startsWith("Message was empty") || line.startsWith("El mensaje") ||
    line.startsWith("(ask cancelled)")   || line.startsWith("(ask cancelado)") ||
    line.startsWith("Failed to send")    || line.startsWith("No se pudo")
  ) {
    return <span style={{ color: "rgba(255,110,80,0.65)" }}>{line}</span>;
  }

  // Success
  if (line.includes("Message sent") || line.includes("Mensaje enviado") || line.includes("Sending") || line.includes("Enviando")) {
    return <span style={{ color: "rgba(100,210,130,0.85)" }}>{line}</span>;
  }

  // Ask-flow prompts / status lines
  if (
    line.startsWith("Let's send") || line.startsWith("Enviemos") ||
    line.startsWith("Your name")  || line.startsWith("Tu nombre") ||
    line.startsWith("Your email") || line.startsWith("Tu email") ||
    line.startsWith("Your message")|| line.startsWith("Tu mensaje")
  ) {
    return <span style={{ color: "rgba(180,140,255,0.75)" }}>{line}</span>;
  }

  // Section headers  —  ...  —
  if (line.trim().startsWith("—")) {
    return <span style={{ color: "rgba(180,140,255,0.7)" }}>{line}</span>;
  }

  // Banner:  rodriwu.io v1.0 — rodriwu@desktop
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

  // Help header line (either locale)
  if (line === "Available commands:" || line === "Comandos disponibles:") {
    return <span style={{ color: "rgba(255,255,255,0.4)" }}>{line}</span>;
  }

  // Help rows:  "  cmdname      — description"
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

  // Key: value  (e.g. "Email:   foo", "Design:     bar")
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

  // Quoted strings  "..."
  if (line.trim().startsWith('"')) {
    return <span style={{ color: "rgba(255,215,100,0.85)", fontStyle: "italic" }}>{line}</span>;
  }

  // Lines containing single-quoted command hints:  Run 'ask' to ...
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

  // Default — slightly dimmed
  return <span style={{ color: "rgba(255,255,255,0.72)" }}>{line}</span>;
}

/* ── Ask flow state ── */
type AskStep =
  | null
  | { step: "name" }
  | { step: "email"; name: string }
  | { step: "message"; name: string; email: string };

type Locale = "en" | "es";

/* ── Translations ── */
const T = {
  en: {
    banner:      "rodriwu.io v1.0 — rodriwu@desktop",
    hint:        "Type 'help' for available commands.",
    help: [
      "Available commands:",
      "  whoami      — about Rodrigo",
      "  skills      — design & tech skills",
      "  links       — github & social media",
      "  contact     — contact information",
      "  work        — work philosophy",
      "  sysinfo     — system information",
      "  ask         — leave me a question or message",
      "  clear       — clear terminal",
    ],
    sysinfo: [
      "— System Information —",
      "",
      "OS:           Hannah Montana OS v2.0 (Best of Both Worlds Edition)",
      "Kernel:       rodriwu.io/core 6.9.0-liquid",
      "Shell:        zsh  (rodriwu@desktop)",
      "Display:      Liquid Glass WM  ·  60 fps",
      "Resolution:   depends on your screen, bestie",
      "",
      "Font UI:      Ubuntu Sans  100–800",
      "Font Mono:    JetBrains Mono  300 · 400 · 500",
      "",
      "Runtime:      Next.js 14  ·  React 18",
      "Animations:   Framer Motion",
      "Canvas:       HTML5  ·  requestAnimationFrame",
      "Deployed on:  Vercel",
      "",
      "Uptime:       depends on your vibe",
      "Memory:       all of it, probably",
      "Swap:         vibes.img  (∞ GB)",
      "",
      "Built with ♥ by Rodriwu.",
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
      "Run 'ask' to leave a question or message.",
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
    banner:      "rodriwu.io v1.0 — rodriwu@escritorio",
    hint:        "Escribe 'help' para ver los comandos disponibles.",
    help: [
      "Comandos disponibles:",
      "  whoami      — sobre Rodrigo",
      "  skills      — habilidades",
      "  links       — redes y github",
      "  contact     — información de contacto",
      "  work        — filosofía de trabajo",
      "  sysinfo     — información del sistema",
      "  ask         — déjame una pregunta o mensaje",
      "  clear       — limpiar terminal",
    ],
    sysinfo: [
      "— Información del Sistema —",
      "",
      "OS:           Hannah Montana OS v2.0 (Lo Mejor de Dos Mundos Edition)",
      "Kernel:       rodriwu.io/core 6.9.0-liquid",
      "Shell:        zsh  (rodriwu@escritorio)",
      "Display:      Liquid Glass WM  ·  60 fps",
      "Resolución:   depende de tu pantalla, amigx",
      "",
      "Fuente UI:    Ubuntu Sans  100–800",
      "Fuente Mono:  JetBrains Mono  300 · 400 · 500",
      "",
      "Runtime:      Next.js 14  ·  React 18",
      "Animaciones:  Framer Motion",
      "Canvas:       HTML5  ·  requestAnimationFrame",
      "Deploy:       Vercel",
      "",
      "Uptime:       depende de tu vibra",
      "Memoria:      toda, probablemente",
      "Swap:         vibras.img  (∞ GB)",
      "",
      "Hecho con ♥ por Rodriwu.",
    ],
    whoami: [
      "Rodrigo Martínez (Rodriwu)",
      "Diseñador con más de 5 años de experiencia.",
      "Enfocado en diseño de interacción y UX.",
      "Amigable, persistente y con mucha energía.",
    ],
    skills: [
      "Diseño:     Figma, Sketch, Adobe XD",
      "Research:   Entrevistas de usuario, pruebas de usabilidad",
      "Frontend:   HTML, CSS, React básico",
      "Motion:     Principle, Framer, GSAP",
      "Sistemas:   Tokens de diseño, librerías de componentes",
    ],
    linksHeader: "— Social y trabajo —",
    contact: [
      "Email:   rodriwuu@gmail.com",
      "Web:     rodriwu.com",
      "",
      "Ejecuta 'links' para abrir perfiles sociales.",
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

export default function TerminalWindow({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const initialLines: Line[] = [t.banner, t.hint, ""];
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [askStep, setAskStep] = useState<AskStep>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const prompt =
    askStep === null        ? "$"      :
    askStep.step === "name" ? "name >" :
    askStep.step === "email"? "email>" :
                              "msg  >";

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();

    /* ── Ask multi-step flow ── */
    if (askStep !== null) {
      if (askStep.step === "name") {
        const name = trimmed || "anonymous";
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

    const lower = trimmed.toLowerCase();
    const newLines: Line[] = [...lines, `$ ${cmd}`];

    if (lower === "clear") {
      setLines(initialLines);
    } else if (lower === "ask") {
      setLines([...newLines, "", t.askStart, t.askName]);
      setAskStep({ step: "name" });
    } else if (lower === "links") {
      setLines([...newLines, t.linksHeader,
        { text: "  GitHub      → github.com/rodriwu",      url: "https://github.com/rodriwu" },
        { text: "  LinkedIn    → linkedin.com/in/rodriwu", url: "https://linkedin.com/in/rodriwu" },
        { text: "  Behance     → behance.net/rodriwu",     url: "https://behance.net/rodriwu" },
        { text: "  X / Twitter → x.com/rodriwu",           url: "https://x.com/rodriwu" },
        "",
      ]);
    } else if (lower in T.en && lower !== "links") {
      const key = lower as keyof typeof t;
      const out = t[key];
      if (Array.isArray(out)) setLines([...newLines, ...out, ""]);
    } else if (lower === "") {
      setLines(newLines);
    } else {
      setLines([...newLines, `${t.notFound} ${lower}`, ""]);
    }

    if (lower && lower !== "ask") setHistory((h) => [lower, ...h]);
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
    }
  };

  return (
    <div
      className="h-full flex flex-col p-4 font-mono text-xs"
      style={{ background: "rgba(10,10,10,0.96)", color: "rgba(255,255,255,0.82)" }}
    >
      <div className="flex-1 overflow-auto space-y-0.5">
        {lines.map((line, i) =>
          isLink(line) ? (
            <div key={i} className="leading-5">
              <a
                href={line.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "rgba(100,185,255,0.88)", textDecoration: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                {line.text}
              </a>
            </div>
          ) : (
            <div key={i} className="leading-5 whitespace-pre">
              {renderTextLine(line)}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div
        className="flex items-center gap-2 pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span style={{ color: askStep ? "rgba(180,140,255,0.7)" : "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-white"
          style={{ color: "rgba(255,255,255,0.9)" }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
