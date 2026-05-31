"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Home,
  FolderOpen,
  User,
  Mail,
  Layers,
  Terminal,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface DockItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

const DOCK_ITEMS: DockItem[] = [
  { icon: Home, label: "Home", id: "home" },
  { icon: User, label: "About", id: "about" },
  { icon: FolderOpen, label: "Projects", id: "projects" },
  { icon: Layers, label: "Stack", id: "stack" },
  { icon: Terminal, label: "Terminal", id: "terminal" },
  { icon: Mail, label: "Contact", id: "contact" },
  { icon: Settings, label: "Config", id: "config" },
];

function DockIcon({
  item,
  mouseX,
  isActive,
  onClick,
}: {
  item: DockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = (el: HTMLButtonElement | null) => {
    buttonRef.current = el;
  };
  const buttonRef = { current: null as HTMLButtonElement | null };

  const distance = useTransform(mouseX, (val) => {
    const el = buttonRef.current;
    if (!el) return 150;
    const rect = el.getBoundingClientRect();
    return val - rect.x - rect.width / 2;
  });

  const size = useTransform(distance, [-150, 0, 150], [44, 64, 44]);
  const iconSize = useTransform(distance, [-150, 0, 150], [18, 26, 18]);
  const springSize = useSpring(size, { mass: 0.1, stiffness: 200, damping: 15 });
  const springIconSize = useSpring(iconSize, { mass: 0.1, stiffness: 200, damping: 15 });

  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatedTooltip visible={isHovered} label={item.label} />

      <motion.button
        ref={(el) => {
          buttonRef.current = el;
        }}
        data-glass
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: springSize, height: springSize }}
        className={`
          relative rounded-2xl flex items-center justify-center transition-colors duration-200
          ${
            isActive
              ? "bg-electric-violet/20 border border-electric-violet/30 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
              : "bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.1]"
          }
        `}
      >
        <motion.div style={{ width: springIconSize, height: springIconSize }}>
          <Icon
            className={`w-full h-full ${
              isActive ? "text-electric-violet" : "text-slate-400"
            }`}
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            layoutId="dock-active"
            className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-electric-violet"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}

function AnimatedTooltip({ visible, label }: { visible: boolean; label: string }) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 6,
        scale: visible ? 1 : 0.9,
      }}
      transition={{ duration: 0.15 }}
      className="absolute -top-10 whitespace-nowrap glass-panel-solid rounded-lg px-3 py-1 pointer-events-none"
    >
      <span className="font-mono text-[10px] tracking-widest text-slate-300 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

export default function NavigationDock() {
  const mouseX = useMotionValue(Infinity);
  const [activeId, setActiveId] = useState("home");

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-panel-solid rounded-2xl px-3 py-2.5 flex items-end gap-2 shadow-2xl shadow-black/40">
        {DOCK_ITEMS.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isActive={activeId === item.id}
            onClick={() => setActiveId(item.id)}
          />
        ))}
      </div>
    </motion.nav>
  );
}
