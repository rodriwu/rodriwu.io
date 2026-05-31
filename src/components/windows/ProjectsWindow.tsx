"use client";

import { ExternalLink } from "lucide-react";

const PROJECTS = [
  {
    title: "rodriwu.com",
    description: "Personal portfolio — minimal, human-centered design with a focus on interaction and typography.",
    tags: ["UX Design", "Web"],
    link: "https://rodriwu.com",
    image: "/wallpaper.jpg",
  },
  {
    title: "Club Pilates",
    description: "Desktop experience design for a fitness brand. Clean, approachable visual system.",
    tags: ["UI Design", "Branding"],
    image: null,
  },
  {
    title: "Digital Experience Design",
    description: "Five years of crafting human-centered digital experiences across web and mobile.",
    tags: ["UX Research", "Interaction Design"],
    image: null,
  },
];

export default function ProjectsWindow() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="space-y-4">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--window-border)" }}
          >
            {project.image ? (
              <div className="h-36 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            ) : (
              <div
                className="h-24 flex items-center justify-center"
                style={{ background: "var(--desktop-icon-hover-bg)" }}
              >
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {project.title}
                </span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className="font-sans text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.title}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-40 hover:opacity-80 transition-opacity flex-shrink-0"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <p
                className="font-sans text-xs leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] px-2 py-0.5 rounded"
                    style={{
                      background: "var(--desktop-icon-hover-bg)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
