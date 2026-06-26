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
  | { type: "h3"; text: string; mt?: number }
  | { type: "image"; src: string; alt?: string; caption?: string; fullBleed?: boolean; wide?: boolean; fit?: "cover" | "contain" | "natural"; aspect?: string; frame?: string; frameBleed?: boolean }
  | { type: "imagePair"; fit?: "cover" | "contain" | "natural"; items: { src: string; label?: string; caption?: string; alt?: string; fit?: "cover" | "contain" | "natural" }[] }
  | { type: "objectives"; items: { emoji: string; label: string; sub: string }[] }
  | { type: "statPills"; items: { value: string; label?: string }[] }
  | { type: "list"; marker?: "x" | "check" | "dot"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "metricCards"; items: { value: string; label: string; sub?: string }[] }
  | { type: "carousel"; items: { src: string; alt?: string; caption?: string; label?: string }[]; aspect?: string }
  | { type: "ticker"; items: { src: string; alt?: string }[]; aspect?: string; speed?: number; cardWidth?: number }
  | { type: "conceptTabs"; items: { label: string; tabLabel?: string; description?: string; src: string; alt?: string; winner?: boolean }[] }
  | { type: "sectionBreak"; src: string; alt?: string; caption?: string }
  | { type: "painPoints"; screenshot?: string; screenshotMobile?: string; screenshotAlt?: string; items: string[] }
  | { type: "phoneFlow"; heading?: string; description?: string; mobileImage?: string; mobileAlt?: string; items: { label: string; description?: string; src: string; alt?: string }[] }
  | { type: "devicePair"; desktop: { src: string; alt?: string }; mobile: { src: string; alt?: string }; caption?: string }
  | { type: "externalLink"; label: string; href: string; description?: string };

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
  /* Object-fit for the single cover image on the detail page. Defaults to
     "contain" so existing case-study covers stay letterboxed inside the
     16:9 frame. Set to "cover" when the asset is designed to bleed. */
  coverFit?: "cover" | "contain";
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
  /* When true, clicking the case anywhere (gallery, /work, next-case)
     opens an "unavailable" modal instead of navigating. Use for cases
     that aren't ready to be read yet. */
  unavailable?: boolean;
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
    year: "2024 to 2025",
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
                label: "Concept B — New Minimalist Brand",
                description: "Neutral palette, type-forward identity, stood completely on its own. Tested as more trustworthy and let MovingPlace build its own reputation.",
                winner: true,
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
            text: "Tested two customization patterns: a modal that kept things compact but hid options behind a click, and an inline editor that put everything in context. Against all odds — and against most of the team's bets — Version B, the inline editor, came out on top: higher confidence scores in testing and more completed quotes.",
          },
          {
            type: "conceptTabs",
            items: [
              {
                src: "/case-studies/mp/ux/customize-quote-a.png",
                alt: "Version A — modal-driven customizer that hid options behind a click",
                label: "Version A — Modal-driven",
                tabLabel: "Version A",
                description: "Compact layout, but customization options sat behind a modal — users had to commit to a click before they could see what they were changing.",
              },
              {
                src: "/case-studies/mp/ux/customize-quote-b.png",
                alt: "Version B — inline editor with every option visible in context (winner)",
                label: "Version B — Inline editor",
                tabLabel: "Version B",
                description: "Every option visible in context. Higher confidence scores in testing and more completed quotes — this is the version we shipped.",
                winner: true,
              },
            ],
          },
          {
            type: "p",
            text: "One thing worth calling out before moving on: the subtle differences you'll notice between the screenshots and flow examples throughout this case study aren't accidents. They reflect the rolling A/B tests that ran in between the big design changes — every time we landed on a winner, we'd test smaller variations on top of it (copy, layout, defaults, labels) to keep tightening the decision. The shipped product is the cumulative result of those micro-iterations, not any single redesign.",
          },
          {
            type: "sectionBreak",
            src: "/case-studies/mp/ux/big-break.png",
            alt: "MovingPlace booking flow — full visual recap of the redesigned UX",
          },
        ],
      },
      {
        id: "cms",
        label: "CMS & Design System",
        heading: "We designed atomic-level patterns that combine into templates.",
        blocks: [
          {
            type: "p",
            text: "Once the booking flow was locked in, we turned to the design system. Tailwind gave us a solid base — tokens and components we could reuse across the whole site, not just checkout.",
          },
          {
            type: "p",
            text: "The bigger play, though, was the front site. We'd already wireframed a stack of templates early on — city pages, state pages, service pages — all built around SEO and internal linking.",
          },
          {
            type: "statPills",
            items: [
              { value: "+14", label: "CMS level landing pages" },
              { value: "Tailwind", label: "Based Components" },
            ],
          },
          {
            type: "image",
            src: "/case-studies/mp/cms/image1.png",
            alt: "MovingPlace CMS & design system — image 1",
          },
          {
            type: "image",
            src: "/case-studies/mp/cms/image2.png",
            alt: "MovingPlace CMS & design system — image 2",
          },
          {
            type: "p",
            text: "From there we set up a flexible CMS-driven modal system so we could spin up and manage these templates without friction — something that could scale with the business.",
          },
          {
            type: "image",
            src: "/case-studies/mp/cms/image3.png",
            alt: "MovingPlace CMS & design system — image 3",
          },
          {
            type: "image",
            src: "/case-studies/mp/cms/image4.png",
            alt: "MovingPlace CMS & design system — image 4",
          },
          { type: "h3", text: "Zooming out" },
          {
            type: "p",
            text: "Across the project, the work moved through three phases — discovery, strategy, and solutions — with each stream overlapping the next. Research informed branding, branding fed wireframing, wireframing rolled into UX/UI, and the design system grew underneath all of it.",
          },
          {
            type: "image",
            src: "/case-studies/mp/timeline.png",
            alt: "MovingPlace project timeline — Discovery, Strategy, Solutions",
            caption: "Project timeline — from discovery through to the design system.",
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
    title: "Moving Permits: Turning Bureaucracy into Trust",
    shortTitle: "PermitPuller",
    company: "Porch Moving Group",
    year: "2023 to 2024",
    role: "UX Design, UI Design",
    deliverables: "Optimized Experience, Booking Flow",
    tagline: "Permits, painlessly.",
    cover: "/covers/pp.png",
    coverFit: "cover",
    accent: "#6366f1",
    size: "tall",
    metrics: [
      { label: "Faster permit fulfillment", value: "18%" },
      { label: "User satisfaction", value: "91%" },
      { label: "First-time → repeat clients", value: "80%+" },
    ],
    overview:
      "A full redesign of Permit Puller, the platform for pulling moving permits in U.S. cities. The legacy product was bleeding users at every step. We rebuilt it for clarity, trust, and speed.",
    challenge:
      "The old system was one giant form with zero feedback after submit. Users abandoned it, often.",
    tags: ["UX Design", "UI Design", "Booking Flow", "B2C"],
    images: [],
    url: "/case/pp",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        eyebrow: "Redesigning the Moving Experience",
        heading: "Moving Permits: Turning Bureaucracy into Trust.",
        blocks: [
          {
            type: "p",
            text: "Permit Puller is the platform people use to pull moving permits in cities across the U.S. By 2023 the product was losing users at every step: opaque pricing, a monolithic form, no status updates after submit.",
          },
          {
            type: "p",
            text: "We rebuilt it from the ground up. Through interviews, persona work, and competitor analysis, we mapped the real friction and designed a step-by-step flow that made the bureaucracy feel like a service.",
          },
          {
            type: "p",
            text: "The new product lifted completion rates, sped up fulfillment, and brought users back for repeat permits. Clarity, it turns out, scales.",
          },
          {
            type: "metricCards",
            items: [
              { value: "18%", label: "Faster permit fulfillment", sub: "Fewer errors, fewer corrections." },
              { value: "91%", label: "User satisfaction", sub: "Post-launch survey results." },
              { value: "80%+", label: "First-time → repeat clients", sub: "Returning for a second permit." },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "What is Permit Puller?",
        blocks: [
          {
            type: "p",
            text: "Picture this. You're finally moving into the city, ten stories up with views in every direction. You've prepped the movers, planned the timeline, and just want to get your boxes inside.",
          },
          {
            type: "p",
            text: "Moving day arrives. You head up to direct the team, then come back down to check on them. It's chaos.",
          },
          {
            type: "p",
            text: "Then you spot it: a fine for parking in a no-parking zone, tucked under the windshield wiper.",
          },
          {
            type: "p",
            text: "Permit Puller exists so that never happens. You handle the boxes. We handle the curb.",
          },
          {
            type: "image",
            src: "/case-studies/pp/goals/pp-2022.png",
            alt: "PermitPuller 2022 web experience",
            caption: "The PermitPuller experience we inherited in 2022.",
          },
          { type: "h3", text: "The challenge" },
          {
            type: "p",
            text: "The legacy system was a long, confusing form with no status updates after submit. People abandoned it constantly.",
          },
          { type: "h3", text: "Pain points" },
          {
            type: "p",
            text: "One giant form. No feedback. No trust. We ran interviews, dug through support tickets, and watched session recordings. Two problems kept showing up.",
          },
          {
            type: "list",
            marker: "x",
            items: [
              "The 📜 monolithic form caused constant mistakes: wrong permit type, missing info, unclear fields.",
              "After submit, users felt 👻 ghosted. No confirmation, no status, no idea what came next.",
            ],
          },
          {
            type: "conceptTabs",
            items: [
              {
                src: "/case-studies/pp/goals/pain-point-1.gif",
                alt: "Issue 01, monolithic single-page form",
                label: "Issue 01 · Monolithic form",
                tabLabel: "Issue 01",
                description: "Every field lived on a single page. Users picked the wrong permit type, missed required info, and abandoned partway through with no way to recover.",
              },
              {
                src: "/case-studies/pp/goals/pain-point-2.png",
                alt: "Issue 02, ghosted after submit with no status",
                label: "Issue 02 · Ghosted after submit",
                tabLabel: "Issue 02",
                description: "After submitting, users got radio silence. No confirmation, no status, no estimated turnaround. Many assumed the request never went through and re-submitted, or gave up entirely.",
              },
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research & Analysis",
        eyebrow: "Research & analysis",
        heading: "Drawing inspiration.",
        blocks: [
          {
            type: "p",
            text: "Direct competitors all leaned the same way: phone-first. Express Permits, Permit Pushers, Suncoast Permits, all funneled users into \"Contact Us\" forms and call centers.",
          },
          {
            type: "p",
            text: "That meant fragmented communication and zero transparency. Suncoast led with a phone number front and center, pushing anyone who preferred digital straight back to the dial pad.",
          },
          {
            type: "p",
            text: "Permit Place and Burnham Nationwide were comprehensive but still phone-heavy. A clear opening for a digital-native experience.",
          },
          {
            type: "ticker",
            aspect: "27/25",
            items: [
              { src: "/case-studies/pp/research/comp-1.avif", alt: "Express Permits" },
              { src: "/case-studies/pp/research/comp-2.avif", alt: "Permit Pushers" },
              { src: "/case-studies/pp/research/comp-3.avif", alt: "Suncoast Permits" },
              { src: "/case-studies/pp/research/comp-4.webp", alt: "Burnham Nationwide" },
            ],
          },
          {
            type: "p",
            text: "So we looked at Angi and Thumbtack instead. Step-by-step flows, structured intake, less back-and-forth. That was the model.",
          },
        ],
      },
      {
        id: "strategy",
        label: "Strategy & Exploration",
        eyebrow: "strategy and exploration",
        heading: "Simplify the flow. Clarify the pricing. Modernize the look.",
        blocks: [
          {
            type: "p",
            text: "Three principles guided the redesign.",
          },
          { type: "h3", text: "A fully fresh perspective" },
          {
            type: "p",
            text: "Beyond the flow, we refreshed the brand and pulled the new UI into the growing PMG Design System.",
          },
          {
            type: "p",
            text: "New voice, new illustrations, new logo.",
          },
          {
            type: "image",
            src: "/case-studies/pp/strategy/strategy.png",
            alt: "Brand refresh and layout exploration",
            caption: "Layout exploration across the new flow.",
          },
          {
            type: "image",
            src: "/case-studies/pp/strategy/confirmation.png",
            alt: "Confirmation screen exploration",
            caption: "Confirmation drafts integrated into the PMG Design System.",
          },
          {
            type: "statPills",
            items: [
              { value: "+6", label: "drafted layouts" },
              { value: "3 days", label: "devoted to page exploration" },
            ],
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        eyebrow: "ui / ux design",
        heading: "Easier, Faster, More Intuitive Permit Requests.",
        blocks: [
          { type: "h3", text: "Step 1: Location" },
          {
            type: "p",
            text: "Drop a pin on the exact spot you need the permit for. Interactive map, no address fumbling.",
          },
          {
            type: "image",
            src: "/case-studies/pp/ux/location.png",
            alt: "Step 1, location selection with interactive map",
          },
          { type: "h3", text: "Step 2 & 3: Permit Type and Details" },
          {
            type: "p",
            text: "Pick from a curated list, mostly moving permits. Each card shows the fee and the lead time up front, so coordinating with movers stays simple.",
          },
          {
            type: "carousel",
            aspect: "16/10",
            items: [
              { src: "/case-studies/pp/ux/permit.png", alt: "Permit type selection", caption: "Permit type" },
              { src: "/case-studies/pp/ux/details.png", alt: "Permit details form", caption: "Permit details" },
            ],
          },
          { type: "h3", text: "Step 3: Timeline" },
          {
            type: "p",
            text: "Pick the date and time window. The permit lines up with the move, no guessing.",
          },
          {
            type: "image",
            src: "/case-studies/pp/ux/date.png",
            alt: "Step 3, timeline selection",
          },
          { type: "h3", text: "Step 4: Add-ons" },
          {
            type: "p",
            text: "A real differentiator. \"Verified Site Review\" checks compliance before the move. \"Permit Signage Removal\" handles posting and pulling down signs.",
          },
          {
            type: "carousel",
            aspect: "16/10",
            items: [
              { src: "/case-studies/pp/ux/add-ons.png", alt: "Add-ons step, primary view", caption: "Add-ons" },
              { src: "/case-studies/pp/ux/add-ons-1.png", alt: "Add-ons step, detail view", caption: "Add-on detail" },
            ],
          },
          { type: "h3", text: "Checkout" },
          {
            type: "p",
            text: "Some permits charge upfront. Others, especially in new cities, need a quick screening first. Either way, users get a response within 24 hours with a clear next step.",
          },
          {
            type: "image",
            src: "/case-studies/pp/ux/confirmation.png",
            alt: "Checkout step",
          },
          { type: "h3", text: "A unified, modern dashboard", mt: 48 },
          {
            type: "p",
            text: "A status dashboard with real-time updates, plus SMS and email notifications. No more ghosting.",
          },
          {
            type: "sectionBreak",
            src: "/case-studies/pp/ux/dashboard.png",
            alt: "Status dashboard with real-time updates and notifications",
          },
        ],
      },
      {
        id: "accomplishments",
        label: "Accomplishments",
        eyebrow: "Accomplishments",
        heading: "Easy to follow, step-by-step data collection flow.",
        blocks: [
          { type: "h3", text: "From anxiety to trust." },
          {
            type: "p",
            text: "The work paid off.",
          },
          {
            type: "list",
            marker: "check",
            items: [
              "📈 Form completion rates climbed across the new flow",
              "🏃 Permit fulfillment got 18% faster",
              "👍 User satisfaction hit 91%",
            ],
          },
          {
            type: "image",
            src: "/case-studies/pp/accomplishments/accomplishments.avif",
            alt: "PermitPuller results, step-by-step flow recap",
          },
          {
            type: "p",
            text: "Over 80% of first-time clients came back for another permit. So we leaned in: pre-filled info, shorter flows, less friction every time. The second pull is effortless.",
          },
        ],
      },
      {
        id: "timeline",
        label: "Timeline",
        eyebrow: "Years on PermitPuller",
        heading: "Two years, one rebuild, a calmer way to pull a permit.",
        blocks: [
          {
            type: "p",
            text: "A look back: from inheriting the 2022 single-page form, through research and brand refresh, into the step-by-step flow and the status dashboard that closed the loop.",
          },
          {
            type: "image",
            src: "/case-studies/pp/timeline.png",
            alt: "PermitPuller timeline, 2022 to 2024, research, brand refresh, and step-by-step flow",
          },
        ],
      },
    ],
    conclusion: {
      quote: "The work shown here is a snapshot of what we built at Porch Moving Group: the redesigned permit flow, the brand refresh, and the status dashboard, developed during my time there before I wrapped up in 2024.",
      body: "Permit Puller is still live today at movingpermits.com, with the same step-by-step structure we shipped and only minor tweaks to the flow. We replaced silence with clarity, and turned a bureaucratic chore into something users could actually trust. Designing for clarity inside a system this complex is a challenge I'd take on again, every time.",
      signoff: "Rodrigo Martínez · Porch Moving Group, 2022 to 2024",
    },
  },
  {
    id: "hdmn",
    homeGallery: false,
    unavailable: true,
    title: "New SMS chat feature for Phone Agents",
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
      { label: "Days devoted to study", value: "7" },
      { label: "Journeys drafted", value: "+6" },
    ],
    overview:
      "Direct communication between Hahdmin Agents and customers throughout the booking process is crucial. The Hahdmin dashboard at Porch was a fragmented platform, requiring users (Customer Service Representatives) to navigate multiple tools for chat communication. This created inefficiency, confusion, and slow response times for agents, customers, and moving companies. To address these issues, our team developed a unified chat feature that integrated SMS and email directly into the existing system.",
    challenge:
      "Phone agents (CSRs) typically coordinate customers' moves using the Hahdmin dashboard — an in-house platform built to handle the logistics of moving and communicate with Porch partners & customers. However, our previous systems lacked direct SMS integration, which made it challenging to connect and share information.",
    tags: ["UX Design", "Internal Tools", "SMS", "Workflow"],
    images: [],
    url: "/case/hdmn",
    nextCaseId: "talitha",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        eyebrow: "Redesigning the Moving Experience",
        heading: "New SMS chat feature for Phone Agents.",
        blocks: [
          {
            type: "p",
            text: "Direct communication between Hahdmin Agents and customers throughout the booking process is crucial.",
          },
          {
            type: "p",
            text: "The Hahdmin dashboard at Porch was a fragmented platform, requiring users (Customer Service Representatives) to navigate multiple tools for chat communication. This created inefficiency, confusion, and slow response times for agents, customers, and moving companies.",
          },
          {
            type: "p",
            text: "To address these issues, our team developed a unified chat feature that integrated SMS and email directly into the existing system.",
          },
          {
            type: "p",
            text: "Through user interviews, rapid prototyping, and iterative feedback, we designed an intuitive interface with color-coded roles and real-time messaging. The new solution streamlined workflows, improved clarity, and enabled faster, more seamless communication for all users.",
          },
          {
            type: "p",
            text: "As a result, agents could manage conversations efficiently, customers received timely updates, and moving companies experienced better coordination, enhancing the overall moving experience.",
          },
          {
            type: "metricCards",
            items: [
              { value: "5", label: "CSRs interviewed", sub: "Every active agent on the team." },
              { value: "7 days", label: "Devoted to a detailed study", sub: "Workflow study and journey mapping." },
              { value: "+6", label: "Drafted journeys", sub: "Flow variants stress-tested." },
              { value: "3 days", label: "Page exploration", sub: "Lo-fi exploration sprint." },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "The challenge.",
        blocks: [
          {
            type: "p",
            text: "Phone agents (CSRs) typically coordinate customers' moves using the Hahdmin dashboard — an in-house platform built to handle the logistics of moving and communicate with Porch partners & customers. However, our previous systems lacked direct SMS integration, which made it challenging to connect and share information.",
          },
          {
            type: "image",
            src: placeholder("Legacy Hahdmin workflow", "#10b981", "16/9"),
            alt: "Legacy Hahdmin agent workflow using multiple external apps",
          },
        ],
      },
      {
        id: "role",
        label: "What is Hahdmin's role?",
        heading: "What is Hahdmin's role?",
        blocks: [
          {
            type: "p",
            text: "Hahdmin offers essential infrastructure and data collection services to ensure that moves operate seamlessly. It provides comprehensive information about quotes, movers, and clients, enabling customer service representatives to efficiently manage a high volume of logistics tickets daily, including delivering quotes via phone and email.",
          },
          {
            type: "p",
            text: "One crucial feature that was lacking is SMS functionality. This addition would simplify communication for everyone involved and save time by allowing parties to interact in a chat room, rather than relying on phone calls or emails.",
          },
          {
            type: "image",
            src: placeholder("Hahdmin dashboard overview", "#10b981", "16/9"),
            alt: "Hahdmin dashboard — quotes, movers, and client information",
          },
        ],
      },
      {
        id: "user-insights",
        label: "User Insights",
        eyebrow: "user insights",
        heading: "Hahdmin Agents Needed Some Help.",
        blocks: [
          {
            type: "p",
            text: "We began by gathering insights from our agents to identify the main obstacles they faced and explore ways to simplify their workflow. It soon became clear that a complete overhaul of the Hahdmin framework wasn't feasible due to time and resource constraints, so we shifted our focus to enhancing the existing interface.",
          },
          {
            type: "p",
            text: "This meant addressing the distinct needs of various user groups — admins, supervisors, agents, customers, and movers who all interact with Hahdmin in different capacities. As we planned the integration of the new chat feature, we carefully considered how to introduce it smoothly while disrupting the overall user experience.",
          },
          {
            type: "statPills",
            items: [
              { value: "7 days", label: "devoted to a detailed study" },
              { value: "5", label: "CSRs interviewed" },
            ],
          },
          {
            type: "list",
            marker: "x",
            items: [
              "The CSR dashboard itself at Hahdmin. It is overwhelming and not very user-friendly.",
              "Agents had to jump between different apps to handle texts, emails, & calls, which is frustrating for customers.",
            ],
          },
          {
            type: "p",
            text: "There was one major caveat: every six months, CSRs were required to learn entirely new tools for handling phone calls, emails, and texts, interrupting daily workflows and creating a frustrating experience for all parties. To make matters worse, the Hahdmin dashboard was overwhelming and not intuitive.",
          },
        ],
      },
      {
        id: "market",
        label: "Market Analysis",
        eyebrow: "market analysis",
        heading: "Market analysis.",
        blocks: [
          {
            type: "p",
            text: "We checked out how big companies handle their chat features and looked into some best practices to get a better grip on the micro interactions.",
          },
          {
            type: "p",
            text: "This assisted us in mapping and brainstorming our own processes, drawing on the insights of experts who had successfully tackled this challenge. We examined companies like Twilio, Textline and even Whatsapp which are renowned for their multi-party SMS communication features.",
          },
          {
            type: "image",
            src: placeholder("Market analysis · Twilio, Textline, Whatsapp", "#10b981", "16/9"),
            alt: "Market analysis — Twilio, Textline, Whatsapp",
          },
          {
            type: "p",
            text: "It was crucial to note that Hahdmin was exclusively a desktop application designed for Customer Service Representatives. The only users who might have accessed it via mobile devices were customers and providers, but agents were not included.",
          },
          {
            type: "statPills",
            items: [
              { value: "+6", label: "drafted journeys" },
              { value: "3 days", label: "devoted to page exploration" },
            ],
          },
        ],
      },
      {
        id: "strategy",
        label: "Findings & Strategy",
        eyebrow: "Findings & Strategy",
        heading: "Lo-fi Explorations.",
        blocks: [
          {
            type: "p",
            text: "After conducting multiple testing rounds with stakeholders and users, our initial sketches evolved into prototypes that outlined the path for integrating SMS messaging into the existing system. We implemented a scope board to help us prioritize the most relevant interactions, which was refined based on ongoing agent feedback.",
          },
          {
            type: "p",
            text: "To help users quickly identify conversation participants and their roles, we introduced color coding, creating a clear visual hierarchy among customers, movers, and agents. This approach clarified interactions and streamlined communication.",
          },
          {
            type: "image",
            src: placeholder("Lo-fi explorations · color-coded roles", "#10b981", "16/9"),
            alt: "Lo-fi explorations with color-coded roles for customers, movers, and agents",
          },
        ],
      },
      {
        id: "ux",
        label: "UX/UI Design",
        eyebrow: "ui/ux design",
        heading: "The Final Product.",
        blocks: [
          {
            type: "p",
            text: "After several rounds of feedback, we introduced our new chat feature flow, which seamlessly integrated not just SMS but also email into the Hahdmin platform, creating a centralized hub for all communications. This upgrade significantly enhanced the experience for agents, customers, and moving companies alike.",
          },
          {
            type: "p",
            text: "Agents wouldn't need to learn new platforms; rather, they would feel at home with our solution. We've integrated the same interactions from platforms they already use into the admin workflow. Additionally, we've introduced a communications modal to help agents communicate and have visibility of all events.",
          },
          {
            type: "image",
            src: placeholder("Final chat feature · unified hub", "#10b981", "16/9"),
            alt: "Final chat feature integrating SMS and email into Hahdmin",
          },
          { type: "h3", text: "New SMS Modal" },
          {
            type: "p",
            text: "The main new feature is the new SMS modal, which is activated from various CTAs throughout the dashboard near contact information. It enables users to initiate SMS threads with any relevant parties added dynamically. Once conversations are started, the agent can view pertinent information on the contact panel on the right.",
          },
          {
            type: "p",
            text: "Another interesting feature is the native capability of maintaining several modals active even when the user navigates other admin dashboards. This allows agents more flexibility in managing logistics and improving communication.",
          },
          {
            type: "image",
            src: placeholder("New SMS modal · multi-modal support", "#10b981", "16/9"),
            alt: "New SMS modal with multiple simultaneous conversations",
          },
          { type: "h3", text: "A notification system was implemented" },
          {
            type: "p",
            text: "After integrating the SMS modal into Hahdmin, we introduced a native notification system to bring real-time message alerts directly into the platform. Historically, SMS conversations were monitored in separate third-party tools, forcing agents to juggle tabs and contexts. This update closed that gap.",
          },
          {
            type: "p",
            text: "Now, new messages and relevant communication events appear instantly in a dedicated notification panel within Hahdmin. The notification system follows a clear logic to keep information relevant and actionable. Not all events generate notifications. Only actions critical to an agent's workflow.",
          },
          {
            type: "image",
            src: placeholder("Notification system · dedicated panel", "#10b981", "16/9"),
            alt: "Native notification system with dedicated panel in Hahdmin",
          },
          { type: "h3", text: "From Sketches to Prototypes" },
          {
            type: "p",
            text: "Agents no longer juggled multiple tools. They managed conversations faster and more easily. Customers got quicker updates and better support. Movers coordinated more efficiently. Overall, communication became faster, clearer, and seamless for everyone. We focused on changes that fit within the existing system. We used rapid prototyping and constant feedback. Training helped agents adopt the new feature smoothly.",
          },
          {
            type: "p",
            text: "The final chat feature integrated SMS and email into Hahdmin. It became a central hub for all communication. By combining the new SMS modal with this intelligent notification logic, Hahdmin now delivers a unified, distraction-free experience where agents can stay on top of conversations and respond faster — all without leaving their main workspace.",
          },
        ],
      },
    ],
    conclusion: {
      quote: "I realized that what seems like a \"small\" addition — in this case, a notification panel — can have a huge impact when paired with the right logic and context. The real challenge wasn't just displaying messages, but deciding which events truly matter.",
      body: "By combining the new SMS modal with intelligent notification logic, Hahdmin now delivers a unified, distraction-free experience where agents can stay on top of conversations and respond faster — all without leaving their main workspace.",
      signoff: "Rodrigo Martínez — UX Designer",
    },
  },

  {
    id: "hah",
    title: "HireAHelper: Conversion ReDesign",
    shortTitle: "HireAHelper",
    company: "Porch Moving Group",
    year: "2024 to 2025",
    role: "UX Design, Creative Direction",
    deliverables: "Optimized Experience, CMS Dev, Design System",
    tagline: "Moving Simplified",
    cover: "/covers/hah.png",
    coverCarousel: [
      "/case-studies/hah/cover/1.png",
      "/case-studies/hah/cover/2.png",
      "/case-studies/hah/cover/3.png",
      "/case-studies/hah/cover/4.png",
      "/case-studies/hah/cover/5.png",
      "/case-studies/hah/cover/6.png",
      "/case-studies/hah/cover/7.png",
      "/case-studies/hah/cover/8.png",
      "/case-studies/hah/cover/9.png",
      "/case-studies/hah/cover/10.png",
      "/case-studies/hah/cover/11.png",
      "/case-studies/hah/cover/12.png",
    ],
    accent: "#0ea5e9",
    size: "wide",
    metrics: [
      { label: "Daily Users", value: "14k" },
      { label: "On Site Purchase", value: "39%" },
      { label: "Revenue per visitor", value: "17%" },
      { label: "Service Providers", value: "120k" },
    ],
    overview:
      "A multi-year redesign of HireAHelper's booking experience, going from a confusing marketplace into a faster, friendlier flow that helps people find movers without losing their minds.",
    challenge:
      "The site looked dated, filters confused people, and the checkout dragged on. Conversion was leaking everywhere. We had to make it feel modern, fast, and trustworthy, without breaking what already worked.",
    tags: ["UX Design", "Creative Direction", "Design System", "Conversion"],
    images: [],
    url: "/case/hah",
    body: [
      {
        id: "snapshot",
        label: "Snapshot",
        heading: "Moving Simplified.",
        blocks: [
          {
            type: "p",
            text: "HireAHelper had outgrown its own site. The platform was working, but as traffic grew so did the friction: confusing filters, a long checkout, a visual style stuck in 2017. My job was to rebuild the booking experience into something people actually wanted to use.",
          },
          {
            type: "p",
            text: "Over three MVPs, we untangled the funnel, modernized the look, and shipped a design system that let the team move faster without breaking the brand. The numbers followed: higher conversion, more revenue per visitor, and a smoother ride from search to checkout.",
          },
          {
            type: "metricCards",
            items: [
              { value: "14,000", label: "Daily Users" },
              { value: "39%", label: "On Site Purchase" },
              { value: "17%", label: "Revenue per visitor" },
              { value: "120k", label: "Service Providers" },
            ],
          },
        ],
      },
      {
        id: "goals",
        label: "Goals & Challenges",
        heading: "Design a smoother, faster way to book movers online.",
        blocks: [
          {
            type: "p",
            text: "HireAHelper has been connecting people with movers across the US since 2015, one of the originals in online mover booking. After seven years of growth, the site that got them here wasn't the site that would take them further.",
          },
          {
            type: "image",
            src: "/case-studies/hah/goals/hah-2022.gif",
            alt: "HireAHelper 2022 web experience",
            caption: "The HAH experience we inherited in 2022.",
          },
          { type: "h3", text: "The challenge" },
          {
            type: "p",
            text: "Users were frustrated. Filters confused them, the checkout dragged, and the brand looked stuck a few years behind. The value prop wasn't landing either. We needed to make the whole thing feel modern, fast, and trustworthy, without losing the users we already had.",
          },
          { type: "h3", text: "Three objectives" },
          {
            type: "objectives",
            items: [
              { emoji: "🙋‍♀️", label: "UX", sub: "Build a platform that actually feels easy to use: usable, trustworthy, satisfying." },
              { emoji: "🎯", label: "Business", sub: "Grow market share by bringing in new users and keeping the ones we have." },
              { emoji: "⭐", label: "Macro", sub: "Cement HAH as the go-to platform for booking moving services online." },
            ],
          },
          { type: "h3", text: "Pain points" },
          {
            type: "p",
            text: "Before redesigning anything, we needed to see exactly where the experience was breaking down. So we talked to people (stakeholders, customer service reps, movers, real customers) and watched how they actually used the site.",
          },
          {
            type: "p",
            text: "Pair that with a heuristic audit, and the patterns showed up fast.",
          },
          {
            type: "statPills",
            items: [
              { value: "11", label: "in-depth user interviews" },
              { value: "+200", label: "interaction recordings" },
            ],
          },
          {
            type: "list",
            marker: "x",
            items: [
              "Checkout felt overwhelming, even for simple services.",
              "The visual language hadn't moved since 2017, and engagement and trust were taking the hit.",
              "Search felt rigid: users had almost no way to customize their criteria.",
              "Filters were too technical, making it hard to actually narrow things down.",
            ],
          },
          {
            type: "conceptTabs",
            items: [
              {
                src: "/case-studies/hah/goals/pain-point-1.gif",
                alt: "Issue 01, Overwhelming checkout flow",
                label: "Issue 01 · Overwhelming checkout",
                tabLabel: "Issue 01",
                description: "Even simple bookings dragged users through a heavy confirmation flow, with too many steps for the size of the job.",
              },
              {
                src: "/case-studies/hah/goals/pain-point-2.gif",
                alt: "Issue 02, Technical filters and rigid search",
                label: "Issue 02 · Filters that fought back",
                tabLabel: "Issue 02",
                description: "Search criteria were rigid and the filters spoke ops-language, not user-language, making it hard to narrow down to the right mover.",
              },
            ],
          },
        ],
      },
      {
        id: "research",
        label: "Research",
        eyebrow: "Research & analysis",
        heading: "Research & analysis.",
        blocks: [
          {
            type: "p",
            text: "From the interviews, a clear persona emerged, and with it a real picture of where people got stuck, where they bounced, and where the experience could actually win them over.",
          },
          {
            type: "image",
            src: "/case-studies/hah/research/personas.avif",
            alt: "HAH user persona and research findings",
            caption: "Persona work distilled from the interviews and usability sessions.",
          },
          {
            type: "p",
            text: "With our own customers mapped, we looked outward, studying how the rest of the industry handled booking.",
          },
          {
            type: "p",
            text: "Early on, the plan was to model HAH after an e-commerce marketplace: browse, compare, book, like a vacation rental. But the deeper we went into both our competitors and our own service model, the clearer it became: our value prop didn't quite fit that shape.",
          },
          {
            type: "ticker",
            aspect: "27/25",
            items: [
              { src: "/case-studies/hah/research/competitors/com-1.png", alt: "Competitor 01" },
              { src: "/case-studies/hah/research/competitors/com-2.png", alt: "Competitor 02" },
              { src: "/case-studies/hah/research/competitors/com-3.png", alt: "Competitor 03" },
              { src: "/case-studies/hah/research/competitors/com-4.png", alt: "Competitor 04" },
              { src: "/case-studies/hah/research/competitors/com-5.png", alt: "Competitor 05" },
              { src: "/case-studies/hah/research/competitors/com-6.png", alt: "Competitor 06" },
              { src: "/case-studies/hah/research/competitors/com-7.png", alt: "Competitor 07" },
            ],
          },
          {
            type: "statPills",
            items: [
              { value: "22", label: "competitors evaluated end to end" },
              { value: "8 days", label: "of focused competitive study" },
            ],
          },
        ],
      },
      {
        id: "mvp1",
        label: "First MVP",
        eyebrow: "1st mvp",
        heading: "Putting ideas into action, 2022.",
        blocks: [
          {
            type: "p",
            text: "Rather than rebuild everything at once, we picked our highest-traffic landing pages (the geo pages) and started testing. Each variation swapped a different version of the CTA form. A few months in, we had real data telling us which directions were working.",
          },
          {
            type: "conceptTabs",
            items: [
              {
                src: "/case-studies/hah/mvp1/example-1.avif",
                alt: "MVP1 experiment 01, original CTA form variation",
                label: "Variation 01 · Original CTA",
                tabLabel: "Variation 01",
                description: "The baseline CTA form on the geo landing pages: long, vertical, ZIP-first.",
              },
              {
                src: "/case-studies/hah/mvp1/example-2.avif",
                alt: "MVP1 experiment 02, condensed CTA layout",
                label: "Variation 02 · Condensed layout",
                tabLabel: "Variation 02",
                description: "Trimmed the form to its essentials and tightened the visual hierarchy around the primary action.",
              },
              {
                src: "/case-studies/hah/mvp1/example-3.avif",
                alt: "MVP1 experiment 03, winning CTA variation",
                label: "Variation 03 · Winner",
                tabLabel: "Variation 03",
                description: "The variation that converted best: clearer headline, lighter form, stronger CTA, shipped to the geo pages.",
                winner: true,
              },
            ],
          },
          {
            type: "list",
            marker: "check",
            items: [
              "Started small, testing surgical CTA changes before reimagining anything bigger.",
            ],
          },
          {
            type: "list",
            marker: "x",
            items: [
              "The new CTAs worked, but the rest of the site still felt dated and disengaging.",
            ],
          },
        ],
      },
      {
        id: "mvp2",
        label: "Second MVP",
        eyebrow: "2nd mvp",
        heading: "The turning point, 2023 to 2024.",
        blocks: [
          {
            type: "p",
            text: "By 2023, it was clear HAH wasn't just a marketplace anymore. So we leaned into that, introducing service cards on the homepage, cleaning up the marketplace UI, and shifting the primary brand color from green to blue to feel more trustworthy.",
          },
          {
            type: "p",
            text: "That kicked off a new step-by-step conversion funnel. We A/B tested everything to make sure conversion held steady while we evolved the experience underneath.",
          },
          {
            type: "devicePair",
            desktop: { src: "/case-studies/hah/mvp2/desktop.webp", alt: "MVP2 desktop, refreshed marketplace with service cards" },
            mobile:  { src: "/case-studies/hah/mvp2/mobile.gif",   alt: "MVP2 mobile, new step-by-step funnel" },
            caption: "MVP2: refreshed marketplace, new funnel, blue brand color.",
          },
          {
            type: "list",
            marker: "check",
            items: [
              "Added a step to collect more context up front, so results actually matched what users needed.",
            ],
          },
          {
            type: "list",
            marker: "x",
            items: [
              "The new design performed better, but the form step was still too long.",
            ],
          },
        ],
      },
      {
        id: "mvp3",
        label: "Latest Upgrades",
        eyebrow: "3rd mvp",
        heading: "The latest upgrades.",
        blocks: [
          {
            type: "p",
            text: "Now we're rolling out a more detailed but intuitive booking flow, closer to what our competitors offer, but with HAH as the primary partner instead of a third-party broker. Porch handles quotes and the move itself, end-to-end.",
          },
          {
            type: "list",
            marker: "check",
            items: [
              "Rebuilt checkout from scratch: what used to be a card-details modal is now a full summary with schedule, options, and clear payment paths.",
            ],
          },
          {
            type: "image",
            src: "/case-studies/hah/mvp3/example-1.webp",
            alt: "MVP3, latest checkout and booking flow",
            caption: "MVP3: comprehensive summary, schedule, and multiple payment options.",
            frame: "#2B73DE",
            frameBleed: true,
          },
          {
            type: "p",
            text: "MVP2 tightened up the funnel by clarifying visual hierarchy and surfacing the move summary up front. But users still had to pick a mover themselves.",
          },
          {
            type: "p",
            text: "In MVP3, the funnel grew up: surfacing multiple quotes quickly and letting users customize the rest of their move, not just the mover. Personalized, but still a marketplace underneath.",
          },
          {
            type: "p",
            text: "The shift: less \"browse a directory,\" more \"here are the best options for you.\" HAH's algorithm, refined over years of customer data, does the heavy lifting on the pre-selection.",
          },
          {
            type: "image",
            src: "/case-studies/hah/mvp3/booking-diagram.png",
            alt: "MVP3 booking funnel diagram, full quote-driven flow",
            caption: "Full MVP3 booking diagram: from intake through quotes to confirmation.",
            frame: "#ffffff",
          },
          {
            type: "sectionBreak",
            src: "/case-studies/hah/mvp3/big-visual-break.png",
            alt: "HireAHelper MVP3, visual recap across desktop and mobile",
          },
          {
            type: "h3",
            text: "Save Quote: pick up where you left off.",
          },
          {
            type: "p",
            text: "Users can save a quote at any step and get it emailed back, so they can come back later without losing progress.",
          },
          {
            type: "image",
            src: "/case-studies/hah/mvp3/save-quote.png",
            alt: "MVP3 Save Quote, confirmation screen plus emailed quote summary",
            caption: "Save Quote: confirmation, emailed summary, and a route back into the dashboard.",
          },
          {
            type: "h3",
            text: "Browse Movers: still a marketplace, just smarter.",
          },
          {
            type: "p",
            text: "The marketplace is still there. The algorithm pre-selects the best mover by default, but users can swap, compare reviews, and pick a different one at any time.",
          },
          {
            type: "image",
            src: "/case-studies/hah/mvp3/browse-movers.png",
            alt: "MVP3 Browse Movers, alternate movers, reviews, and selection",
            caption: "Browse Movers: alternate providers, full reviews, and one-tap re-selection.",
          },
        ],
      },
      {
        id: "cms",
        label: "CMS & Design System",
        eyebrow: "CMS & Design System",
        heading: "A fresh look & improved user experience.",
        blocks: [
          {
            type: "p",
            text: "After enough rounds of testing, we built a proper design system for HAH, sitting on top of Bootstrap, powered by Flowbite. It gave the team a consistent, accessible foundation, and let us ship faster without breaking the brand every other sprint.",
          },
          {
            type: "p",
            text: "In parallel, we revamped the landing-page layer: A/B tested the geo pages, the homepage, the service pages, anywhere conversion was at stake. (Worthy of its own case study, honestly.)",
          },
          {
            type: "statPills",
            items: [
              { value: "+14", label: "CMS-level landing pages" },
              { value: "Tailwind", label: "based components" },
            ],
          },
          {
            type: "image",
            src: "/case-studies/hah/cms/design-system.avif",
            alt: "HAH design system: colors, type, components, and page templates",
            caption: "The HAH design system: colors, type, components, and page templates, all in one place.",
          },
          {
            type: "imagePair",
            items: [
              {
                src: "/case-studies/hah/cms/landing-page.avif",
                alt: "HAH CMS landing page, responsive iPad mockup",
              },
              {
                src: "/case-studies/hah/cms/design-library.avif",
                alt: "HAH Design Library 2024, Porch Moving Group & HireAHelper",
              },
            ],
          },
          {
            type: "p",
            text: "HAH keeps evolving: flows shift, layouts change, the work continues. I wrapped up at Porch in August 2025, so this case study is a snapshot of the years I was part of it.",
          },
          {
            type: "externalLink",
            description: "More HAH UI/UX work on Behance",
            label: "view publication",
            href: "https://www.behance.net/gallery/228809041/HireAHelper-UI-UX",
          },
        ],
      },
      {
        id: "timeline",
        label: "Timeline",
        eyebrow: "Years at HAH",
        heading: "Four years, three MVPs, one design system.",
        blocks: [
          {
            type: "p",
            text: "A look back at the journey: from inheriting the green-era marketplace in 2022, through the blue-era funnel rebuild, into the quote-driven MVP3 and the design system that tied it all together.",
          },
          {
            type: "image",
            src: "/case-studies/hah/timeline.png",
            alt: "HireAHelper timeline, 2022 to 2025, three MVPs, brand refresh, and design system",
          },
        ],
      },
    ],
    conclusion: {
      quote: "The work shown here is a snapshot of what we built at Porch Moving Group: three MVPs of the booking flow, the brand refresh, and the design system that powered HAH, developed during my years there before I wrapped up in August 2025.",
      body: "Since then, HAH has continued to evolve under new management and taken a different direction. What you see here reflects the design decisions, tradeoffs, and systems I was responsible for during that era, from the green-era marketplace through the blue-era funnel, into the quote-driven MVP3. I'm proud of what the team shipped.",
      signoff: "Rodrigo Martínez · Porch Moving Group, 2022 to 2025",
    },
  },
  {
    id: "ruttis",
    title: "Ruttis, A Candyshop Brand",
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
      "Brand identity and packaging for a small-batch candy shop. Full project on Behance.",
    challenge: "",
    tags: ["Brand", "Illustration", "Packaging"],
    images: [],
    url: "https://www.behance.net/gallery/170035285/Dulceria-Ruttis-Branding",
    external: true,
  },
  {
    id: "skincare-junkie",
    homeGallery: false,
    title: "Skincare Junkie · Campaigns 2025 by Omni Common",
    shortTitle: "Skincare Junkie",
    company: "Omni Common",
    year: "2025",
    role: "Creative Direction, Art Direction",
    deliverables: "Campaign Art Direction, Social Assets",
    tagline: "Campaigns 2025.",
    cover: "/covers/skincare-junkie.png",
    accent: "#f472b6",
    size: "small",
    metrics: [
      { label: "Campaigns", value: "Series" },
      { label: "Year", value: "2025" },
    ],
    overview:
      "Campaign art direction and social assets for Skincare Junkie. Full project on Behance.",
    challenge: "",
    tags: ["Campaign", "Art Direction", "Social"],
    images: [],
    url: "https://www.behance.net/gallery/242050641/Skincare-Junkie-Campaigns-2025-by-OC",
    external: true,
  },
  {
    id: "squeedr",
    homeGallery: false,
    title: "Squeedr · Branding",
    shortTitle: "Squeedr",
    company: "Squeedr",
    year: "2023",
    role: "Brand Design",
    deliverables: "Brand Identity",
    tagline: "Brand identity.",
    cover: "/covers/squeedr.png",
    accent: "#22d3ee",
    size: "small",
    metrics: [
      { label: "Deliverable", value: "Identity" },
      { label: "Year", value: "2023" },
    ],
    overview:
      "Brand identity for Squeedr. Full project on Behance.",
    challenge: "",
    tags: ["Brand", "Identity"],
    images: [],
    url: "https://www.behance.net/gallery/184563123/Squeedr-Branding",
    external: true,
  },
];
