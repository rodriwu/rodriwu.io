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

  // Claude Code banner box lines
  if (line.startsWith("╭") || line.startsWith("╰")) {
    return <span style={{ color: "rgba(232,121,92,0.75)" }}>{line}</span>;
  }
  if (line.startsWith("│")) {
    const inner = line.slice(1, -1);
    const starIdx = inner.indexOf("✻");
    if (starIdx !== -1) {
      const before = inner.slice(0, starIdx);
      const star = "✻";
      const rest = inner.slice(starIdx + 1);
      // split "  Claude Code" from "claude-sonnet-4-6  "
      const modelMatch = rest.match(/^(.+?)\s{2,}(claude-\S+)\s*$/);
      if (modelMatch) {
        return (
          <>
            <span style={{ color: "rgba(232,121,92,0.75)" }}>{"│"}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{before}</span>
            <span style={{ color: "rgba(232,121,92,0.9)" }}>{star}</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{modelMatch[1]}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{"                       "}</span>
            <span style={{ color: "rgba(180,140,255,0.7)" }}>{modelMatch[2]}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{"  │"}</span>
          </>
        );
      }
    }
    return <span style={{ color: "rgba(232,121,92,0.75)" }}>{line}</span>;
  }
  // Claude banner body lines
  if (line.trim() === "Tips for getting started:") {
    return <span style={{ color: "rgba(255,255,255,0.45)" }}>{line}</span>;
  }
  if (/^\s+\d+\. /.test(line)) {
    const match = line.match(/^(\s+)(\d+\.)(\s+)(.+)$/);
    if (match) {
      const [, indent, num, sp, text] = match;
      return (
        <>
          <span>{indent}</span>
          <span style={{ color: "rgba(232,121,92,0.7)" }}>{num}</span>
          <span>{sp}</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{text}</span>
        </>
      );
    }
  }
  if (line.trim().startsWith("cwd:")) {
    const [key, ...rest] = line.split(":");
    return (
      <>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>{key}{":" }</span>
        <span style={{ color: "rgba(100,210,130,0.7)" }}>{rest.join(":")}</span>
      </>
    );
  }

  // Claude error line
  if (line.startsWith("Error: no Anthropic") || line.startsWith("Error: sin acceso")) {
    return <span style={{ color: "rgba(255,90,80,0.8)" }}>{line}</span>;
  }
  // Claude mode prompt echo
  if (line.startsWith("> ")) {
    return (
      <>
        <span style={{ color: "rgba(232,121,92,0.8)" }}>{">"}</span>
        <span style={{ color: "rgba(255,255,255,0.65)" }}>{line.slice(1)}</span>
      </>
    );
  }

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

