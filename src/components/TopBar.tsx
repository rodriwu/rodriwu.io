"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wifi, Shield, Cpu, Activity } from "lucide-react";

export default function TopBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-9 glass-panel-solid flex items-center justify-between px-5"
    >
      {/* Left — System Label */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-electric-violet animate-pulse-slow" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase">
            Caelestia OS v2.7
          </span>
        </div>
        <div className="w-px h-3.5 bg-white/10" />
        <span className="font-mono text-[10px] text-electric-violet/70 flex items-center gap-1">
          <Activity size={10} />
          Active Mode: Creative
        </span>
      </div>

      {/* Right — Status + Time */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Shield size={11} className="text-emerald-500/70" />
          <Wifi size={11} />
          <Cpu size={11} className="text-electric-violet/60" />
        </div>
        <div className="w-px h-3.5 bg-white/10" />
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-400">{date}</span>
          <span className="text-[10px] text-slate-300 ml-2 tabular-nums">
            {time}
          </span>
        </div>
      </div>
    </motion.header>
  );
}
