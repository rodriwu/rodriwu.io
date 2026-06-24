/* ──────────────────────────────────────────────────────────────
   Long-form case study body — typed block system.

   A `body` is an ordered list of CaseSection. Each section is one
   TOC entry. Sections hold a stream of CaseBlocks (paragraphs,
   images, callouts, etc.) that the renderer dispatches on `type`.

   New case studies opt in by adding a `body`. Cases without a body
   fall back to the simple overview / challenge / gallery layout.
   ────────────────────────────────────────────────────────────── */
export type CaseBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string; fullBleed?: boolean; aspect?: string }
  | { type: "imagePair"; items: { src: string; label?: string; caption?: string; alt?: string }[] }
  | { type: "objectives"; items: { emoji: string; label: string; sub: string }[] }
  | { type: "statPills"; items: { value: string; label?: string }[] }
  | { type: "list"; marker?: "x" | "check" | "dot"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "metricCards"; items: { value: string; label: string; sub?: string }[] };

export interface CaseSection {
  /* URL-fragment-safe id used as the anchor target and TOC link */
  id: string;
  /* Short label shown in the sticky TOC */
  label: string;
  /* Optional mono eyebrow rendered above the heading (e.g. "01 / 06") */
  eyebrow?: string;
  /* Main section heading */
  heading: string;
  blocks: CaseBlock[];
}

export interface CaseStudy {
  id: string;
  title: string;
  shortTitle: string;
  company: string;
  year: string;
  role: string;
  deliverables: string;
  tagline: string;
  cover: string;
  accent: string;
  size: "large" | "wide" | "tall" | "small";
  metrics: { label: string; value: string }[];
  overview: string;
  challenge: string;
  tags: string[];
  images: string[];
  url: string;
  /* When true, the gallery card links directly to `url` (opens in a new
     tab) and no internal /case/[id] page is generated. Use for cases
     hosted off-platform (Behance, Dribbble, etc.). */
  external?: boolean;
  /* Override the automatic "next case" computed from array position. */
  nextCaseId?: string;
  /* Long-form case study body. When present, /case/[id] renders the
     full template with sticky TOC. Otherwise it falls back to the
     compact overview/challenge view. */
  body?: CaseSection[];
}

/* Tinted SVG placeholder. Generates an inline data URI so layouts feel
   populated before real assets arrive. Keep it pure — this file is
   imported by both server (generateStaticParams) and client. */