/* ── Claude Code banner ── */
const CLAUDE_BANNER = [
  "╭──────────────────────────────────────────────────────────╮",
  "│ ✻  Claude Code                        claude-sonnet-4-6  │",
  "╰──────────────────────────────────────────────────────────╯",
  "",
  "  Tips for getting started:",
  "",
  "    1. Ask Claude to edit a file, fix a bug, or write tests.",
  "    2. Run /help to see all commands.",
  "    3. Be specific about what you want Claude to do.",
  "",
  "  cwd: ~/rodriwu.io",
  "",
];

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
      "",
      "— Core —",
      "  whoami      — about Rodrigo",
      "  skills      — design & tech skills",
      "  links       — github & social media",
      "  contact     — contact information",
      "  work        — work philosophy",
      "  sysinfo     — system information",
      "  ask         — leave me a message",
      "  claude      — open Claude Code",
      "  clear       — clear terminal",
      "",
      "— File System —",
      "  ls [dir]    — list directory contents",
      "  cd <dir>    — change directory",
      "  pwd         — print working directory",
      "  cat <file>  — read file content",
      "  touch <f>   — create empty file",
      "  mkdir <d>   — create directory",
      "  rm <name>   — delete file or directory",
      "",
      "— System & Toys —",
      "  c/run <p>   — run binary programs",
      "  joke        — random developer joke",
      "  weather     — simulated weather",
      "  sudo        — superuser do (try it!)",
      "  echo <txt>  — repeat text",
      "  date        — show system date",
      "  uname       — system information",
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
    claudeError: "Error: no Anthropic API access in this environment.",
    notFound:    "command not found:",
  },
  es: {
    banner:      "rodriwu.io v1.0 — rodriwu@escritorio",
    hint:        "Escribe 'help' para ver los comandos disponibles.",
    help: [
      "Comandos disponibles:",
      "",
      "— Núcleo —",
      "  whoami      — sobre Rodrigo",
      "  skills      — habilidades",
      "  links       — redes y github",
      "  contact     — información de contacto",
      "  work        — filosofía de trabajo",
      "  sysinfo     — información del sistema",
      "  ask         — déjame un mensaje",
      "  claude      — abrir Claude Code",
      "  clear       — limpiar terminal",
      "",
      "— Sistema de Archivos —",
      "  ls [dir]    — listar archivos",
      "  cd <dir>    — cambiar directorio",
      "  pwd         — ruta actual",
      "  cat <arch>  — leer archivo",
      "  touch <f>   — crear archivo vacío",
      "  mkdir <d>   — crear directorio",
      "  rm <nombre> — borrar archivo/carpeta",
      "",
      "— Sistema y Juguetes —",
      "  c/run <p>   — ejecutar programas",
      "  joke        — chiste aleatorio",
      "  weather     — clima simulado",
      "  sudo        — superusuario (¡pruébalo!)",
      "  echo <txt>  — repetir texto",
      "  date        — fecha del sistema",
      "  uname       — info del sistema",
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
      "Amigable, persistentemente y con mucha energía.",
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
    claudeError: "Error: sin acceso a la API de Anthropic en este entorno.",
    notFound:    "comando no encontrado:",
  },
} as const;

/* ── Simulated File System ── */
type FileNode = {
  type: "file";
  content: string;
};
type DirectoryNode = {
  type: "dir";
  children: Record<string, FileNode | DirectoryNode>;
};
type FSNode = FileNode | DirectoryNode;

const INITIAL_FS: DirectoryNode = {
  type: "dir",
  children: {
    "about.txt": { type: "file", content: "Rodrigo Martínez (Rodriwu)\nDesigner & Developer\nFocused on interaction design & UX." },
    "skills.md": { type: "file", content: "# Skills\n\n- Design: Figma, Sketch\n- Frontend: React, Next.js, Tailwind\n- Motion: Framer Motion, GSAP" },
    "projects": {
      type: "dir",
      children: {
        "portfolio.v1": { type: "file", content: "Legacy portfolio built with React." },
        "portfolio.v2": { type: "file", content: "Modern portfolio built with Next.js 14." },
        "secret_plans.txt": { type: "file", content: "1. Build cool stuff\n2. Have fun\n3. Repeat" },
      }
    },
    "bin": {
      type: "dir",
      children: {
        "hello": { type: "file", content: "echo 'Hello, World!'" },
        "matrix": { type: "file", content: "run_matrix_animation()" },
      }
    },
    "readme.md": { type: "file", content: "Welcome to my terminal! Feel free to explore.\nTry 'ls', 'cd', and 'cat'." },
  }
};

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "A SQL query walks into a bar, walks up to two tables, and asks... 'Can I join you?'",
  "Real programmers count from 0.",
  "I'd tell you a joke about UDP, but you might not get it.",
  "A programmer was found dead in the shower. The instructions on the shampoo said: Lather, Rinse, Repeat.",
];

