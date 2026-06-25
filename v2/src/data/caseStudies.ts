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
  | { type: "image"; src: string; alt?: string; caption?: string; fullBleed?: boolean; wide?: boolean; fit?: "cover" | "contain" | "natural"; aspect?: string }
  | { type: "imagePair"; fit?: "cover" | "contain" | "natural"; items: { src: string; label?: string; caption?: string; alt?: string; fit?: "cover" | "contain" | "natural" }[] }
  | { type: "objectives"; items: { emoji: string; label: string; sub: string }[] }
  | { type: "statPills"; items: { value: string; label?: string }[] }
  | { type: "list"; marker?: "x" | "check" | "dot"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "metricCards"; items: { value: string; label: string; sub?: string }[] }
  | { type: "carousel"; items: { src: string; alt?: string; caption?: string; label?: string }[]; aspect?: string }
  | { type: "conceptTabs"; items: { label: string; tabLabel?: string; description?: string; src: string; alt?: string }[] }
  | { type: "painPoints"; screenshot?: string; screenshotMobile?: string; screenshotAlt?: string; items: string[] }
  | { type: "phoneFlow"; heading?: string; description?: string; mobileImage?: string; mobileAlt?: string; items: { label: string; description?: string; src: string; alt?: string }[] };

export interface CaseSection {
  /* URL-fragment-safe id used as the anchor target and TOC link */
  id: string;
  /* Short label shown in the sticky TOC */
  label: string;
  /* Optional mono eyebrow rendered above the heading (e.g. "01 / 06") */
  eyebrow?: string;
  /* Main section heading */
  heading: string;
  /* Optional note shown to the right of the section heading in a two-column layout */
  sideNote?: string;
  /* "outsourced" adds a visual treatment indicating the work was done by a third party */
  variant?: "outsourced";
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
  /* Multiple cover images — renders as a carousel in the Hero. Falls back
     to the single `cover` image when absent. */
  coverCarousel?: string[];
  /* Personal closing section rendered after all body sections. */
  conclusion?: {
    quote: string;
    body?: string;
    signoff?: string;
  };
  /* When true, the gallery card links directly to `url` (opens in a new
     tab) and no internal /case/[id] page is generated. Use for cases
     hosted off-platform (Behance, Dribbble, etc.). */
  external?: boolean;
  /* When `false`, hides this case from the home page gallery — still shown
     on /work and still reachable at /case/[id]. Default: true. */
  homeGallery?: boolean;
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
    year: "2025",
    role: "UX Strategy, Web Design, Brand Art Direction",
    deliverables: "Website Redesign, Shopify, Brand Art Direction",
    tagline: "Coffee worth the ritual.",
    cover: "/covers/talitha.png",
    accent: "#C8956C",
    size: "large",
    metrics: [
      { label: "Monthly traffic lift", value: "+128%" },
      { label: "Branded search growth", value: "+64%" },
      { label: "Conversion rate", value: "~3.7%" },
      { label: "Café order value lift", value: "+33%" },
    ],
    overview:
      "Talitha Coffee (formerly The WestBean Coffee Roasters) is a San Diego coffee brand — three cafés, a roastery, and a mission to end human trafficking. When they came in mid-rebrand, the site read like a generic ecommerce store. We rebuilt it to lead with the cafés, the community, and the mission.",
    challenge:
      "The site had forgotten it had cafés — all product grid, no hours, menus, or locations. With 72.4% of customers having visited only once, the real lever was local loyalty, not more national reach.",
    tags: ["Brand Art Direction", "Web Design", "Shopify", "UX Strategy"],
    images: [],
    url: "/case/talitha",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        heading: "The work at a glance.",
        blocks: [
          {
            type: "p",
            text: "Talitha (formerly The WestBean Coffee Roasters) is a San Diego coffee brand — three cafés, a roastery, and a mission to end human trafficking. The name means 'little girl, arise.' When I came in, they were spending like a national ecommerce brand on a budget that couldn't carry it. My job: pull all that digital energy back home to San Diego and make the website feel like the local café it actually is.",
          },
          {
            type: "metricCards",
            items: [
              { value: "+128%", label: "Website traffic", sub: "1,567 → 3,569 sessions/month." },
              { value: "+64%", label: "Branded search", sub: "More San Diegans searching Talitha by name." },
              { value: "~3.7%", label: "Conversion rate", sub: "Held steady through the full redesign." },
              { value: "+33%", label: "Café order value", sub: "Lift across all three café locations." },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "A brand mid-rebrand.",
        blocks: [
          {
            type: "p",
            text: "Talitha was moving from 'The WestBean' to a new identity without losing the regulars — while running on a local budget that didn't match the national ambitions of the previous strategy. The website reflected the confusion: it looked like a DTC ecommerce store and had completely forgotten that Talitha had three physical cafés in San Diego.",
          },
          {
            type: "image",
            src: placeholder("Old site — annotated pain points", "#C8956C", "16/9"),
            alt: "Annotated screenshot of the old Talitha website showing pain points",
            caption: "Fig. 01 — The old site: all product grid, no hours, menus, or locations. Built to sell nationally, not locally.",
          },
          { type: "h3", text: "Pain points" },
          {
            type: "list",
            marker: "x",
            items: [
              "Budget spread too thin — national reach on local money, nothing compounded",
              "Mid-rebrand confusion — moving from The WestBean to Talitha without a clear identity bridge",
              "Website with no café presence — no hours, no menus, no location pages",
              "Aggressive subscription intros pulled visitors in, then they bounced",
              "Generic visual identity — polished but without personality or local connection",
            ],
          },
          { type: "h3", text: "Three objectives" },
          {
            type: "objectives",
            items: [
              { emoji: "📍", label: "Go local", sub: "Pull the digital strategy back to San Diego. Make Talitha the coffee brand the city reaches for first." },
              { emoji: "☕", label: "Lead with cafés", sub: "Rebuild the site around the physical experience — menus, hours, neighborhoods, and the people behind the bar." },
              { emoji: "🌱", label: "Compound", sub: "Build local gravity that grows over time, not ad spend that evaporates." },
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research & Analysis",
        heading: "265,705 customers. One insight.",
        blocks: [
          {
            type: "p",
            text: "I dug into their café database — 265,705 customers, 757,223 transactions, and 8+ years of history. One number reframed everything: 72.4% of customers had visited only once. The whole business was running on a thin repeat base. That meant local loyalty — not more national reach — was the real lever to pull.",
          },
          {
            type: "statPills",
            items: [
              { value: "265K+", label: "customers in database" },
              { value: "757K+", label: "total transactions" },
              { value: "72.4%", label: "single-visit customers" },
              { value: "8+yrs", label: "history analyzed" },
            ],
          },
          {
            type: "image",
            src: placeholder("Customer segmentation — repeat vs. one-time visitors", "#C8956C", "16/9"),
            alt: "Chart showing customer segmentation by visit frequency",
            caption: "Fig. 02 — The core finding: 72.4% of customers had visited only once. The business needed depth, not width.",
          },
          {
            type: "p",
            text: "Locals wanted hours, menus, and directions. The site was giving them a checkout. The gap wasn't product — it was presence. Talitha needed a website that felt like walking into the Bankers Hill café, not clicking through a DTC storefront.",
          },
        ],
      },
      {
        id: "strategy",
        label: "Strategy",
        heading: "Go deep, not wide.",
        blocks: [
          {
            type: "p",
            text: "The bet: stop chasing the country, go deep on San Diego. A dollar spent building local gravity compounds — the same dollar scattered nationally just evaporates. The strategy flipped the site's hierarchy: cafés first, ecommerce second.",
          },
          {
            type: "p",
            text: "A note on attribution — there's a +571% DTC ecommerce lift floating around from this period. That's a real number, but it was driven by a separate national influencer program, not by the redesign. Where I can point to actual design impact: the café-first rebuild (+128% traffic, +64% branded search) and the in-store order value lift (+33% across all three locations).",
          },
          {
            type: "image",
            src: placeholder("Local-to-digital conversion loop — strategy diagram", "#C8956C", "16/9"),
            alt: "Strategy diagram showing the local-to-digital conversion loop",
            caption: "Fig. 03 — The flywheel: in-café experience drives local search → local search drives site visits → site visits drive return visits.",
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        heading: "Built for the neighborhood.",
        blocks: [
          {
            type: "p",
            text: "I rebuilt the site to lead with the café and the mission instead of a product grid. That meant neighborhood pages — one for Bankers Hill, one for Clairemont, one for Liberty Station. Real menus, real hours, real maps, and community photography instead of a generic shop layout. People looking for coffee near them found a destination, not a checkout flow.",
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Before — homepage", "#C8956C", "4/3"), label: "Before", caption: "Product grid homepage — ecommerce-first, café-last." },
              { src: placeholder("After — café-first homepage", "#C8956C", "4/3"), label: "After", caption: "Café-first rebuild — neighborhood, mission, community." },
            ],
          },
          { type: "h3", text: "Shop improvements" },
          {
            type: "p",
            text: "The shop still had to sell coffee nationally, so I cleaned that up without losing ground on conversion. Sticky sidebar navigation so you never lose your place between collections. Quick-add on the product cards so you can build a cart without leaving the page. Clear roast tags and certification icons to speed up decisions. And a calm, dismissible mission banner to replace the old all-caps marquee.",
          },
          {
            type: "list",
            marker: "check",
            items: [
              "Sticky sidebar nav — never lose your place between collections",
              "Quick-add on product cards — build a cart without leaving the page",
              "Roast tags and cert icons — faster decisions at the product level",
              "Calm mission banner (replaced all-caps accessibility-hostile marquee)",
              "Soft newsletter signup below shop — no popup, just context",
            ],
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Before — product grid", "#C8956C", "4/3"), label: "Before", caption: "Old product grid — no navigation, no quick-add, no hierarchy." },
              { src: placeholder("After — product grid redesign", "#C8956C", "4/3"), label: "After", caption: "Redesigned shop — sticky nav, quick-add, clear tags." },
            ],
          },
          {
            type: "statPills",
            items: [
              { value: "~3.7%", label: "conversion (steady)" },
              { value: "+33%", label: "café order value" },
              { value: "67%", label: "one-timers (down from 72.4%)" },
            ],
          },
        ],
      },
      {
        id: "brand",
        label: "Brand Identity",
        heading: "People-first storytelling.",
        blocks: [
          {
            type: "p",
            text: "The old visuals were polished but soulless. I pushed the brand toward people-first storytelling — founder interviews, barista spotlights, behind-the-scenes content, and real customer photography. The visual identity didn't change structurally, but the art direction did: warmth over precision, community over curation, story over style.",
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Old brand in context — generic, polished", "#C8956C", "4/3"), label: "Before", caption: "Old art direction — polished but impersonal." },
              { src: placeholder("New brand in context — community, warmth", "#C8956C", "4/3"), label: "After", caption: "New direction — people-first, community-rooted." },
            ],
          },
          {
            type: "p",
            text: "That identity shift fed a content engine that grew reach +343% year-over-year, and Instagram went from 2,260 to 7,569 followers (+235%). My art direction set the foundation — the social results were a team effort built on top of it.",
          },
          {
            type: "statPills",
            items: [
              { value: "+343%", label: "reach YoY" },
              { value: "+235%", label: "Instagram followers" },
              { value: "2,260 → 7,569", label: "follower growth" },
            ],
          },
          {
            type: "quote",
            text: "Leading with the cafés and the mission gave a rebranding business a face — and the in-café numbers moved because of it.",
          },
        ],
      },
    ],
    conclusion: {
      quote: "Building the local digital presence Talitha deserved was one of the most rewarding projects I've worked on. When a brand starts resonating with its community, you feel it in the numbers — and in the neighborhood.",
      body: "The redesign moved the metrics, but what stuck with me was that Talitha finally felt like the San Diego brand it always was.",
      signoff: "Thank you for reading!",
    },
  },
  {
    id: "bodybar",
    title: "Designing Ads That Sell Franchises",
    shortTitle: "BODYBAR Pilates",
    company: "Omni Common",
    year: "2026",
    role: "Lead Designer",
    deliverables: "Ad Creative, Meta, PPC, LinkedIn",
    tagline: "Ads built for investors, not just fans.",
    cover: "/covers/bodybar.png",
    accent: "#F97316",
    size: "small",
    metrics: [
      { label: "Leads generated", value: "567" },
      { label: "Google impressions", value: "276K+" },
      { label: "Organic lead qualification", value: "78–80%" },
      { label: "Only converting Meta angle", value: "Power Couples" },
    ],
    overview:
      "BODYBAR Pilates needed more than gym sign-ups — they needed qualified investors ready to open a franchise. I led the design strategy across Meta, Google, and LinkedIn: competitor benchmark, three investor personas, and componentized master designs that let the team adapt fast across every channel.",
    challenge:
      "Previous agencies pulled clicks but missed the actual goal. BODYBAR sells franchises, not memberships. The creative had to speak to investors, not fitness fans — and only one angle actually did.",
    tags: ["Ad Creative", "Meta", "PPC", "Brand Strategy"],
    images: [],
    url: "/case/bodybar",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        heading: "The work at a glance.",
        blocks: [
          {
            type: "p",
            text: "BODYBAR Pilates needed people ready to invest in opening a studio — not just more gym sign-ups. I led the design strategy that turned ad spend into qualified investor leads. Five months of campaigns, 567 leads, and — more importantly — a clear map of what actually converts.",
          },
          {
            type: "metricCards",
            items: [
              { value: "567", label: "Leads generated", sub: "Feb–Jun 2026 across all channels." },
              { value: "276K+", label: "Google impressions", sub: "$25,119 spent — Search and PMax driving qualified leads." },
              { value: "78–80%", label: "Organic qualification rate", sub: "Franchise website and organic search vs. ~23–27% from broad paid." },
              { value: "Power Couples", label: "Top-performing Meta audience", sub: "Breakout angle — 56 leads, 4 qualified investors. No other creative came close." },
            ],
          },
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        heading: "Selling franchises, not memberships.",
        blocks: [
          {
            type: "p",
            text: "BODYBAR sells Pilates franchises. The real goal isn't memberships — it's finding qualified people who want to own a studio. Previous agencies missed this. Their campaigns pulled clicks and impressions, but the leads never matched what BODYBAR was actually selling: a serious investment opportunity.",
          },
          {
            type: "p",
            text: "We needed creative that spoke to investors, not fitness fans. That meant understanding who those investors actually were before touching a single ad.",
          },
          { type: "h3", text: "What wasn't working" },
          {
            type: "list",
            marker: "x",
            items: [
              "Creative aimed at fitness enthusiasts, not franchise investors",
              "High click volume with low-quality lead qualification",
              "No clear read on which channels or angles produced serious investors",
              "No persona framework — all audiences treated the same way",
              "Ad variants rebuilt from scratch instead of componentized for speed",
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research & Personas",
        heading: "Know the investor before designing the ad.",
        blocks: [
          {
            type: "p",
            text: "Before designing anything, I built a competitor benchmark in Figma — breaking down how other fitness and franchise brands ran their ads: messaging, visuals, offers, and tone. That gave us a clear map of the category and showed where BODYBAR could stand out instead of blend in.",
          },
          {
            type: "image",
            src: placeholder("Competitor benchmark — fitness & franchise ads", "#F97316", "16/9"),
            alt: "Figma competitor benchmark board with ad breakdowns and annotations",
            caption: "Fig. 01 — Competitor audit in Figma: messaging, visual treatment, offer structure, and tone across fitness and franchise brands.",
          },
          { type: "h3", text: "Three investor personas" },
          {
            type: "p",
            text: "The research pointed to three audiences worth designing for — each with its own angle, visuals, and message.",
          },
          {
            type: "objectives",
            items: [
              { emoji: "💼", label: "White-Collar Professionals", sub: "Corporate execs looking for a meaningful business to own alongside their career." },
              { emoji: "👫", label: "Power Couples", sub: "Partners investing in a venture together — the angle that turned out to be the only one converting." },
              { emoji: "🏋️", label: "Passion Players", sub: "Fitness lovers who want to turn what they love into a business." },
            ],
          },
          {
            type: "image",
            src: placeholder("Three persona cards — White-Collar / Power Couples / Passion Players", "#F97316", "16/9"),
            alt: "Three investor persona cards with photo, traits, motivation, and ad angle",
            caption: "Fig. 02 — One persona card per investor type. Each shaped a distinct creative direction.",
          },
        ],
      },
      {
        id: "design",
        label: "Design & Production",
        heading: "Master once. Adapt everywhere.",
        blocks: [
          {
            type: "p",
            text: "With personas locked, we built content maps and one master design per angle in a single Figma file. Then componentized them — so adapting to different aspect ratios and channel specs was a matter of swapping variants, not rebuilding art from scratch.",
          },
          {
            type: "list",
            marker: "check",
            items: [
              "PPC / Google Ads — search and display placements",
              "Meta — image and video creative across all three persona angles",
              "LinkedIn — professional-audience targeting for white-collar investors",
            ],
          },
          {
            type: "imagePair",
            items: [
              { src: placeholder("Master design — Power Couples angle", "#F97316", "4/3"), label: "Master", caption: "Master design — one source of truth per persona angle." },
              { src: placeholder("Channel variants — PPC / Meta / LinkedIn", "#F97316", "4/3"), label: "Variants", caption: "Componentized variants across every channel and ratio." },
            ],
          },
          { type: "h3", text: "AI in the workflow" },
          {
            type: "p",
            text: "AI was a real force-multiplier here. It compressed the research phase — faster competitor scanning, audience synthesis, persona framing. On the production side it helped generate graphic assets and batch-export into every channel format. More time on strategy and creative judgment, less on repetitive resize work.",
          },
        ],
      },
      {
        id: "results",
        label: "Results",
        heading: "567 leads — and a roadmap.",
        blocks: [
          {
            type: "p",
            text: "567 leads across five months. But the more valuable outcome was clarity on what actually works — which angles convert, which channels qualify, and where to put the budget next.",
          },
          {
            type: "statPills",
            items: [
              { value: "567", label: "total leads" },
              { value: "4", label: "qualified from Power Couples" },
              { value: "0", label: "qualified from all other Meta creatives" },
              { value: "78–80%", label: "organic qualification rate" },
              { value: "~23–27%", label: "broad paid qualification rate" },
            ],
          },
          {
            type: "image",
            src: placeholder("Results — Power Couples vs. other Meta creatives", "#F97316", "16/9"),
            alt: "Bar chart comparing Power Couples leads vs. other creative angles",
            caption: "Fig. 03 — Power Couples was the only Meta creative producing qualified investors. Every other angle: zero.",
          },
          { type: "h3", text: "What this means" },
          {
            type: "list",
            marker: "check",
            items: [
              "Scale the Power Couples creative — it's the only Meta angle with qualified output",
              "Cut channels that bring volume but no qualified investors",
              "Double down on the franchise website and organic — 78–80% qualification vs. 23–27% from broad paid",
              "Search and Performance Max (not Display) are driving the qualified Google leads",
            ],
          },
          {
            type: "quote",
            text: "For the first time, BODYBAR's ad spend was tied directly to the goal that matters: selling more franchises.",
          },
        ],
      },
    ],
    conclusion: {
      quote: "Five months of campaigns gave us more than leads — they gave us a clear map of what converts and what doesn't. That's the kind of output that actually changes how a brand spends its next dollar.",
      body: "The Power Couples insight alone was worth the entire engagement. Good creative strategy pays for itself.",
      signoff: "Thank you for reading!",
    },
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
    coverCarousel: [
      "/case-studies/mp/cover/1.png",
      "/case-studies/mp/cover/3.png",
      "/case-studies/mp/cover/6.png",
      "/case-studies/mp/cover/9.png",
      "/case-studies/mp/cover/13.png",
      "/case-studies/mp/cover/14.png",
      "/case-studies/mp/cover/15.png",
      "/case-studies/mp/cover/18.png",
      "/case-studies/mp/cover/19.png",
      "/case-studies/mp/cover/20.png",
      "/case-studies/mp/cover/21.png",
    ],
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
            text: "MovingPlace was bleeding customers at every step of a journey people already dread. I spent eight days in research, then rebuilt the whole thing — brand, booking flow, CMS — in one go. Pricing up front, six clear steps, new cities live in hours.",
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
            text: "I joined Porch Moving Group to redesign MovingPlace — a platform stuck in the 2010s that was losing people at every step. The goal: make it trustworthy enough to win the booking on the first visit.",
          },
          {
            type: "p",
            text: "The old form asked for a wall of personal details just to get a quote — then made you wait for someone to call you back. In 2024, that's not how people expect to book anything.",
          },
          {
            type: "image",
            src: "/case-studies/mp/goals/goals-challenges.png",
            alt: "Goals and challenges overview for MovingPlace redesign",
            caption: "The 2022 experience — opaque pricing, a monolithic form, and a callback as the only path to a quote.",
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
          {
            type: "conceptTabs",
            items: [
              {
                src: "/case-studies/mp/goals/pain-points-1.png",
                alt: "Issue 01 — Pricing buried behind contact forms",
                label: "Issue 01 — Pricing last",
                tabLabel: "Issue 01",
                description: "The form collected personal details before showing any pricing. Users had no idea what they were committing to until a CSR called them back.",
              },
              {
                src: "/case-studies/mp/goals/pain-points-2.png",
                alt: "Issue 02 — Mobile experience left as an afterthought",
                label: "Issue 02 — Mobile afterthought",
                tabLabel: "Issue 02",
                description: "The mobile experience was a shrunken desktop layout — not designed for touch, not designed for someone booking from their phone mid-pack.",
              },
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
            text: "Before opening Figma, I spent eight days on research — 30+ competitors, a consumer survey, and interviews with people who'd used a full-service mover in the last six months.",
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
            src: "/case-studies/mp/research/benchmark.gif",
            alt: "Competitive benchmark board across 30+ moving services",
            caption: "30+ competitors mapped across pricing transparency, flow length, and trust signals.",
          },
          {
            type: "image",
            src: "/case-studies/mp/research/personas.png",
            alt: "Three user personas for MovingPlace",
            caption: "Three personas anchored every downstream flow decision.",
          },
          {
            type: "p",
            text: "The finding was pretty obvious in hindsight: companies that showed pricing upfront converted. Companies that hid it behind a form didn't.",
          },
        ],
      },
      {
        id: "strategy",
        label: "Strategy & Exploration",
        heading: "Map the decision tree before touching pixels.",
        blocks: [
          {
            type: "p",
            text: "Six booking journeys drafted. Three days of whiteboarding. The first thing to lock down wasn't the brand — it was the logic. What service type? What distance? What does the quote get built from?",
          },
          { type: "h3", text: "Breaking down the booking logic" },
          {
            type: "p",
            text: "Moving has three distinct jobs to do: labor-only for people handling the truck themselves, full-service for hands-off customers, and long-distance for anything past 40 miles. Each one has different questions, a different checkout path, and different risk. We mapped all three and found the branches where a single flow could handle all of them — progressive disclosure, showing complexity only when the user actually needed it.",
          },
          {
            type: "image",
            src: "/case-studies/mp/strategy/decision-tree.png",
            alt: "Full booking decision tree covering all service types and decision points",
            caption: "Full decision tree: service type → distance threshold → items → date/time → quote → confirm.",
            wide: true,
            fit: "natural",
          },
          { type: "h3", text: "The principle we kept coming back to" },
          {
            type: "p",
            text: "Pricing up front. Every draft that buried the price behind a form lost people. The winning flow puts a personalized quote in front of users as early as possible — addresses first, service type second, pricing third — so they know what they're getting into before they hand over personal details.",
          },
          {
            type: "statPills",
            items: [
              { value: "6+", label: "drafted journeys" },
              { value: "3d", label: "ideation sprint" },
            ],
          },
          { type: "h3", text: "Two brand directions" },
          {
            type: "p",
            text: "With the flow locked, we explored two directions for the brand to wrap around it.",
          },
          {
            type: "conceptTabs",
            items: [
              {
                src: "/case-studies/mp/strategy/concept-a.webp",
                alt: "Concept A — HireAHelper spin-off brand direction",
                label: "Concept A — HireAHelper Spin-off",
                description: "Inherits visual cues from the parent brand — familiar positioning, recognizable palette. A safe starting point.",
              },
              {
                src: "/case-studies/mp/strategy/concept-b.avif",
                alt: "Concept B — New minimalist brand direction, winner",
                label: "Concept B — New Minimalist Brand ✓",
                description: "Neutral palette, type-forward identity, stood completely on its own. Tested as more trustworthy and let MovingPlace build its own reputation.",
              },
            ],
          },
        ],
      },
      {
        id: "brand",
        label: "Brand Identity",
        variant: "outsourced",
        heading: "A new MovingPlace was born.",
        blocks: [
          {
            type: "p",
            text: "Leadership made the call to outsource the rebrand to a specialized agency — which paused our UI work while they ran consumer research, explored concepts, and finalized the identity. The vibrant yellow palette, the logotype, the motion language — all came from that process.",
          },
          {
            type: "carousel",
            aspect: "3/2",
            items: [
              { src: "/case-studies/mp/brand/1.avif", alt: "MovingPlace brand identity overview", caption: "Brand overview" },
              { src: "/case-studies/mp/brand/2.avif", alt: "MovingPlace logotype variants", caption: "Logotype" },
              { src: "/case-studies/mp/brand/3.avif", alt: "MovingPlace color palette", caption: "Color palette" },
              { src: "/case-studies/mp/brand/4.avif", alt: "MovingPlace typography system", caption: "Typography" },
              { src: "/case-studies/mp/brand/5.avif", alt: "MovingPlace motion and icons", caption: "Motion & icons" },
            ],
          },
        ],
      },
      {
        id: "platform",
        label: "Platform Identity",
        heading: "Built to be trusted on first impression.",
        blocks: [
          {
            type: "p",
            text: "While designing the booking flow, I collaborated closely with the marketing and product teams to elevate every aspect of the website's UI and UX — homepage, blog, geo-targeted landing pages, and various subcomponents — all scalable and ready to plug into the CMS.",
          },
          {
            type: "p",
            text: "With the brand book finalized, we filled the pre-designed templates with the new tokens and assets. The outcome was a modern, cohesive experience tailored to the target customer: trustworthy on first impression, clear on what MovingPlace delivers.",
          },
          {
            type: "image",
            src: "/case-studies/mp/platform-new-home.webp",
            alt: "MovingPlace new homepage with brand identity applied",
            wide: true,
            caption: "Homepage — brand tokens applied to the primary booking entry point.",
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        heading: "Enhancing the Booking Flow",
        blocks: [
          {
            type: "p",
            text: "We developed and refined a new booking flow, testing it with HireAHelper while MovingPlace was being prepared. Once final designs received approval, we observed its performance compared to its sister company, HAH. Both platforms now utilize the same booking funnel structure.",
          },
          {
            type: "p",
            text: "While most competitors provided a single quote after multiple steps, we aimed to deliver a more comprehensive and flexible experience by offering three distinct service tiers — Good, Better, Best. This aligned with our diverse customer personas and established our competitive differentiation.",
          },
          {
            type: "statPills",
            items: [
              { value: "22", label: "user testing insights" },
              { value: "6-step", label: "booking flow" },
              { value: "38 → 80%", label: "completion rate" },
            ],
          },
          {
            type: "phoneFlow",
            heading: "Booking Flow",
            description: "While MovingPlace and HireAHelper share some similarities in their booking funnel approach, they aren't identical. MovingPlace differentiates itself by introducing a new feature that allows users to choose from three distinct service levels.",
            mobileImage: "/case-studies/mp/ux/17.png",
            mobileAlt: "MovingPlace booking flow — all 8 steps from Home Page through Confirmation",
            items: [
              { label: "Home Page", description: "Provide your moving locations and your preferred date for the move.", src: "/case-studies/mp/ux/1.png", alt: "MovingPlace home page screen" },
              { label: "Moving Details", description: "Tailor the size of your move to ensure we can deliver the best results for you.", src: "/case-studies/mp/ux/2.png", alt: "Moving details form screen" },
              { label: "Heavy Items", description: "Do you have heavy items to move? Just let us know your specific requirements.", src: "/case-studies/mp/ux/3.png", alt: "Heavy items selection screen" },
              { label: "Select Service Plan", description: "Select from 3 different levels of experience according to your budget.", src: "/case-studies/mp/ux/4.avif", alt: "Service plan selection screen" },
              { label: "Get Quote", description: "Get multiple quotes and compare different providers to customize your experience.", src: "/case-studies/mp/ux/5.png", alt: "Quote comparison screen" },
              { label: "Time & Contact", description: "You're almost there! Select your arrival time and provide your contact information.", src: "/case-studies/mp/ux/6.png", alt: "Time and contact details screen" },
              { label: "Checkout", description: "Please add a payment method to complete your move.", src: "/case-studies/mp/ux/7.png", alt: "Checkout payment screen" },
              { label: "Confirmation", description: "Hire efficient, friendly movers to pack, load, unload, or rearrange your space on time.", src: "/case-studies/mp/ux/8.png", alt: "Booking confirmation screen" },
            ],
          },
          {
            type: "p",
            text: "Completion rate went from 38% to 80% in the first month. But the number I actually cared about was the 40% drop in 'how does this work' support tickets.",
          },
          { type: "h3", text: "Testing how to customize a quote" },
          {
            type: "p",
            text: "Tested two customization patterns: a modal that kept things compact but hid options behind a click, and an inline editor that put everything in context. The inline version won — higher confidence scores and more completed quotes.",
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
            text: "Launching in a new city used to take weeks. With a Tailwind-based component library, we got it down to hours.",
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
            text: "Every landing page now pulls from the same library. New patterns earn their spot by getting used at least twice — anything below that lives in the sandbox. The discipline isn't building the system, it's knowing what to cut.",
          },
        ],
      },
    ],
    conclusion: {
      quote: "The work shown here is a snapshot of what we built at Porch Moving Group — the booking flow, brand system, and CMS framework — developed during my time there before I departed in 2024.",
      body: "Since then, MovingPlace has evolved under new management and taken a different direction. What you see here reflects the design decisions, tradeoffs, and systems I was responsible for during that era. I'm proud of what the team shipped.",
      signoff: "Rodrigo Martínez — Porch Moving Group, 2022–2024",
    },
  },
  {
    id: "pp",
    homeGallery: false,
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
            text: "A 22-field wall of a form, cut down to five focused steps. Completion went from 38% to 80% in the first month — and the support queue got a lot quieter.",
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
            text: "PermitPuller has been securing moving permits across US cities since 2004 — but the platform hadn't kept pace. A 22-field single-page form, zero progress feedback, and complete silence after you hit submit. A necessary service that felt like punishment.",
          },
          {
            type: "p",
            text: "Submit your request, then just… wait. No confirmation, no timeline, no status. The mandate was simple: replace silence with clarity.",
          },
          {
            type: "image",
            src: "/case-studies/pp-01.png",
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
            text: "Most permit services were still running on phone calls and email chains. But indirect competitors like HomeAdvisor had already cracked the step-by-step flow — and it worked.",
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
            src: "/case-studies/pp-02.png",
            alt: "Competitor analysis board for permit and booking services",
            caption: "Fig. 02 — Mapping direct and indirect competitors surfaced the step-by-step flow as the clear benchmark.",
          },
          {
            type: "p",
            text: "The real issue wasn't the form. It was the silence after. People needed to know their request was in motion — not just that they'd clicked submit.",
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
            text: "Three things to fix before touching a wireframe: refresh the brand, restructure the flow, and make a bureaucratic process feel like something a real person designed.",
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
            text: "Location → Permit Type → Timeline → Add-ons → Checkout. One decision per screen. Pricing visible throughout, and a progress bar so you always know where you are.",
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
            text: "Five steps instead of one wall. Each screen asks only what's needed right now — fewer errors, less confusion, and a completion rate that nearly doubled.",
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
            src: "/case-studies/pp-03.png",
            alt: "Five-step PermitPuller booking flow",
            caption: "Fig. 03 — Location → Permit Type → Timeline → Add-ons → Checkout. One decision per screen.",
          },
          { type: "h3", text: "Dashboard & status updates" },
          {
            type: "p",
            text: "The post-submit experience got as much attention as the form. A status dashboard with real-time visibility, paired with SMS and email at each milestone. That alone cut 'where's my permit?' support tickets by 40%.",
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
            text: "We updated the visual identity in parallel — modern illustrations, a new logo, a color system that projects confidence without going corporate. It should feel like someone who cares made it.",
          },
        ],
      },
    ],
    conclusion: {
      quote: "PermitPuller proved that even the most bureaucratic process can be made intuitive. The 5-step flow didn't just reduce support queries — it changed how the team thought about what quality product looks like.",
      body: "Designing for clarity inside a system this complex was a challenge I'd take on again without hesitation.",
      signoff: "Thank you for reading!",
    },
  },
  {
    id: "hdmn",
    homeGallery: false,
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
            text: "Adding SMS to Hahdmin looked small on paper. Seven days of research with five CSRs showed the real scope: every agent had built their own workaround, and none of it lived in the system. One fix changed how the whole team worked.",
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
            text: "Agent-to-customer communication was critical — but the platform wasn't built for it. SMS in iMessage, email in Gmail, calls on the phone. Context lived in agents' heads, not the system.",
          },
          {
            type: "p",
            text: "The cost was real: slow responses, lost context, frustrated customers, managers with no visibility. Agents were burning energy just switching between apps instead of actually helping people.",
          },
          {
            type: "image",
            src: "/case-studies/hdmn-01.png",
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
            text: "Spent a week studying how agents actually communicated — not how the process diagram said they should. Interviewed all five CSRs. The goal was to map what was really happening.",
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
            src: "/case-studies/hdmn-02.png",
            alt: "Agent workflow and journey mapping research board",
            caption: "Fig. 02 — Mapping how agents actually communicated revealed a patchwork of workarounds no one had designed.",
          },
          {
            type: "p",
            text: "Every agent had a different workaround. SMS in iMessage, email in Gmail, notes copy-pasted between them. The system had no visibility into any of it — and neither did their managers.",
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
            text: "The call wasn't to build a new communications hub. It was to inject conversation into the existing workflow. The SMS modal opens from existing CTAs throughout the dashboard — no context switching, no new tab.",
          },
          { type: "h3", text: "Color-coded roles" },
          {
            type: "p",
            text: "Three participants, three color threads: customer, mover, agent. Multiple conversations open at once, and you always know who said what.",
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
            text: "Plus a native notification system — messages come to Hahdmin, agents don't go looking for them.",
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
            text: "Lo-fi testing covered three modal configs: slide-over panel, floating overlay, inline expansion. The slide-over won — full dashboard still visible, conversation right in front of you.",
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
            src: "/case-studies/hdmn-03.png",
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
            text: "A badge on an existing element doesn't sound like much. But the right notification at the right moment changed how the whole team worked — and how customers experienced the booking.",
          },
          {
            type: "quote",
            text: "What seems like a 'small' addition can have a huge impact when paired with the right logic and context.",
          },
        ],
      },
    ],
    conclusion: {
      quote: "Hahdmin started as a tooling fix and became a lesson in how the right communication layer can change a team's entire pace. One modal, properly placed, rerouted how agents handled their whole day.",
      body: "Sometimes the highest-impact design is the one that fits so naturally into the existing workflow that people forget it wasn't always there.",
      signoff: "Thank you for reading!",
    },
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
