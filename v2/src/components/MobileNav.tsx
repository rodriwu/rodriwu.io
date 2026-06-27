"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe, Home } from "lucide-react";
import { useShell } from "./context/ShellContext";

const NAV_LINKS = [
  { num: "01", label: "HOME",    href: "/",        hash: null },
  { num: "02", label: "WORK",    href: "/",        hash: "work" },
  { num: "03", label: "ABOUT",   href: "/about",   hash: null },
  { num: "04", label: "CONTACT", href: "/",        hash: "contact" },
];

export default function MobileNav() {
  const { isDark, toggleTheme, locale, setLocale } = useShell();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const ink  = isDark ? "rgba(255,255,255,0.92)" : "rgba(10,12,35,0.90)";
  const dim  = isDark ? "rgba(255,255,255,0.38)" : "rgba(10,12,35,0.54)";
  const bg   = isDark ? "#121212" : "#d2d0c8";

  const handleNavClick = (href: string, hash: string | null) => {
    setOpen(false);
    if (!hash) {
      router.push(href);
      return;
    }
    if (pathname === href) {
      // Already on the target page — smooth scroll
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      router.push(`${href}#${hash}`);
    }
  };

  return (
    <>
      {/* Fixed top bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 20,
          paddingRight: 20,
          background: "var(--glass-bg)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        {/* Profile photo */}
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            display: "block",
            backgroundImage: `url('${isDark ? "/profile.png" : "/profile-light.png"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
          aria-label="Home"
        />

        {/* Right side: Home + Burger */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Link
            href="/"
            aria-label="Home"
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: dim,
              borderRadius: 10,
            }}
          >
            <Home size={18} strokeWidth={1.5} />
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: ink,
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-overlay"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: bg,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top row — mirrors the bar */}
            <div
              style={{
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: 20,
                paddingRight: 20,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  backgroundImage: `url('${isDark ? "/profile.png" : "/profile-light.png"}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 20%",
                }}
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  color: ink,
                  borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav links */}
            <nav
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "clamp(28px, 8vw, 48px)",
                paddingRight: "clamp(28px, 8vw, 48px)",
                gap: "clamp(20px, 4vh, 32px)",
              }}
            >
              {NAV_LINKS.map(({ num, label, href, hash }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNavClick(href, hash)}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "clamp(11px, 2.8vw, 14px)",
                      letterSpacing: "0.18em",
                      color: dim,
                      minWidth: 24,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "clamp(36px, 10vw, 52px)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      color: ink,
                      lineHeight: 1,
                    }}
                  >
                    {label}
                  </span>
                </motion.button>
              ))}
            </nav>

            {/* Bottom controls — theme + locale */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              style={{
                padding: "0 clamp(28px, 8vw, 48px) clamp(32px, 6vh, 48px)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--taskbar-icon-active-bg)",
                  border: "1px solid var(--glass-border)",
                  color: ink,
                  cursor: "pointer",
                }}
                aria-label={isDark ? "Switch to light" : "Switch to dark"}
              >
                {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
              </button>

              {(["en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className="font-mono"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 10,
                    background: locale === lang ? "var(--taskbar-icon-active-bg)" : "transparent",
                    border: locale === lang ? "1px solid var(--glass-border)" : "1px solid transparent",
                    color: locale === lang ? ink : dim,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    fontWeight: locale === lang ? 600 : 400,
                  }}
                >
                  <Globe size={12} strokeWidth={1.5} />
                  {lang.toUpperCase()}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