export default function TerminalWindow({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const initialLines: Line[] = [t.banner, t.hint, ""];
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [askStep, setAskStep] = useState<AskStep>(null);
  const [claudeMode, setClaudeMode] = useState(false);
  const [fs, setFs] = useState<DirectoryNode>(INITIAL_FS);
  const [cwd, setCwd] = useState<string[]>([]); // path segments
  const [userName, setUserName] = useState<string | null>(null);
  const [isMatrixing, setIsMatrixing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (!isMatrixing) return;
    const interval = setInterval(() => {
      const line = Array.from({ length: 40 }, () => Math.random() > 0.5 ? "1" : "0").join("");
      setLines(prev => [...prev.slice(-100), line]);
    }, 80);
    const timeout = setTimeout(() => {
      setIsMatrixing(false);
      setLines(prev => [...prev, "", "Matrix session terminated.", ""]);
    }, 4000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isMatrixing]);

  const prompt =
    claudeMode              ? ">"      :
    askStep === null        ? (cwd.length === 0 ? "~ $" : `~/${cwd.join("/")} $`) :
    askStep.step === "name" ? "name >" :
    askStep.step === "email"? "email>" :
                              "msg  >";

  // Get node at path relative to current dir
  const getNode = (path: string, currentFS: DirectoryNode, currentCWD: string[]): FSNode | null => {
    if (!path || path === ".") return currentFS;
    
    let segments = path.startsWith("/") ? path.split("/").filter(Boolean) : [...currentCWD, ...path.split("/").filter(Boolean)];
    
    // Resolve ".."
    const resolved: string[] = [];
    for (const seg of segments) {
      if (seg === "..") resolved.pop();
      else if (seg !== ".") resolved.push(seg);
    }

    let node: FSNode = INITIAL_FS;
    for (const seg of resolved) {
      if (node.type !== "dir" || !node.children[seg]) return null;
      node = node.children[seg];
    }
    return node;
  };

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed && !claudeMode && !askStep) return;

    if (isMatrixing) return;

    /* ── Claude mode — any input is an error ── */
    if (claudeMode) {
      if (trimmed === "") { setInput(""); return; }
      setClaudeMode(false);
      setLines((prev) => [...prev, `> ${cmd}`, "", t.claudeError, ""]);
      setInput("");
      return;
    }

    /* ── Ask multi-step flow ── */
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
    } else if (mainCmd === "claude") {
      setLines([...newLines, ...CLAUDE_BANNER]);
      setClaudeMode(true);
      setInput("");
      return;
    } else if (mainCmd === "ask") {
      setLines([...newLines, "", t.askStart, t.askName]);
      setAskStep({ step: "name" });
    } else if (mainCmd === "links") {
      setLines([...newLines, t.linksHeader,
        { text: "  GitHub      → github.com/rodriwu",      url: "https://github.com/rodriwu" },
        { text: "  LinkedIn    → linkedin.com/in/rodriwu", url: "https://linkedin.com/in/rodriwu" },
        { text: "  Behance     → behance.net/rodriwu",     url: "https://behance.net/rodriwu" },
        { text: "  X / Twitter → x.com/rodriwu",           url: "https://x.com/rodriwu" },
        "",
      ]);
    } else if (mainCmd === "whoami") {
      setLines([...newLines, userName || "rodriwu", ""]);
    } else if (mainCmd === "ls") {
      const target = args[0] || ".";
      const node = getNode(target, fs, cwd);
      if (node && node.type === "dir") {
        const items = Object.entries(node.children).map(([name, n]) => 
          n.type === "dir" ? `${name}/` : name
        );
        setLines([...newLines, items.join("  "), ""]);
      } else if (node && node.type === "file") {
        setLines([...newLines, target, ""]);
      } else {
        setLines([...newLines, `ls: cannot access '${target}': No such file or directory`, ""]);
      }
    } else if (mainCmd === "cd") {
      const target = args[0] || "~";
      if (target === "~") {
        setCwd([]);
        setLines([...newLines]);
      } else {
        const node = getNode(target, fs, cwd);
        if (node && node.type === "dir") {
          // Resolve actual path
          let segments = target.startsWith("/") ? target.split("/").filter(Boolean) : [...cwd, ...target.split("/").filter(Boolean)];
          const resolved: string[] = [];
          for (const seg of segments) {
            if (seg === "..") resolved.pop();
            else if (seg !== ".") resolved.push(seg);
          }
          setCwd(resolved);
          setLines([...newLines]);
        } else if (node && node.type === "file") {
          setLines([...newLines, `cd: not a directory: ${target}`, ""]);
        } else {
          setLines([...newLines, `cd: no such file or directory: ${target}`, ""]);
        }
      }
    } else if (mainCmd === "pwd") {
      setLines([...newLines, `/${cwd.join("/")}`, ""]);
    } else if (mainCmd === "cat") {
      const target = args[0];
      if (!target) {
        setLines([...newLines, "usage: cat <filename>", ""]);
      } else {
        const node = getNode(target, fs, cwd);
        if (node && node.type === "file") {
          setLines([...newLines, ...node.content.split("\n"), ""]);
        } else if (node && node.type === "dir") {
          setLines([...newLines, `cat: ${target}: Is a directory`, ""]);
        } else {
          setLines([...newLines, `cat: ${target}: No such file or directory`, ""]);
        }
      }
    } else if (mainCmd === "touch") {
      const name = args[0];
      if (!name) {
        setLines([...newLines, "touch: missing file operand", ""]);
      } else {
        setFs(prev => {
          const newFS = { ...prev };
          let curr = newFS;
          for (const seg of cwd) {
            curr = curr.children[seg] as DirectoryNode;
          }
          if (!curr.children[name]) {
            curr.children[name] = { type: "file", content: "" };
          }
          return newFS;
        });
        setLines([...newLines]);
      }
    } else if (mainCmd === "mkdir") {
      const name = args[0];
      if (!name) {
        setLines([...newLines, "mkdir: missing operand", ""]);
      } else {
        setFs(prev => {
          const newFS = { ...prev };
          let curr = newFS;
          for (const seg of cwd) {
            curr = curr.children[seg] as DirectoryNode;
          }
          if (!curr.children[name]) {
            curr.children[name] = { type: "dir", children: {} };
          }
          return newFS;
        });
        setLines([...newLines]);
      }
    } else if (mainCmd === "rm") {
      const name = args[0];
      if (!name) {
        setLines([...newLines, "rm: missing operand", ""]);
      } else {
        setFs(prev => {
          const newFS = { ...prev };
          let curr = newFS;
          for (const seg of cwd) {
            curr = curr.children[seg] as DirectoryNode;
          }
          delete curr.children[name];
          return newFS;
        });
        setLines([...newLines]);
      }
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
    } else if (mainCmd === "uname") {
      setLines([...newLines, "Linux rodriwu-desktop 6.9.0-liquid #1 SMP PREEMPT_DYNAMIC Mon May 11 20:26 x86_64 GNU/Linux", ""]);
    } else if (mainCmd === "c/run") {
      const target = args[0];
      if (!target) {
        setLines([...newLines, "usage: c/run <program>", ""]);
      } else if (target === "matrix") {
        setLines([...newLines, "Compiling matrix.c...", "Linking...", "Running...", ""]);
        setIsMatrixing(true);
      } else if (target === "hello") {
        setLines([...newLines, "Compiling hello.c...", "Linking...", "Running...", "Hello, World!", ""]);
      } else {
        const node = getNode(target, fs, cwd);
        if (node && node.type === "file") {
          setLines([...newLines, `Compiling ${target}...`, "Linking...", "Running...", ...node.content.split("\n"), ""]);
        } else {
          setLines([...newLines, `c/run: program '${target}' not found`, ""]);
        }
      }
    } else if (mainCmd === "help") {
      setLines([...newLines, ...t.help, "  ls, cd, pwd — navigate files", "  cat, touch, mkdir, rm — manage files", "  sudo, joke, weather — fun stuff", "  c/run       — run toys", ""]);
    } else if (mainCmd in T.en && mainCmd !== "links") {
      const key = mainCmd as keyof typeof t;
      const out = t[key];
      if (Array.isArray(out)) setLines([...newLines, ...out, ""]);
    } else if (mainCmd === "") {
      setLines(newLines);
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
    } else if (e.key === "Escape" && claudeMode) {
      setClaudeMode(false);
      setLines((prev) => [...prev, "(claude exited)", ""]);
      setInput("");
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
        <span style={{ color: claudeMode ? "rgba(232,121,92,0.8)" : askStep ? "rgba(180,140,255,0.7)" : "rgba(255,255,255,0.4)", fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>{prompt}</span>
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
