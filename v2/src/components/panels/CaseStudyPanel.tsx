"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/data/caseStudies";

interface Props {
  cs: CaseStudy;
  aspectRatio?: string;
}

/* CaseCard — thumbnail. Width is controlled by the parent.
   - Internal case: click → /case/[id] (in-app navigation).
   - External case (cs.external): click → cs.url in a new tab.       */
export default function CaseCard({ cs, aspectRatio = "1 / 1" }: Props) {
  const sharedStyle = {
    display: "block",
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  } as const;

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={cs.cover}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center",
        pointerEvents: "none",
      }}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px -5% 0px -5%" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
      }}
    >
      {cs.external ? (
        <a
          href={cs.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${cs.shortTitle} (opens in new tab)`}
          className="rw-thumb"
          draggable={false}
          style={sharedStyle}
        >
          {image}
        </a>
      ) : (
        <Link
          href={`/case/${cs.id}`}
          aria-label={cs.shortTitle}
          className="rw-thumb"
          draggable={false}
          style={sharedStyle}
        >
          {image}
        </Link>
      )}
    </motion.div>
  );
}