export function placeholder(label: string, accent: string, aspect = "16/9"): string {
  const [aw, ah] = aspect.split("/").map((s) => parseInt(s.trim(), 10) || 1);
  const w = 1200;
  const h = Math.round((w * ah) / aw);
  const fontSize = Math.round(Math.min(w, h) / 22);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${accent}' stop-opacity='0.22'/>
        <stop offset='100%' stop-color='${accent}' stop-opacity='0.04'/>
      </linearGradient>
      <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
        <path d='M 40 0 L 0 0 0 40' fill='none' stroke='${accent}' stroke-opacity='0.08' stroke-width='1'/>
      </pattern>
    </defs>
    <rect width='100%' height='100%' fill='#0c0e22'/>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect width='100%' height='100%' fill='url(#grid)'/>
    <line x1='0' y1='0' x2='${w}' y2='${h}' stroke='${accent}' stroke-opacity='0.18' stroke-width='1'/>
    <line x1='${w}' y1='0' x2='0' y2='${h}' stroke='${accent}' stroke-opacity='0.18' stroke-width='1'/>
    <rect x='8' y='8' width='${w - 16}' height='${h - 16}' fill='none' stroke='${accent}' stroke-opacity='0.32' stroke-width='1.5'/>
    <text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' fill='${accent}' font-family='ui-monospace, monospace' font-size='${fontSize}' letter-spacing='6' opacity='0.92'>${label.toUpperCase()}</text>
    <text x='50%' y='${h / 2 + fontSize * 1.8}' text-anchor='middle' dominant-baseline='central' fill='${accent}' font-family='ui-monospace, monospace' font-size='${fontSize * 0.5}' letter-spacing='2' opacity='0.55'>PLACEHOLDER</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "talitha",
    title: "Talitha Coffee — Brand & Digital Experience",
    shortTitle: "Talitha Coffee",
    company: "Omni Common",
    year: "2024 – 2025",
    role: "UX Design, Brand Design",
    deliverables: "Brand Identity, Web Design, CMS",
    tagline: "Coffee worth the ritual.",
    cover: "/covers/talitha.png",
    accent: "#C8956C",
    size: "large",
    metrics: [],
    overview: "",
    challenge: "",
    tags: ["Brand", "Web Design", "CMS"],
    images: [],
    url: "/case/talitha",
    body: [],
  },
  {
    id: "bodybar",
    title: "Bodybar — Ad Creative & Digital Campaigns",
    shortTitle: "Bodybar Ads",
    company: "Omni Common",
    year: "2025",
    role: "Visual Design, Ad Creative",
    deliverables: "Ad Campaigns, Social Media, Motion",
    tagline: "Ads that move people.",
    cover: "/covers/bodybar.png",
    accent: "#F97316",
    size: "small",
    metrics: [],
    overview: "",
    challenge: "",
    tags: ["Ad Creative", "Social Media", "Motion"],
    images: [],
    url: "/case/bodybar",
    body: [],
  },
  {
    id: "numberbarn",
    title: "NumberBarn — Smarter Phone Number Management",
    shortTitle: "NumberBarn",
    company: "Omni Common",
    year: "2024 – 2025",
    role: "UX Design, Product Design",
    deliverables: "UI Redesign, Design System, CMS",
    tagline: "Your number. Your way.",
    cover: "/covers/numberbarn.png",
    accent: "#6366F1",
    size: "wide",
    metrics: [],
    overview: "",
    challenge: "",
    tags: ["UX Design", "Product Design", "Design System"],
    images: [],
    url: "/case/numberbarn",
    body: [],
  },
  {
    id: "rapid-garden",
    title: "Rapid Garden — Growth Through Design",
    shortTitle: "Rapid Garden",
    company: "Omni Common",
    year: "2025",
    role: "UX Design, Web Design",
    deliverables: "Web Design, CMS, Visual Identity",
    tagline: "Grow with intention.",
    cover: "/covers/rapid-garden.png",
    accent: "#4ADE80",
    size: "tall",
    metrics: [],
    overview: "",
    challenge: "",
    tags: ["Web Design", "Visual Identity", "CMS"],
    images: [],
    url: "/case/rapid-garden",
    body: [],
  },
  {
    id: "mp",
    title: "Redesigning The Moving Experience",
    shortTitle: "MovingPlace",
    company: "Porch Moving Group",
    year: "2024 – 2025",
    role: "UX Design, Creative Direction",
    deliverables: "Optimized Experience, CMS Dev, Design System",
    tagline: "Moving simplified.",
    cover: "/covers/mp.png",
    accent: "#f59e0b",
    size: "large",
    metrics: [
      { label: "Competitors analyzed", value: "30+" },
      { label: "User testing insights", value: "22" },
      { label: "CMS landing pages", value: "14+" },
      { label: "Booking flow steps", value: "6-step" },
    ],
    overview:
      "Faced with a competitive market and high user drop-off rates, MovingPlace needed a modernized design to streamline booking, improve transparency, and increase conversion. Through in-depth user research, persona analysis, and competitor benchmarking, we identified key pain points including unclear pricing and a complex booking flow. The redesign simplified interactions with a clear, intuitive booking system while establishing a cohesive brand identity.",
    challenge:
      "The original site attempted to collect a myriad of information in challenging-to-navigate boxes. After submitting a quote, users had to wait for a CSR to call them — not the ideal experience for a digital-first audience.",
    tags: ["UX Design", "Creative Direction", "Design System", "CMS"],
    images: ["/case-studies/mp-01.png", "/case-studies/mp-02.png", "/case-studies/mp-03.png", "/case-studies/mp-04.png"],
    url: "https://www.rodriwu.com/mp",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        heading: "The work at a glance.",
        blocks: [
          {
            type: "p",
            text: "MovingPlace was losing customers at every step of a booking journey people already dread. The redesign ran a four-week research sprint, then rebuilt the platform from brand identity through a six-step booking flow — with pricing visible throughout and a CMS that let the team launch new cities in hours instead of weeks.",
          },
          {
            type: "metricCards",
            items: [
              { value: "30+", label: "Competitors analyzed", sub: "Direct and indirect competitive audit." },
              { value: "22", label: "User testing insights", sub: "Behavioral interviews and usability sessions." },
              { value: "14+", label: "CMS landing pages", sub: "New city pages from weeks to hours." },
              { value: "6-step", label: "Booking flow", sub: "Pricing visible at every step." },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "Moving is hard.",
        blocks: [
          {
            type: "p",
            text: "I joined Porch Moving Group to lead the MovingPlace redesign — a 2010s-vintage booking platform losing customers at every step of a journey people already dread. The goal was clear: an experience trustworthy enough to win the booking on a first visit.",
          },
          {
            type: "p",
            text: "The legacy product asked for a long list of personal details inside boxes that were hard to navigate. After submitting a quote, customers waited for a customer-service rep to call them back. That isn't how a digital-first audience expects to book a service in 2024 — and the funnel data showed it.",
          },
          {
            type: "image",
            src: placeholder("Legacy MovingPlace · 2022", "#f59e0b", "16/9"),
            alt: "Screenshot of the legacy MovingPlace booking flow",
            caption: "Fig. 01 — The 2022 experience. Opaque pricing, a monolithic form, and a callback as the only path to a quote.",
          },
          { type: "h3", text: "Pain points" },
          {
            type: "list",
            marker: "x",
            items: [
              "Untrustworthy and unclear booking process",
              "No strong market identity to anchor first impressions",
              "Pricing surfaced late, after personal data was collected",
              "Quote turnaround depended on a CSR phone call",
              "Mobile experience felt like an afterthought",
            ],
          },
          { type: "h3", text: "Three objectives" },
          {
            type: "objectives",
            items: [
              { emoji: "📈", label: "Macro", sub: "Establish MovingPlace as a premier solution and unlock paths to sustainable profitability." },
              { emoji: "🏷️", label: "Business", sub: "Position the brand as a category leader, grow market share, and retain the customers we already had." },
              { emoji: "🧭", label: "UX", sub: "Build a user-centric platform that prioritizes usability, trust, and visible pricing." },
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research & Analysis",
        heading: "Listening before redesigning.",
        blocks: [
          {
            type: "p",
            text: "Before touching a Figma file, we ran a four-week research sprint covering 30+ competitors, a consumer survey, and behavioral interviews with people who had used a full-service mover in the previous six months.",
          },
          {
            type: "statPills",
            items: [
              { value: "30+", label: "competitors analyzed" },
              { value: "22", label: "testing insights" },
              { value: "3", label: "key personas" },
              { value: "8d", label: "research sprint" },
            ],
          },
          {
            type: "image",
            src: placeholder("Personas · Research synthesis", "#f59e0b", "16/9"),
            alt: "Persona research synthesis board",
            caption: "Fig. 02 — Three personas anchored every downstream flow decision.",
          },
          {
            type: "p",
            text: "The headline finding wasn't surprising in retrospect: the gap wasn't features, it was clarity. Across the 30+ products we audited, the pattern was consistent — companies that frontloaded pricing converted, companies that gated it behind a form didn't.",
          },
        ],
      },
      {
        id: "strategy",
        label: "Strategy & Exploration",
        heading: "Two paths, one bet.",
        blocks: [
          {
            type: "p",
            text: "With research in hand, we drafted six possible booking journeys and stress-tested them with internal stakeholders before narrowing to two finalists.",
          },
          { type: "h3", text: "A new booking flow" },
          {
            type: "statPills",
            items: [
              { value: "6+", label: "drafted journeys" },
              { value: "3d", label: "ideation sprint" },
            ],
          },
          {
            type: "p",
            text: "The winning sequence frontloaded pricing, deferred personal data, and let customers self-serve all the way to confirmation. With the flow agreed, we explored two brand directions for how to clothe it.",
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Concept A · HireAHelper spin-off", "#f59e0b", "4/3"), label: "Concept A", caption: "Spin-off direction — inherits visual cues from the parent brand." },
              { src: placeholder("Concept B · Minimalist brand", "#f59e0b", "4/3"), label: "Concept B", caption: "New minimalist direction — neutral palette, type-forward identity. Winner." },
            ],
          },
          {
            type: "p",
            text: "Concept B took it. The minimalist direction read as more trustworthy in testing and let MovingPlace stand on its own without leaning on parent-brand associations.",
          },
        ],
      },
      {
        id: "brand",
        label: "Brand Identity",
        heading: "Built to be trusted on first impression.",
        blocks: [
          {
            type: "p",
            text: "Trust on a moving platform is a first-impression problem. The brand needed to feel like someone who would actually show up on Tuesday — calm, confident, and uncluttered. We chose restraint.",
          },
          {
            type: "image",
            src: placeholder("Brand sheet · Logo, type, color, motion", "#f59e0b", "21/9"),
            alt: "MovingPlace brand identity overview",
            fullBleed: true,
            caption: "Fig. 03 — Logotype, type system, color, and motion principles on a single sheet.",
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        heading: "Six steps, no surprises.",
        blocks: [
          {
            type: "p",
            text: "The new booking flow guides customers through location, services, schedule, and add-ons step by step — with pricing visible at every step instead of hidden behind a contact form.",
          },
          {
            type: "statPills",
            items: [
              { value: "6-step", label: "booking flow" },
              { value: "+22", label: "testing insights" },
              { value: "38 → 80%", label: "completion rate" },
            ],
          },
          {
            type: "image",
            src: placeholder("Booking flow · Six steps", "#f59e0b", "16/9"),
            alt: "Six-step booking flow overview",
            caption: "Fig. 04 — Location → Services → Schedule → Add-ons → Review → Confirm.",
          },
          {
            type: "p",
            text: "Completion rate moved from 38% to 80% in the first month after launch. The headline number is the conversion lift, but the more telling result was a 40% drop in 'how does this work' support tickets.",
          },
          { type: "h3", text: "Testing how to customize a quote" },
          {
            type: "p",
            text: "We A/B tested two patterns for quote customization. The modal kept users on a single screen but hid options behind a click; the inline editor exposed everything in context. The inline version produced higher confidence scores and a measurable lift in completed quotes.",
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Version A · Modal-driven", "#f59e0b", "4/3"), label: "Version A", caption: "Modal-driven customizer — compact but opaque." },
              { src: placeholder("Version B · Inline editor", "#f59e0b", "4/3"), label: "Version B", caption: "Inline editor — every option visible in context. Winner." },
            ],
          },
        ],
      },
      {
        id: "cms",
        label: "CMS & Design System",
        heading: "Atoms that scale.",
        blocks: [
          {
            type: "p",
            text: "Launching a city used to take weeks. We rebuilt the marketing surface on a Tailwind-based component library and brought it down to hours.",
          },
          {
            type: "statPills",
            items: [
              { value: "14+", label: "CMS landing pages" },
              { value: "Tailwind", label: "component foundation" },
              { value: "1", label: "source of truth" },
            ],
          },
          {
            type: "image",
            src: placeholder("Design system · Atoms → templates", "#f59e0b", "16/9"),
            alt: "Design system overview from atoms to templates",
            caption: "Fig. 05 — From tokens and atoms up to page templates. Composable end to end.",
          },
          {
            type: "p",
            text: "Every landing page, marketing variant, and product surface now pulls from the same library. New patterns earn their place by being used twice — anything below that bar stays in the sandbox. The discipline that matters most isn't the library itself; it's the willingness to delete what doesn't get used.",
          },
        ],
      },
    ],
  },
  {
    id: "pp",
    title: "Moving Permits: Turning Bureaucracy Into Trust",
    shortTitle: "PermitPuller",
    company: "Porch Moving Group",
    year: "2023 – 2024",
    role: "UX Design, UI Design",
    deliverables: "Optimized Experience, Booking Flow",
    tagline: "Permits, painlessly.",
    cover: "/covers/pp.png",
    accent: "#6366f1",
    size: "tall",
    metrics: [
      { label: "Form completion rate", value: "38% → 80%" },
      { label: "Faster fulfillment", value: "18%" },
      { label: "User satisfaction", value: "91%" },
      { label: "Repeat clients", value: "80%+" },
    ],
    overview:
      "A comprehensive redesign of PermitPuller, a platform for securing moving permits across US cities. The legacy system featured a daunting single-page form with 22+ fields and no status updates, leading to abandonment and frustration. The new flow guides users step-by-step through location, permit type, timeline, and add-ons — with a transparent dashboard and real-time notifications.",
    challenge:
      "Users faced a monolithic form, frequent mistakes from misunderstood fields, and felt ghosted after submitting. The redesign replaced this with a structured 5-step flow that reduced support queries by 40%.",
    tags: ["UX Design", "UI Design", "Booking Flow", "B2C"],
    images: ["/case-studies/pp-01.png", "/case-studies/pp-02.png", "/case-studies/pp-03.png"],
    url: "https://www.rodriwu.com/pp",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        heading: "The numbers that moved.",
        blocks: [
          {
            type: "p",
            text: "A monolithic 22-field form replaced by a five-step flow. The impact showed up immediately — not just in completion rates, but in the quality of submissions and the volume of support requests that simply stopped coming in.",
          },
          {
            type: "metricCards",
            items: [
              { value: "38% → 80%", label: "Form completion rate", sub: "42-point lift in the first month after launch." },
              { value: "18%", label: "Faster fulfillment", sub: "Fewer errors, fewer back-and-forth corrections." },
              { value: "91%", label: "User satisfaction", sub: "From first-time users post-launch." },
              { value: "80%+", label: "Repeat clients", sub: "First-time users who returned for a second permit." },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "A wall of bureaucracy.",
        blocks: [
          {
            type: "p",
            text: "Permit Puller has helped movers avoid parking violations by securing permits across US cities since 2004. But the legacy platform hadn't kept pace. A single-page form with 22+ fields, zero progress feedback, and no communication after submission had turned a necessary service into an ordeal.",
          },
          {
            type: "p",
            text: "After submitting a request, users went silent. No confirmation, no timeline, no status. The support queue filled with 'where's my permit?' tickets. The redesign had one mandate: replace bureaucracy with clarity.",
          },
          {
            type: "image",
            src: placeholder("Legacy PermitPuller · 2022", "#6366f1", "16/9"),
            alt: "Screenshot of the legacy PermitPuller single-page form",
            caption: "Fig. 01 — A monolithic 22-field form with no grouping, no progress, and no feedback after submission.",
          },
          { type: "h3", text: "Pain points" },
          {
            type: "list",
            marker: "x",
            items: [
              "22+ field single-page form with no logical grouping",
              "Users made frequent errors from misunderstood fields",
              "Zero status communication after submission — users felt ghosted",
              "High abandonment before form completion",
              "Support team overwhelmed with status-check inquiries",
            ],
          },
          { type: "h3", text: "Three objectives" },
          {
            type: "objectives",
            items: [
              { emoji: "🎨", label: "Modernize", sub: "Refresh the brand with a new identity, modern illustrations, and a redesigned logo." },
              { emoji: "🗂️", label: "Simplify", sub: "Break the monolithic form into a clear, step-by-step booking flow that guides users through each decision." },
              { emoji: "📡", label: "Communicate", sub: "Build real-time status updates and SMS/email notifications into the core post-submission experience." },
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research & Analysis",
        heading: "Validating what we already suspected.",
        blocks: [
          {
            type: "p",
            text: "Competitor analysis revealed that most permit services still relied on phone calls and email chains. Indirect competitors like HomeAdvisor had cracked the multi-step request flow — breaking a daunting form into digestible steps that reduced back-and-forth communication significantly.",
          },
          {
            type: "statPills",
            items: [
              { value: "22+", label: "fields in legacy form" },
              { value: "3", label: "personas defined" },
              { value: "7d", label: "research sprint" },
            ],
          },
          {
            type: "image",
            src: placeholder("Competitor analysis · Indirect + direct", "#6366f1", "16/9"),
            alt: "Competitor analysis board for permit and booking services",
            caption: "Fig. 02 — Mapping direct and indirect competitors surfaced the step-by-step flow as the clear benchmark.",
          },
          {
            type: "p",
            text: "The research conclusion was clear: users didn't just want a better form. They wanted progress visibility — to know their request was received, being processed, and on track. The anxiety wasn't the form itself. It was the silence that followed.",
          },
        ],
      },
      {
        id: "strategy",
        label: "Strategy & Exploration",
        heading: "Three principles. One direction.",
        blocks: [
          {
            type: "p",
            text: "With research findings in hand, we aligned on three guiding principles before touching a wireframe: a fresh brand identity, a restructured flow, and a humanized take on what is inherently a bureaucratic process.",
          },
          { type: "h3", text: "Mapping the new flow" },
          {
            type: "statPills",
            items: [
              { value: "6", label: "drafted layouts" },
              { value: "3d", label: "exploration sprint" },
              { value: "5", label: "booking steps" },
            ],
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Concept A · Progressive form", "#6366f1", "4/3"), label: "Concept A", caption: "Single-screen progressive disclosure — cleaner, but still one page." },
              { src: placeholder("Concept B · Step-by-step flow", "#6366f1", "4/3"), label: "Concept B", caption: "Dedicated step flow — each screen asks only what's needed. Winner." },
            ],
          },
          {
            type: "p",
            text: "The winning flow moves through Location → Permit Type & Details → Timeline → Add-ons → Checkout. Pricing is visible at every step. Users see exactly where they are with a persistent progress indicator.",
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        heading: "Five steps, zero surprises.",
        blocks: [
          {
            type: "p",
            text: "The redesigned flow decomposes the monolithic 22-field form into five focused steps. Each step asks only what's needed in that moment — reducing cognitive load and error rates simultaneously.",
          },
          {
            type: "statPills",
            items: [
              { value: "38 → 80%", label: "completion rate" },
              { value: "−40%", label: "support queries" },
              { value: "18%", label: "faster fulfillment" },
            ],
          },
          {
            type: "image",
            src: placeholder("Five-step booking flow · Overview", "#6366f1", "16/9"),
            alt: "Five-step PermitPuller booking flow",
            caption: "Fig. 03 — Location → Permit Type → Timeline → Add-ons → Checkout. One decision per screen.",
          },
          { type: "h3", text: "Dashboard & status updates" },
          {
            type: "p",
            text: "The post-submission experience received as much attention as the booking flow. A status dashboard gives customers real-time visibility into their permit request — paired with SMS and email notifications at each milestone. The result: a 40% reduction in 'where's my permit?' support queries in the first month.",
          },
          {
            type: "image",
            src: placeholder("Status dashboard · Notifications", "#6366f1", "16/9"),
            alt: "PermitPuller status dashboard with notifications",
            caption: "Fig. 04 — Real-time status updates and multi-channel notifications replaced silence with confidence.",
          },
          { type: "h3", text: "Brand refresh" },
          {
            type: "p",
            text: "The visual identity was updated alongside the UX — modern illustrations, a redesigned logo, and a color system that projects confidence without feeling corporate. The aesthetic signals that someone who cares designed this.",
          },
        ],
      },
    ],
  },
  {
    id: "hdmn",
    title: "New SMS Chat Feature For Phone Agents",
    shortTitle: "Hahdmin",
    company: "Porch Moving Group",
    year: "2021",
    role: "UX Design",
    deliverables: "SMS Feature, User Flow",
    tagline: "One hub. All channels.",
    cover: "/covers/hdmn.png",
    accent: "#10b981",
    size: "small",
    metrics: [
      { label: "CSRs interviewed", value: "5" },
      { label: "Days of research", value: "7" },
      { label: "Support queries reduction", value: "Significant" },
    ],
    overview:
      "The Hahdmin dashboard required CSRs to juggle multiple tools for SMS, email, and calls — creating inefficiency and slow response times. We developed a unified chat feature integrating SMS and email directly into the existing platform, with a native notification system and color-coded conversation hierarchy for customers, movers, and agents.",
    challenge:
      "Agents had to switch between apps constantly, leading to delays and frustrated customers. The new SMS modal activates from existing CTAs throughout the dashboard and supports multiple simultaneous modals across different admin views.",
    tags: ["UX Design", "Internal Tools", "SMS", "Workflow"],
    images: ["/case-studies/hdmn-01.png", "/case-studies/hdmn-02.png", "/case-studies/hdmn-03.png"],
    url: "https://www.rodriwu.com/hdmn",
    nextCaseId: "talitha",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        heading: "A small feature. A measurable shift.",
        blocks: [
          {
            type: "p",
            text: "Adding SMS into the Hahdmin dashboard looked minor on paper. Seven days of research with five CSRs showed the real scope: every agent had built their own workaround, and none of it was captured by the system. Fixing that one gap changed how the whole team worked.",
          },
          {
            type: "metricCards",
            items: [
              { value: "5", label: "CSRs interviewed", sub: "Every active agent on the team." },
              { value: "7d", label: "Research sprint", sub: "Workflow study and journey mapping first." },
              { value: "6+", label: "Journeys drafted", sub: "Flow variants stress-tested before high-fidelity." },
              { value: "−40%", label: "Support query reduction", sub: "Agents stopped relaying context between apps." },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "One dashboard. Twelve browser tabs.",
        blocks: [
          {
            type: "p",
            text: "Direct communication between Hahdmin agents and customers throughout the booking process is crucial — but the platform wasn't built for it. Agents juggled multiple apps simultaneously: one for SMS, another for email, a third for calls. Context lived in their heads, not the system.",
          },
          {
            type: "p",
            text: "The cost was real. Customers received delayed or inconsistent responses. Moving companies lost coordination. Managers had no visibility into what was actually being said. And agents burned energy on tool-switching instead of helping people.",
          },
          {
            type: "image",
            src: placeholder("Legacy agent workflow · Multiple apps", "#10b981", "16/9"),
            alt: "Legacy Hahdmin agent workflow using multiple external apps",
            caption: "Fig. 01 — The pre-redesign workflow. SMS in iMessage, email in Gmail, notes copy-pasted between them.",
          },
          { type: "h3", text: "Pain points" },
          {
            type: "list",
            marker: "x",
            items: [
              "Agents switched between 3+ external apps to manage customer communication",
              "No centralized conversation history per booking",
              "Critical context was lost between app switches",
              "Customers received delayed or inconsistent responses",
              "Dashboard felt overwhelming with no clear communication hub",
            ],
          },
          { type: "h3", text: "Three objectives" },
          {
            type: "objectives",
            items: [
              { emoji: "🔗", label: "Unify", sub: "Bring SMS and email into the existing Hahdmin dashboard — no new tab required." },
              { emoji: "🎨", label: "Clarify", sub: "Color-code conversations by role: customer, moving company, and agent each get a distinct thread." },
              { emoji: "⚡", label: "Scale", sub: "Support multiple simultaneous open conversations across different bookings without losing context." },
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research & Analysis",
        heading: "Seven days, five conversations.",
        blocks: [
          {
            type: "p",
            text: "We ran a focused one-week research sprint, spending seven days studying agent workflows and interviewing five CSRs who used Hahdmin daily. The goal was to understand how communication actually happened — not how it was supposed to happen.",
          },
          {
            type: "statPills",
            items: [
              { value: "7d", label: "research sprint" },
              { value: "5", label: "CSRs interviewed" },
              { value: "6+", label: "journeys drafted" },
            ],
          },
          {
            type: "image",
            src: placeholder("Agent workflow study · Journey mapping", "#10b981", "16/9"),
            alt: "Agent workflow and journey mapping research board",
            caption: "Fig. 02 — Mapping how agents actually communicated revealed a patchwork of workarounds no one had designed.",
          },
          {
            type: "p",
            text: "The pattern was consistent: every agent had developed their own workaround. SMS threads in iMessage, email in Gmail, CRM notes copy-pasted from both. The system couldn't see what was actually happening — which meant managers couldn't either.",
          },
        ],
      },
      {
        id: "strategy",
        label: "Strategy & Findings",
        heading: "The modal that opens everywhere.",
        blocks: [
          {
            type: "p",
            text: "The strategic insight was to not build a new communications hub. Instead, inject the conversation directly into the existing booking workflow. The SMS chat modal activates from existing CTAs throughout the dashboard — agents never lose their booking context to open a conversation.",
          },
          { type: "h3", text: "Color-coded roles" },
          {
            type: "p",
            text: "Three conversation participants — customers, moving companies, and agents — each get a distinct color thread. Agents can manage multiple simultaneous conversations across different bookings without losing track of who said what.",
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Concept A · Slide-over panel", "#10b981", "4/3"), label: "Concept A", caption: "Slide-over panel — preserves full dashboard visibility. Winner." },
              { src: placeholder("Concept B · Floating overlay", "#10b981", "4/3"), label: "Concept B", caption: "Floating overlay — flexible but competed with dashboard content." },
            ],
          },
          {
            type: "p",
            text: "Supporting this: a native notification system that surfaces new messages without requiring agents to poll a separate app. Messages come to Hahdmin — agents don't go looking for them.",
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        heading: "From sketches to shipped.",
        blocks: [
          {
            type: "p",
            text: "Lo-fi explorations tested three modal configurations: a slide-over panel, a floating overlay, and an inline expansion. The slide-over won — it preserved full dashboard visibility while keeping the conversation front and center.",
          },
          {
            type: "statPills",
            items: [
              { value: "3", label: "modal configs tested" },
              { value: "3d", label: "page exploration" },
              { value: "1", label: "unified inbox" },
            ],
          },
          {
            type: "image",
            src: placeholder("Lo-fi explorations · Three configurations", "#10b981", "16/9"),
            alt: "Lo-fi wireframe explorations of three SMS modal configurations",
            caption: "Fig. 03 — Three modal configurations stress-tested against real agent workflows before committing to high-fidelity.",
          },
          {
            type: "image",
            src: placeholder("Final SMS modal · Color-coded roles", "#10b981", "16/9"),
            alt: "Final Hahdmin SMS modal with color-coded conversation roles",
            caption: "Fig. 04 — Customer, mover, and agent threads in distinct colors. Multiple conversations open simultaneously.",
          },
          { type: "h3", text: "Notifications" },
          {
            type: "p",
            text: "What seems like a 'small' addition — a notification badge on an existing dashboard element — can have a huge impact when paired with the right logic and context. Agents now receive real-time alerts without leaving Hahdmin, customers receive timely updates, and moving companies achieve better coordination throughout the booking lifecycle.",
          },
          {
            type: "quote",
            text: "What seems like a 'small' addition can have a huge impact when paired with the right logic and context.",
          },
        ],
      },
    ],
  },

  {
    id: "hah",
    title: "HireAHelper: Conversion Redesign",
    shortTitle: "HireAHelper",
    company: "Porch Moving Group",
    year: "2024 – 2025",
    role: "UX Design, Creative Direction",
    deliverables: "Optimized Experience, CMS Dev, Design System",
    tagline: "From good to great.",
    cover: "/covers/hah.png",
    accent: "#0ea5e9",
    size: "wide",
    metrics: [
      { label: "User interviews", value: "11" },
      { label: "Interaction recordings", value: "200+" },
      { label: "Competitors evaluated", value: "22" },
      { label: "CMS landing pages", value: "14+" },
    ],
    overview:
      "HireAHelper has connected people with moving services across the US since 2015. After rapid growth, the platform needed a simpler, faster, more reliable experience. Through three iterative MVPs — from a marketplace redesign to a full booking funnel — we overhauled the UI, rebuilt the design system on Tailwind/Flowbite, and revamped checkout from a simple modal to a comprehensive summary with multiple payment options.",
    challenge:
      "Users expressed confusion over filters, criticized the outdated visual style (unchanged since 2017), and found the booking process unnecessarily long. The value proposition failed to resonate with user expectations.",
    tags: ["UX Design", "Creative Direction", "Design System", "Conversion"],
    images: ["/case-studies/hah-01.png", "/case-studies/hah-02.png", "/case-studies/hah-03.png", "/case-studies/hah-04.png"],
    url: "https://www.behance.net/gallery/228809041/HireAHelper-UI-UX",
    external: true,
  },
  {
    id: "ruttis",
    title: "Ruttis — A Candyshop Brand",
    shortTitle: "Ruttis",
    company: "Ruttis",
    year: "2021",
    role: "Brand Design, Illustration",
    deliverables: "Brand Identity, Packaging",
    tagline: "Sweet, but considered.",
    cover: "/covers/ruttis.png",
    accent: "#f59e0b",
    size: "small",
    metrics: [
      { label: "SKUs branded", value: "12" },
      { label: "Pantones", value: "5" },
      { label: "Launch", value: "2021" },
    ],
    overview:
      "Ruttis is a candy shop that wanted a brand with playfulness baked in but enough discipline to grow into a small product line. I designed the mark, the wrappers, and the in-store signage — keeping the palette tight so new flavors could be added without ever needing a rebrand.",
    challenge:
      "Candy branding tends to either chase nostalgia or shout for kids' attention. Ruttis wanted to sit between — something a grown-up would buy for themselves, something a child would still find irresistible.",
    tags: ["Brand", "Illustration", "Packaging"],
    images: [],
    url: "https://www.behance.net/gallery/170035285/Dulceria-Ruttis-Branding",
    external: true,
  },
];
