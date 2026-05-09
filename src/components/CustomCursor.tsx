"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const cursorX = useSpring(0, { stiffness: 600, damping: 30 });
  const cursorY = useSpring(0, { stiffness: 600, damping: 30 });
  const trailX = useSpring(0, { stiffness: 180, damping: 28 });
  const trailY = useSpring(0, { stiffness: 180, damping: 28 });

  useEffect(() => {
    const checkTheme = () => setIsDark(!document.documentElement.classList.contains("light"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(!!(t.closest("button") || t.closest("a") || t.closest("[data-hover]")));
    };
    const onOut = () => setIsHovering(false);
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [cursorX, cursorY, trailX, trailY]);

  const color = isDark ? "255,255,255" : "0,0,0";

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          border: `1px solid rgba(${color},${isHovering ? 0.5 : 0.2})`,
          background: isHovering ? `rgba(${color},0.06)` : "transparent",
          backdropFilter: isHovering ? "blur(4px)" : "none",
          transition: "width 0.25s, height 0.25s, border-color 0.25s",
        }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: isClicking ? 3 : 5,
          height: isClicking ? 3 : 5,
          background: `rgba(${color},${isHovering ? 1 : 0.7})`,
          transition: "width 0.1s, height 0.1s",
        }}
      />
    </>
  );
}
